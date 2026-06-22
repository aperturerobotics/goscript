// Generated file based on hidden_embedded_method_field.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class embedded {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): embedded {
		const cloned = new embedded()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Database(): string {
		return "method"
	}

	static __typeInfo = $.registerStructType(
		"main.embedded",
		() => new embedded(),
		[{ name: "Database", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
		embedded,
		[]
	)
}

export class holder {
	public get Database(): string {
		return this._fields.Database.value
	}
	public set Database(value: string) {
		this._fields.Database.value = value
	}

	public get embedded(): embedded {
		return this._fields.embedded.value
	}
	public set embedded(value: embedded) {
		this._fields.embedded.value = value
	}

	public _fields: {
		Database: $.VarRef<string>
		embedded: $.VarRef<embedded>
	}

	constructor(init?: Partial<{Database?: string, embedded?: embedded}>) {
		this._fields = {
			Database: $.varRef(init?.Database ?? ("" as unknown as string)),
			embedded: $.varRef(init?.embedded ? $.markAsStructValue($.cloneStructValue(init.embedded)) : $.markAsStructValue(new embedded()))
		}
	}

	public clone(): holder {
		const cloned = new holder()
		cloned._fields = {
			Database: $.varRef(this._fields.Database.value),
			embedded: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.embedded.value)))
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.holder",
		() => new holder(),
		[],
		holder,
		[{ name: "Database", key: "Database", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "embedded", key: "embedded", type: "main.embedded", anonymous: true }]
	)
}

export function value(h: holder): string {
	return h.Database
}

export async function main(): globalThis.Promise<void> {
	$.println(value($.markAsStructValue(new holder({Database: "field"}))))
}

if ($.isMainScript(import.meta)) {
	await main()
}
