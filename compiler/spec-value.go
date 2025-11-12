package compiler

import (
	"fmt"
	"go/ast"
	"go/token"
	"go/types"

	"golang.org/x/tools/go/packages"
)

// shouldApplyClone determines whether a `.clone()` method call should be appended
// to the TypeScript translation of a Go expression `rhs` when it appears on the
// right-hand side of an assignment. This is primarily to emulate Go's value
// semantics for struct assignments, where assigning one struct variable to another
// creates a copy of the struct.
//
// It uses `go/types` information (`pkg.TypesInfo`) to determine the type of `rhs`.
//   - If `rhs` is identified as a struct type (either directly, as a named type
//     whose underlying type is a struct, or an unnamed type whose underlying type
//     is a struct), it returns `true`.
//   - An optimization: if `rhs` is a composite literal (`*ast.CompositeLit`),
//     it returns `false` because a composite literal already produces a new value,
//     so cloning is unnecessary.
//   - If type information is unavailable or `rhs` is not a struct type, it returns `false`.
//
// This function is crucial for ensuring that assignments of struct values in
// TypeScript behave like copies, as they do in Go, rather than reference assignments.
func shouldApplyClone(pkg *packages.Package, rhs ast.Expr) bool {
	if pkg == nil || pkg.TypesInfo == nil {
		// Cannot determine type without type info, default to no clone
		return false
	}

	// Get the type of the RHS expression
	var exprType types.Type

	// Handle identifiers (variables) directly - the most common case
	if ident, ok := rhs.(*ast.Ident); ok {
		if obj := pkg.TypesInfo.Uses[ident]; obj != nil {
			// Get the type directly from the object
			exprType = obj.Type()
		} else if obj := pkg.TypesInfo.Defs[ident]; obj != nil {
			// Also check Defs map for definitions
			exprType = obj.Type()
		}
	}

	// If we couldn't get the type from Uses/Defs, try getting it from Types
	if exprType == nil {
		if tv, found := pkg.TypesInfo.Types[rhs]; found && tv.Type != nil {
			exprType = tv.Type
		}
	}

	// No type information available
	if exprType == nil {
		return false
	}

	// Optimization: If it's a composite literal for a struct, no need to clone
	// as it's already a fresh value
	if _, isCompositeLit := rhs.(*ast.CompositeLit); isCompositeLit {
		return false
	}

	// Check if it's a struct type (directly, through named type, or underlying)
	if named, ok := exprType.(*types.Named); ok {
		if _, isStruct := named.Underlying().(*types.Struct); isStruct {
			return true // Named struct type
		}
	} else if _, ok := exprType.(*types.Struct); ok {
		return true // Direct struct type
	} else if underlying := exprType.Underlying(); underlying != nil {
		if _, isStruct := underlying.(*types.Struct); isStruct {
			return true // Underlying is a struct
		}
	}

	return false // Not a struct, do not apply clone
}

// WriteValueSpec translates a Go value specification (`ast.ValueSpec`),
// which represents `var` or `const` declarations, into TypeScript `let`
// declarations.
//
// For single variable declarations (`var x T = val` or `var x = val` or `var x T`):
//   - It determines if the variable `x` needs to be varrefed (e.g., if its address is taken)
//     using `c.analysis.NeedsVarRef(obj)`.
//   - If variable referenced: `let x: $.VarRef<T_ts> = $.varRef(initializer_ts_or_zero_ts);`
//     The type annotation is `$.VarRef<T_ts>`, and the initializer is wrapped in `$.varRef()`.
//   - If not variable referenced: `let x: T_ts = initializer_ts_or_zero_ts;`
//     The type annotation is `T_ts`. If the initializer is `&unvarrefedVar`, it becomes `$.varRef(unvarrefedVar_ts)`.
//   - If no initializer is provided, the TypeScript zero value (from `WriteZeroValueForType`)
//     is used.
//   - Type `T` (or `T_ts`) is obtained from `obj.Type()` and translated via `WriteGoType`.
//
// For multiple variable declarations (`var a, b = val1, val2` or `a, b := val1, val2`):
//   - It uses TypeScript array destructuring: `let [a, b] = [val1_ts, val2_ts];`.
//   - If initialized from a single multi-return function call (`a, b := func()`),
//     it becomes `let [a, b] = func_ts();`.
//   - If no initializers are provided, it defaults to `let [a,b] = []` (with a TODO
//     to assign correct individual zero values).
//
// Documentation comments associated with the `ValueSpec` are preserved.
func (c *GoToTSCompiler) WriteValueSpec(a *ast.ValueSpec) error {
	if a.Doc != nil {
		c.WriteDoc(a.Doc)
	}
	if a.Comment != nil {
		c.WriteDoc(a.Comment)
	}

	// Handle single variable declaration
	if len(a.Names) == 1 {
		name := a.Names[0]
		// Skip underscore variables
		if name.Name == "_" {
			return nil
		}
		obj := c.pkg.TypesInfo.Defs[name]
		if obj == nil {
			return fmt.Errorf("could not resolve type: %v", name)
		}

		goType := obj.Type()
		needsVarRef := c.analysis.NeedsVarRef(obj) // Check if address is taken

		hasInitializer := len(a.Values) > 0
		var initializerExpr ast.Expr
		if hasInitializer {
			initializerExpr = a.Values[0]
		}

		// Check if the initializer will result in an $.arrayToSlice call in TypeScript
		isSliceConversion := false
		if hasInitializer {
			// Case 1: Direct call to $.arrayToSlice in Go source (less common for typical array literals)
			if callExpr, isCallExpr := initializerExpr.(*ast.CallExpr); isCallExpr {
				if selExpr, isSelExpr := callExpr.Fun.(*ast.SelectorExpr); isSelExpr {
					if pkgIdent, isPkgIdent := selExpr.X.(*ast.Ident); isPkgIdent && pkgIdent.Name == "$" {
						if selExpr.Sel.Name == "arrayToSlice" {
							isSliceConversion = true
						}
					}
				}
			}

			// Case 2: Go array or slice literal, which will be compiled to $.arrayToSlice
			// We also check if the original Go type is actually a slice or array.
			if !isSliceConversion { // Only check if not already determined by Case 1
				if _, isCompositeLit := initializerExpr.(*ast.CompositeLit); isCompositeLit {
					switch goType.Underlying().(type) {
					case *types.Slice, *types.Array:
						isSliceConversion = true
					}
				}
			}
		}

		// Start declaration - add export for Go-exported symbols (but not if inside a function)
		isInsideFunction := false
		if nodeInfo := c.analysis.NodeData[a]; nodeInfo != nil {
			isInsideFunction = nodeInfo.IsInsideFunction
		}

		if !isInsideFunction {
			c.tsw.WriteLiterally("export ")
		}
		c.tsw.WriteLiterally("let ")
		c.tsw.WriteLiterally(c.sanitizeIdentifier(name.Name))

		// Write type annotation if:
		// 1. Not a slice conversion (normal case), OR
		// 2. Is a slice conversion but needs varRefing (we need explicit type for $.varRef())
		if !isSliceConversion || needsVarRef {
			c.tsw.WriteLiterally(": ")
			// Write type annotation
			if needsVarRef {
				// If varrefed, the variable holds VarRef<OriginalGoType>
				c.tsw.WriteLiterally("$.VarRef<")

				// Special case: if this is a slice conversion from an array type,
				// we should use the slice type instead of the array type
				if isSliceConversion {
					if arrayType, isArray := goType.Underlying().(*types.Array); isArray {
						// Convert [N]T to $.Slice<T>
						c.tsw.WriteLiterally("$.Slice<")
						c.WriteGoType(arrayType.Elem(), GoTypeContextGeneral)
						c.tsw.WriteLiterally(">")
					} else {
						// For slice types, write as-is (already $.Slice<T>)
						c.WriteGoType(goType, GoTypeContextGeneral)
					}
				} else {
					c.WriteGoType(goType, GoTypeContextGeneral) // Write the original Go type T
				}
				c.tsw.WriteLiterally(">")
			} else {
				// If not varrefed, the variable holds the translated Go type directly
				// Custom logic for non-var-ref'd pointers to structs/interfaces.
				if ptrType, isPtr := goType.(*types.Pointer); isPtr {
					elemType := ptrType.Elem()
					actualElemType := elemType.Underlying() // Get the true underlying type (e.g., struct, interface, basic)

					isStruct := false
					if _, ok := actualElemType.(*types.Struct); ok {
						isStruct = true
					}

					isInterface := false
					if _, ok := actualElemType.(*types.Interface); ok {
						isInterface = true
					}

					if isStruct || isInterface {
						// For non-var-ref'd pointers to structs or interfaces,
						// the type is T | null, not $.VarRef<T> | null.
						c.WriteGoType(elemType, GoTypeContextGeneral) // Write the element type itself (e.g., MyStruct)
						c.tsw.WriteLiterally(" | null")
					} else {
						// For other pointer types (e.g., *int, *string, *[]int, **MyStruct),
						// or pointers to types that are not structs/interfaces,
						// use the standard pointer type translation.
						c.WriteGoType(goType, GoTypeContextGeneral)
					}
				} else {
					// Not a pointer type, write as is.
					// Use AST-based type writing if explicit type is provided, otherwise use WriteGoType
					if a.Type != nil {
						// Explicit type annotation in Go code - use AST to preserve qualified names
						c.WriteTypeExpr(a.Type)
					} else {
						// No explicit type - use type inference from WriteGoType
						c.WriteGoType(goType, GoTypeContextGeneral)
					}
				}
			}
		}

		// Write initializer
		c.tsw.WriteLiterally(" = ")

		// Special case for nil pointer to struct type: (*struct{})(nil)
		if hasInitializer {
			if callExpr, isCallExpr := initializerExpr.(*ast.CallExpr); isCallExpr {
				if starExpr, isStarExpr := callExpr.Fun.(*ast.StarExpr); isStarExpr {
					if _, isStructType := starExpr.X.(*ast.StructType); isStructType {
						// Check if the argument is nil
						if len(callExpr.Args) == 1 {
							if nilIdent, isIdent := callExpr.Args[0].(*ast.Ident); isIdent && nilIdent.Name == "nil" {
								c.tsw.WriteLiterally("null")
								c.tsw.WriteLine("") // Ensure newline after null
								return nil
							}
						}
					}
				}
			}
		}

		if needsVarRef {
			// VarRef variable: let v: VarRef<T> = $.varRef(init_or_zero);
			c.tsw.WriteLiterally("$.varRef(")
			if hasInitializer {
				// Write the compiled initializer expression normally
				if err := c.WriteValueExpr(initializerExpr); err != nil {
					return err
				}
			} else {
				// No initializer, varRef the zero value
				c.WriteZeroValueForType(goType)
			}
			c.tsw.WriteLiterally(")")
		} else {
			// Unvarrefed variable: let v: T = init_or_zero;
			if hasInitializer {
				// Handle &v initializer specifically for unvarrefed variables
				if unaryExpr, isUnary := initializerExpr.(*ast.UnaryExpr); isUnary && unaryExpr.Op == token.AND {
					// Initializer is &expr
					// Check if expr is an identifier (variable) or something else (e.g., composite literal)
					if unaryExprXIdent, ok := unaryExpr.X.(*ast.Ident); ok {
						// Case: &variable
						// Check if the variable is varrefed
						innerObj := c.objectOfIdent(unaryExprXIdent)
						needsVarRefOperand := innerObj != nil && c.analysis.NeedsVarRef(innerObj)

						// If variable is varrefed, assign the varRef itself (variable)
						// If variable is not varrefed, assign $.varRef(variable)
						if needsVarRefOperand {
							// do not write .value here.
							c.WriteIdent(unaryExprXIdent, false)
						} else {
							// &unvarrefedVar -> $.varRef(unvarrefedVar)
							c.tsw.WriteLiterally("$.varRef(")
							if err := c.WriteValueExpr(unaryExpr.X); err != nil { // Write 'variable'
								return err
							}
							c.tsw.WriteLiterally(")")
						}
					} else {
						// Case: &compositeLiteral or &otherExpression
						// Let WriteUnaryExpr handle this properly (note: markAsStructValue is now applied in WriteCompositeLit)
						if err := c.WriteValueExpr(unaryExpr); err != nil {
							return err
						}
					}
				} else {
					// Check if this is a named type with methods and the initializer is a basic value
					if namedType, isNamed := goType.(*types.Named); isNamed {
						// Check if this is a wrapper type first
						if c.isWrapperType(namedType) {
							// For wrapper types, no constructor wrapping needed
							if shouldApplyClone(c.pkg, initializerExpr) {
								// When cloning for value assignment, mark the result as struct value
								c.tsw.WriteLiterally("$.markAsStructValue(")
								if err := c.WriteValueExpr(initializerExpr); err != nil {
									return err
								}
								c.tsw.WriteLiterally(".clone())")
							} else {
								if err := c.WriteValueExpr(initializerExpr); err != nil {
									return err
								}
							}
						} else {
							typeName := namedType.Obj().Name()
							if c.hasReceiverMethods(typeName) {
								// Check if the initializer is a basic literal or simple value that needs wrapping
								needsConstructor := false
								switch expr := initializerExpr.(type) {
								case *ast.BasicLit:
									needsConstructor = true
								case *ast.Ident:
									// Check if it's a simple identifier (not a function call or complex expression)
									if expr.Name != "nil" {
										// Check if this identifier refers to a value of the underlying type
										if obj := c.objectOfIdent(expr); obj != nil {
											if objType := obj.Type(); objType != nil {
												// If the identifier's type matches the underlying type, wrap it
												if types.Identical(objType, namedType.Underlying()) {
													needsConstructor = true
												}
											}
										}
									}
								case *ast.CallExpr:
									// Check if this is a make() call that returns the underlying type
									if funIdent, ok := expr.Fun.(*ast.Ident); ok && funIdent.Name == "make" {
										// Check if the make call returns a type that matches the underlying type
										if exprType := c.pkg.TypesInfo.TypeOf(expr); exprType != nil {
											if types.Identical(exprType, namedType.Underlying()) {
												needsConstructor = true
											}
										}
									}
								}

								if needsConstructor {
									c.tsw.WriteLiterallyf("new %s(", typeName)
									if err := c.WriteValueExpr(initializerExpr); err != nil {
										return err
									}
									c.tsw.WriteLiterally(")")
								} else {
									// Regular initializer for named type (e.g., function call that returns the type)
									if shouldApplyClone(c.pkg, initializerExpr) {
										// When cloning for value assignment, mark the result as struct value
										c.tsw.WriteLiterally("$.markAsStructValue(")
										if err := c.WriteValueExpr(initializerExpr); err != nil {
											return err
										}
										c.tsw.WriteLiterally(".clone())")
									} else {
										if err := c.writeInitializerForInterface(initializerExpr, goType); err != nil {
											return err
										}
									}
								}
							} else {
								// Named type without methods, handle normally
								if shouldApplyClone(c.pkg, initializerExpr) {
									// When cloning for value assignment, mark the result as struct value
									c.tsw.WriteLiterally("$.markAsStructValue(")
									if err := c.WriteValueExpr(initializerExpr); err != nil {
										return err
									}
									c.tsw.WriteLiterally(".clone())")
								} else {
									if err := c.writeInitializerForInterface(initializerExpr, goType); err != nil {
										return err
									}
								}
							}
						}
					} else {
						// Regular initializer, clone if needed
						if shouldApplyClone(c.pkg, initializerExpr) {
							// When cloning for value assignment, mark the result as struct value
							c.tsw.WriteLiterally("$.markAsStructValue(")
							if err := c.WriteValueExpr(initializerExpr); err != nil {
								return err
							}
							c.tsw.WriteLiterally(".clone())")
						} else {
							// Check if this is a pointer variable assigned to interface
							if err := c.writeInitializerForInterface(initializerExpr, goType); err != nil {
								return err
							}
						}
					}
				}
			} else {
				// No initializer, use the zero value directly
				// Check if this is a wrapper type first
				if namedType, isNamed := goType.(*types.Named); isNamed {
					if c.isWrapperType(namedType) {
						// For wrapper types, just use zero value directly
						c.WriteZeroValueForType(goType)
					} else {
						typeName := namedType.Obj().Name()
						if c.hasReceiverMethods(typeName) {
							// For named types with methods, create a new instance with zero value
							c.tsw.WriteLiterallyf("new %s(", typeName)
							c.WriteZeroValueForType(namedType.Underlying())
							c.tsw.WriteLiterally(")")
						} else {
							c.WriteZeroValueForType(goType)
						}
					}
				} else {
					c.WriteZeroValueForType(goType)
				}
			}
		}
		c.tsw.WriteLine("") // Finish the declaration line
		return nil
	}

	// --- Multi-variable declaration with proper individual declarations ---
	// Instead of using array destructuring which creates undefined types,
	// generate individual variable declarations with proper types and zero values
	if len(a.Values) > 0 {
		// Has initializers - use array destructuring for multiple assignments
		c.tsw.WriteLiterally("let ")
		c.tsw.WriteLiterally("[") // Use array destructuring for multi-assign
		for i, name := range a.Names {
			if i != 0 {
				c.tsw.WriteLiterally(", ")
			}
			c.tsw.WriteLiterally(c.sanitizeIdentifier(name.Name))
		}
		c.tsw.WriteLiterally("]")

		c.tsw.WriteLiterally(" = ")
		if len(a.Values) == 1 && len(a.Names) > 1 {
			// Assign from a single multi-return value
			if err := c.WriteValueExpr(a.Values[0]); err != nil {
				return err
			}
		} else {
			// Assign from multiple values
			c.tsw.WriteLiterally("[")
			for i, val := range a.Values {
				if i != 0 {
					c.tsw.WriteLiterally(", ")
				}
				if err := c.WriteValueExpr(val); err != nil { // Initializers are values
					return err
				}
			}
			c.tsw.WriteLiterally("]")
		}
		c.tsw.WriteLine("")
	} else {
		// No initializers - generate individual variable declarations with zero values
		for _, name := range a.Names {
			// Skip underscore variables
			if name.Name == "_" {
				continue
			}

			obj := c.pkg.TypesInfo.Defs[name]
			if obj == nil {
				return fmt.Errorf("could not resolve type for variable %v", name.Name)
			}

			goType := obj.Type()

			// Check if exported and not inside function
			isInsideFunction := false
			if nodeInfo := c.analysis.NodeData[a]; nodeInfo != nil {
				isInsideFunction = nodeInfo.IsInsideFunction
			}

			if !isInsideFunction {
				c.tsw.WriteLiterally("export ")
			}

			c.tsw.WriteLiterally("let ")
			c.tsw.WriteLiterally(c.sanitizeIdentifier(name.Name))
			c.tsw.WriteLiterally(": ")

			// Write type annotation - use AST-based type if available, otherwise infer from goType
			if a.Type != nil {
				c.WriteTypeExpr(a.Type)
			} else {
				c.WriteGoType(goType, GoTypeContextGeneral)
			}

			c.tsw.WriteLiterally(" = ")
			c.WriteZeroValueForType(goType)
			c.tsw.WriteLine("")
		}
	}
	return nil
}

// writeInitializerForInterface handles writing initializer expressions for interface variables,
// with special handling for pointer variable assignments to avoid automatic .value dereferencing
func (c *GoToTSCompiler) writeInitializerForInterface(initializerExpr ast.Expr, goType types.Type) error {
	// Check if this is a pointer variable assigned to interface
	if rhsIdent, isIdent := initializerExpr.(*ast.Ident); isIdent {
		if rhsObj := c.objectOfIdent(rhsIdent); rhsObj != nil {
			// Check if LHS is interface and RHS is pointer
			if _, isInterface := goType.Underlying().(*types.Interface); isInterface {
				if _, isPtr := rhsObj.Type().(*types.Pointer); isPtr {
					// For pointer variables that point to varrefed values, write without .value
					// We want to pass the VarRef object itself to the interface, not its .value
					if c.analysis.NeedsVarRefAccess(rhsObj) {
						c.WriteIdent(rhsIdent, false)
						return nil
					}
				}
			}
		}
	}
	// Default case: use regular WriteValueExpr
	return c.WriteValueExpr(initializerExpr)
}
