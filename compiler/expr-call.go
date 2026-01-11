package compiler

import (
	"fmt"
	"go/ast"
	"go/token"
	"go/types"
)

// WriteCallExpr translates a Go function call expression (`ast.CallExpr`)
// into its TypeScript equivalent.
// It handles several Go built-in functions specially:
// - `println(...)` becomes `console.log(...)`.
// - `panic(...)` becomes `$.panic(...)`.
// - `len(arg)` becomes `$.len(arg)`.
// - `cap(arg)` becomes `$.cap(arg)`.
// - `delete(m, k)` becomes `$.deleteMapEntry(m, k)`.
// - `make(chan T, size)` becomes `$.makeChannel<T_ts>(size, zeroValueForT)`.
// - `make(map[K]V)` becomes `$.makeMap<K_ts, V_ts>()`.
// - `make([]T, len, cap)` becomes `$.makeSlice<T_ts>(len, cap)`.
// - `make([]byte, len, cap)` becomes `new Uint8Array(len)`.
// - `string(runeVal)` becomes `$.runeOrStringToString(runeVal)`.
// - `string([]runeVal)` becomes `$.runesToString(sliceVal)`.
// - `string([]byteVal)` becomes `$.bytesToString(sliceVal)`.
// - `[]rune(stringVal)` becomes `$.stringToRunes(stringVal)".
// - `[]byte(stringVal)` becomes `$.stringToBytes(stringVal)`.
// - `close(ch)` becomes `ch.close()`.
// - `append(slice, elems...)` becomes `$.append(slice, elems...)`.
// - `byte(val)` becomes `$.byte(val)`.
// For other function calls:
//   - If the `Analysis` data indicates the function is asynchronous (e.g., due to
//     channel operations or `go`/`defer` usage within it), the call is prefixed with `await`.
//   - Otherwise, it's translated as a standard TypeScript function call: `funcName(arg1, arg2)`.
//
// Arguments are recursively translated using `WriteValueExpr`.
func (c *GoToTSCompiler) WriteCallExpr(exp *ast.CallExpr) error {
	expFun := exp.Fun

	// Handle protobuf method calls
	if handled, err := c.writeProtobufMethodCall(exp); handled {
		return err
	}

	// Handle any type conversion with nil argument
	if handled, err := c.writeNilConversion(exp); handled {
		return err
	}

	// Handle array type conversions like []rune(string)
	if handled, err := c.writeArrayTypeConversion(exp); handled {
		return err
	}

	// Handle built-in functions called as identifiers
	if funIdent, funIsIdent := expFun.(*ast.Ident); funIsIdent {
		// Check for built-in functions first
		if handled, err := c.writeBuiltinFunction(exp, funIdent.String()); handled {
			if err != nil {
				return err
			}
			// For built-ins that don't return early, write the arguments
			if funIdent.String() != "new" && funIdent.String() != "close" && funIdent.String() != "make" &&
				funIdent.String() != "string" && funIdent.String() != "append" && funIdent.String() != "byte" &&
				funIdent.String() != "int" && funIdent.String() != "min" && funIdent.String() != "max" &&
				funIdent.String() != "clear" {
				return c.writeCallArguments(exp)
			}
			return nil
		}

		// Check for type conversions
		if handled, err := c.writeTypeConversion(exp, funIdent); handled {
			return err
		}

		// Check if this is an async function call
		c.writeAsyncCallIfNeeded(exp)

		// Not a special built-in, treat as a regular function call
		if err := c.WriteValueExpr(expFun); err != nil {
			return fmt.Errorf("failed to write function expression in call: %w", err)
		}

		c.addNonNullAssertion(expFun)
		return c.writeCallArguments(exp)
	}

	// Handle qualified type conversions like os.FileMode(value)
	if selectorExpr, ok := expFun.(*ast.SelectorExpr); ok {
		if handled, err := c.writeQualifiedTypeConversion(exp, selectorExpr); handled {
			return err
		}

		// Handle wrapper type method calls: obj.Method() -> TypeName_Method(obj, ...)
		if handled, err := c.writeWrapperTypeMethodCall(exp, selectorExpr); handled {
			return err
		}
	}

	// Handle reflect.TypeFor[T]() - Fun is IndexExpr where X is SelectorExpr
	if indexExpr, ok := expFun.(*ast.IndexExpr); ok {
		if selectorExpr, ok := indexExpr.X.(*ast.SelectorExpr); ok {
			if handled, err := c.writeReflectTypeFor(exp, selectorExpr); handled {
				return err
			}
		}
	}

	// Handle non-identifier function expressions (method calls, function literals, etc.)
	// Check if this is an async method call (e.g., mu.Lock())
	c.writeAsyncCallIfNeeded(exp)

	// If expFun is a function literal, it needs to be wrapped in parentheses for IIFE syntax
	if _, isFuncLit := expFun.(*ast.FuncLit); isFuncLit {
		c.tsw.WriteLiterally("(")
		if err := c.WriteValueExpr(expFun); err != nil {
			return fmt.Errorf("failed to write function literal in call: %w", err)
		}
		c.tsw.WriteLiterally(")")
	} else {
		// Check if this is a function call that returns a function (e.g., simpleIterator(m)())
		// and if the inner call is async, wrap it in parentheses
		innerCallExpr, isCallExpr := expFun.(*ast.CallExpr)
		needsParens := isCallExpr && c.isCallExprAsync(innerCallExpr)

		if needsParens {
			c.tsw.WriteLiterally("(")
		}

		// Not an identifier (e.g., method call on a value, function call result)
		if err := c.WriteValueExpr(expFun); err != nil {
			return fmt.Errorf("failed to write method expression in call: %w", err)
		}

		if needsParens {
			c.tsw.WriteLiterally(")")
		}

		// Add non-null assertion since the returned function could be null
		if isCallExpr {
			c.tsw.WriteLiterally("!")
		} else {
			c.addNonNullAssertion(expFun)
		}
	}

	return c.writeCallArguments(exp)
}

// writeCallArguments writes the argument list for a function call
func (c *GoToTSCompiler) writeCallArguments(exp *ast.CallExpr) error {
	c.tsw.WriteLiterally("(")

	// Get function signature for parameter type checking
	var funcSig *types.Signature
	if c.pkg != nil && c.pkg.TypesInfo != nil {
		if funcType := c.pkg.TypesInfo.TypeOf(exp.Fun); funcType != nil {
			if sig, ok := funcType.(*types.Signature); ok {
				funcSig = sig
			}
		}
	}

	for i, arg := range exp.Args {
		if i != 0 {
			c.tsw.WriteLiterally(", ")
		}
		// Check if this is the last argument and we have ellipsis (variadic call)
		if exp.Ellipsis != token.NoPos && i == len(exp.Args)-1 {
			c.tsw.WriteLiterally("...(")
			// Write the argument
			if err := c.writeArgumentWithTypeHandling(arg, funcSig, i); err != nil {
				return err
			}
			// Add null coalescing for slice spread to prevent TypeScript errors
			c.tsw.WriteLiterally(" ?? [])")
			continue
		}

		if err := c.writeArgumentWithTypeHandling(arg, funcSig, i); err != nil {
			return err
		}
	}

	c.tsw.WriteLiterally(")")
	return nil
}

// writeArgumentWithTypeHandling writes a single argument with proper type handling
func (c *GoToTSCompiler) writeArgumentWithTypeHandling(arg ast.Expr, funcSig *types.Signature, argIndex int) error {
	if funcSig != nil && argIndex < funcSig.Params().Len() {
		paramType := funcSig.Params().At(argIndex).Type()
		isWrapper := c.isWrapperType(paramType)

		if isWrapper {
			// For wrapper types (now type aliases), no auto-wrapping is needed
			// Just use type casting if the types don't match exactly
			argType := c.pkg.TypesInfo.TypeOf(arg)

			// Only add type casting if needed
			if argType != nil && !types.Identical(argType, paramType) {
				c.tsw.WriteLiterally("(")
				if err := c.WriteValueExpr(arg); err != nil {
					return fmt.Errorf("failed to write argument for type cast: %w", err)
				}
				c.tsw.WriteLiterally(" as ")
				c.WriteGoType(paramType, GoTypeContextGeneral)
				c.tsw.WriteLiterally(")")
			} else {
				// Types match, just write the argument directly
				if err := c.WriteValueExpr(arg); err != nil {
					return fmt.Errorf("failed to write argument: %w", err)
				}
			}
			return nil
		}
	}

	// For non-wrapper types, normal argument writing
	if err := c.WriteValueExpr(arg); err != nil {
		return fmt.Errorf("failed to write argument: %w", err)
	}
	return nil
}

// resolveImportAlias returns the import alias for a given package.
// This is the single source of truth for import alias resolution.
func (c *GoToTSCompiler) resolveImportAlias(pkg *types.Package) (alias string, found bool) {
	if c.analysis == nil || pkg == nil {
		return "", false
	}

	pkgName := pkg.Name()

	// Try to match by the actual package name in regular imports
	if _, exists := c.analysis.Imports[pkgName]; exists {
		return pkgName, true
	}

	// Also check synthetic imports for the current file
	if syntheticImports := c.analysis.SyntheticImportsPerFile[c.currentFilePath]; syntheticImports != nil {
		if _, exists := syntheticImports[pkgName]; exists {
			return pkgName, true
		}
	}

	return "", false
}

// getQualifiedTypeName returns the qualified type name for a Named or Alias type
// Returns empty string if the type is not Named or Alias, or has no valid object
func (c *GoToTSCompiler) getQualifiedTypeName(t types.Type) string {
	var obj *types.TypeName

	if namedType, ok := t.(*types.Named); ok {
		obj = namedType.Obj()
	} else if aliasType, ok := t.(*types.Alias); ok {
		obj = aliasType.Obj()
	}

	if obj == nil || obj.Pkg() == nil {
		return ""
	}

	if obj.Pkg() != c.pkg.Types {
		// Imported type
		if alias, found := c.resolveImportAlias(obj.Pkg()); found {
			return alias + "." + obj.Name()
		}
		return obj.Name()
	}

	// Local type
	return obj.Name()
}

// writeAutoWrappedArgument writes an argument, auto-wrapping it if needed based on the expected parameter type
func (c *GoToTSCompiler) writeAutoWrappedArgument(arg ast.Expr, expectedType types.Type) error {
	// For wrapper types (now type aliases), no auto-wrapping is needed
	// Just use type casting if the types don't match exactly
	if c.isWrapperType(expectedType) {
		argType := c.pkg.TypesInfo.TypeOf(arg)

		// Only add type casting if needed
		if argType != nil && !types.Identical(argType, expectedType) {
			c.tsw.WriteLiterally("(")
			if err := c.WriteValueExpr(arg); err != nil {
				return fmt.Errorf("failed to write argument for wrapper type cast: %w", err)
			}
			c.tsw.WriteLiterally(" as ")
			c.WriteGoType(expectedType, GoTypeContextGeneral)
			c.tsw.WriteLiterally(")")
		} else {
			// Types match, just write the argument directly
			if err := c.WriteValueExpr(arg); err != nil {
				return fmt.Errorf("failed to write argument: %w", err)
			}
		}
		return nil
	}

	// For non-wrapper types, normal argument writing
	if err := c.WriteValueExpr(arg); err != nil {
		return fmt.Errorf("failed to write argument: %w", err)
	}
	return nil
}

// writeWrapperTypeMethodCall handles method calls on wrapper types by converting them to function calls
// obj.Method(args) -> TypeName_Method(obj, args)
func (c *GoToTSCompiler) writeWrapperTypeMethodCall(exp *ast.CallExpr, selectorExpr *ast.SelectorExpr) (handled bool, err error) {
	// Get the type of the base expression (the receiver)
	baseType := c.pkg.TypesInfo.TypeOf(selectorExpr.X)
	if baseType == nil {
		return false, nil
	}

	// Check if this is a wrapper type using the analysis
	if !c.isWrapperType(baseType) {
		return false, nil
	}

	// Get the qualified type name for the function call
	typeName := c.getQualifiedTypeName(baseType)
	if typeName == "" {
		return false, nil
	}

	// Write the function call: TypeName_MethodName(receiver, args...)
	c.tsw.WriteLiterally(typeName)
	c.tsw.WriteLiterally("_")
	c.tsw.WriteLiterally(selectorExpr.Sel.Name)
	c.tsw.WriteLiterally("(")

	// Write the receiver (the object the method is called on)
	// For pointer receiver methods, we need to pass the VarRef instead of the value
	receiverNeedsVarRef := false

	// Check if the method has a pointer receiver by looking at the method signature
	if selection := c.pkg.TypesInfo.Selections[selectorExpr]; selection != nil {
		if methodObj := selection.Obj(); methodObj != nil {
			if methodFunc, ok := methodObj.(*types.Func); ok {
				if sig, ok := methodFunc.Type().(*types.Signature); ok && sig != nil {
					if recv := sig.Recv(); recv != nil {
						if _, isPointer := recv.Type().(*types.Pointer); isPointer {
							receiverNeedsVarRef = true
						}
					}
				}
			}
		}
	}

	if receiverNeedsVarRef {
		// For pointer receivers, we need to pass the VarRef (not the value)
		// Check if the receiver expression is an identifier that's already a VarRef
		if ident, ok := selectorExpr.X.(*ast.Ident); ok {
			if obj := c.pkg.TypesInfo.ObjectOf(ident); obj != nil {
				if c.analysis != nil && c.analysis.NeedsVarRef(obj) {
					// This variable is already a VarRef, pass it directly
					c.tsw.WriteLiterally(ident.Name)
				} else {
					// Not a VarRef, write the value expression
					if err := c.WriteValueExpr(selectorExpr.X); err != nil {
						return true, fmt.Errorf("failed to write wrapper type method receiver: %w", err)
					}
				}
			} else {
				if err := c.WriteValueExpr(selectorExpr.X); err != nil {
					return true, fmt.Errorf("failed to write wrapper type method receiver: %w", err)
				}
			}
		} else if selExpr, ok := selectorExpr.X.(*ast.SelectorExpr); ok {
			// Convert p.field to p._fields.field for struct field access
			if baseIdent, ok := selExpr.X.(*ast.Ident); ok {
				c.tsw.WriteLiterally(baseIdent.Name)
				c.tsw.WriteLiterally("._fields.")
				c.tsw.WriteLiterally(selExpr.Sel.Name)
			} else {
				if err := c.WriteValueExpr(selectorExpr.X); err != nil {
					return true, fmt.Errorf("failed to write wrapper type method receiver: %w", err)
				}
			}
		} else {
			if err := c.WriteValueExpr(selectorExpr.X); err != nil {
				return true, fmt.Errorf("failed to write wrapper type method receiver: %w", err)
			}
		}
	} else {
		if err := c.WriteValueExpr(selectorExpr.X); err != nil {
			return true, fmt.Errorf("failed to write wrapper type method receiver: %w", err)
		}
	}

	// Add other arguments
	if len(exp.Args) > 0 {
		c.tsw.WriteLiterally(", ")
		for i, arg := range exp.Args {
			if i != 0 {
				c.tsw.WriteLiterally(", ")
			}
			if err := c.WriteValueExpr(arg); err != nil {
				return true, fmt.Errorf("failed to write wrapper type method argument %d: %w", i, err)
			}
		}
	}

	c.tsw.WriteLiterally(")")
	return true, nil
}
