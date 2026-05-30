// Generated file based on package_import_runtime_policy.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as context from "@goscript/context/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as pprof from "@goscript/runtime/pprof/index.js"

import * as trace from "@goscript/runtime/trace/index.js"

import type * as io from "@goscript/io/index.js"
import "@goscript/bytes/index.js"
import "@goscript/context/index.js"
import "@goscript/runtime/index.js"
import "@goscript/runtime/pprof/index.js"
import "@goscript/runtime/trace/index.js"

export async function main(): globalThis.Promise<void> {
	$.println("runtime trace:", runtime.StartTrace() != null)

	let profile: $.VarRef<bytes.Buffer> = $.varRef($.markAsStructValue(new bytes.Buffer()))
	$.println("pprof:", pprof.StartCPUProfile($.pointerValueOrNil($.interfaceValue<io.Writer | null>(profile, "*bytes.Buffer"))!) != null, pprof.Profile.prototype.WriteTo.call($.pointerValue<pprof.Profile>(pprof.Lookup("heap")), $.pointerValueOrNil($.interfaceValue<io.Writer | null>(profile, "*bytes.Buffer"))!, 0) != null)

	let traceBuf: $.VarRef<bytes.Buffer> = $.varRef($.markAsStructValue(new bytes.Buffer()))
	let __goscriptTuple0: any = trace.NewTask($.pointerValueOrNil(context.Background())!, "task")
	let ctx = __goscriptTuple0[0]
	let task: trace.Task | $.VarRef<trace.Task> | null = __goscriptTuple0[1]
	trace.Task.prototype.End.call($.pointerValue<trace.Task>(task))
	$.println("trace:", trace.Start($.pointerValueOrNil($.interfaceValue<io.Writer | null>(traceBuf, "*bytes.Buffer"))!) != null, trace.IsEnabled())
	trace.Log($.pointerValueOrNil(ctx)!, "category", "message")
	trace.Stop()
}

if ($.isMainScript(import.meta)) {
	await main()
}
