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

// writeReflectTypeFor handles reflect.TypeFor[T]() calls by generating appropriate TypeScript
func (c *GoToTSCompiler) writeReflectTypeFor(exp *ast.CallExpr, selectorExpr *ast.SelectorExpr) (handled bool, err error) {
	// Check if this is reflect.TypeFor
	if selectorExpr.Sel.Name != "TypeFor" {
		return false, nil
	}

	// Check if X is an identifier referring to the reflect package
	xIdent, ok := selectorExpr.X.(*ast.Ident)
	if !ok {
		return false, nil
	}

	obj := c.objectOfIdent(xIdent)
	if obj == nil {
		return false, nil
	}

	pkgName, ok := obj.(*types.PkgName)
	if !ok || pkgName.Imported().Path() != "reflect" {
		return false, nil
	}

	// DEBUG: We found reflect.TypeFor
	// fmt.Printf("DEBUG: Found reflect.TypeFor call\n")

	// This is reflect.TypeFor - now get the type argument
	if c.pkg.TypesInfo.Instances == nil {
		return false, errors.New("reflect.TypeFor called but no type instances available")
	}

	instance, hasInstance := c.pkg.TypesInfo.Instances[selectorExpr.Sel]
	if !hasInstance || instance.TypeArgs == nil || instance.TypeArgs.Len() == 0 {
		return false, errors.New("reflect.TypeFor called without type arguments")
	}

	// Get the first type argument
	typeArg := instance.TypeArgs.At(0)
	// fmt.Printf("DEBUG: Type argument: %v\n", typeArg)

	// Generate TypeScript code to create a Type for this type
	if err := c.writeTypeForTypeArg(typeArg); err != nil {
		return true, err
	}

	return true, nil
}

// writeTypeForTypeArg generates TypeScript code to create a reflect.Type for the given Go type
func (c *GoToTSCompiler) writeTypeForTypeArg(t types.Type) error {
	// Handle basic types
	switch underlying := t.Underlying().(type) {
	case *types.Basic:
		return c.writeBasicTypeFor(underlying)
	case *types.Named:
		// For named types, use TypeOf with a zero value
		return c.writeNamedTypeFor(t)
	case *types.Pointer:
		// For pointer types, use PointerTo
		c.tsw.WriteLiterally("reflect.PointerTo(")
		if err := c.writeTypeForTypeArg(underlying.Elem()); err != nil {
			return err
		}
		c.tsw.WriteLiterally(")")
		return nil
	case *types.Slice:
		// For slice types, use TypeOf with an empty slice
		c.tsw.WriteLiterally("reflect.TypeOf([])")
		return nil
	case *types.Array:
		// For array types, use TypeOf with an empty array
		c.tsw.WriteLiterally("reflect.TypeOf([])")
		return nil
	case *types.Struct:
		// For struct types, use TypeOf with zero value
		return c.writeNamedTypeFor(t)
	case *types.Interface:
		// For interface types, use TypeOf with null
		return c.writeNamedTypeFor(t)
	default:
		return errors.Errorf("unsupported type for reflect.TypeFor: %T", underlying)
	}
}

// writeBasicTypeFor generates code for basic types
func (c *GoToTSCompiler) writeBasicTypeFor(basic *types.Basic) error {
	// Map basic types to their reflect constructors or TypeOf calls
	// Note: We don't pass type parameters to TypeOf - it infers from the value
	switch basic.Kind() {
	case types.Bool:
		c.tsw.WriteLiterally("reflect.TypeOf(false)")
	case types.Int:
		c.tsw.WriteLiterally("reflect.TypeOf(0)")
	case types.Int8:
		c.tsw.WriteLiterally("reflect.TypeOf(0)")
	case types.Int16:
		c.tsw.WriteLiterally("reflect.TypeOf(0)")
	case types.Int32:
		c.tsw.WriteLiterally("reflect.TypeOf(0)")
	case types.Int64:
		c.tsw.WriteLiterally("reflect.TypeOf(0n)")
	case types.Uint:
		c.tsw.WriteLiterally("reflect.TypeOf(0)")
	case types.Uint8:
		c.tsw.WriteLiterally("reflect.TypeOf(0)")
	case types.Uint16:
		c.tsw.WriteLiterally("reflect.TypeOf(0)")
	case types.Uint32:
		c.tsw.WriteLiterally("reflect.TypeOf(0)")
	case types.Uint64:
		c.tsw.WriteLiterally("reflect.TypeOf(0n)")
	case types.Uintptr:
		c.tsw.WriteLiterally("reflect.TypeOf(0)")
	case types.Float32:
		c.tsw.WriteLiterally("reflect.TypeOf(0)")
	case types.Float64:
		c.tsw.WriteLiterally("reflect.TypeOf(0)")
	case types.Complex64:
		c.tsw.WriteLiterally("reflect.TypeOf([0, 0])")
	case types.Complex128:
		c.tsw.WriteLiterally("reflect.TypeOf([0, 0])")
	case types.String:
		c.tsw.WriteLiterally("reflect.TypeOf(\"\")")
	case types.UnsafePointer:
		c.tsw.WriteLiterally("reflect.TypeOf(null)")
	default:
		return errors.Errorf("unsupported basic type for reflect.TypeFor: %v", basic)
	}
	return nil
}

// writeNamedTypeFor generates code for named types (structs, interfaces, etc.)
func (c *GoToTSCompiler) writeNamedTypeFor(t types.Type) error {
	// For interface types, we need special handling since null doesn't carry type info
	if _, ok := t.Underlying().(*types.Interface); ok {
		if named, ok := t.(*types.Named); ok {
			obj := named.Obj()
			pkgPath := ""
			if pkg := obj.Pkg(); pkg != nil {
				if pkg.Name() == "main" {
					pkgPath = "main."
				} else if pkg.Path() != "" {
					pkgPath = pkg.Path() + "."
				}
			}
			typeName := pkgPath + obj.Name()
			c.tsw.WriteLiterally("reflect.getInterfaceTypeByName(\"" + typeName + "\")")
			return nil
		}
		// For anonymous interfaces, use TypeOf(null)
		c.tsw.WriteLiterally("reflect.TypeOf(null)")
		return nil
	}

	// For named types, we need to create a zero value and call TypeOf
	// Note: We don't pass a type parameter to TypeOf - it infers the type from the value
	c.tsw.WriteLiterally("reflect.TypeOf(")

	// Generate a zero value for this type
	switch underlying := t.Underlying().(type) {
	case *types.Struct:
		// For struct types: new MyStruct()
		// Check if this is a named type
		if _, ok := t.(*types.Named); ok {
			c.tsw.WriteLiterally("new ")
			c.WriteGoType(t, GoTypeContextGeneral)
			c.tsw.WriteLiterally("()")
		} else {
			// Anonymous struct
			c.tsw.WriteLiterally("{}")
		}
	case *types.Basic:
		// For basic types wrapped in named types
		return c.writeBasicTypeFor(underlying)
	default:
		return errors.Errorf("unsupported named type underlying for reflect.TypeFor: %T", underlying)
	}

	c.tsw.WriteLiterally(")")
	return nil
}
