package compiler

import (
	"fmt"
	"go/ast"
	"go/token"
	"go/types"
)

// writeAssignmentCore handles the central logic for translating Go assignment
// operations (LHS op RHS) into TypeScript. It's called by `WriteStmtAssign`
// and other functions that need to generate assignment code.
//
// Key behaviors:
//   - Multi-variable assignment (e.g., `a, b = b, a`): Translates to TypeScript
//     array destructuring: `[a_ts, b_ts] = [b_ts, a_ts]`. It correctly handles
//     non-null assertions for array index expressions on both LHS and RHS if
//     all expressions involved are index expressions (common in swaps).
//   - Single-variable assignment to a map index (`myMap[key] = value`): Translates
//     to `$.mapSet(myMap_ts, key_ts, value_ts)`.
//   - Other single-variable assignments (`variable = value`):
//   - The LHS expression is written (caller typically ensures `.value` is appended
//     if assigning to a VarRefed variable's content).
//   - The Go assignment token (`tok`, e.g., `=`, `+=`) is translated to its
//     TypeScript equivalent using `TokenToTs`.
//   - The RHS expression(s) are written. If `shouldApplyClone` indicates the RHS
//     is a struct value, `.clone()` is appended to the translated RHS to emulate
//     Go's value semantics for struct assignment.
//   - Blank identifiers (`_`) on the LHS are handled by omitting them in TypeScript
//     destructuring patterns or by skipping the assignment for single assignments.
//
// This function handles all assignment types including:
// - Pointer dereference assignments (*p = v)
// - Blank identifier assignments (_ = v)
func (c *GoToTSCompiler) writeAssignmentCore(lhs, rhs []ast.Expr, tok token.Token, addDeclaration bool) error {
	// Handle blank identifier (_) on the LHS for single assignments
	if len(lhs) == 1 && len(rhs) == 1 {
		if ident, ok := lhs[0].(*ast.Ident); ok && ident.Name == "_" {
			return c.writeBlankIdentifierAssign(rhs[0])
		}

		// Handle the special case of "*p = val" or "*p += val" (assignment to dereferenced pointer)
		if starExpr, ok := lhs[0].(*ast.StarExpr); ok {
			return c.writePointerDerefAssign(starExpr, rhs[0], tok)
		}

		// Handle variable referenced variables in declarations
		if addDeclaration && tok == token.DEFINE {
			if handled, err := c.writeVarRefShortDecl(lhs[0], rhs[0]); err != nil {
				return err
			} else if handled {
				return nil
			}

			c.tsw.WriteLiterally("let ")
		}
	}

	// Special case for multi-variable assignment to handle array element swaps
	if len(lhs) > 1 && len(rhs) > 1 {
		return c.writeMultiVarAssign(lhs, rhs, tok)
	}

	// --- Logic for assignments ---
	isMapIndexLHS := false // Track if the first LHS is a map index
	for i, l := range lhs {
		if i != 0 {
			c.tsw.WriteLiterally(", ")
		}

		// Handle map indexing assignment specially
		// Note: We don't use WriteIndexExpr here because we need to use $.mapSet instead of .get
		currentIsMapIndex := false
		if indexExpr, ok := l.(*ast.IndexExpr); ok {
			if tv, ok := c.pkg.TypesInfo.Types[indexExpr.X]; ok {
				// Check if it's a concrete map type
				if _, isMap := tv.Type.Underlying().(*types.Map); isMap {
					currentIsMapIndex = true
					if i == 0 {
						isMapIndexLHS = true
					}
					// Use mapSet helper
					c.tsw.WriteLiterally("$.mapSet(")
					if err := c.WriteValueExpr(indexExpr.X); err != nil { // Map
						return err
					}
					c.tsw.WriteLiterally(", ")
					if err := c.WriteValueExpr(indexExpr.Index); err != nil { // Key
						return err
					}
					c.tsw.WriteLiterally(", ")
					// Value will be added after operator and RHS
				} else if typeParam, isTypeParam := tv.Type.(*types.TypeParam); isTypeParam {
					// Check if the type parameter is constrained to be a map type
					constraint := typeParam.Constraint()
					if constraint != nil {
						underlying := constraint.Underlying()
						if iface, isInterface := underlying.(*types.Interface); isInterface {
							if hasMapConstraint(iface) {
								currentIsMapIndex = true
								if i == 0 {
									isMapIndexLHS = true
								}
								// Use mapSet helper for type parameter constrained to map
								c.tsw.WriteLiterally("$.mapSet(")
								if err := c.WriteValueExpr(indexExpr.X); err != nil { // Map
									return err
								}
								c.tsw.WriteLiterally(", ")
								if err := c.WriteValueExpr(indexExpr.Index); err != nil { // Key
									return err
								}
								c.tsw.WriteLiterally(", ")
								// Value will be added after operator and RHS
							}
						}
					}
				}
			}
		}

		if !currentIsMapIndex {
			// For single assignments, handle variable referenced variables specially
			if len(lhs) == 1 && len(rhs) == 1 {
				lhsExprIdent, lhsExprIsIdent := l.(*ast.Ident)
				if lhsExprIsIdent {
					// Determine if LHS is variable referenced
					isLHSVarRefed := false
					var lhsObj types.Object
					// Get the types.Object from the identifier
					lhsObj = c.objectOfIdent(lhsExprIdent)

					// Check if this variable needs to be variable referenced
					if lhsObj != nil && c.analysis.NeedsVarRef(lhsObj) {
						isLHSVarRefed = true
					}

					// prevent writing .value unless lhs is variable referenced
					c.WriteIdent(lhsExprIdent, isLHSVarRefed)
					continue
				}
			}

			// Write the LHS expression normally
			if err := c.WriteValueExpr(l); err != nil {
				return err
			}
		}
	}

	// Check for integer division compound assignment (i /= n)
	// Go's integer division truncates, but JavaScript's /= doesn't
	// We need to convert `i /= n` to `i = Math.trunc(i / n)`
	isIntegerDivisionAssign := false
	if tok == token.QUO_ASSIGN && len(lhs) == 1 && len(rhs) == 1 {
		if lhsType := c.pkg.TypesInfo.TypeOf(lhs[0]); lhsType != nil {
			if basic, ok := lhsType.Underlying().(*types.Basic); ok {
				if basic.Info()&types.IsInteger != 0 {
					isIntegerDivisionAssign = true
				}
			}
		}
	}

	// Only write the assignment operator for regular variables, not for map assignments handled by mapSet
	if isMapIndexLHS && len(lhs) == 1 { // Only skip operator if it's a single map assignment
		// Continue, we've already written part of the mapSet() function call
	} else if isIntegerDivisionAssign {
		// For integer division compound assignment, convert `i /= n` to `i = Math.trunc(i / n)`
		c.tsw.WriteLiterally(" = Math.trunc(")
		// Write LHS again as first operand of division
		if err := c.WriteValueExpr(lhs[0]); err != nil {
			return err
		}
		c.tsw.WriteLiterally(" / ")
		// RHS will be written below, then we close the parenthesis
	} else {
		c.tsw.WriteLiterally(" ")
		if err := c.writeAssignmentOperator(tok); err != nil {
			return err
		}
	}

	// Write RHS
	for i, r := range rhs {
		if i != 0 {
			c.tsw.WriteLiterally(", ")
		}

		// Check if we need to access a variable referenced source value and apply clone
		// For struct value assignments, we need to handle:
		// 1. UnVarRefed source, unVarRefed target: source.clone()
		// 2. Variable referenced source, unVarRefed target: source.value.clone()
		// 3. UnVarRefed source, variable referenced target: $.varRef(source)
		// 4. Variable referenced source, variable referenced target: source (straight assignment of the variable reference)

		// Determine if RHS is a variable referenced variable (could be a struct or other variable)
		needsVarRefedAccessRHS := false
		var rhsObj types.Object

		// Check if RHS is an identifier (variable name)
		rhsIdent, rhsIsIdent := r.(*ast.Ident)
		if rhsIsIdent {
			rhsObj = c.objectOfIdent(rhsIdent)

			// Important: For struct copying, we need to check if the variable itself is variable referenced
			// Important: For struct copying, we need to check if the variable needs variable referenced access
			// This is more comprehensive than just checking if it's variable referenced
			if rhsObj != nil {
				needsVarRefedAccessRHS = c.analysis.NeedsVarRefAccess(rhsObj)
			}
		}

		// Check for pointer-to-pointer assignment
		if rhsIsIdent && rhsObj != nil && len(lhs) == 1 {
			lhsType := c.pkg.TypesInfo.TypeOf(lhs[0])
			rhsType := rhsObj.Type()

			if lhsType != nil && rhsType != nil {
				// Check if both LHS and RHS are pointer types
				if _, lhsIsPtr := lhsType.(*types.Pointer); lhsIsPtr {
					if _, rhsIsPtr := rhsType.(*types.Pointer); rhsIsPtr {
						// This is pointer-to-pointer assignment
						// The key question: is the RHS variable itself varref'd?
						// - If RHS is varref'd (like pp1), use .value to get the actual pointer
						// - If RHS is not varref'd (like p1), use the variable directly

						if c.analysis.NeedsVarRef(rhsObj) {
							// RHS variable is varref'd, so we need its .value to get the actual pointer
							c.WriteIdent(rhsIdent, true) // Add .value access
						} else {
							// RHS variable is not varref'd, so it directly holds the pointer
							c.WriteIdent(rhsIdent, false) // No .value access
						}
						continue
					}
				}
			}
		}

		// Handle different cases for struct cloning
		if shouldApplyClone(c.pkg, r) {
			// When cloning for value assignment, mark the result as struct value
			c.tsw.WriteLiterally("$.markAsStructValue(")

			// Check if RHS is an async call - if so, wrap in parentheses so .clone() binds correctly
			// Example: (await asyncFunc()).clone() instead of await asyncFunc().clone()
			needsParensForAsync := false
			if callExpr, isCall := r.(*ast.CallExpr); isCall && c.isCallExprAsync(callExpr) {
				needsParensForAsync = true
				c.tsw.WriteLiterally("(")
			}

			// For other expressions, we need to handle variable referenced access differently
			if _, isIdent := r.(*ast.Ident); isIdent {
				// For identifiers, WriteValueExpr already adds .value if needed
				if err := c.WriteValueExpr(r); err != nil {
					return err
				}
			} else {
				// For non-identifiers, write the expression and add .value if needed
				if err := c.WriteValueExpr(r); err != nil {
					return err
				}
				// Only add .value for non-identifiers that need variable referenced access
				if needsVarRefedAccessRHS {
					c.tsw.WriteLiterally(".value") // Access the variable referenced value
				}
			}

			if needsParensForAsync {
				c.tsw.WriteLiterally(")")
			}
			c.tsw.WriteLiterally(".clone())") // Always add clone for struct values
		} else {
			// Check if this is a pointer variable assignment to an interface type
			if rhsIsIdent && rhsObj != nil {
				// Check if LHS is interface type and RHS is a pointer variable
				if len(lhs) == 1 {
					lhsType := c.pkg.TypesInfo.TypeOf(lhs[0])
					rhsType := rhsObj.Type()

					if lhsType != nil && rhsType != nil {
						// Check if LHS is interface and RHS is pointer
						if _, isInterface := lhsType.Underlying().(*types.Interface); isInterface {
							if ptrType, isPtr := rhsType.(*types.Pointer); isPtr {
								// This is pointer-to-interface assignment
								// For pointer variables that point to varrefed values, write without .value
								// We want to pass the VarRef object itself to the interface, not its .value
								if c.analysis.NeedsVarRefAccess(rhsObj) {
									// Write the pointer variable without .value access
									c.WriteIdent(rhsIdent, false)
									continue
								}

								// Check if this is a struct pointer for the element type
								if _, isStruct := ptrType.Elem().Underlying().(*types.Struct); isStruct {
									// Struct pointer to interface - might need special handling
									// Continue to normal WriteValueExpr handling
								}
							}
						}
					}
				}
			}

			// Non-struct case: write RHS normally
			// Check if this is a primitive error type being assigned to an error interface
			if c.writePrimitiveErrorWrapperForAssign(lhs, r, i) {
				continue
			}

			if err := c.WriteValueExpr(r); err != nil { // RHS is a non-struct value
				return err
			}
		}
	}

	// Close the parenthesis for &^= transformation
	if tok == token.AND_NOT_ASSIGN && !(isMapIndexLHS && len(lhs) == 1) {
		c.tsw.WriteLiterally(")")
	}

	// Close the parenthesis for integer division compound assignment
	if isIntegerDivisionAssign {
		c.tsw.WriteLiterally(")")
	}

	// If the LHS was a single map index, close the mapSet call
	if isMapIndexLHS && len(lhs) == 1 {
		c.tsw.WriteLiterally(")")
	}
	return nil
}

// writePrimitiveErrorWrapperForAssign checks if an RHS value is a primitive type
// that implements the error interface being assigned to an error-typed LHS,
// and if so, wraps it with $.wrapPrimitiveError.
// Returns true if the wrapper was written, false otherwise.
func (c *GoToTSCompiler) writePrimitiveErrorWrapperForAssign(lhs []ast.Expr, rhs ast.Expr, rhsIndex int) bool {
	// Only handle single assignments for now
	if len(lhs) != 1 || rhsIndex != 0 {
		return false
	}

	// Get the LHS type
	lhsType := c.pkg.TypesInfo.TypeOf(lhs[0])
	if lhsType == nil {
		return false
	}

	// Check if the LHS type is the error interface
	if iface, ok := lhsType.Underlying().(*types.Interface); !ok || iface.String() != "interface{Error() string}" {
		return false
	}

	// Get the actual type of the RHS expression
	rhsType := c.pkg.TypesInfo.TypeOf(rhs)
	if rhsType == nil {
		return false
	}

	// Check if the RHS type is a wrapper type (named type with basic underlying type)
	if !c.isWrapperType(rhsType) {
		return false
	}

	// Check if the RHS type has an Error() method
	if !c.typeHasMethods(rhsType, "Error") {
		return false
	}

	// Get the qualified type name for the Error function
	typeName := c.getQualifiedTypeName(rhsType)
	if typeName == "" {
		return false
	}

	// Write: $.wrapPrimitiveError(value, TypeName_Error)
	c.tsw.WriteLiterally("$.wrapPrimitiveError(")
	if err := c.WriteValueExpr(rhs); err != nil {
		return false
	}
	c.tsw.WriteLiterally(", ")
	c.tsw.WriteLiterally(typeName)
	c.tsw.WriteLiterally("_Error)")

	return true
}

// writeBlankIdentifierAssign handles assignment to blank identifier (_)
func (c *GoToTSCompiler) writeBlankIdentifierAssign(rhs ast.Expr) error {
	c.tsw.WriteLiterally("/* _ = */ ")
	return c.WriteValueExpr(rhs)
}

// writePointerDerefAssign handles assignments to dereferenced pointers (*p = val)
func (c *GoToTSCompiler) writePointerDerefAssign(starExpr *ast.StarExpr, rhs ast.Expr, tok token.Token) error {
	// Write pointer dereference
	if ident, ok := starExpr.X.(*ast.Ident); ok {
		obj := c.objectOfIdent(ident)
		if obj != nil && c.analysis.NeedsVarRef(obj) {
			c.WriteIdent(ident, true)
			c.tsw.WriteLiterally("!.value")
		} else {
			c.WriteIdent(ident, false)
			c.tsw.WriteLiterally("!.value")
		}
	} else {
		if err := c.WriteValueExpr(starExpr.X); err != nil {
			return err
		}
		c.tsw.WriteLiterally("!.value")
	}

	// Write assignment operator
	if tok == token.AND_NOT_ASSIGN {
		c.tsw.WriteLiterally(" &= ~(")
	} else {
		c.tsw.WriteLiterally(" ")
		tokStr, ok := TokenToTs(tok)
		if !ok {
			return fmt.Errorf("unknown assignment token: %s", tok.String())
		}
		c.tsw.WriteLiterally(tokStr)
		c.tsw.WriteLiterally(" ")
	}

	// Write RHS with cloning if needed
	if shouldApplyClone(c.pkg, rhs) {
		c.tsw.WriteLiterally("$.markAsStructValue(")
		if err := c.WriteValueExpr(rhs); err != nil {
			return err
		}
		c.tsw.WriteLiterally(".clone())")
	} else {
		if err := c.WriteValueExpr(rhs); err != nil {
			return err
		}
	}

	if tok == token.AND_NOT_ASSIGN {
		c.tsw.WriteLiterally(")")
	}

	return nil
}

// writeVarRefShortDecl handles short declarations of varrefed variables
// Returns true if handled, false otherwise
func (c *GoToTSCompiler) writeVarRefShortDecl(lhs, rhs ast.Expr) (bool, error) {
	ident, ok := lhs.(*ast.Ident)
	if !ok {
		return false, nil
	}

	obj := c.objectOfIdent(ident)
	if obj == nil || !c.analysis.NeedsVarRef(obj) {
		return false, nil
	}

	c.tsw.WriteLiterally("let ")
	c.tsw.WriteLiterally(c.sanitizeIdentifier(ident.Name))
	c.tsw.WriteLiterally(" = $.varRef(")
	if err := c.WriteValueExpr(rhs); err != nil {
		return false, err
	}
	c.tsw.WriteLiterally(")")
	return true, nil
}

// writeMultiVarAssign handles multi-variable assignments with array destructuring
func (c *GoToTSCompiler) writeMultiVarAssign(lhs, rhs []ast.Expr, tok token.Token) error {
	// Check if all expressions are index expressions (for swap optimization)
	allIndexExprs := true
	for _, expr := range append(lhs, rhs...) {
		if _, isIndexExpr := expr.(*ast.IndexExpr); !isIndexExpr {
			allIndexExprs = false
			break
		}
	}

	// Add semicolon to prevent TypeScript parsing issues
	if tok != token.DEFINE {
		c.tsw.WriteLiterally(";")
	}

	// Write LHS array destructuring pattern
	c.tsw.WriteLiterally("[")
	for i, l := range lhs {
		if i != 0 {
			c.tsw.WriteLiterally(", ")
		}

		if ident, ok := l.(*ast.Ident); ok && ident.Name == "_" {
			// Blank identifier - leave empty slot
		} else if indexExpr, ok := l.(*ast.IndexExpr); ok && allIndexExprs {
			if err := c.WriteValueExpr(indexExpr.X); err != nil {
				return err
			}
			c.tsw.WriteLiterally("![")
			if err := c.WriteValueExpr(indexExpr.Index); err != nil {
				return err
			}
			c.tsw.WriteLiterally("]")
		} else {
			if err := c.WriteValueExpr(l); err != nil {
				return err
			}
		}
	}

	// Write RHS array
	c.tsw.WriteLiterally("] = [")
	for i, r := range rhs {
		if i != 0 {
			c.tsw.WriteLiterally(", ")
		}

		if indexExpr, ok := r.(*ast.IndexExpr); ok && allIndexExprs {
			if err := c.WriteValueExpr(indexExpr.X); err != nil {
				return err
			}
			c.tsw.WriteLiterally("![")
			if err := c.WriteValueExpr(indexExpr.Index); err != nil {
				return err
			}
			c.tsw.WriteLiterally("]")
		} else if callExpr, isCallExpr := r.(*ast.CallExpr); isCallExpr {
			if err := c.WriteCallExpr(callExpr); err != nil {
				return err
			}
		} else {
			if err := c.WriteValueExpr(r); err != nil {
				return err
			}
		}
	}
	c.tsw.WriteLiterally("]")

	return nil
}

// writeAssignmentOperator writes the TypeScript assignment operator
func (c *GoToTSCompiler) writeAssignmentOperator(tok token.Token) error {
	if tok == token.AND_NOT_ASSIGN {
		c.tsw.WriteLiterally("&= ~(")
		return nil
	}

	tokStr, ok := TokenToTs(tok)
	if !ok {
		return fmt.Errorf("unknown assignment token: %s", tok.String())
	}
	c.tsw.WriteLiterally(tokStr)
	c.tsw.WriteLiterally(" ")
	return nil
}
