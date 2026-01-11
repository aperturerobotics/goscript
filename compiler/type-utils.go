package compiler

import (
	"go/ast"
	"go/types"
)

// isByteSliceType checks if a type is []byte (slice of uint8)
func (c *GoToTSCompiler) isByteSliceType(t types.Type) bool {
	if sliceType, isSlice := t.Underlying().(*types.Slice); isSlice {
		if basicElem, isBasic := sliceType.Elem().(*types.Basic); isBasic && basicElem.Kind() == types.Uint8 {
			return true
		}
	}
	return false
}

// isRuneSliceType checks if a type is []rune (slice of int32)
func (c *GoToTSCompiler) isRuneSliceType(t types.Type) bool {
	if sliceType, isSlice := t.Underlying().(*types.Slice); isSlice {
		if basicElem, isBasic := sliceType.Elem().(*types.Basic); isBasic && basicElem.Kind() == types.Int32 {
			return true
		}
	}
	return false
}

// isStringType checks if a type is string or could be string (e.g., type parameter)
func (c *GoToTSCompiler) isStringType(t types.Type) bool {
	if basic, isBasic := t.Underlying().(*types.Basic); isBasic {
		return basic.Kind() == types.String || basic.Kind() == types.UntypedString
	}
	// Handle type parameters (e.g., Bytes ~[]byte | ~string)
	if typeParam, isTypeParam := t.(*types.TypeParam); isTypeParam {
		constraint := typeParam.Constraint()
		if constraintIface, ok := constraint.(*types.Interface); ok {
			return c.constraintIncludesString(constraintIface)
		}
	}
	return false
}

// constraintIncludesString checks if a type constraint includes string
func (c *GoToTSCompiler) constraintIncludesString(constraint *types.Interface) bool {
	// Check if the constraint has type terms that include string
	if constraint.IsMethodSet() {
		return false // Pure method interface, no type terms
	}
	// For union constraints like []byte | string, check each term
	for i := 0; i < constraint.NumEmbeddeds(); i++ {
		embedded := constraint.EmbeddedType(i)
		// Check if embedded is a union
		if union, isUnion := embedded.(*types.Union); isUnion {
			for j := 0; j < union.Len(); j++ {
				term := union.Term(j)
				termType := term.Type()
				// Check if term is string or ~string
				if basic, isBasic := termType.Underlying().(*types.Basic); isBasic {
					if basic.Kind() == types.String {
						return true
					}
				}
			}
		}
		// Check direct embedded type
		if basic, isBasic := embedded.Underlying().(*types.Basic); isBasic {
			if basic.Kind() == types.String {
				return true
			}
		}
	}
	return false
}

// isPointerType checks if a type expression represents a pointer type
func (c *GoToTSCompiler) isPointerType(expr ast.Expr) bool {
	_, isPointer := expr.(*ast.StarExpr)
	return isPointer
}

// isProtobufType checks if a given type is a protobuf type by examining its methods
// and, when available, by verifying it implements the protobuf-go-lite Message interface.
func (c *GoToTSCompiler) isProtobufType(typ types.Type) bool {
	// Normalize to a named type if possible
	var named *types.Named
	switch t := typ.(type) {
	case *types.Named:
		named = t
	case *types.Pointer:
		if n, ok := t.Elem().(*types.Named); ok {
			named = n
		}
	}
	if named == nil {
		return false
	}

	// Prefer interface-based detection when the protobuf-go-lite package is loaded
	if iface := c.getProtobufMessageInterface(); iface != nil {
		if types.Implements(named, iface) || types.Implements(types.NewPointer(named), iface) {
			return true
		}
	}

	// Fallback: method-set detection for common protobuf-go-lite methods
	// Check both value and pointer method sets
	if c.typeHasMethods(named, "MarshalVT", "UnmarshalVT") || c.typeHasMethods(types.NewPointer(named), "MarshalVT", "UnmarshalVT") {
		return true
	}

	return false
}

// isWrapperType checks if a type should be treated as a wrapper type (type alias with basic underlying type).
// Wrapper types are rendered as TypeScript type aliases rather than classes with constructors.
// Examples: os.FileMode (uint32), MyString (string), etc.
func (c *GoToTSCompiler) isWrapperType(t types.Type) bool {
	// Check analysis cache first (for types with methods in analyzed packages)
	if c.analysis.IsNamedBasicType(t) {
		return true
	}

	// For external package types, check if it's a named type with a basic underlying type
	if namedType, ok := t.(*types.Named); ok {
		if _, ok := namedType.Underlying().(*types.Basic); ok {
			return true
		}
	}

	// Also check for type aliases with basic underlying types
	if aliasType, ok := t.(*types.Alias); ok {
		if _, ok := aliasType.Underlying().(*types.Basic); ok {
			return true
		}
	}

	return false
}

// isStructValueType checks if a type is a named struct type
func (c *GoToTSCompiler) isStructValueType(fieldType types.Type) bool {
	if named, ok := fieldType.(*types.Named); ok {
		if _, isStruct := named.Underlying().(*types.Struct); isStruct {
			return true
		}
	}
	return false
}

// isImportedBasicType checks if a type is an imported named type with a basic underlying type
func (c *GoToTSCompiler) isImportedBasicType(fieldType types.Type) bool {
	// Handle named types
	if named, isNamed := fieldType.(*types.Named); isNamed {
		obj := named.Obj()
		if obj == nil || obj.Pkg() == nil || obj.Pkg() == c.pkg.Types {
			return false // Not imported or is local
		}

		underlying := named.Underlying()
		if underlying == nil {
			return false
		}

		_, isBasic := underlying.(*types.Basic)
		return isBasic
	}

	// Handle type aliases (like os.FileMode = fs.FileMode)
	if alias, isAlias := fieldType.(*types.Alias); isAlias {
		obj := alias.Obj()
		if obj == nil || obj.Pkg() == nil || obj.Pkg() == c.pkg.Types {
			return false // Not imported or is local
		}

		underlying := alias.Underlying()
		if underlying == nil {
			return false
		}

		_, isBasic := underlying.(*types.Basic)
		return isBasic
	}

	return false
}

// isMapType checks if a type is a map type (including type parameters constrained to maps)
func (c *GoToTSCompiler) isMapType(iterType, underlying types.Type) bool {
	if _, ok := underlying.(*types.Map); ok {
		return true
	}
	if typeParam, isTypeParam := iterType.(*types.TypeParam); isTypeParam {
		constraint := typeParam.Constraint()
		if constraint != nil {
			constraintUnderlying := constraint.Underlying()
			if iface, isInterface := constraintUnderlying.(*types.Interface); isInterface {
				return hasMapConstraint(iface)
			}
		}
	}
	return false
}

// isArrayOrSlice checks if a type is an array or slice type
func (c *GoToTSCompiler) isArrayOrSlice(underlying types.Type) bool {
	_, isSlice := underlying.(*types.Slice)
	_, isArray := underlying.(*types.Array)
	return isArray || isSlice
}
