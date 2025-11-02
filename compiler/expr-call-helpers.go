package compiler

import (
	"go/ast"
	"go/types"

	"github.com/pkg/errors"
)

// writeByteSliceCreation handles the creation of []byte slices with proper Uint8Array handling
func (c *GoToTSCompiler) writeByteSliceCreation(lengthArg, capacityArg interface{}) error {
	return c.writeSliceCreationForType(lengthArg, capacityArg, true)
}

// writeSliceCreationForType handles slice creation with special handling for byte slices
func (c *GoToTSCompiler) writeSliceCreationForType(lengthArg, capacityArg interface{}, isByteSlice bool) error {
	hasCapacity := capacityArg != nil

	if isByteSlice && !hasCapacity {
		// make([]byte, len) - capacity equals length, use Uint8Array
		c.tsw.WriteLiterally("new Uint8Array(")
		if err := c.writeExprOrDefault(lengthArg, "0"); err != nil {
			return err
		}
		c.tsw.WriteLiterally(")")
		return nil
	}

	// Use $.makeSlice for all other cases
	if isByteSlice {
		c.tsw.WriteLiterally("$.makeSlice<number>(")
	} else {
		return errors.New("writeSliceCreationForType called for non-byte slice without element type")
	}

	if err := c.writeExprOrDefault(lengthArg, "0"); err != nil {
		return err
	}

	if hasCapacity {
		c.tsw.WriteLiterally(", ")
		if err := c.writeExprOrDefault(capacityArg, "0"); err != nil {
			return err
		}
	}

	if isByteSlice {
		c.tsw.WriteLiterally(", 'byte')")
	}

	return nil
}

// writeGenericSliceCreation handles the creation of generic slices with proper type hints
func (c *GoToTSCompiler) writeGenericSliceCreation(elemType types.Type, lengthArg, capacityArg interface{}) error {
	hasCapacity := capacityArg != nil

	c.tsw.WriteLiterally("$.makeSlice<")
	c.WriteGoType(elemType, GoTypeContextGeneral)
	c.tsw.WriteLiterally(">(")

	if err := c.writeExprOrDefault(lengthArg, "0"); err != nil {
		return err
	}

	if hasCapacity {
		c.tsw.WriteLiterally(", ")
		if err := c.writeExprOrDefault(capacityArg, "0"); err != nil {
			return err
		}
	}

	// Add type hint for proper zero value initialization
	c.writeSliceTypeHint(elemType, hasCapacity)
	c.tsw.WriteLiterally(")")
	return nil
}

// writeSliceTypeHint writes the type hint parameter for makeSlice calls
func (c *GoToTSCompiler) writeSliceTypeHint(elemType types.Type, hasCapacity bool) {
	typeHint := c.getTypeHintForSliceElement(elemType)
	if typeHint != "" {
		if !hasCapacity {
			c.tsw.WriteLiterally(", undefined")
		}
		c.tsw.WriteLiterally(", '")
		c.tsw.WriteLiterally(typeHint)
		c.tsw.WriteLiterally("'")
	}
}

// writeExprOrDefault writes an expression if it's not nil, otherwise writes a default value
func (c *GoToTSCompiler) writeExprOrDefault(expr interface{}, defaultValue string) error {
	if expr == nil {
		c.tsw.WriteLiterally(defaultValue)
		return nil
	}

	switch e := expr.(type) {
	case string:
		c.tsw.WriteLiterally(e)
		return nil
	case ast.Expr:
		// If it's an ast.Expr, call WriteValueExpr directly
		return c.WriteValueExpr(e)
	default:
		// If we can't handle the type, return an error
		return errors.Errorf("unsupported expression type in writeExprOrDefault: %T", e)
	}
}
