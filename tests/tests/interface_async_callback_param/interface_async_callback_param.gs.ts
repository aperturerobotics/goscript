// Generated file based on interface_async_callback_param.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as sync from "@goscript/sync/index.js"

export class listScanner {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): listScanner {
		const cloned = new listScanner()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public async Scan(fn: ((_p0: number) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<$.GoError> {
		return await fn!(7)
	}

	static __typeInfo = $.registerStructType(
		"main.listScanner",
		() => new listScanner(),
		[{ name: "Scan", args: [], returns: [] }],
		listScanner,
		{}
	)
}

export type scanner = null | {
	Scan(_p0: ((_p0: number) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<$.GoError>
}

$.registerInterfaceType(
	"main.scanner",
	null,
	[{ name: "Scan", args: [{ name: "_p0", type: { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: ["error"] } }], returns: [{ name: "_r0", type: "error" }] }]
)

export async function run(s: scanner | null): globalThis.Promise<$.GoError> {
	return await $.pointerValue<Exclude<scanner, null>>(s).Scan($.functionValue((v: number): $.GoError => {
		if (v != 7) {
			return errors.New("wrong value")
		}
		return null
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: ["error"] }))
}

export async function main(): globalThis.Promise<void> {
	$.println(await run($.interfaceValue<scanner | null>($.markAsStructValue(new listScanner()), "main.listScanner")) == null)

	let m: sync.Map = $.markAsStructValue(new sync.Map())
	let callbacks = [$.functionValue(async (v: number): globalThis.Promise<$.GoError> => {
		await m.Load(v)
		return null
	}, { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: ["error"] })]
	$.println(await callbacks[0]!(1) == null)
}

if ($.isMainScript(import.meta)) {
	await main()
}
