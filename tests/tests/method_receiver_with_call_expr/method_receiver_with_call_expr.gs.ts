// Generated file based on method_receiver_with_call_expr.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export class State {
	public get value(): number {
		return this._fields.value.value
	}
	public set value(value: number) {
		this._fields.value.value = value
	}

	public _fields: {
		value: $.VarRef<number>
	}

	constructor(init?: Partial<{value?: number}>) {
		this._fields = {
			value: $.varRef(init?.value ?? 0)
		}
	}

	public clone(): State {
		const cloned = new State()
		cloned._fields = {
			value: $.varRef(this._fields.value.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Process(): void {
		const s = this
		getProcessor()(s)
	}

	static __typeInfo = $.registerStructType(
		"main.State",
		new State(),
		[{ name: "Process", args: [], returns: [] }],
		State,
		{"value": { kind: $.TypeKind.Basic, name: "int" }}
	)
}

export function getProcessor(): (_p0: State | $.VarRef<State> | null) => void {
	return (s: State | $.VarRef<State> | null): void => {
	$.pointerValue(s).value = 42
}
}

export async function main(): Promise<void> {
	let state = new State()
	$.pointerValue(state).Process()
	$.println("value:", $.pointerValue(state).value)
}


if ($.isMainScript(import.meta)) {
	await main()
}
