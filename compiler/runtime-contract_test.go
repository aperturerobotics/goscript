package compiler

import "testing"

func TestRuntimeContractOwnsBuiltinImportAndHelpers(t *testing.T) {
	owner := NewRuntimeContractOwner()

	runtimeImport := owner.BuiltinImport()
	if runtimeImport.Alias != "$" || runtimeImport.Source != "@goscript/builtin/index.js" {
		t.Fatalf("unexpected builtin import: %#v", runtimeImport)
	}

	wantHelpers := map[RuntimeHelper]RuntimeHelperCategory{
		RuntimeHelperPrintln:               RuntimeHelperCategoryBuiltin,
		RuntimeHelperPrint:                 RuntimeHelperCategoryBuiltin,
		RuntimeHelperInt:                   RuntimeHelperCategoryBuiltin,
		RuntimeHelperByte:                  RuntimeHelperCategoryBuiltin,
		RuntimeHelperVarRef:                RuntimeHelperCategoryVarRef,
		RuntimeHelperUnref:                 RuntimeHelperCategoryVarRef,
		RuntimeHelperUnsupportedPointerRef: RuntimeHelperCategoryVarRef,
		RuntimeHelperAssignStruct:          RuntimeHelperCategoryValue,
		RuntimeHelperMarkAsStructValue:     RuntimeHelperCategoryValue,
		RuntimeHelperPointerValue:          RuntimeHelperCategoryValue,
		RuntimeHelperMakeSlice:             RuntimeHelperCategorySlice,
		RuntimeHelperAppend:                RuntimeHelperCategorySlice,
		RuntimeHelperMakeMap:               RuntimeHelperCategoryMap,
		RuntimeHelperMapGet:                RuntimeHelperCategoryMap,
		RuntimeHelperNewError:              RuntimeHelperCategoryError,
		RuntimeHelperRegisterStructType:    RuntimeHelperCategoryType,
		RuntimeHelperTypeAssert:            RuntimeHelperCategoryType,
		RuntimeHelperTypedNil:              RuntimeHelperCategoryType,
		RuntimeHelperInterfaceValue:        RuntimeHelperCategoryType,
		RuntimeHelperFunctionValue:         RuntimeHelperCategoryType,
		RuntimeHelperNamedFunction:         RuntimeHelperCategoryType,
		RuntimeHelperGenericZero:           RuntimeHelperCategoryType,
		RuntimeHelperCallGenericMethod:     RuntimeHelperCategoryType,
		RuntimeHelperMakeChannel:           RuntimeHelperCategoryChannel,
		RuntimeHelperSelectStatement:       RuntimeHelperCategoryChannel,
		RuntimeHelperDisposableStack:       RuntimeHelperCategoryDefer,
		RuntimeHelperAsyncDisposableStack:  RuntimeHelperCategoryDefer,
		RuntimeHelperGetHostRuntime:        RuntimeHelperCategoryHost,
		RuntimeHelperWriteHostStdoutText:   RuntimeHelperCategoryHost,
		RuntimeHelperWriteHostStderrText:   RuntimeHelperCategoryHost,
		RuntimeHelperIsMainScript:          RuntimeHelperCategoryHost,
	}
	for helper, category := range wantHelpers {
		contract, ok := owner.Helper(helper)
		if !ok {
			t.Fatalf("missing runtime helper %q", helper)
		}
		if contract.Category != category {
			t.Fatalf("helper %q category = %q, want %q", helper, contract.Category, category)
		}
		if contract.Export == "" {
			t.Fatalf("helper %q has empty export name", helper)
		}
	}
}

func TestRuntimeContractCoversPhaseFiveCategories(t *testing.T) {
	owner := NewRuntimeContractOwner()
	for _, category := range []RuntimeHelperCategory{
		RuntimeHelperCategoryBuiltin,
		RuntimeHelperCategoryValue,
		RuntimeHelperCategoryVarRef,
		RuntimeHelperCategorySlice,
		RuntimeHelperCategoryMap,
		RuntimeHelperCategoryError,
		RuntimeHelperCategoryType,
		RuntimeHelperCategoryChannel,
		RuntimeHelperCategoryDefer,
		RuntimeHelperCategoryHost,
	} {
		if len(owner.HelpersByCategory(category)) == 0 {
			t.Fatalf("runtime helper category %q has no helpers", category)
		}
	}
}

func TestCompileServiceSharesRuntimeContractOwner(t *testing.T) {
	service := NewCompileService()
	if service.LoweringOwner().runtimeOwner != service.RuntimeContractOwner() {
		t.Fatalf("lowering owner does not share the compile service runtime contract")
	}
	if service.TypeScriptEmitOwner().runtimeOwner != service.RuntimeContractOwner() {
		t.Fatalf("emitter owner does not share the compile service runtime contract")
	}
	if got := service.RuntimeContractOwner().QualifiedHelper(RuntimeHelperPrintln); got != "$.println" {
		t.Fatalf("qualified println helper = %q, want $.println", got)
	}
}
