package compiler

import (
	"fmt"
	"go/ast"
	"go/constant"
	"go/token"
	"go/types"
	"slices"
)

// WriteCompositeLit translates a Go composite literal (ast.CompositeLit) into its
// TypeScript equivalent.
//
// It handles several types of composite literals:
//   - Map literals (e.g., `map[K]V{k1: v1}`): Translated to `new Map([[k1_ts, v1_ts]])`.
//     Values are processed by `WriteVarRefedValue`.
//   - Array/Slice literals (e.g., `[]T{e1, e2}`, `[N]T{idx: val}`):
//   - For `[]byte{...}`, translated to `new Uint8Array([...])`.
//   - For other `[]T` or `[N]T`, translated using the `$.arrayToSlice<T_ts>([...])` runtime helper.
//     It handles both keyed and unkeyed elements, infers length if necessary,
//     and uses zero values for uninitialized array elements.
//     Multi-dimensional arrays/slices pass a depth parameter to `$.arrayToSlice`.
//     Element values are processed by `WriteVarRefedValue`.
//   - Struct literals:
//   - Named structs (e.g., `MyStruct{F: v}` or `&MyStruct{F: v}`): Translated to
//     `new MyStruct_ts({ F: v_ts, ... })`. The constructor typically uses an `_init` method.
//   - Anonymous structs (e.g., `struct{F int}{F: v}`): Translated to TypeScript
//     object literals `{ F: v_ts, ... }`.
//     It processes keyed elements (`FieldName: Value`) and unkeyed elements (for anonymous
//     structs or arrays). Field values are processed by `WriteVarRefedValue`.
//     Embedded struct fields are initialized, and explicit initializers for embedded
//     structs (e.g. `Outer{InnerField: InnerType{...}}`) are handled.
//     The function uses `c.analysis` to determine correct value access (e.g., `.value` for var-refed fields).
func (c *GoToTSCompiler) WriteCompositeLit(exp *ast.CompositeLit) error {
	// Get the type of the composite literal
	litType := c.pkg.TypesInfo.TypeOf(exp)

	if exp.Type != nil {
		// Handle map literals: map[K]V{k1: v1, k2: v2}
		// Also handle type alias for map: type OpNames map[K]V; OpNames{k1: v1}
		isMapType := false
		if _, astMapType := exp.Type.(*ast.MapType); astMapType {
			isMapType = true
		} else if litType != nil {
			_, isMapType = litType.Underlying().(*types.Map)
		}
		if isMapType {
			c.tsw.WriteLiterally("new Map([")

			// Add each key-value pair as an entry
			for i, elm := range exp.Elts {
				if i > 0 {
					c.tsw.WriteLiterally(", ")
				}

				if kv, ok := elm.(*ast.KeyValueExpr); ok {
					c.tsw.WriteLiterally("[")
					if err := c.WriteVarRefedValue(kv.Key); err != nil {
						return fmt.Errorf("failed to write map literal key: %w", err)
					}
					c.tsw.WriteLiterally(", ")
					if err := c.WriteVarRefedValue(kv.Value); err != nil {
						return fmt.Errorf("failed to write map literal value: %w", err)
					}
					c.tsw.WriteLiterally("]")
				} else {
					return fmt.Errorf("map literal elements must be key-value pairs")
				}
			}

			c.tsw.WriteLiterally("])")
			return nil
		}

		// Handle array literals
		if arrType, isArrayType := exp.Type.(*ast.ArrayType); isArrayType {
			// Check if this is a slice of slices (multi-dimensional array)
			isMultiDimensional := false
			if _, ok := arrType.Elt.(*ast.ArrayType); ok {
				// It's a slice of slices (multi-dimensional array)
				isMultiDimensional = true
				// We'll handle this with depth parameter to arrayToSlice
			}

			// Check if it's a []byte literal
			isByteSliceLiteral := false
			if typInfo := c.pkg.TypesInfo.TypeOf(exp.Type); typInfo != nil {
				isByteSliceLiteral = c.isByteSliceType(typInfo)
			}

			if isByteSliceLiteral {
				c.tsw.WriteLiterally("new Uint8Array")
			} else {
				c.tsw.WriteLiterally("$.arrayToSlice")

				// write the type annotation
				c.tsw.WriteLiterally("<")
				// Write the element type using the existing function
				c.WriteTypeExpr(arrType.Elt)
				c.tsw.WriteLiterally(">")
			}

			// opening
			c.tsw.WriteLiterally("([")

			// Use type info to get array length and element type
			var arrayLen int
			var elemType ast.Expr
			var goElemType interface{}
			if typ := c.pkg.TypesInfo.TypeOf(exp.Type); typ != nil {
				if at, ok := typ.Underlying().(*types.Array); ok {
					arrayLen = int(at.Len())
					goElemType = at.Elem()
				} else if st, ok := typ.Underlying().(*types.Slice); ok {
					// For slices, get the element type
					goElemType = st.Elem()
				}
			}
			if arrType.Len != nil {
				// Try to evaluate the length from the AST if not available from type info
				if bl, ok := arrType.Len.(*ast.BasicLit); ok && bl.Kind == token.INT {
					if _, err := fmt.Sscan(bl.Value, &arrayLen); err != nil {
						return fmt.Errorf("failed to parse array length from basic literal: %w", err)
					}
				} else {
					// Try to evaluate as a constant expression (e.g., const N = 5; [N]int{})
					if lenValue := c.evaluateConstantExpr(arrType.Len); lenValue != nil {
						if length, ok := lenValue.(int); ok {
							arrayLen = length
						}
					}
				}
			}
			elemType = arrType.Elt

			// Map of index -> value
			elements := make(map[int]ast.Expr)
			orderedCount := 0
			maxIndex := -1
			hasKeyedElements := false

			for _, elm := range exp.Elts {
				if kv, ok := elm.(*ast.KeyValueExpr); ok {
					// Try to evaluate the key expression as a constant (handles both literals and expressions)
					if keyValue := c.evaluateConstantExpr(kv.Key); keyValue != nil {
						if index, ok := keyValue.(int); ok {
							elements[index] = kv.Value
							if index > maxIndex {
								maxIndex = index
							}
							hasKeyedElements = true
						} else {
							return fmt.Errorf("keyed array literal key must evaluate to an integer, got %T", keyValue)
						}
					} else {
						return fmt.Errorf("keyed array literal key must be a constant expression")
					}
				} else {
					// For unkeyed elements, place them at the next available index
					// If we have keyed elements, start after the highest keyed index
					currentIndex := orderedCount
					if hasKeyedElements && orderedCount <= maxIndex {
						currentIndex = maxIndex + 1
						for elements[currentIndex] != nil {
							currentIndex++
						}
					}
					elements[currentIndex] = elm
					if currentIndex > maxIndex {
						maxIndex = currentIndex
					}
					orderedCount = currentIndex + 1
				}
			}

			// Determine array length
			if arrayLen == 0 {
				// If length is not set, infer from max index or number of elements
				if hasKeyedElements {
					arrayLen = maxIndex + 1
				} else {
					arrayLen = len(exp.Elts)
				}
			}

			for i := 0; i < arrayLen; i++ {
				if i > 0 {
					c.tsw.WriteLiterally(", ")
				}
				if elm, ok := elements[i]; ok && elm != nil {
					if err := c.WriteVarRefedValue(elm); err != nil {
						return fmt.Errorf("failed to write array literal element: %w", err)
					}
				} else {
					// Write zero value for element type
					if goElemType != nil {
						c.WriteZeroValueForType(goElemType)
					} else {
						c.WriteZeroValueForType(elemType)
					}
				}
			}
			c.tsw.WriteLiterally("]")

			// If it's a multi-dimensional array/slice, use depth=2 to convert nested arrays
			if isMultiDimensional && !isByteSliceLiteral { // Depth parameter not applicable to Uint8Array constructor
				c.tsw.WriteLiterally(", 2") // Depth of 2 for one level of nesting
			}

			c.tsw.WriteLiterally(")")
			return nil
		} else {
			// Check if this is a struct type
			var structType *types.Struct
			isStructLiteral := false
			isAnonymousStruct := false
			needsValueMarkerClose := false // Track if we need to close $.markAsStructValue()

			if namedType, ok := litType.(*types.Named); ok {
				if underlyingStruct, ok := namedType.Underlying().(*types.Struct); ok {
					structType = underlyingStruct
					isStructLiteral = true

					// Check if this is a protobuf type
					if handled, err := c.writeProtobufCompositeLit(exp, litType); handled {
						if err != nil {
							return err
						}
					} else {
						// Named struct value, use constructor
						if !c.insideAddressOf {
							// Only mark as struct value if not inside address-of operator
							c.tsw.WriteLiterally("$.markAsStructValue(new ")
							needsValueMarkerClose = true
						} else {
							c.tsw.WriteLiterally("new ")
						}
						c.WriteTypeExpr(exp.Type)
					}
				}
			} else if aliasType, ok := litType.(*types.Alias); ok {
				// Handle type aliases (like os.PathError)
				if underlyingStruct, ok := aliasType.Underlying().(*types.Struct); ok {
					structType = underlyingStruct
					isStructLiteral = true

					// Check if this is a protobuf type
					if handled, err := c.writeProtobufCompositeLit(exp, litType); handled {
						if err != nil {
							return err
						}
					} else {
						// Type alias for struct value, use constructor
						if !c.insideAddressOf {
							// Only mark as struct value if not inside address-of operator
							c.tsw.WriteLiterally("$.markAsStructValue(new ")
							needsValueMarkerClose = true
						} else {
							c.tsw.WriteLiterally("new ")
						}
						c.WriteTypeExpr(exp.Type)
					}
				}
			} else if ptrType, ok := litType.(*types.Pointer); ok {
				if namedElem, ok := ptrType.Elem().(*types.Named); ok {
					if underlyingStruct, ok := namedElem.Underlying().(*types.Struct); ok {
						structType = underlyingStruct
						isStructLiteral = true // Treat pointer-to-struct literal similarly

						// Check if this is a protobuf type
						if handled, err := c.writeProtobufCompositeLit(exp, litType); handled {
							if err != nil {
								return err
							}
						} else {
							// Named struct pointer, use constructor
							c.tsw.WriteLiterally("new ")
							c.WriteTypeExpr(exp.Type)
						}
					}
				}
			} else if underlyingStruct, ok := litType.Underlying().(*types.Struct); ok {
				// Anonymous struct literal
				structType = underlyingStruct
				isStructLiteral = true
				isAnonymousStruct = true
				// For anonymous structs, don't use constructor, just create object literal
			}

			if isStructLiteral && structType != nil {
				// --- Struct Literal Handling (Nested) ---
				// Categorize fields into direct, embedded, and explicit embedded
				directFields, embeddedFields, explicitEmbedded, err := c.categorizeStructFields(
					exp, structType, litType, isAnonymousStruct,
				)
				if err != nil {
					return err
				}

				// Write the object literal
				if isAnonymousStruct {
					// For anonymous structs, just write a simple object literal
					c.tsw.WriteLiterally("{")
				} else {
					// For named structs, write the constructor argument
					c.tsw.WriteLiterally("({")
				}

				// Write all fields
				if err := c.writeStructLiteralFields(directFields, embeddedFields, explicitEmbedded, litType); err != nil {
					return err
				}

				// Close the object literal
				if isAnonymousStruct {
					c.tsw.WriteLiterally("}")
				} else {
					c.tsw.WriteLiterally("})")
					// Close markAsStructValue wrapper if we opened one
					if needsValueMarkerClose {
						c.tsw.WriteLiterally(")")
					}
				}

			} else {
				// Non-struct type or anonymous struct, handle normally (or potentially error for anonymous struct literals?)
				c.tsw.WriteLiterally("({") // Assuming object literal for constructor
				for i, elm := range exp.Elts {
					if i != 0 {
						c.tsw.WriteLiterally(", ")
					}
					if err := c.WriteVarRefedValue(elm); err != nil {
						return fmt.Errorf("failed to write literal field: %w", err)
					}
				}
				c.tsw.WriteLiterally("})")
			}
			return nil
		}
	}

	// Untyped composite literal. Let's use type information to determine what it is.
	// First try to get the type information for the expression
	if tv, ok := c.pkg.TypesInfo.Types[exp]; ok && tv.Type != nil {
		underlying := tv.Type.Underlying()
		switch underlying.(type) {
		case *types.Map, *types.Struct:
			// Handle struct directly with the struct literal logic
			if structType, ok := underlying.(*types.Struct); ok {
				return c.writeUntypedStructLiteral(exp, tv.Type, structType)
			}
			// Map case would be handled here
			return fmt.Errorf("untyped map composite literals not yet supported")
		case *types.Array, *types.Slice:
			// Handle array/slice
			return c.writeUntypedArrayLiteral(exp)
		case *types.Pointer:
			// Handle pointer to composite literal
			ptrType := underlying.(*types.Pointer)
			switch elemType := ptrType.Elem().Underlying().(type) {
			case *types.Struct:
				// This is an anonymous struct literal with inferred pointer type
				// Just create the struct object directly - no var-refing needed
				// Anonymous literals are not variables, so they don't get var-refed
				return c.writeUntypedStructLiteral(exp, ptrType.Elem(), elemType)
			default:
				return fmt.Errorf("unhandled pointer composite literal element type: %T", elemType)
			}
		default:
			return fmt.Errorf("unhandled composite literal type: %T", underlying)
		}
	} else {
		return fmt.Errorf("could not determine composite literal type from type information")
	}
}

// writeUntypedArrayLiteral handles untyped composite literals that are arrays/slices
func (c *GoToTSCompiler) writeUntypedArrayLiteral(exp *ast.CompositeLit) error {
	c.tsw.WriteLiterally("[ ")
	for i, elm := range exp.Elts {
		if i != 0 {
			c.tsw.WriteLiterally(", ")
		}
		if err := c.WriteVarRefedValue(elm); err != nil {
			return fmt.Errorf("failed to write untyped array literal element: %w", err)
		}
	}
	c.tsw.WriteLiterally(" ]")
	return nil
}

// writeUntypedStructLiteral handles untyped composite literals that are structs or pointers to structs
func (c *GoToTSCompiler) writeUntypedStructLiteral(exp *ast.CompositeLit, actualType types.Type, structType *types.Struct) error {
	// Create field mapping like the typed struct case
	directFields := make(map[string]ast.Expr)

	// Handle elements that are key-value pairs
	for _, elt := range exp.Elts {
		if kv, ok := elt.(*ast.KeyValueExpr); ok {
			if keyIdent, ok := kv.Key.(*ast.Ident); ok {
				directFields[keyIdent.Name] = kv.Value
			}
		}
	}

	// Handle elements that are positional (no key specified)
	if len(directFields) == 0 {
		// If no key-value pairs, try to match positional values to struct fields
		for i, elt := range exp.Elts {
			if _, isKV := elt.(*ast.KeyValueExpr); !isKV && i < structType.NumFields() {
				field := structType.Field(i)
				directFields[field.Name()] = elt
			}
		}
	}

	// Check if this is a named type
	isNamed := false
	if _, ok := actualType.(*types.Named); ok {
		isNamed = true
	}

	// Write the object literal
	if isNamed {
		// For named structs, use constructor
		c.tsw.WriteLiterally("$.markAsStructValue(new ")
		// Write the type name
		c.WriteGoType(actualType, GoTypeContextGeneral)
		c.tsw.WriteLiterally("({")
	} else {
		// For truly anonymous structs, just write a simple object literal
		c.tsw.WriteLiterally("{")
	}

	firstFieldWritten := false
	// Write fields in order
	directKeys := make([]string, 0, len(directFields))
	for k := range directFields {
		directKeys = append(directKeys, k)
	}
	slices.Sort(directKeys)
	for _, keyName := range directKeys {
		if firstFieldWritten {
			c.tsw.WriteLiterally(", ")
		}

		// Convert field name for protobuf types
		fieldName := c.convertProtobufFieldNameInLiteral(keyName, structType.Underlying())

		c.tsw.WriteLiterally(fieldName)
		c.tsw.WriteLiterally(": ")
		if err := c.WriteVarRefedValue(directFields[keyName]); err != nil {
			return err
		}
		firstFieldWritten = true
	}

	// Close the object literal
	if isNamed {
		c.tsw.WriteLiterally("}))")
	} else {
		c.tsw.WriteLiterally("}")
	}
	return nil
}

// WriteVarRefedValue translates a Go expression (`ast.Expr`) into its TypeScript equivalent,
// specifically for use as a value within a composite literal (e.g., struct fields,
// map keys/values, or array/slice elements). Its primary goal is to ensure that the
// actual un-refed value of the expression is used.
//
// How it works:
//   - Identifiers (`*ast.Ident`): Delegates to `c.WriteIdent(ident, true)`, forcing
//     the `accessValue` flag to `true`. This ensures that if `ident` refers to a
//     GoScript var-refed variable, the generated TypeScript accesses its underlying `.value`
//     (e.g., `myVar.value`).
//   - Selector Expressions (`*ast.SelectorExpr`, e.g., `obj.Field`): Delegates to
//     `c.WriteSelectorExpr(e)`. This function handles the necessary logic for
//     accessing fields or methods, including any required un-var-refing if the field
//     itself or the object it's accessed on is var-refed (e.g., `obj.value.field` or
//     `obj.field.value`).
//   - Star Expressions (`*ast.StarExpr`, e.g., `*ptr`): Delegates to `c.WriteStarExpr(e)`.
//     This function handles pointer dereferencing, which in GoScript's var-refing model
//     often translates to accessing the `.value` field of the pointer (e.g., `ptr.value`).
//   - Basic Literals (`*ast.BasicLit`, e.g., `123`, `"hello"`): Delegates to
//     `c.WriteBasicLit(e)` for direct translation.
//   - Other expression types: Falls back to `c.WriteValueExpr(expr)` for general
//     expression handling. This is important for complex expressions like function
//     calls or binary operations that might appear as values within a composite literal.
//
// Necessity and Distinction from `WriteValueExpr`:
// While `WriteValueExpr` is a general-purpose function for translating Go expressions
// and also un-var-refes identifiers (by calling `WriteIdent` with `accessValue: true`),
// `WriteVarRefedValue` serves a specific and crucial role when called from `WriteCompositeLit`:
//  1. Clarity of Intent: It explicitly signals that for the constituents of a composite
//     literal, the *un-var-refed value* is mandatory.
//  2. Contract for `WriteCompositeLit`: It ensures that `WriteCompositeLit` receives
//     the correct values for initialization, insulating it from potential changes in
//     the default behavior of `WriteValueExpr` regarding un-var-refing.
//  3. Prevents Recursion: `WriteValueExpr` handles `*ast.CompositeLit` nodes by
//     calling `WriteCompositeLit`. If `WriteCompositeLit` were to directly call
//     `WriteValueExpr` for its elements, it could lead to unintended recursion or
//     behavior if an element itself was another composite literal. `WriteVarRefedValue`
//     acts as a specific intermediary for the *elements*.
//
// In summary, `WriteVarRefedValue` is a specialized dispatcher used by `WriteCompositeLit`
// to guarantee that all parts of a Go composite literal are initialized with their
// proper, unrefed TypeScript values.
func (c *GoToTSCompiler) WriteVarRefedValue(expr ast.Expr) error {
	if expr == nil {
		return fmt.Errorf("nil expression passed to write var refed value")
	}

	// Handle different expression types
	switch e := expr.(type) {
	case *ast.Ident:
		c.WriteIdent(e, true)
		return nil
	case *ast.SelectorExpr:
		return c.WriteSelectorExpr(e)
	case *ast.StarExpr:
		// For star expressions, delegate to WriteStarExpr which handles dereferencing
		return c.WriteStarExpr(e)
	case *ast.BasicLit:
		c.WriteBasicLit(e)
		return nil
	default:
		// For other expression types, use WriteValueExpr
		return c.WriteValueExpr(expr)
	}
}

// evaluateConstantExpr attempts to evaluate a Go expression as a compile-time constant.
// It returns the constant value if successful, or nil if the expression is not a constant.
// This is used for evaluating array literal keys that are constant expressions.
func (c *GoToTSCompiler) evaluateConstantExpr(expr ast.Expr) interface{} {
	// Use the type checker's constant evaluation
	if tv, ok := c.pkg.TypesInfo.Types[expr]; ok && tv.Value != nil {
		// The expression has a constant value
		switch tv.Value.Kind() {
		case constant.Int:
			if val, exact := constant.Int64Val(tv.Value); exact {
				return int(val)
			}
		case constant.Float:
			if val, exact := constant.Float64Val(tv.Value); exact {
				return val
			}
		case constant.String:
			return constant.StringVal(tv.Value)
		case constant.Bool:
			return constant.BoolVal(tv.Value)
		}
	}
	return nil
}

// categorizeStructFields organizes the elements of a struct composite literal into
// three categories: direct fields, embedded fields, and explicitly initialized embedded structs.
// Returns maps for direct fields, embedded fields (nested map), and explicit embedded initializations.
func (c *GoToTSCompiler) categorizeStructFields(
	exp *ast.CompositeLit,
	structType *types.Struct,
	litType types.Type,
	isAnonymousStruct bool,
) (
	directFields map[string]ast.Expr,
	embeddedFields map[string]map[string]ast.Expr,
	explicitEmbedded map[string]ast.Expr,
	err error,
) {
	directFields = make(map[string]ast.Expr)
	embeddedFields = make(map[string]map[string]ast.Expr)
	explicitEmbedded = make(map[string]ast.Expr)

	// Pre-populate embeddedFields map keys using the correct property name
	for i := 0; i < structType.NumFields(); i++ {
		field := structType.Field(i)
		if field.Anonymous() {
			fieldType := field.Type()
			if ptr, ok := fieldType.(*types.Pointer); ok {
				fieldType = ptr.Elem()
			}
			if named, ok := fieldType.(*types.Named); ok {
				// Use the type name as the property name in TS
				embeddedPropName := named.Obj().Name()
				embeddedFields[embeddedPropName] = make(map[string]ast.Expr)
			}
		}
	}

	// Group literal elements by direct vs embedded fields
	for _, elt := range exp.Elts {
		kv, ok := elt.(*ast.KeyValueExpr)
		if !ok {
			continue
		} // Skip non-key-value
		keyIdent, ok := kv.Key.(*ast.Ident)
		if !ok {
			continue
		} // Skip non-ident keys
		keyName := keyIdent.Name

		// Check if this is an explicit embedded struct initialization
		// e.g., Person: Person{...} or Person: personVar
		if _, isEmbedded := embeddedFields[keyName]; isEmbedded {
			// This is an explicit initialization of an embedded struct
			explicitEmbedded[keyName] = kv.Value
			continue
		}

		isDirectField := false
		for i := range structType.NumFields() {
			field := structType.Field(i)
			if field.Name() == keyName {
				isDirectField = true
				directFields[keyName] = kv.Value
				break
			}
		}

		// For anonymous structs, all fields are direct fields
		if isAnonymousStruct {
			directFields[keyName] = kv.Value
			isDirectField = true
		}

		// If not a direct field, return an error
		if !isDirectField {
			return nil, nil, nil, fmt.Errorf("field %s not found in type %s for composite literal",
				keyName, litType.String())
		}
	}

	// Handle the case where a struct has values without keys (positional initialization)
	// This block processes non-key-value elements and associates them with struct fields.
	// This applies to both named and anonymous structs.
	if len(exp.Elts) > 0 && len(directFields) == 0 {
		// Check if any elements in the composite literal are not key-value pairs.
		hasNonKeyValueElts := false
		for _, elt := range exp.Elts {
			// If an element is not a key-value pair, set the flag to true.
			if _, isKV := elt.(*ast.KeyValueExpr); !isKV {
				hasNonKeyValueElts = true
				break
			}
		}

		if hasNonKeyValueElts {
			// Get the fields from the struct type
			for i := 0; i < structType.NumFields(); i++ {
				field := structType.Field(i)
				// If we have a value for this field position
				if i < len(exp.Elts) {
					// Check if it's not a key-value pair
					if _, isKV := exp.Elts[i].(*ast.KeyValueExpr); !isKV {
						directFields[field.Name()] = exp.Elts[i]
					}
				}
			}
		}
	}

	return directFields, embeddedFields, explicitEmbedded, nil
}

// writeStructLiteralFields writes the field initializations for a struct composite literal.
// It handles direct fields, explicitly initialized embedded structs, and implicitly initialized
// embedded fields, writing them in sorted order.
func (c *GoToTSCompiler) writeStructLiteralFields(
	directFields map[string]ast.Expr,
	embeddedFields map[string]map[string]ast.Expr,
	explicitEmbedded map[string]ast.Expr,
	litType types.Type,
) error {
	firstFieldWritten := false

	// Write direct fields that aren't embedded struct names
	directKeys := make([]string, 0, len(directFields))
	for k := range directFields {
		// Skip embedded struct names - we'll handle those separately
		if _, isEmbedded := embeddedFields[k]; !isEmbedded {
			directKeys = append(directKeys, k)
		}
	}
	slices.Sort(directKeys)
	for _, keyName := range directKeys {
		if firstFieldWritten {
			c.tsw.WriteLiterally(", ")
		}

		// Convert field name for protobuf types
		fieldName := c.convertProtobufFieldNameInLiteral(keyName, litType)

		c.tsw.WriteLiterally(fieldName)
		c.tsw.WriteLiterally(": ")
		if err := c.WriteVarRefedValue(directFields[keyName]); err != nil {
			return err
		}
		firstFieldWritten = true
	}

	// Write explicitly initialized embedded structs
	explicitKeys := make([]string, 0, len(explicitEmbedded))
	for k := range explicitEmbedded {
		explicitKeys = append(explicitKeys, k)
	}
	slices.Sort(explicitKeys)
	for _, embeddedName := range explicitKeys {
		if firstFieldWritten {
			c.tsw.WriteLiterally(", ")
		}
		c.tsw.WriteLiterally(embeddedName)
		c.tsw.WriteLiterally(": ")

		// Check if the embedded value is a composite literal for a struct
		// If so, extract the fields and write them directly
		if compLit, ok := explicitEmbedded[embeddedName].(*ast.CompositeLit); ok {
			// Write initialization fields directly without the 'new Constructor'
			c.tsw.WriteLiterally("{")
			for i, elem := range compLit.Elts {
				if i > 0 {
					c.tsw.WriteLiterally(", ")
				}
				if err := c.WriteVarRefedValue(elem); err != nil {
					return err
				}
			}
			c.tsw.WriteLiterally("}")
		} else {
			// Not a composite literal, write it normally
			if err := c.WriteVarRefedValue(explicitEmbedded[embeddedName]); err != nil {
				return err
			}
		}
		firstFieldWritten = true
	}

	// Write embedded fields for structs that weren't explicitly initialized
	embeddedKeys := make([]string, 0, len(embeddedFields))
	for k := range embeddedFields {
		// Skip embedded structs that were explicitly initialized
		if _, wasExplicit := explicitEmbedded[k]; !wasExplicit {
			embeddedKeys = append(embeddedKeys, k)
		}
	}
	slices.Sort(embeddedKeys)
	for _, embeddedPropName := range embeddedKeys {
		fieldsMap := embeddedFields[embeddedPropName]
		if len(fieldsMap) == 0 {
			continue
		} // Skip empty embedded initializers

		if firstFieldWritten {
			c.tsw.WriteLiterally(", ")
		}
		c.tsw.WriteLiterally(embeddedPropName) // Use the Type name as the property key
		c.tsw.WriteLiterally(": {")

		innerKeys := make([]string, 0, len(fieldsMap))
		for k := range fieldsMap {
			innerKeys = append(innerKeys, k)
		}
		slices.Sort(innerKeys)
		for i, keyName := range innerKeys {
			if i > 0 {
				c.tsw.WriteLiterally(", ")
			}
			c.tsw.WriteLiterally(keyName) // Field name within the embedded struct
			c.tsw.WriteLiterally(": ")
			if err := c.WriteVarRefedValue(fieldsMap[keyName]); err != nil {
				return err
			}
		}
		c.tsw.WriteLiterally("}")
		firstFieldWritten = true
	}

	return nil
}
