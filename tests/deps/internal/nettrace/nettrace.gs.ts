// Generated file based on nettrace.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export class TraceKey {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): TraceKey {
		const cloned = new TraceKey()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"nettrace.TraceKey",
		() => new TraceKey(),
		[],
		TraceKey,
		[]
	)
}

export class LookupIPAltResolverKey {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): LookupIPAltResolverKey {
		const cloned = new LookupIPAltResolverKey()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"nettrace.LookupIPAltResolverKey",
		() => new LookupIPAltResolverKey(),
		[],
		LookupIPAltResolverKey,
		[]
	)
}

export class Trace {
	// DNSStart is called with the hostname of a DNS lookup
	// before it begins.
	public get DNSStart(): ((name: string) => void) | null {
		return this._fields.DNSStart.value
	}
	public set DNSStart(value: ((name: string) => void) | null) {
		this._fields.DNSStart.value = value
	}

	// DNSDone is called after a DNS lookup completes (or fails).
	// The coalesced parameter is whether singleflight de-duped
	// the call. The addrs are of type net.IPAddr but can't
	// actually be for circular dependency reasons.
	public get DNSDone(): ((netIPs: $.Slice<any>, coalesced: boolean, err: $.GoError) => void) | null {
		return this._fields.DNSDone.value
	}
	public set DNSDone(value: ((netIPs: $.Slice<any>, coalesced: boolean, err: $.GoError) => void) | null) {
		this._fields.DNSDone.value = value
	}

	// ConnectStart is called before a Dial, excluding Dials made
	// during DNS lookups. In the case of DualStack (Happy Eyeballs)
	// dialing, this may be called multiple times, from multiple
	// goroutines.
	public get ConnectStart(): ((network: string, addr: string) => void) | null {
		return this._fields.ConnectStart.value
	}
	public set ConnectStart(value: ((network: string, addr: string) => void) | null) {
		this._fields.ConnectStart.value = value
	}

	// ConnectDone is called after a Dial with the results, excluding
	// Dials made during DNS lookups. It may also be called multiple
	// times, like ConnectStart.
	public get ConnectDone(): ((network: string, addr: string, err: $.GoError) => void) | null {
		return this._fields.ConnectDone.value
	}
	public set ConnectDone(value: ((network: string, addr: string, err: $.GoError) => void) | null) {
		this._fields.ConnectDone.value = value
	}

	public _fields: {
		DNSStart: $.VarRef<((name: string) => void) | null>
		DNSDone: $.VarRef<((netIPs: $.Slice<any>, coalesced: boolean, err: $.GoError) => void) | null>
		ConnectStart: $.VarRef<((network: string, addr: string) => void) | null>
		ConnectDone: $.VarRef<((network: string, addr: string, err: $.GoError) => void) | null>
	}

	constructor(init?: Partial<{DNSStart?: ((name: string) => void) | null, DNSDone?: ((netIPs: $.Slice<any>, coalesced: boolean, err: $.GoError) => void) | null, ConnectStart?: ((network: string, addr: string) => void) | null, ConnectDone?: ((network: string, addr: string, err: $.GoError) => void) | null}>) {
		this._fields = {
			DNSStart: $.varRef(init?.DNSStart ?? (null as ((name: string) => void) | null)),
			DNSDone: $.varRef(init?.DNSDone ?? (null as ((netIPs: $.Slice<any>, coalesced: boolean, err: $.GoError) => void) | null)),
			ConnectStart: $.varRef(init?.ConnectStart ?? (null as ((network: string, addr: string) => void) | null)),
			ConnectDone: $.varRef(init?.ConnectDone ?? (null as ((network: string, addr: string, err: $.GoError) => void) | null))
		}
	}

	public clone(): Trace {
		const cloned = new Trace()
		cloned._fields = {
			DNSStart: $.varRef(this._fields.DNSStart.value),
			DNSDone: $.varRef(this._fields.DNSDone.value),
			ConnectStart: $.varRef(this._fields.ConnectStart.value),
			ConnectDone: $.varRef(this._fields.ConnectDone.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"nettrace.Trace",
		() => new Trace(),
		[],
		Trace,
		[{ name: "DNSStart", key: "DNSStart", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [] } as $.FunctionTypeInfo), index: [0], offset: 0, exported: true }, { name: "DNSDone", key: "DNSDone", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } }, { kind: $.TypeKind.Basic, name: "bool" }, "error"], results: [] } as $.FunctionTypeInfo), index: [1], offset: 8, exported: true }, { name: "ConnectStart", key: "ConnectStart", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }], results: [] } as $.FunctionTypeInfo), index: [2], offset: 16, exported: true }, { name: "ConnectDone", key: "ConnectDone", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }, "error"], results: [] } as $.FunctionTypeInfo), index: [3], offset: 24, exported: true }]
	)
}
