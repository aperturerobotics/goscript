// Generated file based on fd.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"
import "@goscript/errors/index.js"

export type String = string

export class errNetClosing {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): errNetClosing {
		const cloned = new errNetClosing()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e = this
		return "use of closed network connection"
	}

	public Temporary(): boolean {
		const e = this
		return false
	}

	public Timeout(): boolean {
		const e = this
		return false
	}

	static __typeInfo = $.registerStructType(
		"poll.errNetClosing",
		() => new errNetClosing(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Temporary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Timeout", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		errNetClosing,
		[]
	)
}

export class DeadlineExceededError {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): DeadlineExceededError {
		const cloned = new DeadlineExceededError()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Error(): string {
		const e: DeadlineExceededError | $.VarRef<DeadlineExceededError> | null = this
		return "i/o timeout"
	}

	public Temporary(): boolean {
		const e: DeadlineExceededError | $.VarRef<DeadlineExceededError> | null = this
		return true
	}

	public Timeout(): boolean {
		const e: DeadlineExceededError | $.VarRef<DeadlineExceededError> | null = this
		return true
	}

	static __typeInfo = $.registerStructType(
		"poll.DeadlineExceededError",
		() => new DeadlineExceededError(),
		[{ name: "Error", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Temporary", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Timeout", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }],
		DeadlineExceededError,
		[]
	)
}

export let ErrNetClosing: errNetClosing = $.markAsStructValue(new errNetClosing())

export function __goscript_set_ErrNetClosing(__goscriptValue: errNetClosing): void {
	ErrNetClosing = __goscriptValue
}

export let ErrFileClosing: $.GoError = errors.New("use of closed file")

export function __goscript_set_ErrFileClosing(__goscriptValue: $.GoError): void {
	ErrFileClosing = __goscriptValue
}

export let ErrNoDeadline: $.GoError = errors.New("file type does not support deadline")

export function __goscript_set_ErrNoDeadline(__goscriptValue: $.GoError): void {
	ErrNoDeadline = __goscriptValue
}

export function errClosing(isFile: boolean): $.GoError {
	if (isFile) {
		return ErrFileClosing
	}
	return $.interfaceValue<$.GoError>($.markAsStructValue($.cloneStructValue(ErrNetClosing)), "poll.errNetClosing")
}

export let ErrDeadlineExceeded: $.GoError = $.interfaceValue<$.GoError>(new DeadlineExceededError(), "*poll.DeadlineExceededError")

export function __goscript_set_ErrDeadlineExceeded(__goscriptValue: $.GoError): void {
	ErrDeadlineExceeded = __goscriptValue
}

export let ErrNotPollable: $.GoError = errors.New("not pollable")

export function __goscript_set_ErrNotPollable(__goscriptValue: $.GoError): void {
	ErrNotPollable = __goscriptValue
}

export function consume(v: $.VarRef<$.Slice<$.Slice<number>>> | null, n: bigint): void {
	while ($.len($.pointerValue<$.Slice<$.Slice<number>>>(v)) > 0) {
		let ln0 = $.int64($.len(($.pointerValue<$.Slice<$.Slice<number>>>(v))![0]))
		if (ln0 > n) {
			($.pointerValue<$.Slice<$.Slice<number>>>(v))![0] = $.goSlice(($.pointerValue<$.Slice<$.Slice<number>>>(v))![0], Number(n), undefined)
			return
		}
		n = $.int64Sub(n, ln0);
		($.pointerValue<$.Slice<$.Slice<number>>>(v))![0] = null
		v!.value = $.goSlice(($.pointerValue<$.Slice<$.Slice<number>>>(v)), 1, undefined)
	}
}

export let TestHookDidWritev: ((wrote: number) => void) | null = $.functionValue((wrote: number): void => {
}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "int" }], results: [] } as $.FunctionTypeInfo))

export function __goscript_set_TestHookDidWritev(__goscriptValue: ((wrote: number) => void) | null): void {
	TestHookDidWritev = __goscriptValue
}
