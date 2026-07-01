// Generated file based on rpcstream.pb.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as base64 from "@goscript/encoding/base64/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as io from "@goscript/io/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as strings from "@goscript/strings/index.js"

import * as protobuf_go_lite from "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"

import * as json from "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"
import "@goscript/encoding/base64/index.js"
import "@goscript/fmt/index.js"
import "@goscript/io/index.js"
import "@goscript/slices/index.js"
import "@goscript/strconv/index.js"
import "@goscript/strings/index.js"
import "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"
import "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"

export class RpcStreamPacket {
	public get unknownFields(): $.Slice<number> {
		return this._fields.unknownFields.value
	}
	public set unknownFields(value: $.Slice<number>) {
		this._fields.unknownFields.value = value
	}

	// Types that are assignable to Body:
	//
	// 	*RpcStreamPacket_Init
	// 	*RpcStreamPacket_Ack
	// 	*RpcStreamPacket_Data
	public get Body(): isRpcStreamPacket_Body | null {
		return this._fields.Body.value
	}
	public set Body(value: isRpcStreamPacket_Body | null) {
		this._fields.Body.value = value
	}

	public _fields: {
		unknownFields: $.VarRef<$.Slice<number>>
		Body: $.VarRef<isRpcStreamPacket_Body | null>
	}

	constructor(init?: Partial<{unknownFields?: $.Slice<number>, Body?: isRpcStreamPacket_Body | null}>) {
		this._fields = {
			unknownFields: $.varRef(init?.unknownFields ?? (null as $.Slice<number>)),
			Body: $.varRef(init?.Body ?? (null as isRpcStreamPacket_Body | null))
		}
	}

	public clone(): RpcStreamPacket {
		const cloned = new RpcStreamPacket()
		cloned._fields = {
			unknownFields: $.varRef(this._fields.unknownFields.value),
			Body: $.varRef(this._fields.Body.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async CloneMessageVT(): globalThis.Promise<protobuf_go_lite.CloneMessage | null> {
		const m: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null = this
		return $.interfaceValue<protobuf_go_lite.CloneMessage | null>(await RpcStreamPacket.prototype.CloneVT.call(m), "*rpcstream.RpcStreamPacket")
	}

	public async CloneVT(): globalThis.Promise<RpcStreamPacket | $.VarRef<RpcStreamPacket> | null> {
		const m: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null = this
		if (m == null) {
			return null
		}
		let r: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null = new RpcStreamPacket()
		if ($.pointerValue<RpcStreamPacket>(m).Body != null) {
			$.pointerValue<RpcStreamPacket>(r).Body = await $.pointerValue<any>($.mustTypeAssert<any>($.pointerValue<RpcStreamPacket>(m).Body, { kind: $.TypeKind.Interface, methods: [{ name: "CloneOneofVT", args: [], returns: [{ name: "_r0", type: "rpcstream.isRpcStreamPacket_Body" }] }] })).CloneOneofVT()
		}
		if ($.len($.pointerValue<RpcStreamPacket>(m).unknownFields) > 0) {
			$.pointerValue<RpcStreamPacket>(r).unknownFields = (slices.Clone($.pointerValue<RpcStreamPacket>(m).unknownFields) as $.Slice<number>)
		}
		return r
	}

	public async EqualMessageVT(thatMsg: any): globalThis.Promise<boolean> {
		const _this: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null = this
		let __goscriptTuple0: any = $.typeAssertTuple<RpcStreamPacket | $.VarRef<RpcStreamPacket> | null>(thatMsg, { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket" })
		let that: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null = __goscriptTuple0[0]
		let ok = __goscriptTuple0[1]
		if (!ok) {
			return false
		}
		return RpcStreamPacket.prototype.EqualVT.call(_this, that)
	}

	public async EqualVT(that: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null): globalThis.Promise<boolean> {
		const _this: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null = this
		if (_this == that) {
			return true
		} else {
			if ((_this == null) || (that == null)) {
				return false
			}
		}
		if (($.pointerValue<RpcStreamPacket>(_this).Body == null) && ($.pointerValue<RpcStreamPacket>(that).Body != null)) {
			return false
		} else {
			if ($.pointerValue<RpcStreamPacket>(_this).Body != null) {
				if ($.pointerValue<RpcStreamPacket>(that).Body == null) {
					return false
				}
				if (!await $.pointerValue<any>($.mustTypeAssert<any>($.pointerValue<RpcStreamPacket>(_this).Body, { kind: $.TypeKind.Interface, methods: [{ name: "EqualVT", args: [{ name: "_p0", type: "rpcstream.isRpcStreamPacket_Body" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }] })).EqualVT($.pointerValue<RpcStreamPacket>(that).Body)) {
					return false
				}
			}
		}
		return $.stringEqual($.bytesToString($.pointerValue<RpcStreamPacket>(_this).unknownFields), $.bytesToString($.pointerValue<RpcStreamPacket>(that).unknownFields))
	}

	public GetAck(): RpcAck | $.VarRef<RpcAck> | null {
		const x: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null = this
		let __goscriptShadow0 = x
		{
			let __goscriptTuple1: any = $.typeAssertTuple<RpcStreamPacket_Ack | $.VarRef<RpcStreamPacket_Ack> | null>(RpcStreamPacket.prototype.GetBody.call(__goscriptShadow0), { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Ack" })
			let __goscriptShadow1: RpcStreamPacket_Ack | $.VarRef<RpcStreamPacket_Ack> | null = __goscriptTuple1[0]
			let ok = __goscriptTuple1[1]
			if (ok) {
				return $.pointerValue<RpcStreamPacket_Ack>(__goscriptShadow1).Ack
			}
		}
		return null
	}

	public GetBody(): isRpcStreamPacket_Body | null {
		const m: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null = this
		if (m != null) {
			return $.pointerValue<RpcStreamPacket>(m).Body
		}
		return null
	}

	public GetData(): $.Slice<number> {
		const x: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null = this
		let __goscriptShadow2 = x
		{
			let __goscriptTuple2: any = $.typeAssertTuple<RpcStreamPacket_Data | $.VarRef<RpcStreamPacket_Data> | null>(RpcStreamPacket.prototype.GetBody.call(__goscriptShadow2), { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Data" })
			let __goscriptShadow3: RpcStreamPacket_Data | $.VarRef<RpcStreamPacket_Data> | null = __goscriptTuple2[0]
			let ok = __goscriptTuple2[1]
			if (ok) {
				return $.pointerValue<RpcStreamPacket_Data>(__goscriptShadow3).Data
			}
		}
		return null
	}

	public GetInit(): RpcStreamInit | $.VarRef<RpcStreamInit> | null {
		const x: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null = this
		let __goscriptShadow4 = x
		{
			let __goscriptTuple3: any = $.typeAssertTuple<RpcStreamPacket_Init | $.VarRef<RpcStreamPacket_Init> | null>(RpcStreamPacket.prototype.GetBody.call(__goscriptShadow4), { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Init" })
			let __goscriptShadow5: RpcStreamPacket_Init | $.VarRef<RpcStreamPacket_Init> | null = __goscriptTuple3[0]
			let ok = __goscriptTuple3[1]
			if (ok) {
				return $.pointerValue<RpcStreamPacket_Init>(__goscriptShadow5).Init
			}
		}
		return null
	}

	public MarshalJSON(): [$.Slice<number>, $.GoError] {
		const x: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null = this
		return $.markAsStructValue($.cloneStructValue($.pointerValue<json.MarshalerConfig>(json.DefaultMarshalerConfig))).Marshal($.pointerValueOrNil($.interfaceValue<json.Marshaler | null>(x, "*rpcstream.RpcStreamPacket"))!)
	}

	public MarshalProtoJSON(s: json.MarshalState | $.VarRef<json.MarshalState> | null): void {
		const x: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null = this
		if (x == null) {
			json.MarshalState.prototype.WriteNil.call($.pointerValue<json.MarshalState>(s))
			return
		}
		json.MarshalState.prototype.WriteObjectStart.call($.pointerValue<json.MarshalState>(s))
		let wroteField: $.VarRef<boolean> = $.varRef(false)
		if ($.pointerValue<RpcStreamPacket>(x).Body != null) {
			{
				const __goscriptTypeSwitchValue = $.pointerValue<RpcStreamPacket>(x).Body
				switch (true) {
					case $.typeAssert<RpcStreamPacket_Init | $.VarRef<RpcStreamPacket_Init> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Init" }).ok:
						{
							let ov: RpcStreamPacket_Init | $.VarRef<RpcStreamPacket_Init> | null = $.typeAssert<RpcStreamPacket_Init | $.VarRef<RpcStreamPacket_Init> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Init" }).value
							json.MarshalState.prototype.WriteMoreIf.call($.pointerValue<json.MarshalState>(s), wroteField)
							json.MarshalState.prototype.WriteObjectField.call($.pointerValue<json.MarshalState>(s), "init")
							RpcStreamInit.prototype.MarshalProtoJSON.call($.pointerValue<RpcStreamPacket_Init>(ov).Init, json.MarshalState.prototype.WithField.call($.pointerValue<json.MarshalState>(s), "init"))
						}
						break
					case $.typeAssert<RpcStreamPacket_Ack | $.VarRef<RpcStreamPacket_Ack> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Ack" }).ok:
						{
							let ov: RpcStreamPacket_Ack | $.VarRef<RpcStreamPacket_Ack> | null = $.typeAssert<RpcStreamPacket_Ack | $.VarRef<RpcStreamPacket_Ack> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Ack" }).value
							json.MarshalState.prototype.WriteMoreIf.call($.pointerValue<json.MarshalState>(s), wroteField)
							json.MarshalState.prototype.WriteObjectField.call($.pointerValue<json.MarshalState>(s), "ack")
							RpcAck.prototype.MarshalProtoJSON.call($.pointerValue<RpcStreamPacket_Ack>(ov).Ack, json.MarshalState.prototype.WithField.call($.pointerValue<json.MarshalState>(s), "ack"))
						}
						break
					case $.typeAssert<RpcStreamPacket_Data | $.VarRef<RpcStreamPacket_Data> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Data" }).ok:
						{
							let ov: RpcStreamPacket_Data | $.VarRef<RpcStreamPacket_Data> | null = $.typeAssert<RpcStreamPacket_Data | $.VarRef<RpcStreamPacket_Data> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Data" }).value
							json.MarshalState.prototype.WriteMoreIf.call($.pointerValue<json.MarshalState>(s), wroteField)
							json.MarshalState.prototype.WriteObjectField.call($.pointerValue<json.MarshalState>(s), "data")
							json.MarshalState.prototype.WriteBytes.call($.pointerValue<json.MarshalState>(s), $.pointerValue<RpcStreamPacket_Data>(ov).Data)
						}
						break
				}
			}
		}
		json.MarshalState.prototype.WriteObjectEnd.call($.pointerValue<json.MarshalState>(s))
	}

	public MarshalProtoText(): string {
		const x: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null = this
		let sb: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
		sb.value.WriteString("RpcStreamPacket {")
		{
			const __goscriptTypeSwitchValue = $.pointerValue<RpcStreamPacket>(x).Body
			switch (true) {
				case $.typeAssert<RpcStreamPacket_Init | $.VarRef<RpcStreamPacket_Init> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Init" }).ok:
					{
						let body: RpcStreamPacket_Init | $.VarRef<RpcStreamPacket_Init> | null = $.typeAssert<RpcStreamPacket_Init | $.VarRef<RpcStreamPacket_Init> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Init" }).value
						if ($.pointerValue<RpcStreamPacket_Init>(body).Init != null) {
							if (sb.value.Len() > 17) {
								sb.value.WriteString(" ")
							}
							sb.value.WriteString("init: ")
							sb.value.WriteString(RpcStreamInit.prototype.MarshalProtoText.call($.pointerValue<RpcStreamPacket_Init>(body).Init))
						}
					}
					break
				case $.typeAssert<RpcStreamPacket_Ack | $.VarRef<RpcStreamPacket_Ack> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Ack" }).ok:
					{
						let body: RpcStreamPacket_Ack | $.VarRef<RpcStreamPacket_Ack> | null = $.typeAssert<RpcStreamPacket_Ack | $.VarRef<RpcStreamPacket_Ack> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Ack" }).value
						if ($.pointerValue<RpcStreamPacket_Ack>(body).Ack != null) {
							if (sb.value.Len() > 17) {
								sb.value.WriteString(" ")
							}
							sb.value.WriteString("ack: ")
							sb.value.WriteString(RpcAck.prototype.MarshalProtoText.call($.pointerValue<RpcStreamPacket_Ack>(body).Ack))
						}
					}
					break
				case $.typeAssert<RpcStreamPacket_Data | $.VarRef<RpcStreamPacket_Data> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Data" }).ok:
					{
						let body: RpcStreamPacket_Data | $.VarRef<RpcStreamPacket_Data> | null = $.typeAssert<RpcStreamPacket_Data | $.VarRef<RpcStreamPacket_Data> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Data" }).value
						if ($.pointerValue<RpcStreamPacket_Data>(body).Data != null) {
							if (sb.value.Len() > 17) {
								sb.value.WriteString(" ")
							}
							sb.value.WriteString("data: ")
							sb.value.WriteString("\"")
							sb.value.WriteString(base64.Encoding.prototype.EncodeToString.call(base64.StdEncoding, $.pointerValue<RpcStreamPacket_Data>(body).Data))
							sb.value.WriteString("\"")
						}
					}
					break
			}
		}
		sb.value.WriteString("}")
		return sb.value.String()
	}

	public async MarshalToSizedBufferVT(dAtA: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const m: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null = this
		if (m == null) {
			return [0, null]
		}
		let i = $.len(dAtA)
		i
		let l: number = 0
		l
		if ($.pointerValue<RpcStreamPacket>(m).unknownFields != null) {
			i = i - ($.len($.pointerValue<RpcStreamPacket>(m).unknownFields))
			$.copy($.goSlice(dAtA, i, undefined), $.pointerValue<RpcStreamPacket>(m).unknownFields)
		}
		{
			let [vtmsg, ok] = $.typeAssertTuple<any>($.pointerValue<RpcStreamPacket>(m).Body, { kind: $.TypeKind.Interface, methods: [{ name: "MarshalToSizedBufferVT", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }] })
			if (ok) {
				let [size, err] = await $.pointerValue<any>(vtmsg).MarshalToSizedBufferVT($.goSlice(dAtA, undefined, i))
				if (err != null) {
					return [0, err]
				}
				i = i - (size)
			}
		}
		return [$.len(dAtA) - i, null]
	}

	public async MarshalToVT(dAtA: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const m: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null = this
		let size = await RpcStreamPacket.prototype.SizeVT.call(m)
		return RpcStreamPacket.prototype.MarshalToSizedBufferVT.call(m, $.goSlice(dAtA, undefined, size))
	}

	public async MarshalVT(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const m: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null = this
		let dAtA: $.Slice<number> = null as $.Slice<number>
		let err: $.GoError = null as $.GoError
		if (m == null) {
			return [null, null]
		}
		let size = await RpcStreamPacket.prototype.SizeVT.call(m)
		dAtA = $.makeSlice<number>(size, undefined, "byte")
		let __goscriptTuple4: any = await RpcStreamPacket.prototype.MarshalToSizedBufferVT.call(m, $.goSlice(dAtA, undefined, size))
		let n = __goscriptTuple4[0]
		err = __goscriptTuple4[1]
		if (err != null) {
			return [null, err]
		}
		return [$.goSlice(dAtA, undefined, n), null]
	}

	public ProtoMessage(): void {
	}

	public Reset(): void {
		let x: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null = this
		$.assignStruct($.pointerValue<RpcStreamPacket>(x), $.markAsStructValue(new RpcStreamPacket()))
	}

	public async SizeVT(): globalThis.Promise<number> {
		const m: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null = this
		let n: number = 0
		if (m == null) {
			return 0
		}
		let l: number = 0
		l
		{
			let [vtmsg, ok] = $.typeAssertTuple<any>($.pointerValue<RpcStreamPacket>(m).Body, { kind: $.TypeKind.Interface, methods: [{ name: "SizeVT", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }] })
			if (ok) {
				n = n + (await $.pointerValue<any>(vtmsg).SizeVT())
			}
		}
		n = n + ($.len($.pointerValue<RpcStreamPacket>(m).unknownFields))
		return n
	}

	public String(): string {
		const x: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null = this
		return RpcStreamPacket.prototype.MarshalProtoText.call(x)
	}

	public UnmarshalJSON(b: $.Slice<number>): $.GoError {
		const x: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null = this
		return $.markAsStructValue($.cloneStructValue($.pointerValue<json.UnmarshalerConfig>(json.DefaultUnmarshalerConfig))).Unmarshal(b, $.pointerValueOrNil($.interfaceValue<json.Unmarshaler | null>(x, "*rpcstream.RpcStreamPacket"))!)
	}

	public UnmarshalProtoJSON(s: json.UnmarshalState | $.VarRef<json.UnmarshalState> | null): void {
		const x: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null = this
		if (json.UnmarshalState.prototype.ReadNil.call($.pointerValue<json.UnmarshalState>(s))) {
			return
		}
		json.UnmarshalState.prototype.ReadObject.call($.pointerValue<json.UnmarshalState>(s), $.functionValue((key: string): void => {
			switch (key) {
				default:
				{
					json.UnmarshalState.prototype.Skip.call($.pointerValue<json.UnmarshalState>(s))
					break
				}
				case "init":
				{
					let ov: RpcStreamPacket_Init | $.VarRef<RpcStreamPacket_Init> | null = new RpcStreamPacket_Init()
					$.pointerValue<RpcStreamPacket>(x).Body = $.interfaceValue<isRpcStreamPacket_Body | null>(ov, "*rpcstream.RpcStreamPacket_Init")
					if (json.UnmarshalState.prototype.ReadNil.call($.pointerValue<json.UnmarshalState>(s))) {
						$.pointerValue<RpcStreamPacket_Init>(ov).Init = null
						return
					}
					$.pointerValue<RpcStreamPacket_Init>(ov).Init = new RpcStreamInit()
					RpcStreamInit.prototype.UnmarshalProtoJSON.call($.pointerValue<RpcStreamPacket_Init>(ov).Init, json.UnmarshalState.prototype.WithField.call($.pointerValue<json.UnmarshalState>(s), "init", true))
					break
				}
				case "ack":
				{
					let ov: RpcStreamPacket_Ack | $.VarRef<RpcStreamPacket_Ack> | null = new RpcStreamPacket_Ack()
					$.pointerValue<RpcStreamPacket>(x).Body = $.interfaceValue<isRpcStreamPacket_Body | null>(ov, "*rpcstream.RpcStreamPacket_Ack")
					if (json.UnmarshalState.prototype.ReadNil.call($.pointerValue<json.UnmarshalState>(s))) {
						$.pointerValue<RpcStreamPacket_Ack>(ov).Ack = null
						return
					}
					$.pointerValue<RpcStreamPacket_Ack>(ov).Ack = new RpcAck()
					RpcAck.prototype.UnmarshalProtoJSON.call($.pointerValue<RpcStreamPacket_Ack>(ov).Ack, json.UnmarshalState.prototype.WithField.call($.pointerValue<json.UnmarshalState>(s), "ack", true))
					break
				}
				case "data":
				{
					json.UnmarshalState.prototype.AddField.call($.pointerValue<json.UnmarshalState>(s), "data")
					let ov: RpcStreamPacket_Data | $.VarRef<RpcStreamPacket_Data> | null = new RpcStreamPacket_Data()
					$.pointerValue<RpcStreamPacket>(x).Body = $.interfaceValue<isRpcStreamPacket_Body | null>(ov, "*rpcstream.RpcStreamPacket_Data")
					$.pointerValue<RpcStreamPacket_Data>(ov).Data = json.UnmarshalState.prototype.ReadBytes.call($.pointerValue<json.UnmarshalState>(s))
					break
				}
			}
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [] } as $.FunctionTypeInfo)))
	}

	public UnmarshalVT(dAtA: $.Slice<number>): $.GoError {
		let m: RpcStreamPacket | $.VarRef<RpcStreamPacket> | null = this
		let l = $.len(dAtA)
		let iNdEx = 0
		let err: $.GoError = null as $.GoError
		while (iNdEx < l) {
			let preIndex = iNdEx
			let wire: bigint = 0n
			let __goscriptTuple5: any = protobuf_go_lite.DecodeVarint(dAtA, iNdEx)
			wire = __goscriptTuple5[0]
			iNdEx = __goscriptTuple5[1]
			err = __goscriptTuple5[2]
			if (err != null) {
				return err
			}
			let fieldNum = $.int($.int($.uint64Shr(wire, 3), 32), 32)
			let wireType = $.int($.uint64And(wire, 0x7))
			if (wireType == 4) {
				return fmt.Errorf("proto: RpcStreamPacket: wiretype end group for non-group")
			}
			if ($.int(fieldNum, 32) <= $.int(0, 32)) {
				return fmt.Errorf("proto: RpcStreamPacket: illegal tag %d (wire type %d)", $.namedValueInterfaceValue<any>(fieldNum, "int32", {}, { kind: $.TypeKind.Basic, name: "int32" }), $.namedValueInterfaceValue<any>(wire, "uint64", {}, { kind: $.TypeKind.Basic, name: "uint64" }))
			}
			switch (fieldNum) {
				case 1:
				{
					if (wireType != 2) {
						return fmt.Errorf("proto: wrong wireType = %d for field Init", $.namedValueInterfaceValue<any>(wireType, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
					}
					let msglen: number = 0
					let _v: bigint = 0n
					let __goscriptTuple6: any = protobuf_go_lite.DecodeVarint(dAtA, iNdEx)
					_v = __goscriptTuple6[0]
					iNdEx = __goscriptTuple6[1]
					err = __goscriptTuple6[2]
					msglen = $.int(_v)
					if (err != null) {
						return err
					}
					if (msglen < 0) {
						return protobuf_go_lite.ErrInvalidLength
					}
					let postIndex = iNdEx + msglen
					if (postIndex < 0) {
						return protobuf_go_lite.ErrInvalidLength
					}
					if (postIndex > l) {
						return io.ErrUnexpectedEOF
					}
					{
						let __goscriptTuple7: any = $.typeAssertTuple<RpcStreamPacket_Init | $.VarRef<RpcStreamPacket_Init> | null>($.pointerValue<RpcStreamPacket>(m).Body, { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Init" })
						let oneof: RpcStreamPacket_Init | $.VarRef<RpcStreamPacket_Init> | null = __goscriptTuple7[0]
						let ok = __goscriptTuple7[1]
						if (ok) {
							{
								let __goscriptShadow6 = RpcStreamInit.prototype.UnmarshalVT.call($.pointerValue<RpcStreamPacket_Init>(oneof).Init, $.goSlice(dAtA, iNdEx, postIndex))
								if (__goscriptShadow6 != null) {
									return __goscriptShadow6
								}
							}
						} else {
							let v: RpcStreamInit | $.VarRef<RpcStreamInit> | null = new RpcStreamInit()
							{
								let __goscriptShadow7 = RpcStreamInit.prototype.UnmarshalVT.call(v, $.goSlice(dAtA, iNdEx, postIndex))
								if (__goscriptShadow7 != null) {
									return __goscriptShadow7
								}
							}
							$.pointerValue<RpcStreamPacket>(m).Body = $.interfaceValue<isRpcStreamPacket_Body | null>(new RpcStreamPacket_Init({Init: v}), "*rpcstream.RpcStreamPacket_Init")
						}
					}
					iNdEx = postIndex
					break
				}
				case 2:
				{
					if (wireType != 2) {
						return fmt.Errorf("proto: wrong wireType = %d for field Ack", $.namedValueInterfaceValue<any>(wireType, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
					}
					let msglen: number = 0
					let _v: bigint = 0n
					let __goscriptTuple8: any = protobuf_go_lite.DecodeVarint(dAtA, iNdEx)
					_v = __goscriptTuple8[0]
					iNdEx = __goscriptTuple8[1]
					err = __goscriptTuple8[2]
					msglen = $.int(_v)
					if (err != null) {
						return err
					}
					if (msglen < 0) {
						return protobuf_go_lite.ErrInvalidLength
					}
					let postIndex = iNdEx + msglen
					if (postIndex < 0) {
						return protobuf_go_lite.ErrInvalidLength
					}
					if (postIndex > l) {
						return io.ErrUnexpectedEOF
					}
					{
						let __goscriptTuple9: any = $.typeAssertTuple<RpcStreamPacket_Ack | $.VarRef<RpcStreamPacket_Ack> | null>($.pointerValue<RpcStreamPacket>(m).Body, { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Ack" })
						let oneof: RpcStreamPacket_Ack | $.VarRef<RpcStreamPacket_Ack> | null = __goscriptTuple9[0]
						let ok = __goscriptTuple9[1]
						if (ok) {
							{
								let __goscriptShadow8 = RpcAck.prototype.UnmarshalVT.call($.pointerValue<RpcStreamPacket_Ack>(oneof).Ack, $.goSlice(dAtA, iNdEx, postIndex))
								if (__goscriptShadow8 != null) {
									return __goscriptShadow8
								}
							}
						} else {
							let v: RpcAck | $.VarRef<RpcAck> | null = new RpcAck()
							{
								let __goscriptShadow9 = RpcAck.prototype.UnmarshalVT.call(v, $.goSlice(dAtA, iNdEx, postIndex))
								if (__goscriptShadow9 != null) {
									return __goscriptShadow9
								}
							}
							$.pointerValue<RpcStreamPacket>(m).Body = $.interfaceValue<isRpcStreamPacket_Body | null>(new RpcStreamPacket_Ack({Ack: v}), "*rpcstream.RpcStreamPacket_Ack")
						}
					}
					iNdEx = postIndex
					break
				}
				case 3:
				{
					if (wireType != 2) {
						return fmt.Errorf("proto: wrong wireType = %d for field Data", $.namedValueInterfaceValue<any>(wireType, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
					}
					let byteLen: number = 0
					let _v: bigint = 0n
					let __goscriptTuple10: any = protobuf_go_lite.DecodeVarint(dAtA, iNdEx)
					_v = __goscriptTuple10[0]
					iNdEx = __goscriptTuple10[1]
					err = __goscriptTuple10[2]
					byteLen = $.int(_v)
					if (err != null) {
						return err
					}
					if (byteLen < 0) {
						return protobuf_go_lite.ErrInvalidLength
					}
					let postIndex = iNdEx + byteLen
					if (postIndex < 0) {
						return protobuf_go_lite.ErrInvalidLength
					}
					if (postIndex > l) {
						return io.ErrUnexpectedEOF
					}
					let v: $.Slice<number> = $.makeSlice<number>(postIndex - iNdEx, undefined, "byte")
					$.copy(v, $.goSlice(dAtA, iNdEx, postIndex))
					$.pointerValue<RpcStreamPacket>(m).Body = $.interfaceValue<isRpcStreamPacket_Body | null>(new RpcStreamPacket_Data({Data: v}), "*rpcstream.RpcStreamPacket_Data")
					iNdEx = postIndex
					break
				}
				default:
				{
					iNdEx = preIndex
					let [skippy, __goscriptShadow10] = protobuf_go_lite.Skip($.goSlice(dAtA, iNdEx, undefined))
					if (__goscriptShadow10 != null) {
						return __goscriptShadow10
					}
					if ((skippy < 0) || ((iNdEx + skippy) < 0)) {
						return protobuf_go_lite.ErrInvalidLength
					}
					if ((iNdEx + skippy) > l) {
						return io.ErrUnexpectedEOF
					}
					$.pointerValue<RpcStreamPacket>(m).unknownFields = $.appendSlice($.pointerValue<RpcStreamPacket>(m).unknownFields, $.goSlice(dAtA, iNdEx, iNdEx + skippy))
					iNdEx = iNdEx + (skippy)
					break
				}
			}
		}

		if (iNdEx > l) {
			return io.ErrUnexpectedEOF
		}
		return null
	}

	static __typeInfo = $.registerStructType(
		"rpcstream.RpcStreamPacket",
		() => new RpcStreamPacket(),
		[{ name: "CloneMessageVT", args: [], returns: [{ name: "_r0", type: "protobuf_go_lite.CloneMessage" }] }, { name: "CloneVT", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket" } }] }, { name: "EqualMessageVT", args: [{ name: "thatMsg", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "EqualVT", args: [{ name: "that", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "GetAck", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcAck" } }] }, { name: "GetBody", args: [], returns: [{ name: "_r0", type: "rpcstream.isRpcStreamPacket_Body" }] }, { name: "GetData", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "GetInit", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamInit" } }] }, { name: "MarshalJSON", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "MarshalProtoJSON", args: [{ name: "s", type: { kind: $.TypeKind.Pointer, elemType: "json.MarshalState" } }], returns: [] }, { name: "MarshalProtoText", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "MarshalToSizedBufferVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "MarshalToVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "MarshalVT", args: [], returns: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }, { name: "ProtoMessage", args: [], returns: [] }, { name: "Reset", args: [], returns: [] }, { name: "SizeVT", args: [], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "UnmarshalJSON", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "UnmarshalProtoJSON", args: [{ name: "s", type: { kind: $.TypeKind.Pointer, elemType: "json.UnmarshalState" } }], returns: [] }, { name: "UnmarshalVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }],
		RpcStreamPacket,
		[{ name: "unknownFields", key: "unknownFields", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "github.com/aperturerobotics/starpc/rpcstream", index: [0], offset: 0, exported: false }, { name: "Body", key: "Body", type: "rpcstream.isRpcStreamPacket_Body", tag: "protobuf_oneof:\"body\"", index: [1], offset: 24, exported: true }]
	)
}

export class RpcStreamPacket_Init {
	// Init is the first packet in the stream.
	// Sent by the initiator.
	public get Init(): RpcStreamInit | $.VarRef<RpcStreamInit> | null {
		return this._fields.Init.value
	}
	public set Init(value: RpcStreamInit | $.VarRef<RpcStreamInit> | null) {
		this._fields.Init.value = value
	}

	public _fields: {
		Init: $.VarRef<RpcStreamInit | $.VarRef<RpcStreamInit> | null>
	}

	constructor(init?: Partial<{Init?: RpcStreamInit | $.VarRef<RpcStreamInit> | null}>) {
		this._fields = {
			Init: $.varRef(init?.Init ?? (null as RpcStreamInit | $.VarRef<RpcStreamInit> | null))
		}
	}

	public clone(): RpcStreamPacket_Init {
		const cloned = new RpcStreamPacket_Init()
		cloned._fields = {
			Init: $.varRef(this._fields.Init.value)
		}
		return $.markAsStructValue(cloned)
	}

	public CloneOneofVT(): isRpcStreamPacket_Body | null {
		const m: RpcStreamPacket_Init | $.VarRef<RpcStreamPacket_Init> | null = this
		return $.interfaceValue<isRpcStreamPacket_Body | null>(RpcStreamPacket_Init.prototype.CloneVT.call(m), "*rpcstream.RpcStreamPacket_Init")
	}

	public CloneVT(): RpcStreamPacket_Init | $.VarRef<RpcStreamPacket_Init> | null {
		const m: RpcStreamPacket_Init | $.VarRef<RpcStreamPacket_Init> | null = this
		if (m == null) {
			return null
		}
		let r: RpcStreamPacket_Init | $.VarRef<RpcStreamPacket_Init> | null = new RpcStreamPacket_Init()
		$.pointerValue<RpcStreamPacket_Init>(r).Init = RpcStreamInit.prototype.CloneVT.call($.pointerValue<RpcStreamPacket_Init>(m).Init)
		return r
	}

	public EqualVT(thatIface: isRpcStreamPacket_Body | null): boolean {
		const _this: RpcStreamPacket_Init | $.VarRef<RpcStreamPacket_Init> | null = this
		let __goscriptTuple11: any = $.typeAssertTuple<RpcStreamPacket_Init | $.VarRef<RpcStreamPacket_Init> | null>(thatIface, { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Init" })
		let that: RpcStreamPacket_Init | $.VarRef<RpcStreamPacket_Init> | null = __goscriptTuple11[0]
		let ok = __goscriptTuple11[1]
		if (!ok) {
			return false
		}
		if (_this == that) {
			return true
		}
		if (((_this == null) && (that != null)) || ((_this != null) && (that == null))) {
			return false
		}
		{
			let p: RpcStreamInit | $.VarRef<RpcStreamInit> | null = $.pointerValue<RpcStreamPacket_Init>(_this).Init
			let q: RpcStreamInit | $.VarRef<RpcStreamInit> | null = $.pointerValue<RpcStreamPacket_Init>(that).Init
			if (p != q) {
				if (p == null) {
					p = new RpcStreamInit()
				}
				if (q == null) {
					q = new RpcStreamInit()
				}
				if (!RpcStreamInit.prototype.EqualVT.call(p, q)) {
					return false
				}
			}
		}
		return true
	}

	public MarshalToSizedBufferVT(dAtA: $.Slice<number>): [number, $.GoError] {
		const m: RpcStreamPacket_Init | $.VarRef<RpcStreamPacket_Init> | null = this
		let i = $.len(dAtA)
		if ($.pointerValue<RpcStreamPacket_Init>(m).Init != null) {
			let [size, err] = RpcStreamInit.prototype.MarshalToSizedBufferVT.call($.pointerValue<RpcStreamPacket_Init>(m).Init, $.goSlice(dAtA, undefined, i))
			if (err != null) {
				return [0, err]
			}
			i = i - (size)
			i = protobuf_go_lite.EncodeVarint(dAtA, i, $.uint64(size))
			i--
			dAtA![i] = $.uint(0xa, 8)
		} else {
			i = protobuf_go_lite.EncodeVarint(dAtA, i, 0n)
			i--
			dAtA![i] = $.uint(0xa, 8)
		}
		return [$.len(dAtA) - i, null]
	}

	public MarshalToVT(dAtA: $.Slice<number>): [number, $.GoError] {
		const m: RpcStreamPacket_Init | $.VarRef<RpcStreamPacket_Init> | null = this
		let size = RpcStreamPacket_Init.prototype.SizeVT.call(m)
		return RpcStreamPacket_Init.prototype.MarshalToSizedBufferVT.call(m, $.goSlice(dAtA, undefined, size))
	}

	public SizeVT(): number {
		const m: RpcStreamPacket_Init | $.VarRef<RpcStreamPacket_Init> | null = this
		let n: number = 0
		if (m == null) {
			return 0
		}
		let l: number = 0
		l
		if ($.pointerValue<RpcStreamPacket_Init>(m).Init != null) {
			l = RpcStreamInit.prototype.SizeVT.call($.pointerValue<RpcStreamPacket_Init>(m).Init)
			n = n + ((1 + l) + protobuf_go_lite.SizeOfVarint($.uint64(l)))
		} else {
			n = n + (2)
		}
		return n
	}

	public isRpcStreamPacket_Body(): void {
	}

	static __typeInfo = $.registerStructType(
		"rpcstream.RpcStreamPacket_Init",
		() => new RpcStreamPacket_Init(),
		[{ name: "CloneOneofVT", args: [], returns: [{ name: "_r0", type: "rpcstream.isRpcStreamPacket_Body" }] }, { name: "CloneVT", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Init" } }] }, { name: "EqualVT", args: [{ name: "thatIface", type: "rpcstream.isRpcStreamPacket_Body" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "MarshalToSizedBufferVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "MarshalToVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "SizeVT", args: [], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "isRpcStreamPacket_Body", args: [], returns: [] }],
		RpcStreamPacket_Init,
		[{ name: "Init", key: "Init", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamInit" }, tag: "protobuf:\"bytes,1,opt,name=init,proto3,oneof\"", index: [0], offset: 0, exported: true }]
	)
}

export class RpcStreamPacket_Ack {
	// Ack is sent in response to Init.
	// Sent by the server.
	public get Ack(): RpcAck | $.VarRef<RpcAck> | null {
		return this._fields.Ack.value
	}
	public set Ack(value: RpcAck | $.VarRef<RpcAck> | null) {
		this._fields.Ack.value = value
	}

	public _fields: {
		Ack: $.VarRef<RpcAck | $.VarRef<RpcAck> | null>
	}

	constructor(init?: Partial<{Ack?: RpcAck | $.VarRef<RpcAck> | null}>) {
		this._fields = {
			Ack: $.varRef(init?.Ack ?? (null as RpcAck | $.VarRef<RpcAck> | null))
		}
	}

	public clone(): RpcStreamPacket_Ack {
		const cloned = new RpcStreamPacket_Ack()
		cloned._fields = {
			Ack: $.varRef(this._fields.Ack.value)
		}
		return $.markAsStructValue(cloned)
	}

	public CloneOneofVT(): isRpcStreamPacket_Body | null {
		const m: RpcStreamPacket_Ack | $.VarRef<RpcStreamPacket_Ack> | null = this
		return $.interfaceValue<isRpcStreamPacket_Body | null>(RpcStreamPacket_Ack.prototype.CloneVT.call(m), "*rpcstream.RpcStreamPacket_Ack")
	}

	public CloneVT(): RpcStreamPacket_Ack | $.VarRef<RpcStreamPacket_Ack> | null {
		const m: RpcStreamPacket_Ack | $.VarRef<RpcStreamPacket_Ack> | null = this
		if (m == null) {
			return null
		}
		let r: RpcStreamPacket_Ack | $.VarRef<RpcStreamPacket_Ack> | null = new RpcStreamPacket_Ack()
		$.pointerValue<RpcStreamPacket_Ack>(r).Ack = RpcAck.prototype.CloneVT.call($.pointerValue<RpcStreamPacket_Ack>(m).Ack)
		return r
	}

	public EqualVT(thatIface: isRpcStreamPacket_Body | null): boolean {
		const _this: RpcStreamPacket_Ack | $.VarRef<RpcStreamPacket_Ack> | null = this
		let __goscriptTuple12: any = $.typeAssertTuple<RpcStreamPacket_Ack | $.VarRef<RpcStreamPacket_Ack> | null>(thatIface, { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Ack" })
		let that: RpcStreamPacket_Ack | $.VarRef<RpcStreamPacket_Ack> | null = __goscriptTuple12[0]
		let ok = __goscriptTuple12[1]
		if (!ok) {
			return false
		}
		if (_this == that) {
			return true
		}
		if (((_this == null) && (that != null)) || ((_this != null) && (that == null))) {
			return false
		}
		{
			let p: RpcAck | $.VarRef<RpcAck> | null = $.pointerValue<RpcStreamPacket_Ack>(_this).Ack
			let q: RpcAck | $.VarRef<RpcAck> | null = $.pointerValue<RpcStreamPacket_Ack>(that).Ack
			if (p != q) {
				if (p == null) {
					p = new RpcAck()
				}
				if (q == null) {
					q = new RpcAck()
				}
				if (!RpcAck.prototype.EqualVT.call(p, q)) {
					return false
				}
			}
		}
		return true
	}

	public MarshalToSizedBufferVT(dAtA: $.Slice<number>): [number, $.GoError] {
		const m: RpcStreamPacket_Ack | $.VarRef<RpcStreamPacket_Ack> | null = this
		let i = $.len(dAtA)
		if ($.pointerValue<RpcStreamPacket_Ack>(m).Ack != null) {
			let [size, err] = RpcAck.prototype.MarshalToSizedBufferVT.call($.pointerValue<RpcStreamPacket_Ack>(m).Ack, $.goSlice(dAtA, undefined, i))
			if (err != null) {
				return [0, err]
			}
			i = i - (size)
			i = protobuf_go_lite.EncodeVarint(dAtA, i, $.uint64(size))
			i--
			dAtA![i] = $.uint(0x12, 8)
		} else {
			i = protobuf_go_lite.EncodeVarint(dAtA, i, 0n)
			i--
			dAtA![i] = $.uint(0x12, 8)
		}
		return [$.len(dAtA) - i, null]
	}

	public MarshalToVT(dAtA: $.Slice<number>): [number, $.GoError] {
		const m: RpcStreamPacket_Ack | $.VarRef<RpcStreamPacket_Ack> | null = this
		let size = RpcStreamPacket_Ack.prototype.SizeVT.call(m)
		return RpcStreamPacket_Ack.prototype.MarshalToSizedBufferVT.call(m, $.goSlice(dAtA, undefined, size))
	}

	public SizeVT(): number {
		const m: RpcStreamPacket_Ack | $.VarRef<RpcStreamPacket_Ack> | null = this
		let n: number = 0
		if (m == null) {
			return 0
		}
		let l: number = 0
		l
		if ($.pointerValue<RpcStreamPacket_Ack>(m).Ack != null) {
			l = RpcAck.prototype.SizeVT.call($.pointerValue<RpcStreamPacket_Ack>(m).Ack)
			n = n + ((1 + l) + protobuf_go_lite.SizeOfVarint($.uint64(l)))
		} else {
			n = n + (2)
		}
		return n
	}

	public isRpcStreamPacket_Body(): void {
	}

	static __typeInfo = $.registerStructType(
		"rpcstream.RpcStreamPacket_Ack",
		() => new RpcStreamPacket_Ack(),
		[{ name: "CloneOneofVT", args: [], returns: [{ name: "_r0", type: "rpcstream.isRpcStreamPacket_Body" }] }, { name: "CloneVT", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Ack" } }] }, { name: "EqualVT", args: [{ name: "thatIface", type: "rpcstream.isRpcStreamPacket_Body" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "MarshalToSizedBufferVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "MarshalToVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "SizeVT", args: [], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "isRpcStreamPacket_Body", args: [], returns: [] }],
		RpcStreamPacket_Ack,
		[{ name: "Ack", key: "Ack", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcAck" }, tag: "protobuf:\"bytes,2,opt,name=ack,proto3,oneof\"", index: [0], offset: 0, exported: true }]
	)
}

export class RpcStreamPacket_Data {
	// Data is the encapsulated data packet.
	public get Data(): $.Slice<number> {
		return this._fields.Data.value
	}
	public set Data(value: $.Slice<number>) {
		this._fields.Data.value = value
	}

	public _fields: {
		Data: $.VarRef<$.Slice<number>>
	}

	constructor(init?: Partial<{Data?: $.Slice<number>}>) {
		this._fields = {
			Data: $.varRef(init?.Data ?? (null as $.Slice<number>))
		}
	}

	public clone(): RpcStreamPacket_Data {
		const cloned = new RpcStreamPacket_Data()
		cloned._fields = {
			Data: $.varRef(this._fields.Data.value)
		}
		return $.markAsStructValue(cloned)
	}

	public CloneOneofVT(): isRpcStreamPacket_Body | null {
		const m: RpcStreamPacket_Data | $.VarRef<RpcStreamPacket_Data> | null = this
		return $.interfaceValue<isRpcStreamPacket_Body | null>(RpcStreamPacket_Data.prototype.CloneVT.call(m), "*rpcstream.RpcStreamPacket_Data")
	}

	public CloneVT(): RpcStreamPacket_Data | $.VarRef<RpcStreamPacket_Data> | null {
		const m: RpcStreamPacket_Data | $.VarRef<RpcStreamPacket_Data> | null = this
		if (m == null) {
			return null
		}
		let r: RpcStreamPacket_Data | $.VarRef<RpcStreamPacket_Data> | null = new RpcStreamPacket_Data()
		{
			let rhs: $.Slice<number> = $.pointerValue<RpcStreamPacket_Data>(m).Data
			if (rhs != null) {
				$.pointerValue<RpcStreamPacket_Data>(r).Data = (slices.Clone(rhs) as $.Slice<number>)
			}
		}
		return r
	}

	public EqualVT(thatIface: isRpcStreamPacket_Body | null): boolean {
		const _this: RpcStreamPacket_Data | $.VarRef<RpcStreamPacket_Data> | null = this
		let __goscriptTuple13: any = $.typeAssertTuple<RpcStreamPacket_Data | $.VarRef<RpcStreamPacket_Data> | null>(thatIface, { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Data" })
		let that: RpcStreamPacket_Data | $.VarRef<RpcStreamPacket_Data> | null = __goscriptTuple13[0]
		let ok = __goscriptTuple13[1]
		if (!ok) {
			return false
		}
		if (_this == that) {
			return true
		}
		if (((_this == null) && (that != null)) || ((_this != null) && (that == null))) {
			return false
		}
		if (!$.stringEqual($.bytesToString($.pointerValue<RpcStreamPacket_Data>(_this).Data), $.bytesToString($.pointerValue<RpcStreamPacket_Data>(that).Data))) {
			return false
		}
		return true
	}

	public MarshalToSizedBufferVT(dAtA: $.Slice<number>): [number, $.GoError] {
		const m: RpcStreamPacket_Data | $.VarRef<RpcStreamPacket_Data> | null = this
		let i = $.len(dAtA)
		i = i - ($.len($.pointerValue<RpcStreamPacket_Data>(m).Data))
		$.copy($.goSlice(dAtA, i, undefined), $.pointerValue<RpcStreamPacket_Data>(m).Data)
		i = protobuf_go_lite.EncodeVarint(dAtA, i, $.uint64($.len($.pointerValue<RpcStreamPacket_Data>(m).Data)))
		i--
		dAtA![i] = $.uint(0x1a, 8)
		return [$.len(dAtA) - i, null]
	}

	public MarshalToVT(dAtA: $.Slice<number>): [number, $.GoError] {
		const m: RpcStreamPacket_Data | $.VarRef<RpcStreamPacket_Data> | null = this
		let size = RpcStreamPacket_Data.prototype.SizeVT.call(m)
		return RpcStreamPacket_Data.prototype.MarshalToSizedBufferVT.call(m, $.goSlice(dAtA, undefined, size))
	}

	public SizeVT(): number {
		const m: RpcStreamPacket_Data | $.VarRef<RpcStreamPacket_Data> | null = this
		let n: number = 0
		if (m == null) {
			return 0
		}
		let l: number = 0
		l
		l = $.len($.pointerValue<RpcStreamPacket_Data>(m).Data)
		n = n + ((1 + l) + protobuf_go_lite.SizeOfVarint($.uint64(l)))
		return n
	}

	public isRpcStreamPacket_Body(): void {
	}

	static __typeInfo = $.registerStructType(
		"rpcstream.RpcStreamPacket_Data",
		() => new RpcStreamPacket_Data(),
		[{ name: "CloneOneofVT", args: [], returns: [{ name: "_r0", type: "rpcstream.isRpcStreamPacket_Body" }] }, { name: "CloneVT", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamPacket_Data" } }] }, { name: "EqualVT", args: [{ name: "thatIface", type: "rpcstream.isRpcStreamPacket_Body" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "MarshalToSizedBufferVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "MarshalToVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "SizeVT", args: [], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "isRpcStreamPacket_Body", args: [], returns: [] }],
		RpcStreamPacket_Data,
		[{ name: "Data", key: "Data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, tag: "protobuf:\"bytes,3,opt,name=data,proto3,oneof\"", index: [0], offset: 0, exported: true }]
	)
}

export class RpcStreamInit {
	public get unknownFields(): $.Slice<number> {
		return this._fields.unknownFields.value
	}
	public set unknownFields(value: $.Slice<number>) {
		this._fields.unknownFields.value = value
	}

	// ComponentId is the identifier of the component making the request.
	public get ComponentId(): string {
		return this._fields.ComponentId.value
	}
	public set ComponentId(value: string) {
		this._fields.ComponentId.value = value
	}

	public _fields: {
		unknownFields: $.VarRef<$.Slice<number>>
		ComponentId: $.VarRef<string>
	}

	constructor(init?: Partial<{unknownFields?: $.Slice<number>, ComponentId?: string}>) {
		this._fields = {
			unknownFields: $.varRef(init?.unknownFields ?? (null as $.Slice<number>)),
			ComponentId: $.varRef(init?.ComponentId ?? ("" as string))
		}
	}

	public clone(): RpcStreamInit {
		const cloned = new RpcStreamInit()
		cloned._fields = {
			unknownFields: $.varRef(this._fields.unknownFields.value),
			ComponentId: $.varRef(this._fields.ComponentId.value)
		}
		return $.markAsStructValue(cloned)
	}

	public CloneMessageVT(): protobuf_go_lite.CloneMessage | null {
		const m: RpcStreamInit | $.VarRef<RpcStreamInit> | null = this
		return $.interfaceValue<protobuf_go_lite.CloneMessage | null>(RpcStreamInit.prototype.CloneVT.call(m), "*rpcstream.RpcStreamInit")
	}

	public CloneVT(): RpcStreamInit | $.VarRef<RpcStreamInit> | null {
		const m: RpcStreamInit | $.VarRef<RpcStreamInit> | null = this
		if (m == null) {
			return null
		}
		let r: RpcStreamInit | $.VarRef<RpcStreamInit> | null = new RpcStreamInit()
		$.pointerValue<RpcStreamInit>(r).ComponentId = $.pointerValue<RpcStreamInit>(m).ComponentId
		if ($.len($.pointerValue<RpcStreamInit>(m).unknownFields) > 0) {
			$.pointerValue<RpcStreamInit>(r).unknownFields = (slices.Clone($.pointerValue<RpcStreamInit>(m).unknownFields) as $.Slice<number>)
		}
		return r
	}

	public EqualMessageVT(thatMsg: any): boolean {
		const _this: RpcStreamInit | $.VarRef<RpcStreamInit> | null = this
		let __goscriptTuple14: any = $.typeAssertTuple<RpcStreamInit | $.VarRef<RpcStreamInit> | null>(thatMsg, { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamInit" })
		let that: RpcStreamInit | $.VarRef<RpcStreamInit> | null = __goscriptTuple14[0]
		let ok = __goscriptTuple14[1]
		if (!ok) {
			return false
		}
		return RpcStreamInit.prototype.EqualVT.call(_this, that)
	}

	public EqualVT(that: RpcStreamInit | $.VarRef<RpcStreamInit> | null): boolean {
		const _this: RpcStreamInit | $.VarRef<RpcStreamInit> | null = this
		if (_this == that) {
			return true
		} else {
			if ((_this == null) || (that == null)) {
				return false
			}
		}
		if (!$.stringEqual($.pointerValue<RpcStreamInit>(_this).ComponentId, $.pointerValue<RpcStreamInit>(that).ComponentId)) {
			return false
		}
		return $.stringEqual($.bytesToString($.pointerValue<RpcStreamInit>(_this).unknownFields), $.bytesToString($.pointerValue<RpcStreamInit>(that).unknownFields))
	}

	public GetComponentId(): string {
		const x: RpcStreamInit | $.VarRef<RpcStreamInit> | null = this
		if (x != null) {
			return $.pointerValue<RpcStreamInit>(x).ComponentId
		}
		return ""
	}

	public MarshalJSON(): [$.Slice<number>, $.GoError] {
		const x: RpcStreamInit | $.VarRef<RpcStreamInit> | null = this
		return $.markAsStructValue($.cloneStructValue($.pointerValue<json.MarshalerConfig>(json.DefaultMarshalerConfig))).Marshal($.pointerValueOrNil($.interfaceValue<json.Marshaler | null>(x, "*rpcstream.RpcStreamInit"))!)
	}

	public MarshalProtoJSON(s: json.MarshalState | $.VarRef<json.MarshalState> | null): void {
		const x: RpcStreamInit | $.VarRef<RpcStreamInit> | null = this
		if (x == null) {
			json.MarshalState.prototype.WriteNil.call($.pointerValue<json.MarshalState>(s))
			return
		}
		json.MarshalState.prototype.WriteObjectStart.call($.pointerValue<json.MarshalState>(s))
		let wroteField: $.VarRef<boolean> = $.varRef(false)
		if ((!$.stringEqual($.pointerValue<RpcStreamInit>(x).ComponentId, "")) || json.MarshalState.prototype.HasField.call($.pointerValue<json.MarshalState>(s), "componentId")) {
			json.MarshalState.prototype.WriteMoreIf.call($.pointerValue<json.MarshalState>(s), wroteField)
			json.MarshalState.prototype.WriteObjectField.call($.pointerValue<json.MarshalState>(s), "componentId")
			json.MarshalState.prototype.WriteString.call($.pointerValue<json.MarshalState>(s), $.pointerValue<RpcStreamInit>(x).ComponentId)
		}
		json.MarshalState.prototype.WriteObjectEnd.call($.pointerValue<json.MarshalState>(s))
	}

	public MarshalProtoText(): string {
		const x: RpcStreamInit | $.VarRef<RpcStreamInit> | null = this
		let sb: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
		sb.value.WriteString("RpcStreamInit {")
		if (!$.stringEqual($.pointerValue<RpcStreamInit>(x).ComponentId, "")) {
			if (sb.value.Len() > 15) {
				sb.value.WriteString(" ")
			}
			sb.value.WriteString("component_id: ")
			sb.value.WriteString(strconv.Quote($.pointerValue<RpcStreamInit>(x).ComponentId))
		}
		sb.value.WriteString("}")
		return sb.value.String()
	}

	public MarshalToSizedBufferVT(dAtA: $.Slice<number>): [number, $.GoError] {
		const m: RpcStreamInit | $.VarRef<RpcStreamInit> | null = this
		if (m == null) {
			return [0, null]
		}
		let i = $.len(dAtA)
		i
		let l: number = 0
		l
		if ($.pointerValue<RpcStreamInit>(m).unknownFields != null) {
			i = i - ($.len($.pointerValue<RpcStreamInit>(m).unknownFields))
			$.copy($.goSlice(dAtA, i, undefined), $.pointerValue<RpcStreamInit>(m).unknownFields)
		}
		if ($.len($.pointerValue<RpcStreamInit>(m).ComponentId) > 0) {
			i = i - ($.len($.pointerValue<RpcStreamInit>(m).ComponentId))
			$.copy($.goSlice(dAtA, i, undefined), $.pointerValue<RpcStreamInit>(m).ComponentId)
			i = protobuf_go_lite.EncodeVarint(dAtA, i, $.uint64($.len($.pointerValue<RpcStreamInit>(m).ComponentId)))
			i--
			dAtA![i] = $.uint(0xa, 8)
		}
		return [$.len(dAtA) - i, null]
	}

	public MarshalToVT(dAtA: $.Slice<number>): [number, $.GoError] {
		const m: RpcStreamInit | $.VarRef<RpcStreamInit> | null = this
		let size = RpcStreamInit.prototype.SizeVT.call(m)
		return RpcStreamInit.prototype.MarshalToSizedBufferVT.call(m, $.goSlice(dAtA, undefined, size))
	}

	public MarshalVT(): [$.Slice<number>, $.GoError] {
		const m: RpcStreamInit | $.VarRef<RpcStreamInit> | null = this
		let dAtA: $.Slice<number> = null as $.Slice<number>
		let err: $.GoError = null as $.GoError
		if (m == null) {
			return [null, null]
		}
		let size = RpcStreamInit.prototype.SizeVT.call(m)
		dAtA = $.makeSlice<number>(size, undefined, "byte")
		let __goscriptTuple15: any = RpcStreamInit.prototype.MarshalToSizedBufferVT.call(m, $.goSlice(dAtA, undefined, size))
		let n = __goscriptTuple15[0]
		err = __goscriptTuple15[1]
		if (err != null) {
			return [null, err]
		}
		return [$.goSlice(dAtA, undefined, n), null]
	}

	public ProtoMessage(): void {
	}

	public Reset(): void {
		let x: RpcStreamInit | $.VarRef<RpcStreamInit> | null = this
		$.assignStruct($.pointerValue<RpcStreamInit>(x), $.markAsStructValue(new RpcStreamInit()))
	}

	public SizeVT(): number {
		const m: RpcStreamInit | $.VarRef<RpcStreamInit> | null = this
		let n: number = 0
		if (m == null) {
			return 0
		}
		let l: number = 0
		l
		l = $.len($.pointerValue<RpcStreamInit>(m).ComponentId)
		if (l > 0) {
			n = n + ((1 + l) + protobuf_go_lite.SizeOfVarint($.uint64(l)))
		}
		n = n + ($.len($.pointerValue<RpcStreamInit>(m).unknownFields))
		return n
	}

	public String(): string {
		const x: RpcStreamInit | $.VarRef<RpcStreamInit> | null = this
		return RpcStreamInit.prototype.MarshalProtoText.call(x)
	}

	public UnmarshalJSON(b: $.Slice<number>): $.GoError {
		const x: RpcStreamInit | $.VarRef<RpcStreamInit> | null = this
		return $.markAsStructValue($.cloneStructValue($.pointerValue<json.UnmarshalerConfig>(json.DefaultUnmarshalerConfig))).Unmarshal(b, $.pointerValueOrNil($.interfaceValue<json.Unmarshaler | null>(x, "*rpcstream.RpcStreamInit"))!)
	}

	public UnmarshalProtoJSON(s: json.UnmarshalState | $.VarRef<json.UnmarshalState> | null): void {
		const x: RpcStreamInit | $.VarRef<RpcStreamInit> | null = this
		if (json.UnmarshalState.prototype.ReadNil.call($.pointerValue<json.UnmarshalState>(s))) {
			return
		}
		json.UnmarshalState.prototype.ReadObject.call($.pointerValue<json.UnmarshalState>(s), $.functionValue((key: string): void => {
			switch (key) {
				default:
				{
					json.UnmarshalState.prototype.Skip.call($.pointerValue<json.UnmarshalState>(s))
					break
				}
				case "component_id":
				case "componentId":
				{
					json.UnmarshalState.prototype.AddField.call($.pointerValue<json.UnmarshalState>(s), "component_id")
					$.pointerValue<RpcStreamInit>(x).ComponentId = json.UnmarshalState.prototype.ReadString.call($.pointerValue<json.UnmarshalState>(s))
					break
				}
			}
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [] } as $.FunctionTypeInfo)))
	}

	public UnmarshalVT(dAtA: $.Slice<number>): $.GoError {
		let m: RpcStreamInit | $.VarRef<RpcStreamInit> | null = this
		let l = $.len(dAtA)
		let iNdEx = 0
		let err: $.GoError = null as $.GoError
		while (iNdEx < l) {
			let preIndex = iNdEx
			let wire: bigint = 0n
			let __goscriptTuple16: any = protobuf_go_lite.DecodeVarint(dAtA, iNdEx)
			wire = __goscriptTuple16[0]
			iNdEx = __goscriptTuple16[1]
			err = __goscriptTuple16[2]
			if (err != null) {
				return err
			}
			let fieldNum = $.int($.int($.uint64Shr(wire, 3), 32), 32)
			let wireType = $.int($.uint64And(wire, 0x7))
			if (wireType == 4) {
				return fmt.Errorf("proto: RpcStreamInit: wiretype end group for non-group")
			}
			if ($.int(fieldNum, 32) <= $.int(0, 32)) {
				return fmt.Errorf("proto: RpcStreamInit: illegal tag %d (wire type %d)", $.namedValueInterfaceValue<any>(fieldNum, "int32", {}, { kind: $.TypeKind.Basic, name: "int32" }), $.namedValueInterfaceValue<any>(wire, "uint64", {}, { kind: $.TypeKind.Basic, name: "uint64" }))
			}
			switch (fieldNum) {
				case 1:
				{
					if (wireType != 2) {
						return fmt.Errorf("proto: wrong wireType = %d for field ComponentId", $.namedValueInterfaceValue<any>(wireType, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
					}
					let stringLen: bigint = 0n
					let __goscriptTuple17: any = protobuf_go_lite.DecodeVarint(dAtA, iNdEx)
					stringLen = __goscriptTuple17[0]
					iNdEx = __goscriptTuple17[1]
					err = __goscriptTuple17[2]
					if (err != null) {
						return err
					}
					let intStringLen = $.int(stringLen)
					if (intStringLen < 0) {
						return protobuf_go_lite.ErrInvalidLength
					}
					let postIndex = iNdEx + intStringLen
					if (postIndex < 0) {
						return protobuf_go_lite.ErrInvalidLength
					}
					if (postIndex > l) {
						return io.ErrUnexpectedEOF
					}
					$.pointerValue<RpcStreamInit>(m).ComponentId = $.bytesToString($.goSlice(dAtA, iNdEx, postIndex))
					iNdEx = postIndex
					break
				}
				default:
				{
					iNdEx = preIndex
					let [skippy, __goscriptShadow11] = protobuf_go_lite.Skip($.goSlice(dAtA, iNdEx, undefined))
					if (__goscriptShadow11 != null) {
						return __goscriptShadow11
					}
					if ((skippy < 0) || ((iNdEx + skippy) < 0)) {
						return protobuf_go_lite.ErrInvalidLength
					}
					if ((iNdEx + skippy) > l) {
						return io.ErrUnexpectedEOF
					}
					$.pointerValue<RpcStreamInit>(m).unknownFields = $.appendSlice($.pointerValue<RpcStreamInit>(m).unknownFields, $.goSlice(dAtA, iNdEx, iNdEx + skippy))
					iNdEx = iNdEx + (skippy)
					break
				}
			}
		}

		if (iNdEx > l) {
			return io.ErrUnexpectedEOF
		}
		return null
	}

	static __typeInfo = $.registerStructType(
		"rpcstream.RpcStreamInit",
		() => new RpcStreamInit(),
		[{ name: "CloneMessageVT", args: [], returns: [{ name: "_r0", type: "protobuf_go_lite.CloneMessage" }] }, { name: "CloneVT", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamInit" } }] }, { name: "EqualMessageVT", args: [{ name: "thatMsg", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "EqualVT", args: [{ name: "that", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcStreamInit" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "GetComponentId", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "MarshalJSON", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "MarshalProtoJSON", args: [{ name: "s", type: { kind: $.TypeKind.Pointer, elemType: "json.MarshalState" } }], returns: [] }, { name: "MarshalProtoText", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "MarshalToSizedBufferVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "MarshalToVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "MarshalVT", args: [], returns: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }, { name: "ProtoMessage", args: [], returns: [] }, { name: "Reset", args: [], returns: [] }, { name: "SizeVT", args: [], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "UnmarshalJSON", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "UnmarshalProtoJSON", args: [{ name: "s", type: { kind: $.TypeKind.Pointer, elemType: "json.UnmarshalState" } }], returns: [] }, { name: "UnmarshalVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }],
		RpcStreamInit,
		[{ name: "unknownFields", key: "unknownFields", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "github.com/aperturerobotics/starpc/rpcstream", index: [0], offset: 0, exported: false }, { name: "ComponentId", key: "ComponentId", type: { kind: $.TypeKind.Basic, name: "string" }, tag: "protobuf:\"bytes,1,opt,name=component_id,json=componentId,proto3\" json:\"componentId,omitempty\"", index: [1], offset: 24, exported: true }]
	)
}

export class RpcAck {
	public get unknownFields(): $.Slice<number> {
		return this._fields.unknownFields.value
	}
	public set unknownFields(value: $.Slice<number>) {
		this._fields.unknownFields.value = value
	}

	// Error indicates there was some error setting up the stream.
	public get Error(): string {
		return this._fields.Error.value
	}
	public set Error(value: string) {
		this._fields.Error.value = value
	}

	public _fields: {
		unknownFields: $.VarRef<$.Slice<number>>
		Error: $.VarRef<string>
	}

	constructor(init?: Partial<{unknownFields?: $.Slice<number>, Error?: string}>) {
		this._fields = {
			unknownFields: $.varRef(init?.unknownFields ?? (null as $.Slice<number>)),
			Error: $.varRef(init?.Error ?? ("" as string))
		}
	}

	public clone(): RpcAck {
		const cloned = new RpcAck()
		cloned._fields = {
			unknownFields: $.varRef(this._fields.unknownFields.value),
			Error: $.varRef(this._fields.Error.value)
		}
		return $.markAsStructValue(cloned)
	}

	public CloneMessageVT(): protobuf_go_lite.CloneMessage | null {
		const m: RpcAck | $.VarRef<RpcAck> | null = this
		return $.interfaceValue<protobuf_go_lite.CloneMessage | null>(RpcAck.prototype.CloneVT.call(m), "*rpcstream.RpcAck")
	}

	public CloneVT(): RpcAck | $.VarRef<RpcAck> | null {
		const m: RpcAck | $.VarRef<RpcAck> | null = this
		if (m == null) {
			return null
		}
		let r: RpcAck | $.VarRef<RpcAck> | null = new RpcAck()
		$.pointerValue<RpcAck>(r).Error = $.pointerValue<RpcAck>(m).Error
		if ($.len($.pointerValue<RpcAck>(m).unknownFields) > 0) {
			$.pointerValue<RpcAck>(r).unknownFields = (slices.Clone($.pointerValue<RpcAck>(m).unknownFields) as $.Slice<number>)
		}
		return r
	}

	public EqualMessageVT(thatMsg: any): boolean {
		const _this: RpcAck | $.VarRef<RpcAck> | null = this
		let __goscriptTuple18: any = $.typeAssertTuple<RpcAck | $.VarRef<RpcAck> | null>(thatMsg, { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcAck" })
		let that: RpcAck | $.VarRef<RpcAck> | null = __goscriptTuple18[0]
		let ok = __goscriptTuple18[1]
		if (!ok) {
			return false
		}
		return RpcAck.prototype.EqualVT.call(_this, that)
	}

	public EqualVT(that: RpcAck | $.VarRef<RpcAck> | null): boolean {
		const _this: RpcAck | $.VarRef<RpcAck> | null = this
		if (_this == that) {
			return true
		} else {
			if ((_this == null) || (that == null)) {
				return false
			}
		}
		if (!$.stringEqual($.pointerValue<RpcAck>(_this).Error, $.pointerValue<RpcAck>(that).Error)) {
			return false
		}
		return $.stringEqual($.bytesToString($.pointerValue<RpcAck>(_this).unknownFields), $.bytesToString($.pointerValue<RpcAck>(that).unknownFields))
	}

	public GetError(): string {
		const x: RpcAck | $.VarRef<RpcAck> | null = this
		if (x != null) {
			return $.pointerValue<RpcAck>(x).Error
		}
		return ""
	}

	public MarshalJSON(): [$.Slice<number>, $.GoError] {
		const x: RpcAck | $.VarRef<RpcAck> | null = this
		return $.markAsStructValue($.cloneStructValue($.pointerValue<json.MarshalerConfig>(json.DefaultMarshalerConfig))).Marshal($.pointerValueOrNil($.interfaceValue<json.Marshaler | null>(x, "*rpcstream.RpcAck"))!)
	}

	public MarshalProtoJSON(s: json.MarshalState | $.VarRef<json.MarshalState> | null): void {
		const x: RpcAck | $.VarRef<RpcAck> | null = this
		if (x == null) {
			json.MarshalState.prototype.WriteNil.call($.pointerValue<json.MarshalState>(s))
			return
		}
		json.MarshalState.prototype.WriteObjectStart.call($.pointerValue<json.MarshalState>(s))
		let wroteField: $.VarRef<boolean> = $.varRef(false)
		if ((!$.stringEqual($.pointerValue<RpcAck>(x).Error, "")) || json.MarshalState.prototype.HasField.call($.pointerValue<json.MarshalState>(s), "error")) {
			json.MarshalState.prototype.WriteMoreIf.call($.pointerValue<json.MarshalState>(s), wroteField)
			json.MarshalState.prototype.WriteObjectField.call($.pointerValue<json.MarshalState>(s), "error")
			json.MarshalState.prototype.WriteString.call($.pointerValue<json.MarshalState>(s), $.pointerValue<RpcAck>(x).Error)
		}
		json.MarshalState.prototype.WriteObjectEnd.call($.pointerValue<json.MarshalState>(s))
	}

	public MarshalProtoText(): string {
		const x: RpcAck | $.VarRef<RpcAck> | null = this
		let sb: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
		sb.value.WriteString("RpcAck {")
		if (!$.stringEqual($.pointerValue<RpcAck>(x).Error, "")) {
			if (sb.value.Len() > 8) {
				sb.value.WriteString(" ")
			}
			sb.value.WriteString("error: ")
			sb.value.WriteString(strconv.Quote($.pointerValue<RpcAck>(x).Error))
		}
		sb.value.WriteString("}")
		return sb.value.String()
	}

	public MarshalToSizedBufferVT(dAtA: $.Slice<number>): [number, $.GoError] {
		const m: RpcAck | $.VarRef<RpcAck> | null = this
		if (m == null) {
			return [0, null]
		}
		let i = $.len(dAtA)
		i
		let l: number = 0
		l
		if ($.pointerValue<RpcAck>(m).unknownFields != null) {
			i = i - ($.len($.pointerValue<RpcAck>(m).unknownFields))
			$.copy($.goSlice(dAtA, i, undefined), $.pointerValue<RpcAck>(m).unknownFields)
		}
		if ($.len($.pointerValue<RpcAck>(m).Error) > 0) {
			i = i - ($.len($.pointerValue<RpcAck>(m).Error))
			$.copy($.goSlice(dAtA, i, undefined), $.pointerValue<RpcAck>(m).Error)
			i = protobuf_go_lite.EncodeVarint(dAtA, i, $.uint64($.len($.pointerValue<RpcAck>(m).Error)))
			i--
			dAtA![i] = $.uint(0xa, 8)
		}
		return [$.len(dAtA) - i, null]
	}

	public MarshalToVT(dAtA: $.Slice<number>): [number, $.GoError] {
		const m: RpcAck | $.VarRef<RpcAck> | null = this
		let size = RpcAck.prototype.SizeVT.call(m)
		return RpcAck.prototype.MarshalToSizedBufferVT.call(m, $.goSlice(dAtA, undefined, size))
	}

	public MarshalVT(): [$.Slice<number>, $.GoError] {
		const m: RpcAck | $.VarRef<RpcAck> | null = this
		let dAtA: $.Slice<number> = null as $.Slice<number>
		let err: $.GoError = null as $.GoError
		if (m == null) {
			return [null, null]
		}
		let size = RpcAck.prototype.SizeVT.call(m)
		dAtA = $.makeSlice<number>(size, undefined, "byte")
		let __goscriptTuple19: any = RpcAck.prototype.MarshalToSizedBufferVT.call(m, $.goSlice(dAtA, undefined, size))
		let n = __goscriptTuple19[0]
		err = __goscriptTuple19[1]
		if (err != null) {
			return [null, err]
		}
		return [$.goSlice(dAtA, undefined, n), null]
	}

	public ProtoMessage(): void {
	}

	public Reset(): void {
		let x: RpcAck | $.VarRef<RpcAck> | null = this
		$.assignStruct($.pointerValue<RpcAck>(x), $.markAsStructValue(new RpcAck()))
	}

	public SizeVT(): number {
		const m: RpcAck | $.VarRef<RpcAck> | null = this
		let n: number = 0
		if (m == null) {
			return 0
		}
		let l: number = 0
		l
		l = $.len($.pointerValue<RpcAck>(m).Error)
		if (l > 0) {
			n = n + ((1 + l) + protobuf_go_lite.SizeOfVarint($.uint64(l)))
		}
		n = n + ($.len($.pointerValue<RpcAck>(m).unknownFields))
		return n
	}

	public String(): string {
		const x: RpcAck | $.VarRef<RpcAck> | null = this
		return RpcAck.prototype.MarshalProtoText.call(x)
	}

	public UnmarshalJSON(b: $.Slice<number>): $.GoError {
		const x: RpcAck | $.VarRef<RpcAck> | null = this
		return $.markAsStructValue($.cloneStructValue($.pointerValue<json.UnmarshalerConfig>(json.DefaultUnmarshalerConfig))).Unmarshal(b, $.pointerValueOrNil($.interfaceValue<json.Unmarshaler | null>(x, "*rpcstream.RpcAck"))!)
	}

	public UnmarshalProtoJSON(s: json.UnmarshalState | $.VarRef<json.UnmarshalState> | null): void {
		const x: RpcAck | $.VarRef<RpcAck> | null = this
		if (json.UnmarshalState.prototype.ReadNil.call($.pointerValue<json.UnmarshalState>(s))) {
			return
		}
		json.UnmarshalState.prototype.ReadObject.call($.pointerValue<json.UnmarshalState>(s), $.functionValue((key: string): void => {
			switch (key) {
				default:
				{
					json.UnmarshalState.prototype.Skip.call($.pointerValue<json.UnmarshalState>(s))
					break
				}
				case "error":
				{
					json.UnmarshalState.prototype.AddField.call($.pointerValue<json.UnmarshalState>(s), "error")
					$.pointerValue<RpcAck>(x).Error = json.UnmarshalState.prototype.ReadString.call($.pointerValue<json.UnmarshalState>(s))
					break
				}
			}
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [] } as $.FunctionTypeInfo)))
	}

	public UnmarshalVT(dAtA: $.Slice<number>): $.GoError {
		let m: RpcAck | $.VarRef<RpcAck> | null = this
		let l = $.len(dAtA)
		let iNdEx = 0
		let err: $.GoError = null as $.GoError
		while (iNdEx < l) {
			let preIndex = iNdEx
			let wire: bigint = 0n
			let __goscriptTuple20: any = protobuf_go_lite.DecodeVarint(dAtA, iNdEx)
			wire = __goscriptTuple20[0]
			iNdEx = __goscriptTuple20[1]
			err = __goscriptTuple20[2]
			if (err != null) {
				return err
			}
			let fieldNum = $.int($.int($.uint64Shr(wire, 3), 32), 32)
			let wireType = $.int($.uint64And(wire, 0x7))
			if (wireType == 4) {
				return fmt.Errorf("proto: RpcAck: wiretype end group for non-group")
			}
			if ($.int(fieldNum, 32) <= $.int(0, 32)) {
				return fmt.Errorf("proto: RpcAck: illegal tag %d (wire type %d)", $.namedValueInterfaceValue<any>(fieldNum, "int32", {}, { kind: $.TypeKind.Basic, name: "int32" }), $.namedValueInterfaceValue<any>(wire, "uint64", {}, { kind: $.TypeKind.Basic, name: "uint64" }))
			}
			switch (fieldNum) {
				case 1:
				{
					if (wireType != 2) {
						return fmt.Errorf("proto: wrong wireType = %d for field Error", $.namedValueInterfaceValue<any>(wireType, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
					}
					let stringLen: bigint = 0n
					let __goscriptTuple21: any = protobuf_go_lite.DecodeVarint(dAtA, iNdEx)
					stringLen = __goscriptTuple21[0]
					iNdEx = __goscriptTuple21[1]
					err = __goscriptTuple21[2]
					if (err != null) {
						return err
					}
					let intStringLen = $.int(stringLen)
					if (intStringLen < 0) {
						return protobuf_go_lite.ErrInvalidLength
					}
					let postIndex = iNdEx + intStringLen
					if (postIndex < 0) {
						return protobuf_go_lite.ErrInvalidLength
					}
					if (postIndex > l) {
						return io.ErrUnexpectedEOF
					}
					$.pointerValue<RpcAck>(m).Error = $.bytesToString($.goSlice(dAtA, iNdEx, postIndex))
					iNdEx = postIndex
					break
				}
				default:
				{
					iNdEx = preIndex
					let [skippy, __goscriptShadow12] = protobuf_go_lite.Skip($.goSlice(dAtA, iNdEx, undefined))
					if (__goscriptShadow12 != null) {
						return __goscriptShadow12
					}
					if ((skippy < 0) || ((iNdEx + skippy) < 0)) {
						return protobuf_go_lite.ErrInvalidLength
					}
					if ((iNdEx + skippy) > l) {
						return io.ErrUnexpectedEOF
					}
					$.pointerValue<RpcAck>(m).unknownFields = $.appendSlice($.pointerValue<RpcAck>(m).unknownFields, $.goSlice(dAtA, iNdEx, iNdEx + skippy))
					iNdEx = iNdEx + (skippy)
					break
				}
			}
		}

		if (iNdEx > l) {
			return io.ErrUnexpectedEOF
		}
		return null
	}

	static __typeInfo = $.registerStructType(
		"rpcstream.RpcAck",
		() => new RpcAck(),
		[{ name: "CloneMessageVT", args: [], returns: [{ name: "_r0", type: "protobuf_go_lite.CloneMessage" }] }, { name: "CloneVT", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcAck" } }] }, { name: "EqualMessageVT", args: [{ name: "thatMsg", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "EqualVT", args: [{ name: "that", type: { kind: $.TypeKind.Pointer, elemType: "rpcstream.RpcAck" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "GetError", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "MarshalJSON", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "MarshalProtoJSON", args: [{ name: "s", type: { kind: $.TypeKind.Pointer, elemType: "json.MarshalState" } }], returns: [] }, { name: "MarshalProtoText", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "MarshalToSizedBufferVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "MarshalToVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "MarshalVT", args: [], returns: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }, { name: "ProtoMessage", args: [], returns: [] }, { name: "Reset", args: [], returns: [] }, { name: "SizeVT", args: [], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "UnmarshalJSON", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "UnmarshalProtoJSON", args: [{ name: "s", type: { kind: $.TypeKind.Pointer, elemType: "json.UnmarshalState" } }], returns: [] }, { name: "UnmarshalVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }],
		RpcAck,
		[{ name: "unknownFields", key: "unknownFields", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "github.com/aperturerobotics/starpc/rpcstream", index: [0], offset: 0, exported: false }, { name: "Error", key: "Error", type: { kind: $.TypeKind.Basic, name: "string" }, tag: "protobuf:\"bytes,1,opt,name=error,proto3\" json:\"error,omitempty\"", index: [1], offset: 24, exported: true }]
	)
}

export type isRpcStreamPacket_Body = {
	isRpcStreamPacket_Body(): void
}

$.registerInterfaceType(
	"rpcstream.isRpcStreamPacket_Body",
	null,
	[{ name: "isRpcStreamPacket_Body", args: [], returns: [] }]
);
