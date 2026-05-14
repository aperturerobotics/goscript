// Generated file based on util_promise.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

import * as context from "@goscript/context/index.ts"

export class Promise {
	public get result(): any {
		return this._fields.result.value
	}
	public set result(value: any) {
		this._fields.result.value = value
	}

	public get err(): error {
		return this._fields.err.value
	}
	public set err(value: error) {
		this._fields.err.value = value
	}

	public get isResolved(): boolean {
		return this._fields.isResolved.value
	}
	public set isResolved(value: boolean) {
		this._fields.isResolved.value = value
	}

	public get ch(): $.Channel<Record<string, unknown>> | null {
		return this._fields.ch.value
	}
	public set ch(value: $.Channel<Record<string, unknown>> | null) {
		this._fields.ch.value = value
	}

	public _fields: {
		result: $.VarRef<any>
		err: $.VarRef<error>
		isResolved: $.VarRef<boolean>
		ch: $.VarRef<$.Channel<Record<string, unknown>> | null>
	}

	constructor(init?: Partial<{result?: any, err?: error, isResolved?: boolean, ch?: $.Channel<Record<string, unknown>> | null}>) {
		this._fields = {
			result: $.varRef(init?.result ?? null),
			err: $.varRef(init?.err ?? null),
			isResolved: $.varRef(init?.isResolved ?? false),
			ch: $.varRef(init?.ch ?? null)
		}
	}

	public clone(): Promise {
		const cloned = new Promise()
		cloned._fields = {
			result: $.varRef(this._fields.result.value),
			err: $.varRef(this._fields.err.value),
			isResolved: $.varRef(this._fields.isResolved.value),
			ch: $.varRef(this._fields.ch.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Await(ctx: Context): Promise<void> {
		const p = this
		if ($.pointerValue(p).isResolved) {
			return [$.pointerValue(p).result, $.pointerValue(p).err]
		}
		const [__goscriptSelectHasReturn3505372, __goscriptSelectValue3505372] = await $.selectStatement([
			{
				id: 0,
				isSend: false,
				channel: $.pointerValue(p).ch,
				onSelected: async (result) => {
					return [$.pointerValue(p).result, $.pointerValue(p).err]
				}
			},
			{
				id: 1,
				isSend: false,
				channel: ctx.Done(),
				onSelected: async (result) => {
					let zero: any = $.genericZero(__typeArgs, "T", null)
					return [zero, ctx.Err()]
				}
			}
		], false)
		if (__goscriptSelectHasReturn3505372) {
			return __goscriptSelectValue3505372
		}
	}

	public SetResult(val: any, err: error): boolean {
		const p = this
		if ($.pointerValue(p).isResolved) {
			return false
		}
		$.pointerValue(p).result = val
		$.pointerValue(p).err = err
		$.pointerValue(p).isResolved = true
		if ($.pointerValue(p).ch != null) {
			$.pointerValue(p).ch.close()
		}
		return true
	}

	static __typeInfo = $.registerStructType(
		"main.Promise",
		new Promise(),
		[{ name: "Await", args: [], returns: [] }, { name: "SetResult", args: [], returns: [] }],
		Promise,
		{"result": { kind: $.TypeKind.Interface, methods: [] }, "err": "error", "isResolved": { kind: $.TypeKind.Basic, name: "bool" }, "ch": { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: {} } }}
	)
}

export function NewPromise(__typeArgs: $.GenericTypeArgs | undefined): Promise | $.VarRef<Promise> | null {
	return new Promise({ch: $.makeChannel<Record<string, unknown>>(0, null, "both")})
}

export function NewPromiseWithResult(__typeArgs: $.GenericTypeArgs | undefined, val: any, err: error): Promise | $.VarRef<Promise> | null {
	let p = new Promise({result: val, err: err, isResolved: true, ch: $.makeChannel<Record<string, unknown>>(0, null, "both")})
	if ($.pointerValue(p).ch != null) {
		$.pointerValue(p).ch.close()
	}
	return p
}

export async function main(): Promise<void> {
	let ctx = context.Background()
	$.println("Test 1: Basic Promise with string")
	let p1 = NewPromise({T: { zero: () => "" }})
	queueMicrotask(async () => { ((): void => {
	$.pointerValue(p1).SetResult("hello world", null)
})() })
	let [result1, err1] = $.pointerValue(p1).Await(ctx)
	if (err1 != null) {
		$.println("Error:", err1.Error())
	} else {
		$.println("Result:", result1)
	}
	$.println("Test 2: Pre-resolved Promise with int")
	let p2 = NewPromiseWithResult({T: { zero: () => 0 }}, 42, null)
	let [result2, err2] = $.pointerValue(p2).Await(ctx)
	if (err2 != null) {
		$.println("Error:", err2.Error())
	} else {
		$.println("Result:", result2)
	}
	$.println("Test 3: Promise with error")
	let p3 = NewPromiseWithResult({T: { zero: () => false }}, false, context.DeadlineExceeded)
	let [result3, err3] = $.pointerValue(p3).Await(ctx)
	if (err3 != null) {
		$.println("Error:", err3.Error())
	} else {
		$.println("Result:", result3)
	}
	$.println("Test 4: Cannot set result twice")
	let p4 = NewPromise({T: { zero: () => 0 }})
	let success1 = $.pointerValue(p4).SetResult(100, null)
	let success2 = $.pointerValue(p4).SetResult(200, null)
	$.println("First set success:", success1)
	$.println("Second set success:", success2)
	let [result4, err4] = $.pointerValue(p4).Await(ctx)
	if (err4 != null) {
		$.println("Error:", err4.Error())
	} else {
		$.println("Final result:", result4)
	}
	$.println("All tests completed")
}


if ($.isMainScript(import.meta)) {
	await main()
}
