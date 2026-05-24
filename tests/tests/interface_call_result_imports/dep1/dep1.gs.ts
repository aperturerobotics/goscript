// Generated file based on dep1.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as dep2 from "@goscript/github.com/aperturerobotics/goscript/tests/tests/interface_call_result_imports/dep2/index.js"
import "@goscript/github.com/aperturerobotics/goscript/tests/tests/interface_call_result_imports/dep2/index.js"

export class maker {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): maker {
		const cloned = new maker()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Value(): string {
		return "ok"
	}

	static __typeInfo = $.registerStructType(
		"dep1.maker",
		() => new maker(),
		[{ name: "Value", args: [], returns: [] }],
		maker,
		{}
	)
}

export function Make(): dep2.Value | null {
	return $.interfaceValue<dep2.Value | null>($.markAsStructValue(new maker()), "dep1.maker")
}
