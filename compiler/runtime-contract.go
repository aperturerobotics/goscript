package compiler

import (
	"cmp"
	"slices"
	"strings"

	gs "github.com/aperturerobotics/goscript"
	"github.com/pkg/errors"
)

// RuntimeHelperCategory names a runtime helper family owned by the contract.
type RuntimeHelperCategory string

const (
	RuntimeHelperCategoryBuiltin RuntimeHelperCategory = "builtin"
	RuntimeHelperCategoryValue   RuntimeHelperCategory = "value"
	RuntimeHelperCategoryVarRef  RuntimeHelperCategory = "varref"
	RuntimeHelperCategorySlice   RuntimeHelperCategory = "slice"
	RuntimeHelperCategoryMap     RuntimeHelperCategory = "map"
	RuntimeHelperCategoryError   RuntimeHelperCategory = "error"
	RuntimeHelperCategoryType    RuntimeHelperCategory = "type"
	RuntimeHelperCategoryChannel RuntimeHelperCategory = "channel"
	RuntimeHelperCategoryDefer   RuntimeHelperCategory = "defer"
	RuntimeHelperCategoryHost    RuntimeHelperCategory = "host"
)

// RuntimeHelper identifies one compiler-visible helper exported by @goscript/builtin.
type RuntimeHelper string

const (
	RuntimeHelperPrintln RuntimeHelper = "builtin.println"
	RuntimeHelperPrint   RuntimeHelper = "builtin.print"
	RuntimeHelperInt     RuntimeHelper = "builtin.int"
	RuntimeHelperByte    RuntimeHelper = "builtin.byte"
	RuntimeHelperLen     RuntimeHelper = "builtin.len"
	RuntimeHelperCap     RuntimeHelper = "builtin.cap"
	RuntimeHelperClear   RuntimeHelper = "builtin.clear"
	RuntimeHelperPanic   RuntimeHelper = "builtin.panic"
	RuntimeHelperRecover RuntimeHelper = "builtin.recover"
	RuntimeHelperMin     RuntimeHelper = "builtin.min"
	RuntimeHelperMax     RuntimeHelper = "builtin.max"
	RuntimeHelperComplex RuntimeHelper = "builtin.complex"
	RuntimeHelperReal    RuntimeHelper = "builtin.real"
	RuntimeHelperImag    RuntimeHelper = "builtin.imag"

	RuntimeHelperAssignStruct      RuntimeHelper = "value.assignStruct"
	RuntimeHelperMarkAsStructValue RuntimeHelper = "value.markAsStructValue"
	RuntimeHelperCloneStructValue  RuntimeHelper = "value.cloneStructValue"
	RuntimeHelperPointerValue      RuntimeHelper = "value.pointerValue"
	RuntimeHelperArrayEqual        RuntimeHelper = "value.arrayEqual"

	RuntimeHelperVarRef                RuntimeHelper = "varref.varRef"
	RuntimeHelperFieldRef              RuntimeHelper = "varref.fieldRef"
	RuntimeHelperUnref                 RuntimeHelper = "varref.unref"
	RuntimeHelperIsVarRef              RuntimeHelper = "varref.isVarRef"
	RuntimeHelperUnsupportedPointerRef RuntimeHelper = "varref.unsupportedPointerRef"

	RuntimeHelperMakeSlice                    RuntimeHelper = "slice.makeSlice"
	RuntimeHelperGoSlice                      RuntimeHelper = "slice.goSlice"
	RuntimeHelperArrayToSlice                 RuntimeHelper = "slice.arrayToSlice"
	RuntimeHelperSliceToArray                 RuntimeHelper = "slice.sliceToArray"
	RuntimeHelperSliceToArrayPointer          RuntimeHelper = "slice.sliceToArrayPointer"
	RuntimeHelperAppend                       RuntimeHelper = "slice.append"
	RuntimeHelperCopy                         RuntimeHelper = "slice.copy"
	RuntimeHelperAsArray                      RuntimeHelper = "slice.asArray"
	RuntimeHelperStringToRunes                RuntimeHelper = "slice.stringToRunes"
	RuntimeHelperRangeString                  RuntimeHelper = "slice.rangeString"
	RuntimeHelperStringToRune                 RuntimeHelper = "slice.stringToRune"
	RuntimeHelperRunesToString                RuntimeHelper = "slice.runesToString"
	RuntimeHelperStringToBytes                RuntimeHelper = "slice.stringToBytes"
	RuntimeHelperBytesToString                RuntimeHelper = "slice.bytesToString"
	RuntimeHelperGenericBytesOrStringToString RuntimeHelper = "slice.genericBytesOrStringToString"
	RuntimeHelperIndexStringOrBytes           RuntimeHelper = "slice.indexStringOrBytes"
	RuntimeHelperSliceStringOrBytes           RuntimeHelper = "slice.sliceStringOrBytes"
	RuntimeHelperIndexRef                     RuntimeHelper = "slice.indexRef"
	RuntimeHelperIndexAddress                 RuntimeHelper = "slice.indexAddress"

	RuntimeHelperMakeMap        RuntimeHelper = "map.makeMap"
	RuntimeHelperMapGet         RuntimeHelper = "map.mapGet"
	RuntimeHelperMapSet         RuntimeHelper = "map.mapSet"
	RuntimeHelperMapHas         RuntimeHelper = "map.mapHas"
	RuntimeHelperDeleteMapEntry RuntimeHelper = "map.deleteMapEntry"

	RuntimeHelperNewError           RuntimeHelper = "error.newError"
	RuntimeHelperToGoError          RuntimeHelper = "error.toGoError"
	RuntimeHelperWrapPrimitiveError RuntimeHelper = "error.wrapPrimitiveError"

	RuntimeHelperTypeKind                 RuntimeHelper = "type.TypeKind"
	RuntimeHelperRegisterStructType       RuntimeHelper = "type.registerStructType"
	RuntimeHelperRegisterInterfaceType    RuntimeHelper = "type.registerInterfaceType"
	RuntimeHelperGetTypeByName            RuntimeHelper = "type.getTypeByName"
	RuntimeHelperTypeAssert               RuntimeHelper = "type.typeAssert"
	RuntimeHelperTypeAssertTuple          RuntimeHelper = "type.typeAssertTuple"
	RuntimeHelperMustTypeAssert           RuntimeHelper = "type.mustTypeAssert"
	RuntimeHelperIs                       RuntimeHelper = "type.is"
	RuntimeHelperTypeSwitch               RuntimeHelper = "type.typeSwitch"
	RuntimeHelperTypedNil                 RuntimeHelper = "type.typedNil"
	RuntimeHelperInterfaceValue           RuntimeHelper = "type.interfaceValue"
	RuntimeHelperNamedValueInterfaceValue RuntimeHelper = "type.namedValueInterfaceValue"
	RuntimeHelperFunctionValue            RuntimeHelper = "type.functionValue"
	RuntimeHelperNamedFunction            RuntimeHelper = "type.namedFunction"
	RuntimeHelperGenericZero              RuntimeHelper = "type.genericZero"
	RuntimeHelperCallGenericMethod        RuntimeHelper = "type.callGenericMethod"

	RuntimeHelperMakeChannel     RuntimeHelper = "channel.makeChannel"
	RuntimeHelperMakeChannelRef  RuntimeHelper = "channel.makeChannelRef"
	RuntimeHelperChanSend        RuntimeHelper = "channel.chanSend"
	RuntimeHelperChanRecv        RuntimeHelper = "channel.chanRecv"
	RuntimeHelperChanRecvWithOk  RuntimeHelper = "channel.chanRecvWithOk"
	RuntimeHelperSelectStatement RuntimeHelper = "channel.selectStatement"

	RuntimeHelperDisposableStack      RuntimeHelper = "defer.DisposableStack"
	RuntimeHelperAsyncDisposableStack RuntimeHelper = "defer.AsyncDisposableStack"

	RuntimeHelperGetHostRuntime      RuntimeHelper = "host.getHostRuntime"
	RuntimeHelperWriteHostStdoutText RuntimeHelper = "host.writeHostStdoutText"
	RuntimeHelperWriteHostStderrText RuntimeHelper = "host.writeHostStderrText"
	RuntimeHelperIsMainScript        RuntimeHelper = "host.isMainScript"
)

// RuntimeImport is a generated TypeScript import owned by the runtime contract.
type RuntimeImport struct {
	Alias  string
	Source string
}

// RuntimeHelperContract describes one helper exported by the runtime package.
type RuntimeHelperContract struct {
	Helper   RuntimeHelper
	Export   string
	Category RuntimeHelperCategory
}

// RuntimeContractOwner owns generated-code helper names and runtime capabilities.
type RuntimeContractOwner struct {
	helpers map[RuntimeHelper]RuntimeHelperContract
}

// NewRuntimeContractOwner creates the runtime contract owner.
func NewRuntimeContractOwner() *RuntimeContractOwner {
	owner := &RuntimeContractOwner{
		helpers: make(map[RuntimeHelper]RuntimeHelperContract),
	}
	for _, helper := range runtimeHelperContracts() {
		owner.helpers[helper.Helper] = helper
	}
	return owner
}

// BuiltinImport returns the runtime import used by generated package modules.
func (o *RuntimeContractOwner) BuiltinImport() RuntimeImport {
	return RuntimeImport{
		Alias:  "$",
		Source: "@goscript/builtin/index.js",
	}
}

// Helpers returns every compiler-visible runtime helper contract.
func (o *RuntimeContractOwner) Helpers() []RuntimeHelperContract {
	helpers := make([]RuntimeHelperContract, 0, len(o.helpers))
	for _, helper := range o.helpers {
		helpers = append(helpers, helper)
	}
	slices.SortFunc(helpers, compareRuntimeHelperContract)
	return helpers
}

// HelpersByCategory returns helper contracts in a category.
func (o *RuntimeContractOwner) HelpersByCategory(category RuntimeHelperCategory) []RuntimeHelperContract {
	var helpers []RuntimeHelperContract
	for _, helper := range o.helpers {
		if helper.Category == category {
			helpers = append(helpers, helper)
		}
	}
	slices.SortFunc(helpers, compareRuntimeHelperContract)
	return helpers
}

// Helper returns one runtime helper contract.
func (o *RuntimeContractOwner) Helper(helper RuntimeHelper) (RuntimeHelperContract, bool) {
	contract, ok := o.helpers[helper]
	return contract, ok
}

// HelperName returns the exported runtime symbol for a helper.
func (o *RuntimeContractOwner) HelperName(helper RuntimeHelper) (string, bool) {
	contract, ok := o.Helper(helper)
	if !ok {
		return "", false
	}
	return contract.Export, true
}

// QualifiedHelper returns a generated-code reference to a runtime helper.
func (o *RuntimeContractOwner) QualifiedHelper(helper RuntimeHelper) string {
	name, ok := o.HelperName(helper)
	if !ok {
		panic("missing runtime helper contract: " + string(helper))
	}
	return o.BuiltinImport().Alias + "." + name
}

// MissingRuntimeExports returns helper exports absent from the real runtime source.
func (o *RuntimeContractOwner) MissingRuntimeExports() ([]string, error) {
	exports, err := scanBuiltinRuntimeExports()
	if err != nil {
		return nil, err
	}
	var missing []string
	for _, helper := range o.Helpers() {
		if !exports[helper.Export] {
			missing = append(missing, helper.Export)
		}
	}
	slices.Sort(missing)
	return missing, nil
}

func compareRuntimeHelperContract(a RuntimeHelperContract, b RuntimeHelperContract) int {
	if c := cmp.Compare(a.Category, b.Category); c != 0 {
		return c
	}
	if c := cmp.Compare(a.Export, b.Export); c != 0 {
		return c
	}
	return cmp.Compare(a.Helper, b.Helper)
}

func runtimeHelperContracts() []RuntimeHelperContract {
	return []RuntimeHelperContract{
		runtimeHelper(RuntimeHelperPrintln, "println", RuntimeHelperCategoryBuiltin),
		runtimeHelper(RuntimeHelperPrint, "print", RuntimeHelperCategoryBuiltin),
		runtimeHelper(RuntimeHelperInt, "int", RuntimeHelperCategoryBuiltin),
		runtimeHelper(RuntimeHelperByte, "byte", RuntimeHelperCategoryBuiltin),
		runtimeHelper(RuntimeHelperLen, "len", RuntimeHelperCategoryBuiltin),
		runtimeHelper(RuntimeHelperCap, "cap", RuntimeHelperCategoryBuiltin),
		runtimeHelper(RuntimeHelperClear, "clear", RuntimeHelperCategoryBuiltin),
		runtimeHelper(RuntimeHelperPanic, "panic", RuntimeHelperCategoryBuiltin),
		runtimeHelper(RuntimeHelperRecover, "recover", RuntimeHelperCategoryBuiltin),
		runtimeHelper(RuntimeHelperMin, "min", RuntimeHelperCategoryBuiltin),
		runtimeHelper(RuntimeHelperMax, "max", RuntimeHelperCategoryBuiltin),
		runtimeHelper(RuntimeHelperComplex, "complex", RuntimeHelperCategoryBuiltin),
		runtimeHelper(RuntimeHelperReal, "real", RuntimeHelperCategoryBuiltin),
		runtimeHelper(RuntimeHelperImag, "imag", RuntimeHelperCategoryBuiltin),
		runtimeHelper(RuntimeHelperAssignStruct, "assignStruct", RuntimeHelperCategoryValue),
		runtimeHelper(RuntimeHelperMarkAsStructValue, "markAsStructValue", RuntimeHelperCategoryValue),
		runtimeHelper(RuntimeHelperCloneStructValue, "cloneStructValue", RuntimeHelperCategoryValue),
		runtimeHelper(RuntimeHelperPointerValue, "pointerValue", RuntimeHelperCategoryValue),
		runtimeHelper(RuntimeHelperArrayEqual, "arrayEqual", RuntimeHelperCategoryValue),
		runtimeHelper(RuntimeHelperVarRef, "varRef", RuntimeHelperCategoryVarRef),
		runtimeHelper(RuntimeHelperFieldRef, "fieldRef", RuntimeHelperCategoryVarRef),
		runtimeHelper(RuntimeHelperUnref, "unref", RuntimeHelperCategoryVarRef),
		runtimeHelper(RuntimeHelperIsVarRef, "isVarRef", RuntimeHelperCategoryVarRef),
		runtimeHelper(RuntimeHelperUnsupportedPointerRef, "unsupportedPointerRef", RuntimeHelperCategoryVarRef),
		runtimeHelper(RuntimeHelperMakeSlice, "makeSlice", RuntimeHelperCategorySlice),
		runtimeHelper(RuntimeHelperGoSlice, "goSlice", RuntimeHelperCategorySlice),
		runtimeHelper(RuntimeHelperArrayToSlice, "arrayToSlice", RuntimeHelperCategorySlice),
		runtimeHelper(RuntimeHelperSliceToArray, "sliceToArray", RuntimeHelperCategorySlice),
		runtimeHelper(RuntimeHelperSliceToArrayPointer, "sliceToArrayPointer", RuntimeHelperCategorySlice),
		runtimeHelper(RuntimeHelperAppend, "append", RuntimeHelperCategorySlice),
		runtimeHelper(RuntimeHelperCopy, "copy", RuntimeHelperCategorySlice),
		runtimeHelper(RuntimeHelperAsArray, "asArray", RuntimeHelperCategorySlice),
		runtimeHelper(RuntimeHelperStringToRunes, "stringToRunes", RuntimeHelperCategorySlice),
		runtimeHelper(RuntimeHelperRangeString, "rangeString", RuntimeHelperCategorySlice),
		runtimeHelper(RuntimeHelperStringToRune, "stringToRune", RuntimeHelperCategorySlice),
		runtimeHelper(RuntimeHelperRunesToString, "runesToString", RuntimeHelperCategorySlice),
		runtimeHelper(RuntimeHelperStringToBytes, "stringToBytes", RuntimeHelperCategorySlice),
		runtimeHelper(RuntimeHelperBytesToString, "bytesToString", RuntimeHelperCategorySlice),
		runtimeHelper(RuntimeHelperGenericBytesOrStringToString, "genericBytesOrStringToString", RuntimeHelperCategorySlice),
		runtimeHelper(RuntimeHelperIndexStringOrBytes, "indexStringOrBytes", RuntimeHelperCategorySlice),
		runtimeHelper(RuntimeHelperSliceStringOrBytes, "sliceStringOrBytes", RuntimeHelperCategorySlice),
		runtimeHelper(RuntimeHelperIndexRef, "indexRef", RuntimeHelperCategorySlice),
		runtimeHelper(RuntimeHelperIndexAddress, "indexAddress", RuntimeHelperCategorySlice),
		runtimeHelper(RuntimeHelperMakeMap, "makeMap", RuntimeHelperCategoryMap),
		runtimeHelper(RuntimeHelperMapGet, "mapGet", RuntimeHelperCategoryMap),
		runtimeHelper(RuntimeHelperMapSet, "mapSet", RuntimeHelperCategoryMap),
		runtimeHelper(RuntimeHelperMapHas, "mapHas", RuntimeHelperCategoryMap),
		runtimeHelper(RuntimeHelperDeleteMapEntry, "deleteMapEntry", RuntimeHelperCategoryMap),
		runtimeHelper(RuntimeHelperNewError, "newError", RuntimeHelperCategoryError),
		runtimeHelper(RuntimeHelperToGoError, "toGoError", RuntimeHelperCategoryError),
		runtimeHelper(RuntimeHelperWrapPrimitiveError, "wrapPrimitiveError", RuntimeHelperCategoryError),
		runtimeHelper(RuntimeHelperTypeKind, "TypeKind", RuntimeHelperCategoryType),
		runtimeHelper(RuntimeHelperRegisterStructType, "registerStructType", RuntimeHelperCategoryType),
		runtimeHelper(RuntimeHelperRegisterInterfaceType, "registerInterfaceType", RuntimeHelperCategoryType),
		runtimeHelper(RuntimeHelperGetTypeByName, "getTypeByName", RuntimeHelperCategoryType),
		runtimeHelper(RuntimeHelperTypeAssert, "typeAssert", RuntimeHelperCategoryType),
		runtimeHelper(RuntimeHelperTypeAssertTuple, "typeAssertTuple", RuntimeHelperCategoryType),
		runtimeHelper(RuntimeHelperMustTypeAssert, "mustTypeAssert", RuntimeHelperCategoryType),
		runtimeHelper(RuntimeHelperIs, "is", RuntimeHelperCategoryType),
		runtimeHelper(RuntimeHelperTypeSwitch, "typeSwitch", RuntimeHelperCategoryType),
		runtimeHelper(RuntimeHelperTypedNil, "typedNil", RuntimeHelperCategoryType),
		runtimeHelper(RuntimeHelperInterfaceValue, "interfaceValue", RuntimeHelperCategoryType),
		runtimeHelper(RuntimeHelperNamedValueInterfaceValue, "namedValueInterfaceValue", RuntimeHelperCategoryType),
		runtimeHelper(RuntimeHelperFunctionValue, "functionValue", RuntimeHelperCategoryType),
		runtimeHelper(RuntimeHelperNamedFunction, "namedFunction", RuntimeHelperCategoryType),
		runtimeHelper(RuntimeHelperGenericZero, "genericZero", RuntimeHelperCategoryType),
		runtimeHelper(RuntimeHelperCallGenericMethod, "callGenericMethod", RuntimeHelperCategoryType),
		runtimeHelper(RuntimeHelperMakeChannel, "makeChannel", RuntimeHelperCategoryChannel),
		runtimeHelper(RuntimeHelperMakeChannelRef, "makeChannelRef", RuntimeHelperCategoryChannel),
		runtimeHelper(RuntimeHelperChanSend, "chanSend", RuntimeHelperCategoryChannel),
		runtimeHelper(RuntimeHelperChanRecv, "chanRecv", RuntimeHelperCategoryChannel),
		runtimeHelper(RuntimeHelperChanRecvWithOk, "chanRecvWithOk", RuntimeHelperCategoryChannel),
		runtimeHelper(RuntimeHelperSelectStatement, "selectStatement", RuntimeHelperCategoryChannel),
		runtimeHelper(RuntimeHelperDisposableStack, "DisposableStack", RuntimeHelperCategoryDefer),
		runtimeHelper(RuntimeHelperAsyncDisposableStack, "AsyncDisposableStack", RuntimeHelperCategoryDefer),
		runtimeHelper(RuntimeHelperGetHostRuntime, "getHostRuntime", RuntimeHelperCategoryHost),
		runtimeHelper(RuntimeHelperWriteHostStdoutText, "writeHostStdoutText", RuntimeHelperCategoryHost),
		runtimeHelper(RuntimeHelperWriteHostStderrText, "writeHostStderrText", RuntimeHelperCategoryHost),
		runtimeHelper(RuntimeHelperIsMainScript, "isMainScript", RuntimeHelperCategoryHost),
	}
}

func runtimeHelper(
	helper RuntimeHelper,
	export string,
	category RuntimeHelperCategory,
) RuntimeHelperContract {
	return RuntimeHelperContract{
		Helper:   helper,
		Export:   export,
		Category: category,
	}
}

func scanBuiltinRuntimeExports() (map[string]bool, error) {
	index, err := gs.GsOverrides.ReadFile("gs/builtin/index.ts")
	if err != nil {
		return nil, err
	}
	exports := make(map[string]bool)
	for _, module := range builtinReexportModules(string(index)) {
		data, err := gs.GsOverrides.ReadFile("gs/builtin/" + module + ".ts")
		if err != nil {
			return nil, errors.Wrapf(err, "read builtin export module %s", module)
		}
		for _, name := range sourceExportNames(string(data)) {
			exports[name] = true
		}
	}
	return exports, nil
}

func builtinReexportModules(index string) []string {
	var modules []string
	for line := range strings.SplitSeq(index, "\n") {
		line = strings.TrimSpace(line)
		if !strings.HasPrefix(line, "export * from ") {
			continue
		}
		module := quotedModulePath(line)
		module = strings.TrimPrefix(module, "./")
		module = strings.TrimSuffix(module, ".js")
		if module != "" {
			modules = append(modules, module)
		}
	}
	slices.Sort(modules)
	return modules
}

func quotedModulePath(line string) string {
	for _, quote := range []string{"'", "\""} {
		_, remaining, ok := strings.Cut(line, quote)
		if !ok {
			continue
		}
		module, _, ok := strings.Cut(remaining, quote)
		if ok {
			return module
		}
	}
	return ""
}

func sourceExportNames(data string) []string {
	names := make(map[string]bool)
	for line := range strings.SplitSeq(data, "\n") {
		line = strings.TrimSpace(line)
		for _, prefix := range []string{
			"export async function ",
			"export function ",
			"export const ",
			"export class ",
			"export enum ",
			"export type ",
			"export interface ",
		} {
			if !strings.HasPrefix(line, prefix) {
				continue
			}
			name := exportNameAfterPrefix(line, prefix)
			if name != "" {
				names[name] = true
			}
		}
	}
	result := make([]string, 0, len(names))
	for name := range names {
		result = append(result, name)
	}
	slices.Sort(result)
	return result
}

func exportNameAfterPrefix(line, prefix string) string {
	remaining := strings.TrimSpace(strings.TrimPrefix(line, prefix))
	for idx, char := range remaining {
		if char == '_' || char == '$' ||
			(char >= 'a' && char <= 'z') ||
			(char >= 'A' && char <= 'Z') ||
			(idx > 0 && char >= '0' && char <= '9') {
			continue
		}
		return remaining[:idx]
	}
	return remaining
}
