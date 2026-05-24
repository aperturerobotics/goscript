// Generated file based on register.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as __goscript_consts from "./consts.gs.ts"
import "./consts.gs.ts"

export class thing {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): thing {
		const cloned = new thing()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.thing",
		() => new thing(),
		[],
		thing,
		{}
	)
}

export let Seen: number = 0

export function __goscript_set_Seen(value: number): void {
	Seen = value
}

export function newThing(): thing {
	return $.markAsStructValue(new thing())
}

function __goscriptInit0(): void {
	Seen = 0
}

__goscriptInit0()
