// Generated file based on reserved_identifier_arguments.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class Parser {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): Parser {
		const cloned = new Parser()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Parse(_arguments: $.Slice<string>): number {
		return $.len(_arguments)
	}

	static __typeInfo = $.registerStructType(
		"main.Parser",
		() => new Parser(),
		[{ name: "Parse", args: [], returns: [] }],
		Parser,
		[]
	)
}

export function collect(_arguments: string): string {
	return _arguments + "!"
}

export async function main(): globalThis.Promise<void> {
	$.println($.markAsStructValue($.cloneStructValue($.markAsStructValue(new Parser()))).Parse($.arrayToSlice<string>(["a", "b"])))
	$.println(collect("ok"))
}

if ($.isMainScript(import.meta)) {
	await main()
}
