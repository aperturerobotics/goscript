// Generated file based on types.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Job {
	public get Value(): string {
		return this._fields.Value.value
	}
	public set Value(value: string) {
		this._fields.Value.value = value
	}

	public _fields: {
		Value: $.VarRef<string>;
	}

	constructor(init?: Partial<{Value?: string}>) {
		this._fields = {
			Value: $.varRef(init?.Value ?? "")
		}
	}

	public clone(): Job {
		const cloned = new Job()
		cloned._fields = {
			Value: $.varRef(this._fields.Value.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'main.Job',
	  new Job(),
	  [],
	  Job,
	  {"Value": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

export type Jobs = $.Channel<Job> | null;

