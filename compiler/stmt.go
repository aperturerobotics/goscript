package compiler

import (
	"fmt"
	"go/ast"
	"go/token"
	"go/types"
	"strings"

	"github.com/pkg/errors"
)

// WriteStmt is a central dispatcher function that translates a Go statement
// (`ast.Stmt`) into its TypeScript equivalent by calling the appropriate
// specialized `WriteStmt*` or `write*` method.
// It handles a wide variety of Go statements:
//   - Block statements (`ast.BlockStmt`): `WriteStmtBlock`.
//   - Assignment statements (`ast.AssignStmt`): `WriteStmtAssign`.
//   - Return statements (`ast.ReturnStmt`): `WriteStmtReturn`.
//   - Defer statements (`ast.DeferStmt`): `WriteStmtDefer`.
//   - If statements (`ast.IfStmt`): `WriteStmtIf`.
//   - Expression statements (`ast.ExprStmt`): `WriteStmtExpr`.
//   - Declaration statements (`ast.DeclStmt`): `WriteStmtDecl`.
//   - For statements (`ast.ForStmt`): `WriteStmtFor`.
//   - Range statements (`ast.RangeStmt`): `WriteStmtRange`.
//   - Switch statements (`ast.SwitchStmt`): `WriteStmtSwitch`.
//   - Increment/decrement statements (`ast.IncDecStmt`): `WriteStmtIncDec`.
//   - Send statements (`ast.SendStmt`): `WriteStmtSend`.
//   - Go statements (`ast.GoStmt`): `WriteStmtGo`.
//   - Select statements (`ast.SelectStmt`): `WriteStmtSelect`.
//   - Branch statements (`ast.BranchStmt`): `WriteStmtBranch`.
//   - Type switch statements (`ast.TypeSwitchStmt`): `WriteStmtTypeSwitch`.
//   - Labeled statements (`ast.LabeledStmt`): `WriteStmtLabeled`.
//
// If an unknown statement type is encountered, it returns an error.
func (c *GoToTSCompiler) WriteStmt(a ast.Stmt) error {
	switch exp := a.(type) {
	case *ast.BlockStmt:
		if err := c.WriteStmtBlock(exp, false); err != nil {
			return fmt.Errorf("failed to write block statement: %w", err)
		}
	case *ast.AssignStmt:
		// special case: if the left side of the assign has () we need a ; to prepend the line
		// ;(myStruct!.value).MyInt = 5
		// otherwise typescript assumes it is a function call
		if len(exp.Lhs) == 1 {
			if lhsSel, ok := exp.Lhs[0].(*ast.SelectorExpr); ok {
				if _, ok := lhsSel.X.(*ast.ParenExpr); ok {
					c.tsw.WriteLiterally(";")
				}
			}
		}

		if err := c.WriteStmtAssign(exp); err != nil {
			return fmt.Errorf("failed to write assignment statement: %w", err)
		}
	case *ast.ReturnStmt:
		if err := c.WriteStmtReturn(exp); err != nil {
			return fmt.Errorf("failed to write return statement: %w", err)
		}
	case *ast.DeferStmt:
		if err := c.WriteStmtDefer(exp); err != nil {
			return fmt.Errorf("failed to write defer statement: %w", err)
		}
	case *ast.IfStmt:
		if err := c.WriteStmtIf(exp); err != nil {
			return fmt.Errorf("failed to write if statement: %w", err)
		}
	case *ast.ExprStmt:
		if err := c.WriteStmtExpr(exp); err != nil {
			return fmt.Errorf("failed to write expression statement: %w", err)
		}
	case *ast.DeclStmt:
		if err := c.WriteStmtDecl(exp); err != nil {
			return fmt.Errorf("failed to write declaration statement: %w", err)
		}
	case *ast.ForStmt:
		if err := c.WriteStmtFor(exp); err != nil {
			return fmt.Errorf("failed to write for statement: %w", err)
		}
	case *ast.RangeStmt:
		// Generate TS for for…range loops, log if something goes wrong
		if err := c.WriteStmtRange(exp); err != nil {
			return fmt.Errorf("failed to write range statement: %w", err)
		}
	case *ast.SwitchStmt:
		if err := c.WriteStmtSwitch(exp); err != nil {
			return fmt.Errorf("failed to write switch statement: %w", err)
		}
	case *ast.IncDecStmt:
		if err := c.WriteStmtIncDec(exp); err != nil {
			return fmt.Errorf("failed to write increment/decrement statement: %w", err)
		}
	case *ast.SendStmt:
		if err := c.WriteStmtSend(exp); err != nil {
			return fmt.Errorf("failed to write send statement: %w", err)
		}
	case *ast.GoStmt:
		if err := c.WriteStmtGo(exp); err != nil {
			return fmt.Errorf("failed to write go statement: %w", err)
		}
	case *ast.SelectStmt:
		// Handle select statement
		if err := c.WriteStmtSelect(exp); err != nil {
			return fmt.Errorf("failed to write select statement: %w", err)
		}
	case *ast.BranchStmt:
		if err := c.WriteStmtBranch(exp); err != nil {
			return fmt.Errorf("failed to write branch statement: %w", err)
		}
	case *ast.TypeSwitchStmt:
		if err := c.WriteStmtTypeSwitch(exp); err != nil {
			return fmt.Errorf("failed to write type switch statement: %w", err)
		}
	case *ast.LabeledStmt:
		if err := c.WriteStmtLabeled(exp); err != nil {
			return fmt.Errorf("failed to write labeled statement: %w", err)
		}
	default:
		return errors.Errorf("unknown statement: %#v\n", a)
	}
	return nil
}

// WriteStmtDecl handles declaration statements (`ast.DeclStmt`),
// such as short variable declarations or type declarations within a statement list.
// It processes `ValueSpec`s and `TypeSpec`s within the declaration.
func (c *GoToTSCompiler) WriteStmtDecl(stmt *ast.DeclStmt) error {
	// This typically contains a GenDecl
	if genDecl, ok := stmt.Decl.(*ast.GenDecl); ok {
		for _, spec := range genDecl.Specs {
			// Value specs within a declaration statement
			if valueSpec, ok := spec.(*ast.ValueSpec); ok {
				if err := c.WriteValueSpec(valueSpec); err != nil {
					return fmt.Errorf("failed to write value spec in declaration statement: %w", err)
				}
			} else if typeSpec, ok := spec.(*ast.TypeSpec); ok {
				if err := c.WriteTypeSpec(typeSpec); err != nil {
					return fmt.Errorf("failed to write type spec in declaration statement: %w", err)
				}
			} else {
				return fmt.Errorf("unhandled spec in DeclStmt: %T", spec)
			}
		}
	} else {
		return errors.Errorf("unhandled declaration type in DeclStmt: %T", stmt.Decl)
	}
	return nil
}

// WriteStmtIncDec handles increment and decrement statements (`ast.IncDecStmt`).
// It writes the expression followed by `++` or `--`.
func (c *GoToTSCompiler) WriteStmtIncDec(stmt *ast.IncDecStmt) error {
	if err := c.WriteValueExpr(stmt.X); err != nil { // The expression (e.g., i)
		return fmt.Errorf("failed to write increment/decrement expression: %w", err)
	}
	tokStr, ok := TokenToTs(stmt.Tok)
	if !ok {
		return errors.Errorf("unknown incdec token: %s", stmt.Tok.String())
	}
	c.tsw.WriteLiterally(tokStr) // The token (e.g., ++)
	c.tsw.WriteLine("")
	return nil
}

// WriteStmtBranch handles branch statements (`ast.BranchStmt`), such as `break` and `continue`.
func (c *GoToTSCompiler) WriteStmtBranch(stmt *ast.BranchStmt) error {
	switch stmt.Tok {
	case token.BREAK:
		c.tsw.WriteLine("break") // No semicolon needed
	case token.CONTINUE:
		c.tsw.WriteLine("continue") // No semicolon needed
	case token.GOTO:
		// TypeScript doesn't support goto, but we can handle it by skipping it
		// since the labeled statement restructuring should handle the control flow
		c.tsw.WriteCommentLinef("goto %s // goto statement skipped", stmt.Label.Name)
	case token.FALLTHROUGH:
		// Fallthrough is handled in switch statements, should not appear elsewhere
		c.tsw.WriteCommentLinef("fallthrough // fallthrough statement skipped")
	default:
		// This case should ideally not be reached if the Go parser is correct,
		// as ast.BranchStmt only covers break, continue, goto, fallthrough.
		c.tsw.WriteCommentLinef("unhandled branch statement token: %s", stmt.Tok.String())
	}
	return nil
}

// WriteStmtGo translates a Go statement (`ast.GoStmt`) into its TypeScript equivalent.
// It handles `go func(){...}()`, `go namedFunc(args)`, and `go x.Method(args)`.
func (c *GoToTSCompiler) WriteStmtGo(exp *ast.GoStmt) error {
	// Handle goroutine statement
	// Translate 'go func() { ... }()' to 'queueMicrotask(() => { ... compiled body ... })'
	callExpr := exp.Call

	switch fun := callExpr.Fun.(type) {
	case *ast.FuncLit:
		// For function literals, we need to check if the function literal itself is async
		// This happens during analysis in analysisVisitor.Visit for FuncLit nodes
		isAsync := c.analysis.IsFuncLitAsync(fun)
		if isAsync {
			c.tsw.WriteLiterally("queueMicrotask(async () => ")
		} else {
			c.tsw.WriteLiterally("queueMicrotask(() => ")
		}

		// Compile the function literal's body directly
		if err := c.WriteStmtBlock(fun.Body, true); err != nil {
			return fmt.Errorf("failed to write goroutine function literal body: %w", err)
		}

		c.tsw.WriteLine(")") // Close the queueMicrotask statement

	case *ast.Ident:
		// Handle named functions: go namedFunc(args)
		// Get the object for this function
		obj := c.pkg.TypesInfo.Uses[fun]
		if obj == nil {
			return errors.Errorf("could not find object for function: %s", fun.Name)
		}

		// Check if the function is async
		isAsync := c.analysis.IsAsyncFunc(obj)
		if isAsync {
			c.tsw.WriteLiterally("queueMicrotask(async () => {")
		} else {
			c.tsw.WriteLiterally("queueMicrotask(() => {")
		}

		c.tsw.Indent(1)
		c.tsw.WriteLine("")

		// Write the function call, using await if the function is async
		if isAsync {
			c.tsw.WriteLiterally("await ")
		}

		// Write the function name
		c.tsw.WriteLiterally(fun.Name)

		// Write the function arguments
		c.tsw.WriteLiterally("(")
		for i, arg := range callExpr.Args {
			if i != 0 {
				c.tsw.WriteLiterally(", ")
			}
			if err := c.WriteValueExpr(arg); err != nil {
				return fmt.Errorf("failed to write argument %d in goroutine function call: %w", i, err)
			}
		}
		c.tsw.WriteLiterally(")")
		c.tsw.WriteLine("")

		c.tsw.Indent(-1)
		c.tsw.WriteLine("})") // Close the queueMicrotask callback and the statement
	case *ast.SelectorExpr:
		// Handle selector expressions: go x.Method(args)
		// Get the object for the selected method
		obj := c.pkg.TypesInfo.Uses[fun.Sel]
		if obj == nil {
			return errors.Errorf("could not find object for selected method: %s", fun.Sel.Name)
		}

		// Check if the function is async
		isAsync := c.analysis.IsAsyncFunc(obj)
		if isAsync {
			c.tsw.WriteLiterally("queueMicrotask(async () => {")
		} else {
			c.tsw.WriteLiterally("queueMicrotask(() => {")
		}

		c.tsw.Indent(1)
		c.tsw.WriteLine("")

		// Write the function call, using await if the function is async
		if isAsync {
			c.tsw.WriteLiterally("await ")
		}

		// Write the selector expression (e.g., f.Bar)
		// Note: callExpr.Fun is the *ast.SelectorExpr itself
		// For method calls, we need to add null assertion since Go would panic on nil receiver
		if selectorExpr, ok := callExpr.Fun.(*ast.SelectorExpr); ok {
			if err := c.WriteValueExpr(selectorExpr.X); err != nil {
				return fmt.Errorf("failed to write selector base expression in goroutine: %w", err)
			}
			// Add null assertion for method calls - Go would panic if receiver is nil
			c.tsw.WriteLiterally("!.")
			c.WriteIdent(selectorExpr.Sel, true)
		} else {
			if err := c.WriteValueExpr(callExpr.Fun); err != nil {
				return fmt.Errorf("failed to write selector expression in goroutine: %w", err)
			}
		}

		// Write the function arguments
		c.tsw.WriteLiterally("(")
		for i, arg := range callExpr.Args {
			if i != 0 {
				c.tsw.WriteLiterally(", ")
			}
			if err := c.WriteValueExpr(arg); err != nil {
				return fmt.Errorf("failed to write argument %d in goroutine selector function call: %w", i, err)
			}
		}
		c.tsw.WriteLiterally(")")
		c.tsw.WriteLine("")

		c.tsw.Indent(-1)
		c.tsw.WriteLine("})") // Close the queueMicrotask callback and the statement
	case *ast.TypeAssertExpr:
		// Handle type assertion expressions: go x.(func())()
		// We assume this is always synchronous (no async function returned by type assertion)
		c.tsw.WriteLiterally("queueMicrotask(() => {")

		c.tsw.Indent(1)
		c.tsw.WriteLine("")

		// Write the type assertion call
		if err := c.WriteTypeAssertExpr(fun); err != nil {
			return fmt.Errorf("failed to write type assertion expression in goroutine: %w", err)
		}

		// Add non-null assertion since mustTypeAssert throws on failure rather than returning null
		c.tsw.WriteLiterally("!")

		// Write the function arguments
		c.tsw.WriteLiterally("(")
		for i, arg := range callExpr.Args {
			if i != 0 {
				c.tsw.WriteLiterally(", ")
			}
			if err := c.WriteValueExpr(arg); err != nil {
				return fmt.Errorf("failed to write argument %d in goroutine type assertion function call: %w", i, err)
			}
		}
		c.tsw.WriteLiterally(")")
		c.tsw.WriteLine("")

		c.tsw.Indent(-1)
		c.tsw.WriteLine("})") // Close the queueMicrotask callback and the statement
	default:
		return errors.Errorf("unhandled goroutine function type: %T", callExpr.Fun)
	}
	return nil
}

// WriteStmtExpr translates a Go expression statement (`ast.ExprStmt`) into
// its TypeScript equivalent. An expression statement in Go is an expression
// evaluated for its side effects (e.g., a function call).
//   - A special case is a simple channel receive used as a statement (`<-ch`). This
//     is translated to `await ch_ts.receive();` (the value is discarded).
//   - For other expression statements, the underlying expression `exp.X` is translated
//     using `WriteValueExpr`.
//   - It attempts to preserve inline comments associated with the expression statement
//     or its underlying expression `exp.X`.
//
// The translated statement is terminated with a newline.
func (c *GoToTSCompiler) WriteStmtExpr(exp *ast.ExprStmt) error {
	// Handle simple channel receive used as a statement (<-ch)
	if unaryExpr, ok := exp.X.(*ast.UnaryExpr); ok && unaryExpr.Op == token.ARROW {
		// Translate <-ch to await $.chanRecv(ch)
		c.tsw.WriteLiterally("await $.chanRecv(")
		if err := c.WriteValueExpr(unaryExpr.X); err != nil { // Channel expression
			return fmt.Errorf("failed to write channel expression in receive statement: %w", err)
		}
		c.tsw.WriteLiterally(")") // Use chanRecv() as the value is discarded
		c.tsw.WriteLine("")
		return nil
	}

	// Handle other expression statements
	if err := c.WriteValueExpr(exp.X); err != nil { // Expression statement evaluates a value
		return err
	}

	// Handle potential inline comment for ExprStmt
	inlineCommentWritten := false
	if c.pkg != nil && c.pkg.Fset != nil && exp.End().IsValid() {
		if file := c.pkg.Fset.File(exp.End()); file != nil {
			endLine := file.Line(exp.End())
			// Check comments associated *directly* with the ExprStmt node
			for _, cg := range c.analysis.Cmap[exp] {
				if cg.Pos().IsValid() && file.Line(cg.Pos()) == endLine && cg.Pos() > exp.End() {
					commentText := strings.TrimSpace(strings.TrimPrefix(cg.Text(), "//"))
					c.tsw.WriteLiterally(" // " + commentText)
					inlineCommentWritten = true
					break
				}
			}
			// Also check comments associated with the underlying expression X
			// This might be necessary if the comment map links it to X instead of ExprStmt
			if !inlineCommentWritten {
				for _, cg := range c.analysis.Cmap[exp.X] {
					if cg.Pos().IsValid() && file.Line(cg.Pos()) == endLine && cg.Pos() > exp.End() {
						commentText := strings.TrimSpace(strings.TrimPrefix(cg.Text(), "//"))
						c.tsw.WriteLiterally(" // " + commentText)
						inlineCommentWritten = true //nolint:ineffassign
						break
					}
				}
			}
		}
	}

	// Add semicolon according to design doc (omit semicolons) - REMOVED semicolon
	c.tsw.WriteLine("") // Finish with a newline
	return nil
}

// WriteStmtSend translates a Go channel send statement (`ast.SendStmt`),
// which has the form `ch <- value`, into its asynchronous TypeScript equivalent.
// The translation is `await ch_ts.send(value_ts)`.
// Both the channel expression (`exp.Chan`) and the value expression (`exp.Value`)
// are translated using `WriteValueExpr`. The `await` keyword is used because
// channel send operations are asynchronous in the TypeScript model.
// The statement is terminated with a newline.
func (c *GoToTSCompiler) WriteStmtSend(exp *ast.SendStmt) error {
	// Translate ch <- value to await $.chanSend(ch, value)
	c.tsw.WriteLiterally("await $.chanSend(")
	if err := c.WriteValueExpr(exp.Chan); err != nil { // The channel expression
		return fmt.Errorf("failed to write channel expression in send statement: %w", err)
	}
	c.tsw.WriteLiterally(", ")
	if err := c.WriteValueExpr(exp.Value); err != nil { // The value expression
		return fmt.Errorf("failed to write value expression in send statement: %w", err)
	}
	c.tsw.WriteLiterally(")")
	c.tsw.WriteLine("") // Add newline after the statement
	return nil
}

// WriteStmtIf translates a Go `if` statement (`ast.IfStmt`) into its
// TypeScript equivalent.
//   - If the Go `if` has an initialization statement (`exp.Init`), it's wrapped
//     in a TypeScript block `{...}` before the `if` keyword, and the initializer
//     is translated within this block. This emulates Go's `if` statement scope.
//   - The condition (`exp.Cond`) is translated using `WriteValueExpr` and placed
//     within parentheses `(...)`.
//   - The `if` body (`exp.Body`) is translated as a block statement using
//     `WriteStmtBlock`. If `exp.Body` is nil, an empty block `{}` is written.
//   - The `else` branch (`exp.Else`) is handled:
//   - If `exp.Else` is a block statement (`ast.BlockStmt`), it's written as `else { ...body_ts... }`.
//   - If `exp.Else` is another `if` statement (`ast.IfStmt`), it's written as `else if (...) ...`,
//     recursively calling `WriteStmtIf`.
//
// The function aims to produce idiomatic TypeScript `if/else if/else` structures.
func (c *GoToTSCompiler) WriteStmtIf(exp *ast.IfStmt) error {
	// Handle optional initialization statement
	if exp.Init != nil {
		// Check for variable shadowing in the initialization first
		if c.analysis.HasVariableShadowing(exp) {
			shadowingInfo := c.analysis.GetShadowingInfo(exp)
			if shadowingInfo != nil {
				// Handle variable shadowing by creating temporary variables
				for varName, tempVarName := range shadowingInfo.TempVariables {
					c.tsw.WriteLiterally("const ")
					c.tsw.WriteLiterally(tempVarName)
					c.tsw.WriteLiterally(" = ")

					// Check if this is a built-in function and handle it directly
					if c.isBuiltinFunction(varName) {
						c.tsw.WriteLiterally("$.")
						c.tsw.WriteLiterally(varName)
					} else {
						// Get the original object for this shadowed variable
						if originalObj, exists := shadowingInfo.ShadowedVariables[varName]; exists {
							// Create an identifier with the original name and use WriteValueExpr to properly resolve it
							originalIdent := &ast.Ident{Name: varName}
							// Set the identifier in the Uses map so WriteValueExpr can find the object
							c.pkg.TypesInfo.Uses[originalIdent] = originalObj
							c.WriteValueExpr(originalIdent)
						} else {
							// Fallback to literal name if no object found (shouldn't happen in normal cases)
							c.tsw.WriteLiterally(varName)
						}
					}
					c.tsw.WriteLine("")
				}
			}
		}

		c.tsw.WriteLine("{")
		c.tsw.Indent(1)

		// Handle the initialization with or without shadowing support
		if c.analysis.HasVariableShadowing(exp) {
			shadowingInfo := c.analysis.GetShadowingInfo(exp)
			if shadowingInfo != nil {
				// Handle the initialization with shadowing support
				if assignStmt, ok := exp.Init.(*ast.AssignStmt); ok {
					if err := c.writeShadowedAssignmentWithoutTempVars(assignStmt, shadowingInfo); err != nil {
						return fmt.Errorf("failed to write shadowed assignment in if init: %w", err)
					}
				} else {
					// Non-assignment initialization statement
					if err := c.WriteStmt(exp.Init); err != nil {
						return fmt.Errorf("failed to write if initialization statement: %w", err)
					}
				}
			} else {
				// No shadowing info, write normally
				if err := c.WriteStmt(exp.Init); err != nil {
					return fmt.Errorf("failed to write if initialization statement: %w", err)
				}
			}
		} else {
			// No variable shadowing, write initialization normally
			if err := c.WriteStmt(exp.Init); err != nil {
				return fmt.Errorf("failed to write if initialization statement: %w", err)
			}
		}

		// Write the if statement itself within the initialization block
		c.tsw.WriteLiterally("if (")
		if err := c.WriteValueExpr(exp.Cond); err != nil {
			return err
		}
		c.tsw.WriteLiterally(") ")

		if err := c.WriteStmt(exp.Body); err != nil {
			return err
		}

		if exp.Else != nil {
			c.tsw.WriteLiterally(" else ")
			if err := c.WriteStmt(exp.Else); err != nil {
				return err
			}
		}

		c.tsw.Indent(-1)
		c.tsw.WriteLine("}")
		return nil
	}

	// No initialization statement, write if statement normally
	c.tsw.WriteLiterally("if (")
	if err := c.WriteValueExpr(exp.Cond); err != nil {
		return err
	}
	c.tsw.WriteLiterally(") ")

	if err := c.WriteStmt(exp.Body); err != nil {
		return err
	}

	if exp.Else != nil {
		c.tsw.WriteLiterally(" else ")
		if err := c.WriteStmt(exp.Else); err != nil {
			return err
		}
	}

	return nil
}

// WriteStmtReturn translates a Go `return` statement (`ast.ReturnStmt`) into
// its TypeScript equivalent.
//   - It writes the `return` keyword.
//   - If there are multiple return values (`len(exp.Results) > 1`), the translated
//     results are wrapped in a TypeScript array literal `[...]`.
//   - Each result expression in `exp.Results` is translated using `WriteValueExpr`.
//   - If there are no results, it simply writes `return`.
//
// The statement is terminated with a newline.
func (c *GoToTSCompiler) WriteStmtReturn(exp *ast.ReturnStmt) error {
	c.tsw.WriteLiterally("return ")

	// Check if it's a bare named return
	nodeInfo := c.analysis.NodeData[exp]
	if nodeInfo != nil && nodeInfo.IsBareReturn {
		var namedReturns []string
		if nodeInfo.EnclosingFuncDecl != nil {
			if obj := c.pkg.TypesInfo.ObjectOf(nodeInfo.EnclosingFuncDecl.Name); obj != nil {
				if funcInfo := c.analysis.FunctionData[obj]; funcInfo != nil {
					namedReturns = funcInfo.NamedReturns
				}
			}
		} else if nodeInfo.EnclosingFuncLit != nil {
			if funcInfo := c.analysis.FuncLitData[nodeInfo.EnclosingFuncLit]; funcInfo != nil {
				namedReturns = funcInfo.NamedReturns
			}
		}

		if len(namedReturns) == 1 {
			// Single named return - don't wrap in array
			c.tsw.WriteLiterally(c.sanitizeIdentifier(namedReturns[0]))
		} else if len(namedReturns) > 1 {
			// Multiple named returns - wrap in array
			c.tsw.WriteLiterally("[")
			for i, name := range namedReturns {
				if i != 0 {
					c.tsw.WriteLiterally(", ")
				}
				c.tsw.WriteLiterally(c.sanitizeIdentifier(name))
			}
			c.tsw.WriteLiterally("]")
		}
	} else {
		// Handle explicit return values
		if len(exp.Results) > 1 {
			c.tsw.WriteLiterally("[")
		}
		for i, res := range exp.Results {
			if i != 0 {
				c.tsw.WriteLiterally(", ")
			}
			// Special handling for nil in generic function returns
			if ident, isIdent := res.(*ast.Ident); isIdent && ident.Name == "nil" {
				// Check if we're in a generic function and get the return type
				if nodeInfo := c.analysis.NodeData[exp]; nodeInfo != nil && nodeInfo.EnclosingFuncDecl != nil {
					funcDecl := nodeInfo.EnclosingFuncDecl
					if funcDecl.Type.Results != nil && i < len(funcDecl.Type.Results.List) {
						// Get the return type for this result position
						resultField := funcDecl.Type.Results.List[i]
						if resultType := c.pkg.TypesInfo.TypeOf(resultField.Type); resultType != nil {
							if _, isTypeParam := resultType.(*types.TypeParam); isTypeParam {
								// This is a generic type parameter, use type assertion with unknown intermediate
								c.tsw.WriteLiterally("null as unknown as ")
								c.WriteGoType(resultType, GoTypeContextFunctionReturn)
								continue
							}
						}
					}
				}
			}
			if err := c.WriteValueExpr(res); err != nil { // Return results are values
				return err
			}
		}
		if len(exp.Results) > 1 {
			c.tsw.WriteLiterally("]")
		}
	}
	c.tsw.WriteLine("")
	return nil
}

// WriteStmtBlock translates a Go block statement (`ast.BlockStmt`), typically
// `{ ...stmts... }`, into its TypeScript equivalent, carefully preserving
// comments and blank lines to maintain code readability and structure.
//   - It writes an opening brace `{` and indents.
//   - If the analysis (`c.analysis.NeedsDefer`) indicates that the block (or a
//     function it's part of) contains `defer` statements, it injects a
//     `using __defer = new $.DisposableStack();` (or `AsyncDisposableStack` if
//     the context is async or contains async defers) at the beginning of the block.
//     This `__defer` stack is used by `WriteStmtDefer` to register cleanup actions.
//   - It iterates through the statements (`exp.List`) in the block:
//   - Leading comments associated with each statement are written first, with
//     blank lines preserved based on original source line numbers.
//   - The statement itself is then translated using `WriteStmt`.
//   - Inline comments (comments on the same line after a statement) are expected
//     to be handled by the individual statement writers (e.g., `WriteStmtExpr`).
//   - Trailing comments within the block (after the last statement but before the
//     closing brace) are written.
//   - Blank lines before the closing brace are preserved.
//   - Finally, it unindents and writes the closing brace `}`.
//
// If `suppressNewline` is true, the final newline after the closing brace is omitted
// (used, for example, when an `if` block is followed by an `else`).
func (c *GoToTSCompiler) WriteStmtBlock(exp *ast.BlockStmt, suppressNewline bool) error {
	if exp == nil {
		c.tsw.WriteLiterally("{}")
		if !suppressNewline {
			c.tsw.WriteLine("")
		}
		return nil
	}

	// Opening brace
	c.tsw.WriteLine("{")
	c.tsw.Indent(1)

	// Determine if there is any defer to an async function literal in this block
	hasAsyncDefer := false
	for _, stmt := range exp.List {
		if deferStmt, ok := stmt.(*ast.DeferStmt); ok {
			if funcLit, ok := deferStmt.Call.Fun.(*ast.FuncLit); ok {
				if c.analysis.IsFuncLitAsync(funcLit) {
					hasAsyncDefer = true
					break
				}
			} else {
				// Check if the deferred call is to an async function
				if c.isCallAsyncInDefer(deferStmt.Call) {
					hasAsyncDefer = true
					break
				}
			}
		}
	}

	// Add using statement if needed, considering async function or async defer
	if c.analysis.NeedsDefer(exp) {
		if c.analysis.IsInAsyncFunction(exp) || hasAsyncDefer {
			c.tsw.WriteLine("await using __defer = new $.AsyncDisposableStack();")
		} else {
			c.tsw.WriteLine("using __defer = new $.DisposableStack();")
		}
	}

	// Prepare line info
	var file *token.File
	if c.pkg != nil && c.pkg.Fset != nil && exp.Lbrace.IsValid() {
		file = c.pkg.Fset.File(exp.Lbrace)
	}

	// writeBlank emits a single blank line if gap > 1
	writeBlank := func(prev, curr int) {
		if file != nil && prev > 0 && curr > prev+1 {
			c.tsw.WriteLine("")
		}
	}

	// Track last printed line, start at opening brace
	lastLine := 0
	if file != nil {
		lastLine = file.Line(exp.Lbrace)
	}

	// 1. For each statement: write its leading comments, blank space, then the stmt
	for _, stmt := range exp.List {
		// Get statement's end line and position for inline comment check
		stmtEndLine := 0
		stmtEndPos := token.NoPos
		if file != nil && stmt.End().IsValid() {
			stmtEndLine = file.Line(stmt.End())
			stmtEndPos = stmt.End()
		}

		// Process leading comments for stmt
		comments := c.analysis.Cmap.Filter(stmt).Comments()
		for _, cg := range comments {
			// Check if this comment group is an inline comment for the current statement
			isInlineComment := false
			if file != nil && cg.Pos().IsValid() && stmtEndPos.IsValid() {
				commentStartLine := file.Line(cg.Pos())
				// Inline if starts on same line as stmt end AND starts after stmt end position
				if commentStartLine == stmtEndLine && cg.Pos() > stmtEndPos {
					isInlineComment = true
				}
			}

			// If it's NOT an inline comment for this statement, write it here
			if !isInlineComment {
				start := 0
				if file != nil && cg.Pos().IsValid() {
					start = file.Line(cg.Pos())
				}
				writeBlank(lastLine, start)
				c.WriteDoc(cg) // WriteDoc will handle the actual comment text
				if file != nil && cg.End().IsValid() {
					lastLine = file.Line(cg.End())
				}
			}
			// If it IS an inline comment, skip it. The statement writer will handle it.
		}

		// the statement itself
		stmtStart := 0
		if file != nil && stmt.Pos().IsValid() {
			stmtStart = file.Line(stmt.Pos())
		}
		writeBlank(lastLine, stmtStart)
		// Call the specific statement writer (e.g., WriteStmtAssign).
		// It is responsible for handling its own inline comment.
		if err := c.WriteStmt(stmt); err != nil {
			return fmt.Errorf("failed to write statement in block: %w", err)
		}

		if file != nil && stmt.End().IsValid() {
			// Update lastLine based on the statement's end, *including* potential inline comment handled by WriteStmt*
			lastLine = file.Line(stmt.End())
		}
	}

	// 2. Trailing comments on the block (after last stmt, before closing brace)
	trailing := c.analysis.Cmap.Filter(exp).Comments()
	for _, cg := range trailing {
		start := 0
		if file != nil && cg.Pos().IsValid() {
			start = file.Line(cg.Pos())
		}
		// only emit if it follows the last content
		if start > lastLine {
			writeBlank(lastLine, start)
			c.WriteDoc(cg)
			if file != nil && cg.End().IsValid() {
				lastLine = file.Line(cg.End())
			}
		}
	}

	// 3. Blank lines before closing brace
	closing := 0
	if file != nil && exp.Rbrace.IsValid() {
		closing = file.Line(exp.Rbrace)
	}
	writeBlank(lastLine, closing)

	// Closing brace
	c.tsw.Indent(-1)
	c.tsw.WriteLiterally("}")

	if !suppressNewline {
		c.tsw.WriteLine("")
	}
	return nil
}

// WriteStmtSwitch translates a Go `switch` statement into its TypeScript equivalent.
//   - If the Go switch has an initialization statement (`exp.Init`), it's wrapped
//     in a TypeScript block `{...}` before the `switch` keyword, and the
//     initializer is translated within this block. This emulates Go's switch scope.
//   - The switch condition (`exp.Tag`):
//   - If `exp.Tag` is present, it's translated using `WriteValueExpr`.
//   - If `exp.Tag` is nil (a "tagless" switch, like `switch { case cond1: ... }`),
//     it's translated as `switch (true)` in TypeScript.
//   - Each case clause (`ast.CaseClause`) in `exp.Body.List` is translated using
//     `WriteCaseClause`.
//
// The overall structure is `[optional_init_block] switch (condition_ts) { ...cases_ts... }`.
func (c *GoToTSCompiler) WriteStmtSwitch(exp *ast.SwitchStmt) error {
	// Handle optional initialization statement
	if exp.Init != nil {
		c.tsw.WriteLiterally("{")
		c.tsw.Indent(1)
		if err := c.WriteStmt(exp.Init); err != nil {
			return fmt.Errorf("failed to write switch initialization statement: %w", err)
		}
		defer func() {
			c.tsw.Indent(-1)
			c.tsw.WriteLiterally("}")
		}()
	}

	c.tsw.WriteLiterally("switch (")
	// Handle the switch tag (the expression being switched on)
	if exp.Tag != nil {
		if err := c.WriteValueExpr(exp.Tag); err != nil {
			return fmt.Errorf("failed to write switch tag expression: %w", err)
		}
	} else {
		c.tsw.WriteLiterally("true") // Write 'true' for switch without expression
	}
	c.tsw.WriteLiterally(") {")
	c.tsw.WriteLine("")
	c.tsw.Indent(1)

	// Handle case clauses
	for _, stmt := range exp.Body.List {
		if caseClause, ok := stmt.(*ast.CaseClause); ok {
			if err := c.WriteCaseClause(caseClause); err != nil {
				return fmt.Errorf("failed to write case clause in switch statement: %w", err)
			}
		} else {
			return fmt.Errorf("unhandled statement in switch body: %T", stmt)
		}
	}

	c.tsw.Indent(-1)
	c.tsw.WriteLine("}")
	return nil
}

// WriteStmtDefer translates a Go `defer` statement into TypeScript code that
// utilizes a disposable stack (`$.DisposableStack` or `$.AsyncDisposableStack`).
// The Go `defer` semantics (LIFO execution at function exit) are emulated by
// registering a cleanup function with this stack.
//   - `defer funcCall()` becomes `__defer.defer(() => { funcCall_ts(); });`.
//   - `defer func(){ ...body... }()` (an immediately-invoked function literal, IIFL)
//     has its body inlined: `__defer.defer(() => { ...body_ts... });`.
//   - If the deferred call is to an async function or an async function literal
//     (determined by `c.analysis.IsInAsyncFunctionMap`), the registered callback
//     is marked `async`: `__defer.defer(async () => { ... });`.
//
// The `__defer` variable is assumed to be declared at the beginning of the
// function scope (see `WriteStmtBlock` or `WriteFuncDeclAsMethod`) using
// `await using __defer = new $.AsyncDisposableStack();` for async functions/contexts
// or `using __defer = new $.DisposableStack();` for sync contexts.
func (c *GoToTSCompiler) WriteStmtDefer(exp *ast.DeferStmt) error {
	// Determine if the deferred call is to an async function literal using analysis
	isAsyncDeferred := false
	if funcLit, ok := exp.Call.Fun.(*ast.FuncLit); ok {
		isAsyncDeferred = c.analysis.IsFuncLitAsync(funcLit)
	} else {
		// Check if the deferred call is to an async function
		isAsyncDeferred = c.isCallAsyncInDefer(exp.Call)
	}

	// Set async prefix based on pre-computed async status
	asyncPrefix := ""
	if isAsyncDeferred {
		asyncPrefix = "async "
	}

	// Set stack variable based on whether we are in an async function
	stackVar := "__defer"
	c.tsw.WriteLiterallyf("%s.defer(%s() => {", stackVar, asyncPrefix)
	c.tsw.Indent(1)
	c.tsw.WriteLine("")

	// Write the deferred call or inline the body when it's an immediately-invoked
	// function literal (defer func(){ ... }()).
	if funcLit, ok := exp.Call.Fun.(*ast.FuncLit); ok && len(exp.Call.Args) == 0 {
		// Inline the function literal's body to avoid nested arrow invocation.
		for _, stmt := range funcLit.Body.List {
			if err := c.WriteStmt(stmt); err != nil {
				return fmt.Errorf("failed to write statement in deferred function body: %w", err)
			}
		}
	} else {
		// Write the call expression as-is.
		if err := c.WriteValueExpr(exp.Call); err != nil {
			return fmt.Errorf("failed to write deferred call: %w", err)
		}
		c.tsw.WriteLine("")
	}

	c.tsw.Indent(-1)
	c.tsw.WriteLine("});")

	return nil
}

// isCallAsyncInDefer determines if a call expression in a defer statement is async
func (c *GoToTSCompiler) isCallAsyncInDefer(callExpr *ast.CallExpr) bool {
	switch fun := callExpr.Fun.(type) {
	case *ast.Ident:
		// Direct function call (e.g., defer myFunc())
		if obj := c.pkg.TypesInfo.Uses[fun]; obj != nil {
			return c.analysis.IsAsyncFunc(obj)
		}
	case *ast.SelectorExpr:
		// Method call (e.g., defer handle.Release()) or package function call
		if selection := c.pkg.TypesInfo.Selections[fun]; selection != nil {
			// Method call on an object
			if methodObj := selection.Obj(); methodObj != nil {
				return c.analysis.IsAsyncFunc(methodObj)
			}
		} else if ident, ok := fun.X.(*ast.Ident); ok {
			// Package-level function call (e.g., defer time.Sleep())
			if obj := c.pkg.TypesInfo.Uses[ident]; obj != nil {
				if pkgName, isPkg := obj.(*types.PkgName); isPkg {
					methodName := fun.Sel.Name
					pkgPath := pkgName.Imported().Path()
					return c.analysis.IsMethodAsync(pkgPath, "", methodName)
				}
			}
		}
	}
	return false
}

// WriteStmtLabeled handles labeled statements (ast.LabeledStmt), such as "label: statement".
// In TypeScript, labels cannot be used with variable declarations, so we need to handle this case specially.
func (c *GoToTSCompiler) WriteStmtLabeled(stmt *ast.LabeledStmt) error {
	// Check if the labeled statement is a declaration statement or assignment with :=
	needsBlock := false
	if _, ok := stmt.Stmt.(*ast.DeclStmt); ok {
		needsBlock = true
	} else if assignStmt, ok := stmt.Stmt.(*ast.AssignStmt); ok && assignStmt.Tok == token.DEFINE {
		// Assignment with := is also a declaration and needs special handling
		needsBlock = true
	}

	if needsBlock {
		// For declaration statements and := assignments, we need to put the label on a separate line
		// because TypeScript doesn't allow labels with declarations
		c.tsw.WriteLiterally(stmt.Label.Name)
		c.tsw.WriteLine(": {")
		c.tsw.Indent(1)

		// Write the statement without the label
		if err := c.WriteStmt(stmt.Stmt); err != nil {
			return fmt.Errorf("failed to write labeled declaration/assignment statement: %w", err)
		}

		c.tsw.Indent(-1)
		c.tsw.WriteLine("}")
	} else {
		// For non-declaration statements, write the label normally
		c.tsw.WriteLiterally(stmt.Label.Name)
		c.tsw.WriteLiterally(": ")

		// Write the labeled statement
		if err := c.WriteStmt(stmt.Stmt); err != nil {
			return fmt.Errorf("failed to write labeled statement: %w", err)
		}
	}

	return nil
}

// writeShadowedAssignment writes an assignment statement that has variable shadowing,
// using pre-computed identifier mappings from analysis instead of dynamic context.
func (c *GoToTSCompiler) writeShadowedAssignment(stmt *ast.AssignStmt, shadowingInfo *ShadowingInfo) error {
	// First, create temporary variables for the shadowed variables
	for varName, tempVarName := range shadowingInfo.TempVariables {
		c.tsw.WriteLiterally("const ")
		c.tsw.WriteLiterally(tempVarName)
		c.tsw.WriteLiterally(" = ")

		// Check if this is a built-in function and handle it directly
		if c.isBuiltinFunction(varName) {
			c.tsw.WriteLiterally("$.")
			c.tsw.WriteLiterally(varName)
		} else {
			// Get the original object for this shadowed variable
			if originalObj, exists := shadowingInfo.ShadowedVariables[varName]; exists {
				// Create an identifier with the original name and use WriteValueExpr to properly resolve it
				originalIdent := &ast.Ident{Name: varName}
				// Set the identifier in the Uses map so WriteValueExpr can find the object
				c.pkg.TypesInfo.Uses[originalIdent] = originalObj
				c.WriteValueExpr(originalIdent)
			} else {
				// Fallback to literal name if no object found (shouldn't happen in normal cases)
				c.tsw.WriteLiterally(varName)
			}
		}
		c.tsw.WriteLine("")
	}

	// Now write the LHS variables (these are new declarations)
	for i, lhsExpr := range stmt.Lhs {
		if i > 0 {
			c.tsw.WriteLiterally(", ")
		}

		if ident, ok := lhsExpr.(*ast.Ident); ok {
			if ident.Name == "_" {
				c.tsw.WriteLiterally("_")
			} else {
				c.tsw.WriteLiterally("let ")
				c.WriteIdent(ident, false) // Don't use temp variable for LHS
			}
		} else {
			// For non-identifier LHS (shouldn't happen in := assignments), write normally
			if err := c.WriteValueExpr(lhsExpr); err != nil {
				return err
			}
		}
	}

	c.tsw.WriteLiterally(" = ")

	// Write RHS expressions - but we need to replace shadowed variables with temporary variables
	for i, rhsExpr := range stmt.Rhs {
		if i > 0 {
			c.tsw.WriteLiterally(", ")
		}
		if err := c.writeShadowedRHSExpression(rhsExpr, shadowingInfo); err != nil {
			return err
		}
	}

	c.tsw.WriteLine("")
	return nil
}

// writeShadowedAssignmentWithoutTempVars writes an assignment statement that has variable shadowing,
// but assumes temporary variables have already been created outside this scope.
func (c *GoToTSCompiler) writeShadowedAssignmentWithoutTempVars(stmt *ast.AssignStmt, shadowingInfo *ShadowingInfo) error {
	if len(stmt.Rhs) == 1 {
		if typeAssert, isTypeAssert := stmt.Rhs[0].(*ast.TypeAssertExpr); isTypeAssert {
			if len(stmt.Lhs) != 2 {
				return fmt.Errorf("type assertion assignment requires 2 LHS, got %d", len(stmt.Lhs))
			}
			valueExpr := stmt.Lhs[0]
			okExpr := stmt.Lhs[1]
			valueIdent, valueIsIdent := valueExpr.(*ast.Ident)
			okIdent, okIsIdent := okExpr.(*ast.Ident)
			if valueIsIdent && okIsIdent {
				valueName := valueIdent.Name
				okName := okIdent.Name
				valueIsBlank := valueName == "_"
				okIsBlank := okName == "_"
				if valueIsBlank && okIsBlank {
					// Both blank, evaluate RHS for side effects
					if err := c.writeShadowedRHSExpression(typeAssert.X, shadowingInfo); err != nil {
						return err
					}
					c.tsw.WriteLine("")
					return nil
				}
				c.tsw.WriteLiterally("let { ")
				var parts []string
				if !valueIsBlank {
					parts = append(parts, "value: "+valueName)
				}
				if !okIsBlank {
					parts = append(parts, "ok: "+okName)
				}
				c.tsw.WriteLiterally(strings.Join(parts, ", "))
				c.tsw.WriteLiterally(" } = $.typeAssert<")
				c.WriteTypeExpr(typeAssert.Type)
				c.tsw.WriteLiterally(">(")
				if err := c.writeShadowedRHSExpression(typeAssert.X, shadowingInfo); err != nil {
					return err
				}
				c.tsw.WriteLiterally(", ")
				c.writeTypeDescription(typeAssert.Type)
				c.tsw.WriteLiterally(")")
				c.tsw.WriteLine("")
				return nil
			}
		}
	}

	firstDecl := true
	for i, lhsExpr := range stmt.Lhs {
		if i > 0 {
			c.tsw.WriteLiterally(", ")
		}
		if ident, ok := lhsExpr.(*ast.Ident); ok {
			if ident.Name != "_" {
				if firstDecl {
					c.tsw.WriteLiterally("let ")
					firstDecl = false
				}
				c.WriteIdent(ident, false)
			} else {
				c.tsw.WriteLiterally("_")
			}
		} else {
			if err := c.WriteValueExpr(lhsExpr); err != nil {
				return err
			}
		}
	}
	c.tsw.WriteLiterally(" = ")
	for i, rhsExpr := range stmt.Rhs {
		if i > 0 {
			c.tsw.WriteLiterally(", ")
		}
		if err := c.writeShadowedRHSExpression(rhsExpr, shadowingInfo); err != nil {
			return err
		}
	}
	c.tsw.WriteLine("")
	return nil
}

// writeShadowedRHSExpression writes a RHS expression, replacing shadowed variables with temporary variables
func (c *GoToTSCompiler) writeShadowedRHSExpression(expr ast.Expr, shadowingInfo *ShadowingInfo) error {
	switch e := expr.(type) {
	case *ast.Ident:
		// Check if this identifier is a shadowed variable
		if tempVar, isShadowed := shadowingInfo.TempVariables[e.Name]; isShadowed {
			// Use the temporary variable instead
			c.tsw.WriteLiterally(tempVar)
		} else {
			// Use the original identifier
			c.WriteIdent(e, true)
		}
		return nil

	case *ast.CallExpr:
		// Handle function calls - replace identifiers in arguments with temp variables
		if err := c.writeShadowedRHSExpression(e.Fun, shadowingInfo); err != nil {
			return err
		}

		// Add non-null assertion for function calls (same logic as WriteCallExpr)
		c.addNonNullAssertion(e.Fun)

		c.tsw.WriteLiterally("(")
		for i, arg := range e.Args {
			if i > 0 {
				c.tsw.WriteLiterally(", ")
			}
			if err := c.writeShadowedRHSExpression(arg, shadowingInfo); err != nil {
				return err
			}
		}
		c.tsw.WriteLiterally(")")
		return nil

	case *ast.SelectorExpr:
		// Handle selector expressions (e.g., obj.Method)
		if err := c.writeShadowedRHSExpression(e.X, shadowingInfo); err != nil {
			return err
		}
		c.tsw.WriteLiterally(".")
		c.WriteIdent(e.Sel, true)
		return nil

	case *ast.IndexExpr:
		// Handle index expressions (e.g., arr[i])
		if err := c.writeShadowedRHSExpression(e.X, shadowingInfo); err != nil {
			return err
		}
		c.tsw.WriteLiterally("[")
		if err := c.writeShadowedRHSExpression(e.Index, shadowingInfo); err != nil {
			return err
		}
		c.tsw.WriteLiterally("]")
		return nil

	case *ast.UnaryExpr:
		// Handle unary expressions (e.g., &x, -x)
		c.tsw.WriteLiterally(e.Op.String())
		return c.writeShadowedRHSExpression(e.X, shadowingInfo)

	case *ast.BinaryExpr:
		// Handle binary expressions (e.g., x + y)
		if err := c.writeShadowedRHSExpression(e.X, shadowingInfo); err != nil {
			return err
		}
		c.tsw.WriteLiterally(" ")
		c.tsw.WriteLiterally(e.Op.String())
		c.tsw.WriteLiterally(" ")
		return c.writeShadowedRHSExpression(e.Y, shadowingInfo)

	case *ast.ParenExpr:
		// Handle parenthesized expressions
		c.tsw.WriteLiterally("(")
		if err := c.writeShadowedRHSExpression(e.X, shadowingInfo); err != nil {
			return err
		}
		c.tsw.WriteLiterally(")")
		return nil

	default:
		// For other expression types, fall back to normal WriteValueExpr
		return c.WriteValueExpr(expr)
	}
}

// isBuiltinFunction checks if the given name is a Go built-in function
func (c *GoToTSCompiler) isBuiltinFunction(name string) bool {
	builtins := map[string]bool{
		"len":     true,
		"cap":     true,
		"make":    true,
		"new":     true,
		"append":  true,
		"copy":    true,
		"delete":  true,
		"complex": true,
		"real":    true,
		"imag":    true,
		"close":   true,
		"panic":   true,
		"recover": true,
		"print":   true,
		"println": true,
	}
	return builtins[name]
}
