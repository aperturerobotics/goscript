// Generated file based on method_receiver_with_call_expr.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class State {
	public get value(): number {
		return this._fields.value.value
	}
	public set value(value: number) {
		this._fields.value.value = value
	}

	public _fields: {
		value: $.VarRef<number>;
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
		return cloned
	}

	public Process(): void {
		const s = this
		;getProcessor()!(s)
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.State',
	  new State(),
	  [{ name: "Process", args: [], returns: [] }],
	  State,
	  {"value": { kind: $.TypeKind.Basic, name: "int" }}
	);
}

export function getProcessor(): ((p0: State | null) => void) | null {
	return (s: State | null): void => {
		s!.value = 42
	}
}

export async function main(): Promise<void> {
	let state = new State({})
	state!.Process()
	$.println("value:", state!.value)
}

