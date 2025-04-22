package compiler

import (
	"fmt"
	"go/ast"
	"go/token"
	gtypes "go/types"

	gstypes "github.com/paralin/goscript/types" // Explicit alias for goscript types
	"github.com/sanity-io/litter"
)

// WriteStmt writes a statement to the output, including associated comments if writeComments is true.
func (c *GoToTSCompiler) WriteStmt(a ast.Stmt, writeComments bool) {
	if writeComments {
		if comments := c.cmap[a]; comments != nil {
			for _, cg := range comments {
				c.WriteDoc(cg)
			}
		}
	}

	switch exp := a.(type) {
	case *ast.BlockStmt:
		c.WriteStmtBlock(exp)
	case *ast.AssignStmt:
		c.WriteStmtAssign(exp)
	case *ast.ReturnStmt:
		c.WriteStmtReturn(exp)
	case *ast.IfStmt:
		c.WriteStmtIf(exp)
	case *ast.ExprStmt:
		c.WriteStmtExpr(exp)
	default:
		c.tsw.WriteCommentLine(fmt.Sprintf("unknown statement: %s\n", litter.Sdump(a)))
	}
}

// Overload for backward compatibility
func (c *GoToTSCompiler) WriteStmtCompat(a ast.Stmt) {
	c.WriteStmt(a, true)
}

// WriteStmtIf writes an if statement.
func (s *GoToTSCompiler) WriteStmtIf(exp *ast.IfStmt) {
	if exp.Init != nil {
		s.tsw.WriteLiterally("{")
		s.tsw.Indent(1)

		s.WriteStmt(exp.Init, false) // Do not write comments for Init

		defer func() {
			s.tsw.Indent(-1)
			s.tsw.WriteLiterally("}")
		}()
	}

	s.tsw.WriteLiterally("if (")
	s.WriteValueExpr(exp.Cond) // Condition is a value
	s.tsw.WriteLiterally(") ")

	if exp.Body != nil {
		s.WriteStmtBlock(exp.Body)
	} else {
		s.tsw.WriteLine("{}")
	}
}

// WriteStmtReturn writes a return statement.
func (c *GoToTSCompiler) WriteStmtReturn(exp *ast.ReturnStmt) {
	c.tsw.WriteLiterally("return ")
	for i, res := range exp.Results {
		if i != 0 {
			c.tsw.WriteLiterally(", ")
		}
		c.WriteValueExpr(res) // Return results are values
	}
	c.tsw.WriteLine("")
}

// WriteStmtBlock writes a block statement, preserving comments and blank lines.
func (c *GoToTSCompiler) WriteStmtBlock(exp *ast.BlockStmt) {
	if exp == nil {
		c.tsw.WriteLine("{}")
		return
	}

	// Opening brace
	c.tsw.WriteLine("{")
	c.tsw.Indent(1)

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
		// leading comments for stmt
		comments := c.cmap.Filter(stmt).Comments()
		for _, cg := range comments {
			start := 0
			if file != nil && cg.Pos().IsValid() {
				start = file.Line(cg.Pos())
			}
			writeBlank(lastLine, start)
			c.WriteDoc(cg)
			if file != nil && cg.End().IsValid() {
				lastLine = file.Line(cg.End())
			}
		}

		// the statement itself
		stmtStart := 0
		if file != nil && stmt.Pos().IsValid() {
			stmtStart = file.Line(stmt.Pos())
		}
		writeBlank(lastLine, stmtStart)
		c.WriteStmt(stmt, false)
		if file != nil && stmt.End().IsValid() {
			lastLine = file.Line(stmt.End())
		}
	}

	// 2. Trailing comments on the block (after last stmt, before closing brace)
	trailing := c.cmap.Filter(exp).Comments()
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
	c.tsw.WriteLine("}")
}

// WriteStmtAssign writes an assign statement.
func (c *GoToTSCompiler) WriteStmtAssign(exp *ast.AssignStmt) {
	// skip blank-identifier assignments: ignore single `_ = ...` assignments
	if len(exp.Lhs) == 1 {
		if ident, ok := exp.Lhs[0].(*ast.Ident); ok && ident.Name == "_" {
			return
		}
	}
	// filter out blank identifiers for multi-value assignments: remove any `_` slots
	lhs, rhs := filterBlankIdentifiers(exp.Lhs, exp.Rhs)
	if len(lhs) == 0 {
		return
	}
	// special-case define assignments (`:=`):
	if exp.Tok == token.DEFINE {
		c.tsw.WriteLiterally("let ")
		for i, l := range lhs {
			if i != 0 {
				c.tsw.WriteLiterally(", ")
			}
			c.WriteValueExpr(l) // LHS is a value
			c.tsw.WriteLiterally(" = ")

			// Check if we should apply clone for value-type semantics
			if shouldApplyClone(c.pkg, rhs[i]) {
				c.WriteValueExpr(rhs[i]) // RHS is a value
				c.tsw.WriteLiterally(".clone()")
			} else {
				c.WriteValueExpr(rhs[i]) // RHS is a value
			}
		}
		c.tsw.WriteLine("")
		return
	}

	// fallback for other assignment tokens (`=`, `+=`, etc):
	for i, l := range lhs {
		if i != 0 {
			c.tsw.WriteLiterally(", ")
		}
		c.WriteValueExpr(l) // LHS is a value
	}
	c.tsw.WriteLiterally(" ")
	tokStr, ok := gstypes.TokenToTs(exp.Tok) // Use explicit gstypes alias
	if !ok {
		c.tsw.WriteLiterally("?= ")
		c.tsw.WriteCommentLine("Unknown token " + exp.Tok.String())
	} else {
		c.tsw.WriteLiterally(tokStr)
	}
	c.tsw.WriteLiterally(" ")
	for i, r := range rhs {
		if i != 0 {
			c.tsw.WriteLiterally(", ")
		}
		c.WriteValueExpr(r) // RHS is a value
	}
	c.tsw.WriteLine("")
}

// WriteStmtExpr writes an expr statement.
func (c *GoToTSCompiler) WriteStmtExpr(exp *ast.ExprStmt) {
	c.WriteValueExpr(exp.X) // Expression statement evaluates a value
	c.tsw.WriteLine(";")
}

// WriteZeroValue writes the TypeScript zero‐value for a Go type.
func (c *GoToTSCompiler) WriteZeroValue(expr ast.Expr) {
	switch t := expr.(type) {
	case *ast.Ident:
		// Try to resolve identifier type
		if tv, found := c.pkg.TypesInfo.Types[t]; found {
			underlying := tv.Type.Underlying()
			switch u := underlying.(type) {
			case *gtypes.Basic: // Use gotypes alias
				if u.Info()&gtypes.IsNumeric != 0 { // Use gotypes alias
					c.tsw.WriteLiterally("0")
				} else if u.Info()&gtypes.IsString != 0 { // Use gotypes alias
					c.tsw.WriteLiterally(`""`)
				} else if u.Info()&gtypes.IsBoolean != 0 { // Use gotypes alias
					c.tsw.WriteLiterally("false")
				} else {
					c.tsw.WriteLiterally("null // unknown basic type")
				}
			case *gtypes.Struct: // Use gotypes alias
				// Zero value for struct is new instance
				c.tsw.WriteLiterally("new ")
				c.WriteTypeExpr(t) // Write the type name
				c.tsw.WriteLiterally("()")
			case *gtypes.Pointer, *gtypes.Interface, *gtypes.Slice, *gtypes.Map, *gtypes.Chan, *gtypes.Signature: // Use gotypes alias
				// Pointers, interfaces, slices, maps, channels, functions zero value is null/undefined
				c.tsw.WriteLiterally("null")
			default:
				c.tsw.WriteLiterally("null // unknown underlying type")
			}
		} else {
			// Fallback for unresolved identifiers (basic types)
			switch t.Name {
			case "int", "int8", "int16", "int32", "int64", "uint", "uint8", "uint16", "uint32", "uint64", "uintptr", "float32", "float64", "complex64", "complex128":
				c.tsw.WriteLiterally("0")
			case "string":
				c.tsw.WriteLiterally(`""`)
			case "bool":
				c.tsw.WriteLiterally("false")
			default:
				// Assume custom type, might be struct or interface -> null
				c.tsw.WriteLiterally("null // unresolved identifier")
			}
		}
	case *ast.StarExpr, *ast.InterfaceType, *ast.ArrayType, *ast.MapType, *ast.ChanType, *ast.FuncType:
		// Pointers, interfaces, arrays, maps, channels, functions zero value is null/undefined
		c.tsw.WriteLiterally("null")
	case *ast.StructType:
		// Anonymous struct zero value is complex, default to null for now
		c.tsw.WriteLiterally("null")
	default:
		// everything else defaults to null in TS
		c.tsw.WriteLiterally("null")
	}
}
