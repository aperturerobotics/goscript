// Generated file based on map_struct_key.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class requestKey {
	public get soID(): string {
		return this._fields.soID.value
	}
	public set soID(value: string) {
		this._fields.soID.value = value
	}

	public get inviteID(): string {
		return this._fields.inviteID.value
	}
	public set inviteID(value: string) {
		this._fields.inviteID.value = value
	}

	public get peerID(): string {
		return this._fields.peerID.value
	}
	public set peerID(value: string) {
		this._fields.peerID.value = value
	}

	public _fields: {
		soID: $.VarRef<string>
		inviteID: $.VarRef<string>
		peerID: $.VarRef<string>
	}

	constructor(init?: Partial<{soID?: string, inviteID?: string, peerID?: string}>) {
		this._fields = {
			soID: $.varRef(init?.soID ?? ""),
			inviteID: $.varRef(init?.inviteID ?? ""),
			peerID: $.varRef(init?.peerID ?? "")
		}
	}

	public clone(): requestKey {
		const cloned = new requestKey()
		cloned._fields = {
			soID: $.varRef(this._fields.soID.value),
			inviteID: $.varRef(this._fields.inviteID.value),
			peerID: $.varRef(this._fields.peerID.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.requestKey",
		() => new requestKey(),
		[],
		requestKey,
		{"soID": { kind: $.TypeKind.Basic, name: "string" }, "inviteID": { kind: $.TypeKind.Basic, name: "string" }, "peerID": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export async function main(): globalThis.Promise<void> {
	let status: Map<requestKey, string> | null = $.makeMap<requestKey, string>()
	$.mapSet(status, $.markAsStructValue(new requestKey({soID: "so-1", inviteID: "inv-1", peerID: "peer-1"})), "pending")
	$.mapSet(status, $.markAsStructValue(new requestKey({soID: "so-1", inviteID: "inv-1", peerID: "peer-1"})), "accepted")

	let [got, ok] = $.mapGet(status, $.markAsStructValue(new requestKey({soID: "so-1", inviteID: "inv-1", peerID: "peer-1"})), "")
	$.println("same struct key:", got, ok, $.len(status))

	let [, missing] = $.mapGet(status, $.markAsStructValue(new requestKey({soID: "so-2", inviteID: "inv-1", peerID: "peer-1"})), "")
	$.println("different struct key:", missing)

	$.deleteMapEntry(status, $.markAsStructValue(new requestKey({soID: "so-1", inviteID: "inv-1", peerID: "peer-1"})))
	let [, deleted] = $.mapGet(status, $.markAsStructValue(new requestKey({soID: "so-1", inviteID: "inv-1", peerID: "peer-1"})), "")
	$.println("deleted struct key:", deleted, $.len(status))
}

if ($.isMainScript(import.meta)) {
	await main()
}
