// Generated file based on bodyless_async_callback.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"
import "@goscript/sync/index.js"

export class Setting {
	public get once(): sync.Once {
		return this._fields.once.value
	}
	public set once(value: sync.Once) {
		this._fields.once.value = value
	}

	public _fields: {
		once: $.VarRef<sync.Once>
	}

	constructor(init?: Partial<{once?: sync.Once}>) {
		this._fields = {
			once: $.varRef(init?.once ? $.markAsStructValue(init.once.clone()) : $.markAsStructValue(new sync.Once()))
		}
	}

	public clone(): Setting {
		const cloned = new Setting()
		cloned._fields = {
			once: $.varRef($.markAsStructValue(this._fields.once.value.clone()))
		}
		return $.markAsStructValue(cloned)
	}

	public async Value(): globalThis.Promise<string> {
		const s: Setting | $.VarRef<Setting> | null = this
		await $.pointerValue<Setting>(s).once.Do($.functionValue((): void => {
		}, { kind: $.TypeKind.Function, params: [], results: [] }))
		return ""
	}

	static __typeInfo = $.registerStructType(
		"main.Setting",
		() => new Setting(),
		[{ name: "Value", args: [], returns: [] }],
		Setting,
		{"once": "sync.Once"}
	)
}

export function setCallback(callback: ((_p0: string) => (() => void) | null | globalThis.Promise<(() => void) | null>) | null): void {
}

export async function newCallback(name: string): globalThis.Promise<(() => void) | null> {
	let s: Setting | $.VarRef<Setting> | null = new Setting()
	await Setting.prototype.Value.call(s)
	return $.functionValue((): void => {
		$.println("callback:", name)
	}, { kind: $.TypeKind.Function, params: [], results: [] })
}

function __goscriptInit0(): void {
	setCallback(newCallback)
}

export async function main(): globalThis.Promise<void> {
	$.println("ok")
}

__goscriptInit0()

if ($.isMainScript(import.meta)) {
	await main()
}
