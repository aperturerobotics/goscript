package compiler

import "go/types"

// ConstraintInfo holds information about types found in an interface constraint
type ConstraintInfo struct {
	HasMap        bool
	HasSlice      bool
	HasString     bool
	HasByteSlice  bool
	MapValueType  types.Type
	SliceElemType types.Type
}

// analyzeConstraint analyzes an interface constraint and returns information about the types it contains
func analyzeConstraint(iface *types.Interface) ConstraintInfo {
	info := ConstraintInfo{}

	for i := 0; i < iface.NumEmbeddeds(); i++ {
		embedded := iface.EmbeddedType(i)
		if union, ok := embedded.(*types.Union); ok {
			for j := 0; j < union.Len(); j++ {
				term := union.Term(j)
				checkType(term.Type(), &info)
			}
		} else {
			checkType(embedded, &info)
		}
	}

	return info
}

func checkType(t types.Type, info *ConstraintInfo) {
	underlying := t.Underlying()

	if mapType, isMap := underlying.(*types.Map); isMap {
		info.HasMap = true
		if info.MapValueType == nil {
			info.MapValueType = mapType.Elem()
		}
		return
	}

	if sliceType, isSlice := underlying.(*types.Slice); isSlice {
		info.HasSlice = true
		if info.SliceElemType == nil {
			info.SliceElemType = sliceType.Elem()
		}

		if elemType, isBasic := sliceType.Elem().(*types.Basic); isBasic && elemType.Kind() == types.Uint8 {
			info.HasByteSlice = true
		}
		return
	}

	if basicType, isBasic := underlying.(*types.Basic); isBasic {
		if (basicType.Info() & types.IsString) != 0 {
			info.HasString = true
		}
	}
}

// hasMapConstraint checks if an interface constraint includes map types
func hasMapConstraint(iface *types.Interface) bool {
	return analyzeConstraint(iface).HasMap
}

// hasSliceConstraint checks if an interface constraint includes slice types
func hasSliceConstraint(iface *types.Interface) bool {
	return analyzeConstraint(iface).HasSlice
}

// hasMixedStringByteConstraint checks if an interface constraint includes both string and []byte types
func hasMixedStringByteConstraint(iface *types.Interface) bool {
	info := analyzeConstraint(iface)
	return info.HasString && info.HasByteSlice
}

// getMapValueTypeFromConstraint extracts the value type from a map constraint
func getMapValueTypeFromConstraint(iface *types.Interface) types.Type {
	return analyzeConstraint(iface).MapValueType
}

// getSliceElementTypeFromConstraint extracts the element type from a slice constraint
func getSliceElementTypeFromConstraint(iface *types.Interface) types.Type {
	return analyzeConstraint(iface).SliceElemType
}
