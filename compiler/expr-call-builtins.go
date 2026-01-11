package compiler

import (
	"fmt"
	"go/ast"
	"go/token"

	"github.com/pkg/errors"
)

// builtinFunctions is the definitive list of Go builtin functions handled by the compiler
var builtinFunctions = map[string]bool{
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
	"min":     true,
	"max":     true,
	"clear":   true,
}

// writeBuiltinFunction handles built-in Go functions
func (c *GoToTSCompiler) writeBuiltinFunction(exp *ast.CallExpr, funName string) (handled bool, err error) {
	switch funName {
	case "panic":
		c.tsw.WriteLiterally("$.panic")
		return true, nil
	case "println":
		c.tsw.WriteLiterally("$.println")
		return true, nil
	case "len":
		if len(exp.Args) != 1 {
			return true, errors.Errorf("unhandled len call with incorrect number of arguments: %d != 1", len(exp.Args))
		}
		c.tsw.WriteLiterally("$.len")
		return true, nil
	case "cap":
		if len(exp.Args) != 1 {
			return true, errors.Errorf("unhandled cap call with incorrect number of arguments: %d != 1", len(exp.Args))
		}
		c.tsw.WriteLiterally("$.cap")
		return true, nil
	case "new":
		if len(exp.Args) != 1 {
			return true, errors.Errorf("unhandled new call with incorrect number of arguments: %d != 1", len(exp.Args))
		}
		c.tsw.WriteLiterally("new ")
		c.WriteTypeExpr(exp.Args[0]) // This should write the TypeScript type T_ts
		c.tsw.WriteLiterally("()")
		return true, nil
	case "delete":
		if len(exp.Args) != 2 {
			return true, errors.Errorf("unhandled delete call with incorrect number of arguments: %d != 2", len(exp.Args))
		}
		c.tsw.WriteLiterally("$.deleteMapEntry")
		return true, nil
	case "copy":
		if len(exp.Args) != 2 {
			return true, errors.Errorf("unhandled copy call with incorrect number of arguments: %d != 2", len(exp.Args))
		}
		c.tsw.WriteLiterally("$.copy")
		return true, nil
	case "recover":
		if len(exp.Args) != 0 {
			return true, errors.Errorf("unhandled recover call with incorrect number of arguments: %d != 0", len(exp.Args))
		}
		c.tsw.WriteLiterally("$.recover")
		return true, nil
	case "make":
		return true, c.WriteCallExprMake(exp)
	case "string":
		return true, c.writeStringConversion(exp)
	case "close":
		if len(exp.Args) != 1 {
			return true, errors.New("unhandled close call with incorrect number of arguments")
		}
		if err := c.WriteValueExpr(exp.Args[0]); err != nil {
			return true, fmt.Errorf("failed to write channel in close call: %w", err)
		}
		c.tsw.WriteLiterally(".close()")
		return true, nil
	case "append":
		return true, c.writeAppendCall(exp)
	case "min":
		if len(exp.Args) < 1 {
			return true, errors.New("unhandled min call with no arguments")
		}
		c.tsw.WriteLiterally("Math.min(")
		for i, arg := range exp.Args {
			if i > 0 {
				c.tsw.WriteLiterally(", ")
			}
			if err := c.WriteValueExpr(arg); err != nil {
				return true, fmt.Errorf("failed to write argument %d in min call: %w", i, err)
			}
		}
		c.tsw.WriteLiterally(")")
		return true, nil
	case "max":
		if len(exp.Args) < 1 {
			return true, errors.New("unhandled max call with no arguments")
		}
		c.tsw.WriteLiterally("Math.max(")
		for i, arg := range exp.Args {
			if i > 0 {
				c.tsw.WriteLiterally(", ")
			}
			if err := c.WriteValueExpr(arg); err != nil {
				return true, fmt.Errorf("failed to write argument %d in max call: %w", i, err)
			}
		}
		c.tsw.WriteLiterally(")")
		return true, nil
	case "clear":
		if len(exp.Args) != 1 {
			return true, errors.Errorf("unhandled clear call with incorrect number of arguments: %d != 1", len(exp.Args))
		}
		c.tsw.WriteLiterally("$.clear(")
		if err := c.WriteValueExpr(exp.Args[0]); err != nil {
			return true, fmt.Errorf("failed to write argument in clear call: %w", err)
		}
		c.tsw.WriteLiterally(")")
		return true, nil
	case "byte":
		if len(exp.Args) != 1 {
			return true, errors.Errorf("unhandled byte call with incorrect number of arguments: %d != 1", len(exp.Args))
		}
		c.tsw.WriteLiterally("$.byte(")
		if err := c.WriteValueExpr(exp.Args[0]); err != nil {
			return true, fmt.Errorf("failed to write argument for byte() conversion: %w", err)
		}
		c.tsw.WriteLiterally(")")
		return true, nil
	case "int":
		return true, c.writeIntConversion(exp)
	default:
		return false, nil
	}
}

// writeAppendCall handles append() function calls
func (c *GoToTSCompiler) writeAppendCall(exp *ast.CallExpr) error {
	if len(exp.Args) < 1 {
		return errors.New("unhandled append call with incorrect number of arguments")
	}

	c.tsw.WriteLiterally("$.append(")
	// The first argument is the slice
	if err := c.WriteValueExpr(exp.Args[0]); err != nil {
		return fmt.Errorf("failed to write slice in append call: %w", err)
	}

	// The remaining arguments are the elements to append
	elemsToAppend := exp.Args[1:]
	for i, arg := range elemsToAppend {
		if i > 0 || len(exp.Args) > 1 {
			c.tsw.WriteLiterally(", ")
		}

		// Handle ellipsis (spread) for the last argument: append(slice, elems...)
		// The ellipsis can only appear on the last argument, so check if this is the last element
		isLastElement := i == len(elemsToAppend)-1
		if exp.Ellipsis != token.NoPos && isLastElement {
			// Check if the slice is []byte and the argument is a string
			sliceType := c.pkg.TypesInfo.TypeOf(exp.Args[0])
			argType := c.pkg.TypesInfo.TypeOf(arg)

			if sliceType != nil && argType != nil {
				if c.isByteSliceType(sliceType) && c.isStringType(argType) {
					// Convert string to bytes: append([]byte, string...) -> $.append(slice, ...$.stringToBytes(string))
					c.tsw.WriteLiterally("...$.stringToBytes(")
					if err := c.WriteValueExpr(arg); err != nil {
						return fmt.Errorf("failed to write string argument in append call: %w", err)
					}
					c.tsw.WriteLiterally(")")
					continue
				}
			}

			// For other slice types with ellipsis, use spread operator
			// append(slice, anotherSlice...) -> $.append(slice, ...(anotherSlice || []))
			// The || [] handles the case where anotherSlice is null (nil in Go)
			c.tsw.WriteLiterally("...(")
			if err := c.WriteValueExpr(arg); err != nil {
				return fmt.Errorf("failed to write spread argument in append call: %w", err)
			}
			c.tsw.WriteLiterally(" || [])")
			continue
		}

		if err := c.WriteValueExpr(arg); err != nil {
			return fmt.Errorf("failed to write argument %d in append call: %w", i+1, err)
		}
	}
	c.tsw.WriteLiterally(")")
	return nil
}
