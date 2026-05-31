// Generated file based on interface_copied_method_call.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class task {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): task {
		const cloned = new task()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Run(): void {
		$.println("run")
	}

	static __typeInfo = $.registerStructType(
		"main.task",
		() => new task(),
		[{ name: "Run", args: [], returns: [] }],
		task,
		[]
	)
}

export type runner = {
	Run(): void
}

$.registerInterfaceType(
	"main.runner",
	null,
	[{ name: "Run", args: [], returns: [] }]
);

export function callCopied(r: runner | null): void {
	let curr: runner | null = null as runner | null
	void ($.functionValue((): void => {
		curr = r
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))()
	$.pointerValue<Exclude<runner, null>>(curr).Run()
}

export async function main(): globalThis.Promise<void> {
	callCopied($.interfaceValue<runner | null>($.markAsStructValue(new task()), "main.task"))
}

if ($.isMainScript(import.meta)) {
	await main()
}
