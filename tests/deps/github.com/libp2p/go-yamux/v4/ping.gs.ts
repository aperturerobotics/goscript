// Generated file based on ping.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as time from "@goscript/time/index.js"
import "@goscript/time/index.js"

export class ping {
	public get id(): number {
		return this._fields.id.value
	}
	public set id(value: number) {
		this._fields.id.value = value
	}

	// written to by the session on ping response
	public get pingResponse(): $.Channel<{}> | null {
		return this._fields.pingResponse.value
	}
	public set pingResponse(value: $.Channel<{}> | null) {
		this._fields.pingResponse.value = value
	}

	// closed by the Ping call that sent the ping when done.
	public get done(): $.Channel<{}> | null {
		return this._fields.done.value
	}
	public set done(value: $.Channel<{}> | null) {
		this._fields.done.value = value
	}

	// result set before done is closed.
	public get err(): $.GoError {
		return this._fields.err.value
	}
	public set err(value: $.GoError) {
		this._fields.err.value = value
	}

	public get duration(): time.Duration {
		return this._fields.duration.value
	}
	public set duration(value: time.Duration) {
		this._fields.duration.value = value
	}

	public _fields: {
		id: $.VarRef<number>
		pingResponse: $.VarRef<$.Channel<{}> | null>
		done: $.VarRef<$.Channel<{}> | null>
		err: $.VarRef<$.GoError>
		duration: $.VarRef<time.Duration>
	}

	constructor(init?: Partial<{id?: number, pingResponse?: $.Channel<{}> | null, done?: $.Channel<{}> | null, err?: $.GoError, duration?: time.Duration}>) {
		this._fields = {
			id: $.varRef(init?.id ?? (0 as number)),
			pingResponse: $.varRef(init?.pingResponse ?? (null as $.Channel<{}> | null)),
			done: $.varRef(init?.done ?? (null as $.Channel<{}> | null)),
			err: $.varRef(init?.err ?? (null as $.GoError)),
			duration: $.varRef(init?.duration ?? (0n as time.Duration))
		}
	}

	public clone(): ping {
		const cloned = new ping()
		cloned._fields = {
			id: $.varRef(this._fields.id.value),
			pingResponse: $.varRef(this._fields.pingResponse.value),
			done: $.varRef(this._fields.done.value),
			err: $.varRef(this._fields.err.value),
			duration: $.varRef(this._fields.duration.value)
		}
		return $.markAsStructValue(cloned)
	}

	public finish(val: time.Duration, err: $.GoError): void {
		let p: ping | $.VarRef<ping> | null = this
		$.pointerValue<ping>(p).err = err
		$.pointerValue<ping>(p).duration = val
		$.pointerValue<ping>(p).done!.close()
	}

	public async wait(): globalThis.Promise<[time.Duration, $.GoError]> {
		const p: ping | $.VarRef<ping> | null = this
		await $.chanRecv($.pointerValue<ping>(p).done)
		return [$.pointerValue<ping>(p).duration, $.pointerValue<ping>(p).err]
	}

	static __typeInfo = $.registerStructType(
		"yamux.ping",
		() => new ping(),
		[{ name: "finish", args: [{ name: "val", type: { kind: $.TypeKind.Basic, name: "int64", typeName: "time.Duration" } }, { name: "err", type: "error" }], returns: [] }, { name: "wait", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int64", typeName: "time.Duration" } }, { name: "_r1", type: "error" }] }],
		ping,
		[{ name: "id", key: "id", type: { kind: $.TypeKind.Basic, name: "uint32" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [0], offset: 0, exported: false }, { name: "pingResponse", key: "pingResponse", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [1], offset: 8, exported: false }, { name: "done", key: "done", type: { kind: $.TypeKind.Channel, direction: "both", elemType: { kind: $.TypeKind.Struct, methods: [], fields: [] } }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [2], offset: 16, exported: false }, { name: "err", key: "err", type: "error", pkgPath: "github.com/libp2p/go-yamux/v4", index: [3], offset: 24, exported: false }, { name: "duration", key: "duration", type: { kind: $.TypeKind.Basic, name: "int64", typeName: "time.Duration" }, pkgPath: "github.com/libp2p/go-yamux/v4", index: [4], offset: 40, exported: false }]
	)
}

export function newPing(id: number): ping | $.VarRef<ping> | null {
	return new ping({id: $.uint(id, 32), pingResponse: $.makeChannel<{}>(1, {}, "both"), done: $.makeChannel<{}>(0, {}, "both")})
}
