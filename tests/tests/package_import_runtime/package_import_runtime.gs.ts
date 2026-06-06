// Generated file based on package_import_runtime.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as runtime from "@goscript/runtime/index.js"
import "@goscript/runtime/index.js"

export async function main(): globalThis.Promise<void> {
	// Test basic runtime functions
	$.println("GOOS:", runtime.GOOS)
	$.println("GOARCH:", runtime.GOARCH)
	$.println("Compiler:", runtime.Compiler)
	// println("Version:", runtime.Version()) - not stable for the test (go.mod may change)
	// println("NumCPU:", runtime.NumCPU()) - not stable for the test (number of cores may change)

	// Test GOMAXPROCS
	let procs = runtime.GOMAXPROCS(0)
	$.println("GOMAXPROCS(-1):", runtime.GOMAXPROCS(-1))
	$.println("GOMAXPROCS(0):", procs)

	// Test NumGoroutine
	$.println("NumGoroutine:", runtime.NumGoroutine())

	// Test GC (should be no-op)
	runtime.GC()
	$.println("GC called successfully")

	let pcs: $.Slice<number> = $.makeSlice<number>(0, undefined, "number")
	$.println("Callers empty:", runtime.Callers(0, pcs))
	let frames: runtime.Frames | $.VarRef<runtime.Frames> | null = runtime.CallersFrames(pcs)
	let [frame, more] = runtime.Frames.prototype.Next.call($.pointerValue<runtime.Frames>(frames))
	$.println("Frames empty:", frame.Line, more)
	$.println("FuncForPC nil:", runtime.FuncForPC($.uint(0, 64)) == null)

	let box = $.varRef({value: 1})
	let cleanup = $.markAsStructValue($.cloneStructValue(runtime.AddCleanup(box, $.functionValue((value: number): void => {
		$.println("cleanup should not run during test:", value)
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [] } as $.FunctionTypeInfo)), 1)))
	$.markAsStructValue($.cloneStructValue(cleanup)).Stop()
	runtime.KeepAlive($.interfaceValue<any>(box, "*struct{value int}"))
	$.println("Cleanup stopped")

	runtime.SetFinalizer($.interfaceValue<any>(box, "*struct{value int}"), $.interfaceValue<any>($.functionValue((_p0: $.VarRef<{"value": number}> | null): void => {
		$.println("finalizer should not run during test")
	}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: { kind: $.TypeKind.Struct, methods: [], fields: [{ name: "value", key: "value", type: { kind: $.TypeKind.Basic, name: "int" }, pkgPath: "github.com/aperturerobotics/goscript/tests/tests/package_import_runtime", index: [0], offset: 0, exported: false }] } }], results: [] } as $.FunctionTypeInfo)), "func(*struct{value int})"))
	runtime.SetFinalizer($.interfaceValue<any>(box, "*struct{value int}"), null)
	$.println("Finalizer ignored")
}

if ($.isMainScript(import.meta)) {
	await main()
}
