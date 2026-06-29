// Generated file based on rpcproto.pb.go
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

import * as __goscript_errors from "./errors.gs.ts"

import * as __goscript_packet from "./packet.gs.ts"
import "@goscript/encoding/base64/index.js"
import "@goscript/fmt/index.js"
import "@goscript/io/index.js"
import "@goscript/slices/index.js"
import "@goscript/strconv/index.js"
import "@goscript/strings/index.js"
import "@goscript/github.com/aperturerobotics/protobuf-go-lite/index.js"
import "@goscript/github.com/aperturerobotics/protobuf-go-lite/json/index.js"
import "./errors.gs.ts"
import "./packet.gs.ts"

export class Packet {
	public get unknownFields(): $.Slice<number> {
		return this._fields.unknownFields.value
	}
	public set unknownFields(value: $.Slice<number>) {
		this._fields.unknownFields.value = value
	}

	// Body is the packet body.
	//
	// Types that are assignable to Body:
	//
	// 	*Packet_CallStart
	// 	*Packet_CallData
	// 	*Packet_CallCancel
	public get Body(): isPacket_Body | null {
		return this._fields.Body.value
	}
	public set Body(value: isPacket_Body | null) {
		this._fields.Body.value = value
	}

	public _fields: {
		unknownFields: $.VarRef<$.Slice<number>>
		Body: $.VarRef<isPacket_Body | null>
	}

	constructor(init?: Partial<{unknownFields?: $.Slice<number>, Body?: isPacket_Body | null}>) {
		this._fields = {
			unknownFields: $.varRef(init?.unknownFields ?? (null as $.Slice<number>)),
			Body: $.varRef(init?.Body ?? (null as isPacket_Body | null))
		}
	}

	public clone(): Packet {
		const cloned = new Packet()
		cloned._fields = {
			unknownFields: $.varRef(this._fields.unknownFields.value),
			Body: $.varRef(this._fields.Body.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async CloneMessageVT(): globalThis.Promise<protobuf_go_lite.CloneMessage | null> {
		const m: Packet | $.VarRef<Packet> | null = this
		return $.interfaceValue<protobuf_go_lite.CloneMessage | null>(await Packet.prototype.CloneVT.call(m), "*srpc.Packet")
	}

	public async CloneVT(): globalThis.Promise<Packet | $.VarRef<Packet> | null> {
		const m: Packet | $.VarRef<Packet> | null = this
		if (m == null) {
			return null
		}
		let r: Packet | $.VarRef<Packet> | null = new Packet()
		if ($.pointerValue<Packet>(m).Body != null) {
			$.pointerValue<Packet>(r).Body = await $.pointerValue<any>($.mustTypeAssert<any>($.pointerValue<Packet>(m).Body, { kind: $.TypeKind.Interface, methods: [{ name: "CloneOneofVT", args: [], returns: [{ name: "_r0", type: "srpc.isPacket_Body" }] }] })).CloneOneofVT()
		}
		if ($.len($.pointerValue<Packet>(m).unknownFields) > 0) {
			$.pointerValue<Packet>(r).unknownFields = (slices.Clone($.pointerValue<Packet>(m).unknownFields) as $.Slice<number>)
		}
		return r
	}

	public async EqualMessageVT(thatMsg: any): globalThis.Promise<boolean> {
		const _this: Packet | $.VarRef<Packet> | null = this
		let __goscriptTuple0: any = $.typeAssertTuple<Packet | $.VarRef<Packet> | null>(thatMsg, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet" })
		let that: Packet | $.VarRef<Packet> | null = __goscriptTuple0[0]
		let ok = __goscriptTuple0[1]
		if (!ok) {
			return false
		}
		return await Packet.prototype.EqualVT.call(_this, that)
	}

	public async EqualVT(that: Packet | $.VarRef<Packet> | null): globalThis.Promise<boolean> {
		const _this: Packet | $.VarRef<Packet> | null = this
		if (_this == that) {
			return true
		} else {
			if ((_this == null) || (that == null)) {
				return false
			}
		}
		if (($.pointerValue<Packet>(_this).Body == null) && ($.pointerValue<Packet>(that).Body != null)) {
			return false
		} else {
			if ($.pointerValue<Packet>(_this).Body != null) {
				if ($.pointerValue<Packet>(that).Body == null) {
					return false
				}
				if (!await $.pointerValue<any>($.mustTypeAssert<any>($.pointerValue<Packet>(_this).Body, { kind: $.TypeKind.Interface, methods: [{ name: "EqualVT", args: [{ name: "_p0", type: "srpc.isPacket_Body" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }] })).EqualVT($.pointerValue<Packet>(that).Body)) {
					return false
				}
			}
		}
		return $.stringEqual($.bytesToString($.pointerValue<Packet>(_this).unknownFields), $.bytesToString($.pointerValue<Packet>(that).unknownFields))
	}

	public GetBody(): isPacket_Body | null {
		const m: Packet | $.VarRef<Packet> | null = this
		if (m != null) {
			return $.pointerValue<Packet>(m).Body
		}
		return null
	}

	public GetCallCancel(): boolean {
		const x: Packet | $.VarRef<Packet> | null = this
		let __goscriptShadow0 = x
		{
			let __goscriptTuple1: any = $.typeAssertTuple<Packet_CallCancel | $.VarRef<Packet_CallCancel> | null>(Packet.prototype.GetBody.call(__goscriptShadow0), { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallCancel" })
			let __goscriptShadow1: Packet_CallCancel | $.VarRef<Packet_CallCancel> | null = __goscriptTuple1[0]
			let ok = __goscriptTuple1[1]
			if (ok) {
				return $.pointerValue<Packet_CallCancel>(__goscriptShadow1).CallCancel
			}
		}
		return false
	}

	public GetCallData(): CallData | $.VarRef<CallData> | null {
		const x: Packet | $.VarRef<Packet> | null = this
		let __goscriptShadow2 = x
		{
			let __goscriptTuple2: any = $.typeAssertTuple<Packet_CallData | $.VarRef<Packet_CallData> | null>(Packet.prototype.GetBody.call(__goscriptShadow2), { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallData" })
			let __goscriptShadow3: Packet_CallData | $.VarRef<Packet_CallData> | null = __goscriptTuple2[0]
			let ok = __goscriptTuple2[1]
			if (ok) {
				return $.pointerValue<Packet_CallData>(__goscriptShadow3).CallData
			}
		}
		return null
	}

	public GetCallStart(): CallStart | $.VarRef<CallStart> | null {
		const x: Packet | $.VarRef<Packet> | null = this
		let __goscriptShadow4 = x
		{
			let __goscriptTuple3: any = $.typeAssertTuple<Packet_CallStart | $.VarRef<Packet_CallStart> | null>(Packet.prototype.GetBody.call(__goscriptShadow4), { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallStart" })
			let __goscriptShadow5: Packet_CallStart | $.VarRef<Packet_CallStart> | null = __goscriptTuple3[0]
			let ok = __goscriptTuple3[1]
			if (ok) {
				return $.pointerValue<Packet_CallStart>(__goscriptShadow5).CallStart
			}
		}
		return null
	}

	public MarshalJSON(): [$.Slice<number>, $.GoError] {
		const x: Packet | $.VarRef<Packet> | null = this
		return $.markAsStructValue($.cloneStructValue($.pointerValue<json.MarshalerConfig>(json.DefaultMarshalerConfig))).Marshal($.pointerValueOrNil($.interfaceValue<json.Marshaler | null>(x, "*srpc.Packet"))!)
	}

	public MarshalProtoJSON(s: json.MarshalState | $.VarRef<json.MarshalState> | null): void {
		const x: Packet | $.VarRef<Packet> | null = this
		if (x == null) {
			json.MarshalState.prototype.WriteNil.call($.pointerValue<json.MarshalState>(s))
			return
		}
		json.MarshalState.prototype.WriteObjectStart.call($.pointerValue<json.MarshalState>(s))
		let wroteField: $.VarRef<boolean> = $.varRef(false)
		if ($.pointerValue<Packet>(x).Body != null) {
			{
				const __goscriptTypeSwitchValue = $.pointerValue<Packet>(x).Body
				switch (true) {
					case $.typeAssert<Packet_CallStart | $.VarRef<Packet_CallStart> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallStart" }).ok:
						{
							let ov: Packet_CallStart | $.VarRef<Packet_CallStart> | null = $.typeAssert<Packet_CallStart | $.VarRef<Packet_CallStart> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallStart" }).value
							json.MarshalState.prototype.WriteMoreIf.call($.pointerValue<json.MarshalState>(s), wroteField)
							json.MarshalState.prototype.WriteObjectField.call($.pointerValue<json.MarshalState>(s), "callStart")
							CallStart.prototype.MarshalProtoJSON.call($.pointerValue<Packet_CallStart>(ov).CallStart, json.MarshalState.prototype.WithField.call($.pointerValue<json.MarshalState>(s), "callStart"))
						}
						break
					case $.typeAssert<Packet_CallData | $.VarRef<Packet_CallData> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallData" }).ok:
						{
							let ov: Packet_CallData | $.VarRef<Packet_CallData> | null = $.typeAssert<Packet_CallData | $.VarRef<Packet_CallData> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallData" }).value
							json.MarshalState.prototype.WriteMoreIf.call($.pointerValue<json.MarshalState>(s), wroteField)
							json.MarshalState.prototype.WriteObjectField.call($.pointerValue<json.MarshalState>(s), "callData")
							CallData.prototype.MarshalProtoJSON.call($.pointerValue<Packet_CallData>(ov).CallData, json.MarshalState.prototype.WithField.call($.pointerValue<json.MarshalState>(s), "callData"))
						}
						break
					case $.typeAssert<Packet_CallCancel | $.VarRef<Packet_CallCancel> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallCancel" }).ok:
						{
							let ov: Packet_CallCancel | $.VarRef<Packet_CallCancel> | null = $.typeAssert<Packet_CallCancel | $.VarRef<Packet_CallCancel> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallCancel" }).value
							json.MarshalState.prototype.WriteMoreIf.call($.pointerValue<json.MarshalState>(s), wroteField)
							json.MarshalState.prototype.WriteObjectField.call($.pointerValue<json.MarshalState>(s), "callCancel")
							json.MarshalState.prototype.WriteBool.call($.pointerValue<json.MarshalState>(s), $.pointerValue<Packet_CallCancel>(ov).CallCancel)
						}
						break
				}
			}
		}
		json.MarshalState.prototype.WriteObjectEnd.call($.pointerValue<json.MarshalState>(s))
	}

	public MarshalProtoText(): string {
		const x: Packet | $.VarRef<Packet> | null = this
		let sb: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
		sb.value.WriteString("Packet {")
		{
			const __goscriptTypeSwitchValue = $.pointerValue<Packet>(x).Body
			switch (true) {
				case $.typeAssert<Packet_CallStart | $.VarRef<Packet_CallStart> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallStart" }).ok:
					{
						let body: Packet_CallStart | $.VarRef<Packet_CallStart> | null = $.typeAssert<Packet_CallStart | $.VarRef<Packet_CallStart> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallStart" }).value
						if ($.pointerValue<Packet_CallStart>(body).CallStart != null) {
							if (sb.value.Len() > 8) {
								sb.value.WriteString(" ")
							}
							sb.value.WriteString("call_start: ")
							sb.value.WriteString(CallStart.prototype.MarshalProtoText.call($.pointerValue<Packet_CallStart>(body).CallStart))
						}
					}
					break
				case $.typeAssert<Packet_CallData | $.VarRef<Packet_CallData> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallData" }).ok:
					{
						let body: Packet_CallData | $.VarRef<Packet_CallData> | null = $.typeAssert<Packet_CallData | $.VarRef<Packet_CallData> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallData" }).value
						if ($.pointerValue<Packet_CallData>(body).CallData != null) {
							if (sb.value.Len() > 8) {
								sb.value.WriteString(" ")
							}
							sb.value.WriteString("call_data: ")
							sb.value.WriteString(CallData.prototype.MarshalProtoText.call($.pointerValue<Packet_CallData>(body).CallData))
						}
					}
					break
				case $.typeAssert<Packet_CallCancel | $.VarRef<Packet_CallCancel> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallCancel" }).ok:
					{
						let body: Packet_CallCancel | $.VarRef<Packet_CallCancel> | null = $.typeAssert<Packet_CallCancel | $.VarRef<Packet_CallCancel> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallCancel" }).value
						if ($.pointerValue<Packet_CallCancel>(body).CallCancel != false) {
							if (sb.value.Len() > 8) {
								sb.value.WriteString(" ")
							}
							sb.value.WriteString("call_cancel: ")
							sb.value.WriteString(strconv.FormatBool($.pointerValue<Packet_CallCancel>(body).CallCancel))
						}
					}
					break
			}
		}
		sb.value.WriteString("}")
		return sb.value.String()
	}

	public async MarshalToSizedBufferVT(dAtA: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const m: Packet | $.VarRef<Packet> | null = this
		if (m == null) {
			return [0, null]
		}
		let i = $.len(dAtA)
		i
		let l: number = 0
		l
		if ($.pointerValue<Packet>(m).unknownFields != null) {
			i = i - ($.len($.pointerValue<Packet>(m).unknownFields))
			$.copy($.goSlice(dAtA, i, undefined), $.pointerValue<Packet>(m).unknownFields)
		}
		{
			let [vtmsg, ok] = $.typeAssertTuple<any>($.pointerValue<Packet>(m).Body, { kind: $.TypeKind.Interface, methods: [{ name: "MarshalToSizedBufferVT", args: [{ name: "_p0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }] })
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
		const m: Packet | $.VarRef<Packet> | null = this
		let size = await Packet.prototype.SizeVT.call(m)
		return await Packet.prototype.MarshalToSizedBufferVT.call(m, $.goSlice(dAtA, undefined, size))
	}

	public async MarshalVT(): globalThis.Promise<[$.Slice<number>, $.GoError]> {
		const m: Packet | $.VarRef<Packet> | null = this
		let dAtA: $.Slice<number> = null as $.Slice<number>
		let err: $.GoError = null as $.GoError
		if (m == null) {
			return [null, null]
		}
		let size = await Packet.prototype.SizeVT.call(m)
		dAtA = $.makeSlice<number>(size, undefined, "byte")
		let __goscriptTuple4: any = await Packet.prototype.MarshalToSizedBufferVT.call(m, $.goSlice(dAtA, undefined, size))
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
		let x: Packet | $.VarRef<Packet> | null = this
		$.assignStruct($.pointerValue<Packet>(x), $.markAsStructValue(new Packet()))
	}

	public async SizeVT(): globalThis.Promise<number> {
		const m: Packet | $.VarRef<Packet> | null = this
		let n: number = 0
		if (m == null) {
			return 0
		}
		let l: number = 0
		l
		{
			let [vtmsg, ok] = $.typeAssertTuple<any>($.pointerValue<Packet>(m).Body, { kind: $.TypeKind.Interface, methods: [{ name: "SizeVT", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }] }] })
			if (ok) {
				n = n + (await $.pointerValue<any>(vtmsg).SizeVT())
			}
		}
		n = n + ($.len($.pointerValue<Packet>(m).unknownFields))
		return n
	}

	public String(): string {
		const x: Packet | $.VarRef<Packet> | null = this
		return Packet.prototype.MarshalProtoText.call(x)
	}

	public UnmarshalJSON(b: $.Slice<number>): $.GoError {
		const x: Packet | $.VarRef<Packet> | null = this
		return $.markAsStructValue($.cloneStructValue($.pointerValue<json.UnmarshalerConfig>(json.DefaultUnmarshalerConfig))).Unmarshal(b, $.pointerValueOrNil($.interfaceValue<json.Unmarshaler | null>(x, "*srpc.Packet"))!)
	}

	public UnmarshalProtoJSON(s: json.UnmarshalState | $.VarRef<json.UnmarshalState> | null): void {
		const x: Packet | $.VarRef<Packet> | null = this
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
				case "call_start":
				case "callStart":
				{
					let ov: Packet_CallStart | $.VarRef<Packet_CallStart> | null = new Packet_CallStart()
					$.pointerValue<Packet>(x).Body = $.interfaceValue<isPacket_Body | null>(ov, "*srpc.Packet_CallStart")
					if (json.UnmarshalState.prototype.ReadNil.call($.pointerValue<json.UnmarshalState>(s))) {
						$.pointerValue<Packet_CallStart>(ov).CallStart = null
						return
					}
					$.pointerValue<Packet_CallStart>(ov).CallStart = new CallStart()
					CallStart.prototype.UnmarshalProtoJSON.call($.pointerValue<Packet_CallStart>(ov).CallStart, json.UnmarshalState.prototype.WithField.call($.pointerValue<json.UnmarshalState>(s), "call_start", true))
					break
				}
				case "call_data":
				case "callData":
				{
					let ov: Packet_CallData | $.VarRef<Packet_CallData> | null = new Packet_CallData()
					$.pointerValue<Packet>(x).Body = $.interfaceValue<isPacket_Body | null>(ov, "*srpc.Packet_CallData")
					if (json.UnmarshalState.prototype.ReadNil.call($.pointerValue<json.UnmarshalState>(s))) {
						$.pointerValue<Packet_CallData>(ov).CallData = null
						return
					}
					$.pointerValue<Packet_CallData>(ov).CallData = new CallData()
					CallData.prototype.UnmarshalProtoJSON.call($.pointerValue<Packet_CallData>(ov).CallData, json.UnmarshalState.prototype.WithField.call($.pointerValue<json.UnmarshalState>(s), "call_data", true))
					break
				}
				case "call_cancel":
				case "callCancel":
				{
					json.UnmarshalState.prototype.AddField.call($.pointerValue<json.UnmarshalState>(s), "call_cancel")
					let ov: Packet_CallCancel | $.VarRef<Packet_CallCancel> | null = new Packet_CallCancel()
					$.pointerValue<Packet>(x).Body = $.interfaceValue<isPacket_Body | null>(ov, "*srpc.Packet_CallCancel")
					$.pointerValue<Packet_CallCancel>(ov).CallCancel = json.UnmarshalState.prototype.ReadBool.call($.pointerValue<json.UnmarshalState>(s))
					break
				}
			}
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [] } as $.FunctionTypeInfo)))
	}

	public UnmarshalVT(dAtA: $.Slice<number>): $.GoError {
		let m: Packet | $.VarRef<Packet> | null = this
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
				return fmt.Errorf("proto: Packet: wiretype end group for non-group")
			}
			if (fieldNum <= 0) {
				return fmt.Errorf("proto: Packet: illegal tag %d (wire type %d)", $.namedValueInterfaceValue<any>(fieldNum, "int32", {}, { kind: $.TypeKind.Basic, name: "int32" }), $.namedValueInterfaceValue<any>(wire, "uint64", {}, { kind: $.TypeKind.Basic, name: "uint64" }))
			}
			switch (fieldNum) {
				case 1:
				{
					if (wireType != 2) {
						return fmt.Errorf("proto: wrong wireType = %d for field CallStart", $.namedValueInterfaceValue<any>(wireType, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
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
						let __goscriptTuple7: any = $.typeAssertTuple<Packet_CallStart | $.VarRef<Packet_CallStart> | null>($.pointerValue<Packet>(m).Body, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallStart" })
						let oneof: Packet_CallStart | $.VarRef<Packet_CallStart> | null = __goscriptTuple7[0]
						let ok = __goscriptTuple7[1]
						if (ok) {
							{
								let __goscriptShadow6 = CallStart.prototype.UnmarshalVT.call($.pointerValue<Packet_CallStart>(oneof).CallStart, $.goSlice(dAtA, iNdEx, postIndex))
								if (__goscriptShadow6 != null) {
									return __goscriptShadow6
								}
							}
						} else {
							let v: CallStart | $.VarRef<CallStart> | null = new CallStart()
							{
								let __goscriptShadow7 = CallStart.prototype.UnmarshalVT.call(v, $.goSlice(dAtA, iNdEx, postIndex))
								if (__goscriptShadow7 != null) {
									return __goscriptShadow7
								}
							}
							$.pointerValue<Packet>(m).Body = $.interfaceValue<isPacket_Body | null>(new Packet_CallStart({CallStart: v}), "*srpc.Packet_CallStart")
						}
					}
					iNdEx = postIndex
					break
				}
				case 2:
				{
					if (wireType != 2) {
						return fmt.Errorf("proto: wrong wireType = %d for field CallData", $.namedValueInterfaceValue<any>(wireType, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
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
						let __goscriptTuple9: any = $.typeAssertTuple<Packet_CallData | $.VarRef<Packet_CallData> | null>($.pointerValue<Packet>(m).Body, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallData" })
						let oneof: Packet_CallData | $.VarRef<Packet_CallData> | null = __goscriptTuple9[0]
						let ok = __goscriptTuple9[1]
						if (ok) {
							{
								let __goscriptShadow8 = CallData.prototype.UnmarshalVT.call($.pointerValue<Packet_CallData>(oneof).CallData, $.goSlice(dAtA, iNdEx, postIndex))
								if (__goscriptShadow8 != null) {
									return __goscriptShadow8
								}
							}
						} else {
							let v: CallData | $.VarRef<CallData> | null = new CallData()
							{
								let __goscriptShadow9 = CallData.prototype.UnmarshalVT.call(v, $.goSlice(dAtA, iNdEx, postIndex))
								if (__goscriptShadow9 != null) {
									return __goscriptShadow9
								}
							}
							$.pointerValue<Packet>(m).Body = $.interfaceValue<isPacket_Body | null>(new Packet_CallData({CallData: v}), "*srpc.Packet_CallData")
						}
					}
					iNdEx = postIndex
					break
				}
				case 3:
				{
					if (wireType != 0) {
						return fmt.Errorf("proto: wrong wireType = %d for field CallCancel", $.namedValueInterfaceValue<any>(wireType, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
					}
					let v: number = 0
					let _v: bigint = 0n
					let __goscriptTuple10: any = protobuf_go_lite.DecodeVarint(dAtA, iNdEx)
					_v = __goscriptTuple10[0]
					iNdEx = __goscriptTuple10[1]
					err = __goscriptTuple10[2]
					v = $.int(_v)
					if (err != null) {
						return err
					}
					let b = v != 0
					$.pointerValue<Packet>(m).Body = $.interfaceValue<isPacket_Body | null>(new Packet_CallCancel({CallCancel: b}), "*srpc.Packet_CallCancel")
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
					$.pointerValue<Packet>(m).unknownFields = $.appendSlice($.pointerValue<Packet>(m).unknownFields, $.goSlice(dAtA, iNdEx, iNdEx + skippy))
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

	public Validate(): $.GoError {
		const p: Packet | $.VarRef<Packet> | null = this
		{
			const __goscriptTypeSwitchValue = Packet.prototype.GetBody.call(p)
			switch (true) {
				case $.typeAssert<Packet_CallStart | $.VarRef<Packet_CallStart> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallStart" }).ok:
					{
						let b: Packet_CallStart | $.VarRef<Packet_CallStart> | null = $.typeAssert<Packet_CallStart | $.VarRef<Packet_CallStart> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallStart" }).value
						return CallStart.prototype.Validate.call($.pointerValue<Packet_CallStart>(b).CallStart)
					}
					break
				case $.typeAssert<Packet_CallData | $.VarRef<Packet_CallData> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallData" }).ok:
					{
						let b: Packet_CallData | $.VarRef<Packet_CallData> | null = $.typeAssert<Packet_CallData | $.VarRef<Packet_CallData> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallData" }).value
						return CallData.prototype.Validate.call($.pointerValue<Packet_CallData>(b).CallData)
					}
					break
				case $.typeAssert<Packet_CallCancel | $.VarRef<Packet_CallCancel> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallCancel" }).ok:
					{
						let b: Packet_CallCancel | $.VarRef<Packet_CallCancel> | null = $.typeAssert<Packet_CallCancel | $.VarRef<Packet_CallCancel> | null>(__goscriptTypeSwitchValue, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallCancel" }).value
						return null
					}
					break
				default:
					{
						let b: any = __goscriptTypeSwitchValue
						return __goscript_errors.ErrUnrecognizedPacket
					}
					break
			}
		}
		throw new globalThis.Error("goscript: unreachable return")
	}

	static __typeInfo = $.registerStructType(
		"srpc.Packet",
		() => new Packet(),
		[{ name: "CloneMessageVT", args: [], returns: [{ name: "_r0", type: "protobuf_go_lite.CloneMessage" }] }, { name: "CloneVT", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "srpc.Packet" } }] }, { name: "EqualMessageVT", args: [{ name: "thatMsg", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "EqualVT", args: [{ name: "that", type: { kind: $.TypeKind.Pointer, elemType: "srpc.Packet" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "GetBody", args: [], returns: [{ name: "_r0", type: "srpc.isPacket_Body" }] }, { name: "GetCallCancel", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "GetCallData", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "srpc.CallData" } }] }, { name: "GetCallStart", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "srpc.CallStart" } }] }, { name: "MarshalJSON", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "MarshalProtoJSON", args: [{ name: "s", type: { kind: $.TypeKind.Pointer, elemType: "json.MarshalState" } }], returns: [] }, { name: "MarshalProtoText", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "MarshalToSizedBufferVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "MarshalToVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "MarshalVT", args: [], returns: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }, { name: "ProtoMessage", args: [], returns: [] }, { name: "Reset", args: [], returns: [] }, { name: "SizeVT", args: [], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "UnmarshalJSON", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "UnmarshalProtoJSON", args: [{ name: "s", type: { kind: $.TypeKind.Pointer, elemType: "json.UnmarshalState" } }], returns: [] }, { name: "UnmarshalVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "Validate", args: [], returns: [{ name: "_r0", type: "error" }] }],
		Packet,
		[{ name: "unknownFields", key: "unknownFields", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [0], offset: 0, exported: false }, { name: "Body", key: "Body", type: "srpc.isPacket_Body", tag: "protobuf_oneof:\"body\"", index: [1], offset: 24, exported: true }]
	)
}

export class Packet_CallStart {
	// CallStart initiates a new call.
	public get CallStart(): CallStart | $.VarRef<CallStart> | null {
		return this._fields.CallStart.value
	}
	public set CallStart(value: CallStart | $.VarRef<CallStart> | null) {
		this._fields.CallStart.value = value
	}

	public _fields: {
		CallStart: $.VarRef<CallStart | $.VarRef<CallStart> | null>
	}

	constructor(init?: Partial<{CallStart?: CallStart | $.VarRef<CallStart> | null}>) {
		this._fields = {
			CallStart: $.varRef(init?.CallStart ?? (null as CallStart | $.VarRef<CallStart> | null))
		}
	}

	public clone(): Packet_CallStart {
		const cloned = new Packet_CallStart()
		cloned._fields = {
			CallStart: $.varRef(this._fields.CallStart.value)
		}
		return $.markAsStructValue(cloned)
	}

	public CloneOneofVT(): isPacket_Body | null {
		const m: Packet_CallStart | $.VarRef<Packet_CallStart> | null = this
		return $.interfaceValue<isPacket_Body | null>(Packet_CallStart.prototype.CloneVT.call(m), "*srpc.Packet_CallStart")
	}

	public CloneVT(): Packet_CallStart | $.VarRef<Packet_CallStart> | null {
		const m: Packet_CallStart | $.VarRef<Packet_CallStart> | null = this
		if (m == null) {
			return null
		}
		let r: Packet_CallStart | $.VarRef<Packet_CallStart> | null = new Packet_CallStart()
		$.pointerValue<Packet_CallStart>(r).CallStart = CallStart.prototype.CloneVT.call($.pointerValue<Packet_CallStart>(m).CallStart)
		return r
	}

	public EqualVT(thatIface: isPacket_Body | null): boolean {
		const _this: Packet_CallStart | $.VarRef<Packet_CallStart> | null = this
		let __goscriptTuple11: any = $.typeAssertTuple<Packet_CallStart | $.VarRef<Packet_CallStart> | null>(thatIface, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallStart" })
		let that: Packet_CallStart | $.VarRef<Packet_CallStart> | null = __goscriptTuple11[0]
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
			let p: CallStart | $.VarRef<CallStart> | null = $.pointerValue<Packet_CallStart>(_this).CallStart
			let q: CallStart | $.VarRef<CallStart> | null = $.pointerValue<Packet_CallStart>(that).CallStart
			if (p != q) {
				if (p == null) {
					p = new CallStart()
				}
				if (q == null) {
					q = new CallStart()
				}
				if (!CallStart.prototype.EqualVT.call(p, q)) {
					return false
				}
			}
		}
		return true
	}

	public MarshalToSizedBufferVT(dAtA: $.Slice<number>): [number, $.GoError] {
		const m: Packet_CallStart | $.VarRef<Packet_CallStart> | null = this
		let i = $.len(dAtA)
		if ($.pointerValue<Packet_CallStart>(m).CallStart != null) {
			let [size, err] = CallStart.prototype.MarshalToSizedBufferVT.call($.pointerValue<Packet_CallStart>(m).CallStart, $.goSlice(dAtA, undefined, i))
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
		const m: Packet_CallStart | $.VarRef<Packet_CallStart> | null = this
		let size = Packet_CallStart.prototype.SizeVT.call(m)
		return Packet_CallStart.prototype.MarshalToSizedBufferVT.call(m, $.goSlice(dAtA, undefined, size))
	}

	public SizeVT(): number {
		const m: Packet_CallStart | $.VarRef<Packet_CallStart> | null = this
		let n: number = 0
		if (m == null) {
			return 0
		}
		let l: number = 0
		l
		if ($.pointerValue<Packet_CallStart>(m).CallStart != null) {
			l = CallStart.prototype.SizeVT.call($.pointerValue<Packet_CallStart>(m).CallStart)
			n = n + ((1 + l) + protobuf_go_lite.SizeOfVarint($.uint64(l)))
		} else {
			n = n + (2)
		}
		return n
	}

	public isPacket_Body(): void {
	}

	static __typeInfo = $.registerStructType(
		"srpc.Packet_CallStart",
		() => new Packet_CallStart(),
		[{ name: "CloneOneofVT", args: [], returns: [{ name: "_r0", type: "srpc.isPacket_Body" }] }, { name: "CloneVT", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallStart" } }] }, { name: "EqualVT", args: [{ name: "thatIface", type: "srpc.isPacket_Body" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "MarshalToSizedBufferVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "MarshalToVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "SizeVT", args: [], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "isPacket_Body", args: [], returns: [] }],
		Packet_CallStart,
		[{ name: "CallStart", key: "CallStart", type: { kind: $.TypeKind.Pointer, elemType: "srpc.CallStart" }, tag: "protobuf:\"bytes,1,opt,name=call_start,json=callStart,proto3,oneof\"", index: [0], offset: 0, exported: true }]
	)
}

export class Packet_CallData {
	// CallData is a message in a streaming RPC sequence.
	public get CallData(): CallData | $.VarRef<CallData> | null {
		return this._fields.CallData.value
	}
	public set CallData(value: CallData | $.VarRef<CallData> | null) {
		this._fields.CallData.value = value
	}

	public _fields: {
		CallData: $.VarRef<CallData | $.VarRef<CallData> | null>
	}

	constructor(init?: Partial<{CallData?: CallData | $.VarRef<CallData> | null}>) {
		this._fields = {
			CallData: $.varRef(init?.CallData ?? (null as CallData | $.VarRef<CallData> | null))
		}
	}

	public clone(): Packet_CallData {
		const cloned = new Packet_CallData()
		cloned._fields = {
			CallData: $.varRef(this._fields.CallData.value)
		}
		return $.markAsStructValue(cloned)
	}

	public CloneOneofVT(): isPacket_Body | null {
		const m: Packet_CallData | $.VarRef<Packet_CallData> | null = this
		return $.interfaceValue<isPacket_Body | null>(Packet_CallData.prototype.CloneVT.call(m), "*srpc.Packet_CallData")
	}

	public CloneVT(): Packet_CallData | $.VarRef<Packet_CallData> | null {
		const m: Packet_CallData | $.VarRef<Packet_CallData> | null = this
		if (m == null) {
			return null
		}
		let r: Packet_CallData | $.VarRef<Packet_CallData> | null = new Packet_CallData()
		$.pointerValue<Packet_CallData>(r).CallData = CallData.prototype.CloneVT.call($.pointerValue<Packet_CallData>(m).CallData)
		return r
	}

	public EqualVT(thatIface: isPacket_Body | null): boolean {
		const _this: Packet_CallData | $.VarRef<Packet_CallData> | null = this
		let __goscriptTuple12: any = $.typeAssertTuple<Packet_CallData | $.VarRef<Packet_CallData> | null>(thatIface, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallData" })
		let that: Packet_CallData | $.VarRef<Packet_CallData> | null = __goscriptTuple12[0]
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
			let p: CallData | $.VarRef<CallData> | null = $.pointerValue<Packet_CallData>(_this).CallData
			let q: CallData | $.VarRef<CallData> | null = $.pointerValue<Packet_CallData>(that).CallData
			if (p != q) {
				if (p == null) {
					p = new CallData()
				}
				if (q == null) {
					q = new CallData()
				}
				if (!CallData.prototype.EqualVT.call(p, q)) {
					return false
				}
			}
		}
		return true
	}

	public MarshalToSizedBufferVT(dAtA: $.Slice<number>): [number, $.GoError] {
		const m: Packet_CallData | $.VarRef<Packet_CallData> | null = this
		let i = $.len(dAtA)
		if ($.pointerValue<Packet_CallData>(m).CallData != null) {
			let [size, err] = CallData.prototype.MarshalToSizedBufferVT.call($.pointerValue<Packet_CallData>(m).CallData, $.goSlice(dAtA, undefined, i))
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
		const m: Packet_CallData | $.VarRef<Packet_CallData> | null = this
		let size = Packet_CallData.prototype.SizeVT.call(m)
		return Packet_CallData.prototype.MarshalToSizedBufferVT.call(m, $.goSlice(dAtA, undefined, size))
	}

	public SizeVT(): number {
		const m: Packet_CallData | $.VarRef<Packet_CallData> | null = this
		let n: number = 0
		if (m == null) {
			return 0
		}
		let l: number = 0
		l
		if ($.pointerValue<Packet_CallData>(m).CallData != null) {
			l = CallData.prototype.SizeVT.call($.pointerValue<Packet_CallData>(m).CallData)
			n = n + ((1 + l) + protobuf_go_lite.SizeOfVarint($.uint64(l)))
		} else {
			n = n + (2)
		}
		return n
	}

	public isPacket_Body(): void {
	}

	static __typeInfo = $.registerStructType(
		"srpc.Packet_CallData",
		() => new Packet_CallData(),
		[{ name: "CloneOneofVT", args: [], returns: [{ name: "_r0", type: "srpc.isPacket_Body" }] }, { name: "CloneVT", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallData" } }] }, { name: "EqualVT", args: [{ name: "thatIface", type: "srpc.isPacket_Body" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "MarshalToSizedBufferVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "MarshalToVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "SizeVT", args: [], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "isPacket_Body", args: [], returns: [] }],
		Packet_CallData,
		[{ name: "CallData", key: "CallData", type: { kind: $.TypeKind.Pointer, elemType: "srpc.CallData" }, tag: "protobuf:\"bytes,2,opt,name=call_data,json=callData,proto3,oneof\"", index: [0], offset: 0, exported: true }]
	)
}

export class Packet_CallCancel {
	// CallCancel cancels the call.
	public get CallCancel(): boolean {
		return this._fields.CallCancel.value
	}
	public set CallCancel(value: boolean) {
		this._fields.CallCancel.value = value
	}

	public _fields: {
		CallCancel: $.VarRef<boolean>
	}

	constructor(init?: Partial<{CallCancel?: boolean}>) {
		this._fields = {
			CallCancel: $.varRef(init?.CallCancel ?? (false as boolean))
		}
	}

	public clone(): Packet_CallCancel {
		const cloned = new Packet_CallCancel()
		cloned._fields = {
			CallCancel: $.varRef(this._fields.CallCancel.value)
		}
		return $.markAsStructValue(cloned)
	}

	public CloneOneofVT(): isPacket_Body | null {
		const m: Packet_CallCancel | $.VarRef<Packet_CallCancel> | null = this
		return $.interfaceValue<isPacket_Body | null>(Packet_CallCancel.prototype.CloneVT.call(m), "*srpc.Packet_CallCancel")
	}

	public CloneVT(): Packet_CallCancel | $.VarRef<Packet_CallCancel> | null {
		const m: Packet_CallCancel | $.VarRef<Packet_CallCancel> | null = this
		if (m == null) {
			return null
		}
		let r: Packet_CallCancel | $.VarRef<Packet_CallCancel> | null = new Packet_CallCancel()
		$.pointerValue<Packet_CallCancel>(r).CallCancel = $.pointerValue<Packet_CallCancel>(m).CallCancel
		return r
	}

	public EqualVT(thatIface: isPacket_Body | null): boolean {
		const _this: Packet_CallCancel | $.VarRef<Packet_CallCancel> | null = this
		let __goscriptTuple13: any = $.typeAssertTuple<Packet_CallCancel | $.VarRef<Packet_CallCancel> | null>(thatIface, { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallCancel" })
		let that: Packet_CallCancel | $.VarRef<Packet_CallCancel> | null = __goscriptTuple13[0]
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
		if ($.pointerValue<Packet_CallCancel>(_this).CallCancel != $.pointerValue<Packet_CallCancel>(that).CallCancel) {
			return false
		}
		return true
	}

	public MarshalToSizedBufferVT(dAtA: $.Slice<number>): [number, $.GoError] {
		const m: Packet_CallCancel | $.VarRef<Packet_CallCancel> | null = this
		let i = $.len(dAtA)
		i--
		if ($.pointerValue<Packet_CallCancel>(m).CallCancel) {
			dAtA![i] = $.uint(1, 8)
		} else {
			dAtA![i] = $.uint(0, 8)
		}
		i--
		dAtA![i] = $.uint(0x18, 8)
		return [$.len(dAtA) - i, null]
	}

	public MarshalToVT(dAtA: $.Slice<number>): [number, $.GoError] {
		const m: Packet_CallCancel | $.VarRef<Packet_CallCancel> | null = this
		let size = Packet_CallCancel.prototype.SizeVT.call(m)
		return Packet_CallCancel.prototype.MarshalToSizedBufferVT.call(m, $.goSlice(dAtA, undefined, size))
	}

	public SizeVT(): number {
		const m: Packet_CallCancel | $.VarRef<Packet_CallCancel> | null = this
		let n: number = 0
		if (m == null) {
			return 0
		}
		let l: number = 0
		l
		n = n + (2)
		return n
	}

	public isPacket_Body(): void {
	}

	static __typeInfo = $.registerStructType(
		"srpc.Packet_CallCancel",
		() => new Packet_CallCancel(),
		[{ name: "CloneOneofVT", args: [], returns: [{ name: "_r0", type: "srpc.isPacket_Body" }] }, { name: "CloneVT", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "srpc.Packet_CallCancel" } }] }, { name: "EqualVT", args: [{ name: "thatIface", type: "srpc.isPacket_Body" }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "MarshalToSizedBufferVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "MarshalToVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "SizeVT", args: [], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "isPacket_Body", args: [], returns: [] }],
		Packet_CallCancel,
		[{ name: "CallCancel", key: "CallCancel", type: { kind: $.TypeKind.Basic, name: "bool" }, tag: "protobuf:\"varint,3,opt,name=call_cancel,json=callCancel,proto3,oneof\"", index: [0], offset: 0, exported: true }]
	)
}

export class CallStart {
	public get unknownFields(): $.Slice<number> {
		return this._fields.unknownFields.value
	}
	public set unknownFields(value: $.Slice<number>) {
		this._fields.unknownFields.value = value
	}

	// RpcService is the service to contact.
	// Must be set.
	public get RpcService(): string {
		return this._fields.RpcService.value
	}
	public set RpcService(value: string) {
		this._fields.RpcService.value = value
	}

	// RpcMethod is the RPC method to call.
	// Must be set.
	public get RpcMethod(): string {
		return this._fields.RpcMethod.value
	}
	public set RpcMethod(value: string) {
		this._fields.RpcMethod.value = value
	}

	// Data contains the request or the first message in the stream.
	// Optional if streaming.
	public get Data(): $.Slice<number> {
		return this._fields.Data.value
	}
	public set Data(value: $.Slice<number>) {
		this._fields.Data.value = value
	}

	// DataIsZero indicates Data is set with an empty message.
	public get DataIsZero(): boolean {
		return this._fields.DataIsZero.value
	}
	public set DataIsZero(value: boolean) {
		this._fields.DataIsZero.value = value
	}

	public _fields: {
		unknownFields: $.VarRef<$.Slice<number>>
		RpcService: $.VarRef<string>
		RpcMethod: $.VarRef<string>
		Data: $.VarRef<$.Slice<number>>
		DataIsZero: $.VarRef<boolean>
	}

	constructor(init?: Partial<{unknownFields?: $.Slice<number>, RpcService?: string, RpcMethod?: string, Data?: $.Slice<number>, DataIsZero?: boolean}>) {
		this._fields = {
			unknownFields: $.varRef(init?.unknownFields ?? (null as $.Slice<number>)),
			RpcService: $.varRef(init?.RpcService ?? ("" as string)),
			RpcMethod: $.varRef(init?.RpcMethod ?? ("" as string)),
			Data: $.varRef(init?.Data ?? (null as $.Slice<number>)),
			DataIsZero: $.varRef(init?.DataIsZero ?? (false as boolean))
		}
	}

	public clone(): CallStart {
		const cloned = new CallStart()
		cloned._fields = {
			unknownFields: $.varRef(this._fields.unknownFields.value),
			RpcService: $.varRef(this._fields.RpcService.value),
			RpcMethod: $.varRef(this._fields.RpcMethod.value),
			Data: $.varRef(this._fields.Data.value),
			DataIsZero: $.varRef(this._fields.DataIsZero.value)
		}
		return $.markAsStructValue(cloned)
	}

	public CloneMessageVT(): protobuf_go_lite.CloneMessage | null {
		const m: CallStart | $.VarRef<CallStart> | null = this
		return $.interfaceValue<protobuf_go_lite.CloneMessage | null>(CallStart.prototype.CloneVT.call(m), "*srpc.CallStart")
	}

	public CloneVT(): CallStart | $.VarRef<CallStart> | null {
		const m: CallStart | $.VarRef<CallStart> | null = this
		if (m == null) {
			return null
		}
		let r: CallStart | $.VarRef<CallStart> | null = new CallStart()
		$.pointerValue<CallStart>(r).RpcService = $.pointerValue<CallStart>(m).RpcService
		$.pointerValue<CallStart>(r).RpcMethod = $.pointerValue<CallStart>(m).RpcMethod
		$.pointerValue<CallStart>(r).DataIsZero = $.pointerValue<CallStart>(m).DataIsZero
		{
			let rhs: $.Slice<number> = $.pointerValue<CallStart>(m).Data
			if (rhs != null) {
				$.pointerValue<CallStart>(r).Data = (slices.Clone(rhs) as $.Slice<number>)
			}
		}
		if ($.len($.pointerValue<CallStart>(m).unknownFields) > 0) {
			$.pointerValue<CallStart>(r).unknownFields = (slices.Clone($.pointerValue<CallStart>(m).unknownFields) as $.Slice<number>)
		}
		return r
	}

	public EqualMessageVT(thatMsg: any): boolean {
		const _this: CallStart | $.VarRef<CallStart> | null = this
		let __goscriptTuple14: any = $.typeAssertTuple<CallStart | $.VarRef<CallStart> | null>(thatMsg, { kind: $.TypeKind.Pointer, elemType: "srpc.CallStart" })
		let that: CallStart | $.VarRef<CallStart> | null = __goscriptTuple14[0]
		let ok = __goscriptTuple14[1]
		if (!ok) {
			return false
		}
		return CallStart.prototype.EqualVT.call(_this, that)
	}

	public EqualVT(that: CallStart | $.VarRef<CallStart> | null): boolean {
		const _this: CallStart | $.VarRef<CallStart> | null = this
		if (_this == that) {
			return true
		} else {
			if ((_this == null) || (that == null)) {
				return false
			}
		}
		if (!$.stringEqual($.pointerValue<CallStart>(_this).RpcService, $.pointerValue<CallStart>(that).RpcService)) {
			return false
		}
		if (!$.stringEqual($.pointerValue<CallStart>(_this).RpcMethod, $.pointerValue<CallStart>(that).RpcMethod)) {
			return false
		}
		if (!$.stringEqual($.bytesToString($.pointerValue<CallStart>(_this).Data), $.bytesToString($.pointerValue<CallStart>(that).Data))) {
			return false
		}
		if ($.pointerValue<CallStart>(_this).DataIsZero != $.pointerValue<CallStart>(that).DataIsZero) {
			return false
		}
		return $.stringEqual($.bytesToString($.pointerValue<CallStart>(_this).unknownFields), $.bytesToString($.pointerValue<CallStart>(that).unknownFields))
	}

	public GetData(): $.Slice<number> {
		const x: CallStart | $.VarRef<CallStart> | null = this
		if (x != null) {
			return $.pointerValue<CallStart>(x).Data
		}
		return null
	}

	public GetDataIsZero(): boolean {
		const x: CallStart | $.VarRef<CallStart> | null = this
		if (x != null) {
			return $.pointerValue<CallStart>(x).DataIsZero
		}
		return false
	}

	public GetRpcMethod(): string {
		const x: CallStart | $.VarRef<CallStart> | null = this
		if (x != null) {
			return $.pointerValue<CallStart>(x).RpcMethod
		}
		return ""
	}

	public GetRpcService(): string {
		const x: CallStart | $.VarRef<CallStart> | null = this
		if (x != null) {
			return $.pointerValue<CallStart>(x).RpcService
		}
		return ""
	}

	public MarshalJSON(): [$.Slice<number>, $.GoError] {
		const x: CallStart | $.VarRef<CallStart> | null = this
		return $.markAsStructValue($.cloneStructValue($.pointerValue<json.MarshalerConfig>(json.DefaultMarshalerConfig))).Marshal($.pointerValueOrNil($.interfaceValue<json.Marshaler | null>(x, "*srpc.CallStart"))!)
	}

	public MarshalProtoJSON(s: json.MarshalState | $.VarRef<json.MarshalState> | null): void {
		const x: CallStart | $.VarRef<CallStart> | null = this
		if (x == null) {
			json.MarshalState.prototype.WriteNil.call($.pointerValue<json.MarshalState>(s))
			return
		}
		json.MarshalState.prototype.WriteObjectStart.call($.pointerValue<json.MarshalState>(s))
		let wroteField: $.VarRef<boolean> = $.varRef(false)
		if ((!$.stringEqual($.pointerValue<CallStart>(x).RpcService, "")) || json.MarshalState.prototype.HasField.call($.pointerValue<json.MarshalState>(s), "rpcService")) {
			json.MarshalState.prototype.WriteMoreIf.call($.pointerValue<json.MarshalState>(s), wroteField)
			json.MarshalState.prototype.WriteObjectField.call($.pointerValue<json.MarshalState>(s), "rpcService")
			json.MarshalState.prototype.WriteString.call($.pointerValue<json.MarshalState>(s), $.pointerValue<CallStart>(x).RpcService)
		}
		if ((!$.stringEqual($.pointerValue<CallStart>(x).RpcMethod, "")) || json.MarshalState.prototype.HasField.call($.pointerValue<json.MarshalState>(s), "rpcMethod")) {
			json.MarshalState.prototype.WriteMoreIf.call($.pointerValue<json.MarshalState>(s), wroteField)
			json.MarshalState.prototype.WriteObjectField.call($.pointerValue<json.MarshalState>(s), "rpcMethod")
			json.MarshalState.prototype.WriteString.call($.pointerValue<json.MarshalState>(s), $.pointerValue<CallStart>(x).RpcMethod)
		}
		if (($.len($.pointerValue<CallStart>(x).Data) > 0) || json.MarshalState.prototype.HasField.call($.pointerValue<json.MarshalState>(s), "data")) {
			json.MarshalState.prototype.WriteMoreIf.call($.pointerValue<json.MarshalState>(s), wroteField)
			json.MarshalState.prototype.WriteObjectField.call($.pointerValue<json.MarshalState>(s), "data")
			json.MarshalState.prototype.WriteBytes.call($.pointerValue<json.MarshalState>(s), $.pointerValue<CallStart>(x).Data)
		}
		if ($.pointerValue<CallStart>(x).DataIsZero || json.MarshalState.prototype.HasField.call($.pointerValue<json.MarshalState>(s), "dataIsZero")) {
			json.MarshalState.prototype.WriteMoreIf.call($.pointerValue<json.MarshalState>(s), wroteField)
			json.MarshalState.prototype.WriteObjectField.call($.pointerValue<json.MarshalState>(s), "dataIsZero")
			json.MarshalState.prototype.WriteBool.call($.pointerValue<json.MarshalState>(s), $.pointerValue<CallStart>(x).DataIsZero)
		}
		json.MarshalState.prototype.WriteObjectEnd.call($.pointerValue<json.MarshalState>(s))
	}

	public MarshalProtoText(): string {
		const x: CallStart | $.VarRef<CallStart> | null = this
		let sb: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
		sb.value.WriteString("CallStart {")
		if (!$.stringEqual($.pointerValue<CallStart>(x).RpcService, "")) {
			if (sb.value.Len() > 11) {
				sb.value.WriteString(" ")
			}
			sb.value.WriteString("rpc_service: ")
			sb.value.WriteString(strconv.Quote($.pointerValue<CallStart>(x).RpcService))
		}
		if (!$.stringEqual($.pointerValue<CallStart>(x).RpcMethod, "")) {
			if (sb.value.Len() > 11) {
				sb.value.WriteString(" ")
			}
			sb.value.WriteString("rpc_method: ")
			sb.value.WriteString(strconv.Quote($.pointerValue<CallStart>(x).RpcMethod))
		}
		if ($.pointerValue<CallStart>(x).Data != null) {
			if (sb.value.Len() > 11) {
				sb.value.WriteString(" ")
			}
			sb.value.WriteString("data: ")
			sb.value.WriteString("\"")
			sb.value.WriteString(base64.Encoding.prototype.EncodeToString.call(base64.StdEncoding, $.pointerValue<CallStart>(x).Data))
			sb.value.WriteString("\"")
		}
		if ($.pointerValue<CallStart>(x).DataIsZero != false) {
			if (sb.value.Len() > 11) {
				sb.value.WriteString(" ")
			}
			sb.value.WriteString("data_is_zero: ")
			sb.value.WriteString(strconv.FormatBool($.pointerValue<CallStart>(x).DataIsZero))
		}
		sb.value.WriteString("}")
		return sb.value.String()
	}

	public MarshalToSizedBufferVT(dAtA: $.Slice<number>): [number, $.GoError] {
		const m: CallStart | $.VarRef<CallStart> | null = this
		if (m == null) {
			return [0, null]
		}
		let i = $.len(dAtA)
		i
		let l: number = 0
		l
		if ($.pointerValue<CallStart>(m).unknownFields != null) {
			i = i - ($.len($.pointerValue<CallStart>(m).unknownFields))
			$.copy($.goSlice(dAtA, i, undefined), $.pointerValue<CallStart>(m).unknownFields)
		}
		if ($.pointerValue<CallStart>(m).DataIsZero) {
			i--
			if ($.pointerValue<CallStart>(m).DataIsZero) {
				dAtA![i] = $.uint(1, 8)
			} else {
				dAtA![i] = $.uint(0, 8)
			}
			i--
			dAtA![i] = $.uint(0x20, 8)
		}
		if ($.len($.pointerValue<CallStart>(m).Data) > 0) {
			i = i - ($.len($.pointerValue<CallStart>(m).Data))
			$.copy($.goSlice(dAtA, i, undefined), $.pointerValue<CallStart>(m).Data)
			i = protobuf_go_lite.EncodeVarint(dAtA, i, $.uint64($.len($.pointerValue<CallStart>(m).Data)))
			i--
			dAtA![i] = $.uint(0x1a, 8)
		}
		if ($.len($.pointerValue<CallStart>(m).RpcMethod) > 0) {
			i = i - ($.len($.pointerValue<CallStart>(m).RpcMethod))
			$.copy($.goSlice(dAtA, i, undefined), $.pointerValue<CallStart>(m).RpcMethod)
			i = protobuf_go_lite.EncodeVarint(dAtA, i, $.uint64($.len($.pointerValue<CallStart>(m).RpcMethod)))
			i--
			dAtA![i] = $.uint(0x12, 8)
		}
		if ($.len($.pointerValue<CallStart>(m).RpcService) > 0) {
			i = i - ($.len($.pointerValue<CallStart>(m).RpcService))
			$.copy($.goSlice(dAtA, i, undefined), $.pointerValue<CallStart>(m).RpcService)
			i = protobuf_go_lite.EncodeVarint(dAtA, i, $.uint64($.len($.pointerValue<CallStart>(m).RpcService)))
			i--
			dAtA![i] = $.uint(0xa, 8)
		}
		return [$.len(dAtA) - i, null]
	}

	public MarshalToVT(dAtA: $.Slice<number>): [number, $.GoError] {
		const m: CallStart | $.VarRef<CallStart> | null = this
		let size = CallStart.prototype.SizeVT.call(m)
		return CallStart.prototype.MarshalToSizedBufferVT.call(m, $.goSlice(dAtA, undefined, size))
	}

	public MarshalVT(): [$.Slice<number>, $.GoError] {
		const m: CallStart | $.VarRef<CallStart> | null = this
		let dAtA: $.Slice<number> = null as $.Slice<number>
		let err: $.GoError = null as $.GoError
		if (m == null) {
			return [null, null]
		}
		let size = CallStart.prototype.SizeVT.call(m)
		dAtA = $.makeSlice<number>(size, undefined, "byte")
		let __goscriptTuple15: any = CallStart.prototype.MarshalToSizedBufferVT.call(m, $.goSlice(dAtA, undefined, size))
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
		let x: CallStart | $.VarRef<CallStart> | null = this
		$.assignStruct($.pointerValue<CallStart>(x), $.markAsStructValue(new CallStart()))
	}

	public SizeVT(): number {
		const m: CallStart | $.VarRef<CallStart> | null = this
		let n: number = 0
		if (m == null) {
			return 0
		}
		let l: number = 0
		l
		l = $.len($.pointerValue<CallStart>(m).RpcService)
		if (l > 0) {
			n = n + ((1 + l) + protobuf_go_lite.SizeOfVarint($.uint64(l)))
		}
		l = $.len($.pointerValue<CallStart>(m).RpcMethod)
		if (l > 0) {
			n = n + ((1 + l) + protobuf_go_lite.SizeOfVarint($.uint64(l)))
		}
		l = $.len($.pointerValue<CallStart>(m).Data)
		if (l > 0) {
			n = n + ((1 + l) + protobuf_go_lite.SizeOfVarint($.uint64(l)))
		}
		if ($.pointerValue<CallStart>(m).DataIsZero) {
			n = n + (2)
		}
		n = n + ($.len($.pointerValue<CallStart>(m).unknownFields))
		return n
	}

	public String(): string {
		const x: CallStart | $.VarRef<CallStart> | null = this
		return CallStart.prototype.MarshalProtoText.call(x)
	}

	public UnmarshalJSON(b: $.Slice<number>): $.GoError {
		const x: CallStart | $.VarRef<CallStart> | null = this
		return $.markAsStructValue($.cloneStructValue($.pointerValue<json.UnmarshalerConfig>(json.DefaultUnmarshalerConfig))).Unmarshal(b, $.pointerValueOrNil($.interfaceValue<json.Unmarshaler | null>(x, "*srpc.CallStart"))!)
	}

	public UnmarshalProtoJSON(s: json.UnmarshalState | $.VarRef<json.UnmarshalState> | null): void {
		const x: CallStart | $.VarRef<CallStart> | null = this
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
				case "rpc_service":
				case "rpcService":
				{
					json.UnmarshalState.prototype.AddField.call($.pointerValue<json.UnmarshalState>(s), "rpc_service")
					$.pointerValue<CallStart>(x).RpcService = json.UnmarshalState.prototype.ReadString.call($.pointerValue<json.UnmarshalState>(s))
					break
				}
				case "rpc_method":
				case "rpcMethod":
				{
					json.UnmarshalState.prototype.AddField.call($.pointerValue<json.UnmarshalState>(s), "rpc_method")
					$.pointerValue<CallStart>(x).RpcMethod = json.UnmarshalState.prototype.ReadString.call($.pointerValue<json.UnmarshalState>(s))
					break
				}
				case "data":
				{
					json.UnmarshalState.prototype.AddField.call($.pointerValue<json.UnmarshalState>(s), "data")
					$.pointerValue<CallStart>(x).Data = json.UnmarshalState.prototype.ReadBytes.call($.pointerValue<json.UnmarshalState>(s))
					break
				}
				case "data_is_zero":
				case "dataIsZero":
				{
					json.UnmarshalState.prototype.AddField.call($.pointerValue<json.UnmarshalState>(s), "data_is_zero")
					$.pointerValue<CallStart>(x).DataIsZero = json.UnmarshalState.prototype.ReadBool.call($.pointerValue<json.UnmarshalState>(s))
					break
				}
			}
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [] } as $.FunctionTypeInfo)))
	}

	public UnmarshalVT(dAtA: $.Slice<number>): $.GoError {
		let m: CallStart | $.VarRef<CallStart> | null = this
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
				return fmt.Errorf("proto: CallStart: wiretype end group for non-group")
			}
			if (fieldNum <= 0) {
				return fmt.Errorf("proto: CallStart: illegal tag %d (wire type %d)", $.namedValueInterfaceValue<any>(fieldNum, "int32", {}, { kind: $.TypeKind.Basic, name: "int32" }), $.namedValueInterfaceValue<any>(wire, "uint64", {}, { kind: $.TypeKind.Basic, name: "uint64" }))
			}
			switch (fieldNum) {
				case 1:
				{
					if (wireType != 2) {
						return fmt.Errorf("proto: wrong wireType = %d for field RpcService", $.namedValueInterfaceValue<any>(wireType, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
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
					$.pointerValue<CallStart>(m).RpcService = $.bytesToString($.goSlice(dAtA, iNdEx, postIndex))
					iNdEx = postIndex
					break
				}
				case 2:
				{
					if (wireType != 2) {
						return fmt.Errorf("proto: wrong wireType = %d for field RpcMethod", $.namedValueInterfaceValue<any>(wireType, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
					}
					let stringLen: bigint = 0n
					let __goscriptTuple18: any = protobuf_go_lite.DecodeVarint(dAtA, iNdEx)
					stringLen = __goscriptTuple18[0]
					iNdEx = __goscriptTuple18[1]
					err = __goscriptTuple18[2]
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
					$.pointerValue<CallStart>(m).RpcMethod = $.bytesToString($.goSlice(dAtA, iNdEx, postIndex))
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
					let __goscriptTuple19: any = protobuf_go_lite.DecodeVarint(dAtA, iNdEx)
					_v = __goscriptTuple19[0]
					iNdEx = __goscriptTuple19[1]
					err = __goscriptTuple19[2]
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
					$.pointerValue<CallStart>(m).Data = $.appendSlice($.goSlice($.pointerValue<CallStart>(m).Data, undefined, 0), $.goSlice(dAtA, iNdEx, postIndex))
					if ($.pointerValue<CallStart>(m).Data == null) {
						$.pointerValue<CallStart>(m).Data = $.arrayToSlice<number>([])
					}
					iNdEx = postIndex
					break
				}
				case 4:
				{
					if (wireType != 0) {
						return fmt.Errorf("proto: wrong wireType = %d for field DataIsZero", $.namedValueInterfaceValue<any>(wireType, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
					}
					let v: number = 0
					let _v: bigint = 0n
					let __goscriptTuple20: any = protobuf_go_lite.DecodeVarint(dAtA, iNdEx)
					_v = __goscriptTuple20[0]
					iNdEx = __goscriptTuple20[1]
					err = __goscriptTuple20[2]
					v = $.int(_v)
					if (err != null) {
						return err
					}
					$.pointerValue<CallStart>(m).DataIsZero = v != 0
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
					$.pointerValue<CallStart>(m).unknownFields = $.appendSlice($.pointerValue<CallStart>(m).unknownFields, $.goSlice(dAtA, iNdEx, iNdEx + skippy))
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

	public Validate(): $.GoError {
		const p: CallStart | $.VarRef<CallStart> | null = this
		let method = CallStart.prototype.GetRpcMethod.call(p)
		if ($.len(method) == 0) {
			return __goscript_errors.ErrEmptyMethodID
		}
		let service = CallStart.prototype.GetRpcService.call(p)
		if ($.len(service) == 0) {
			return __goscript_errors.ErrEmptyServiceID
		}
		return null
	}

	static __typeInfo = $.registerStructType(
		"srpc.CallStart",
		() => new CallStart(),
		[{ name: "CloneMessageVT", args: [], returns: [{ name: "_r0", type: "protobuf_go_lite.CloneMessage" }] }, { name: "CloneVT", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "srpc.CallStart" } }] }, { name: "EqualMessageVT", args: [{ name: "thatMsg", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "EqualVT", args: [{ name: "that", type: { kind: $.TypeKind.Pointer, elemType: "srpc.CallStart" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "GetData", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "GetDataIsZero", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "GetRpcMethod", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "GetRpcService", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "MarshalJSON", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "MarshalProtoJSON", args: [{ name: "s", type: { kind: $.TypeKind.Pointer, elemType: "json.MarshalState" } }], returns: [] }, { name: "MarshalProtoText", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "MarshalToSizedBufferVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "MarshalToVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "MarshalVT", args: [], returns: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }, { name: "ProtoMessage", args: [], returns: [] }, { name: "Reset", args: [], returns: [] }, { name: "SizeVT", args: [], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "UnmarshalJSON", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "UnmarshalProtoJSON", args: [{ name: "s", type: { kind: $.TypeKind.Pointer, elemType: "json.UnmarshalState" } }], returns: [] }, { name: "UnmarshalVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "Validate", args: [], returns: [{ name: "_r0", type: "error" }] }],
		CallStart,
		[{ name: "unknownFields", key: "unknownFields", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [0], offset: 0, exported: false }, { name: "RpcService", key: "RpcService", type: { kind: $.TypeKind.Basic, name: "string" }, tag: "protobuf:\"bytes,1,opt,name=rpc_service,json=rpcService,proto3\" json:\"rpcService,omitempty\"", index: [1], offset: 24, exported: true }, { name: "RpcMethod", key: "RpcMethod", type: { kind: $.TypeKind.Basic, name: "string" }, tag: "protobuf:\"bytes,2,opt,name=rpc_method,json=rpcMethod,proto3\" json:\"rpcMethod,omitempty\"", index: [2], offset: 40, exported: true }, { name: "Data", key: "Data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, tag: "protobuf:\"bytes,3,opt,name=data,proto3\" json:\"data,omitempty\"", index: [3], offset: 56, exported: true }, { name: "DataIsZero", key: "DataIsZero", type: { kind: $.TypeKind.Basic, name: "bool" }, tag: "protobuf:\"varint,4,opt,name=data_is_zero,json=dataIsZero,proto3\" json:\"dataIsZero,omitempty\"", index: [4], offset: 80, exported: true }]
	)
}

export class CallData {
	public get unknownFields(): $.Slice<number> {
		return this._fields.unknownFields.value
	}
	public set unknownFields(value: $.Slice<number>) {
		this._fields.unknownFields.value = value
	}

	// Data contains the packet in the sequence.
	public get Data(): $.Slice<number> {
		return this._fields.Data.value
	}
	public set Data(value: $.Slice<number>) {
		this._fields.Data.value = value
	}

	// DataIsZero indicates Data is set with an empty message.
	public get DataIsZero(): boolean {
		return this._fields.DataIsZero.value
	}
	public set DataIsZero(value: boolean) {
		this._fields.DataIsZero.value = value
	}

	// Complete indicates the RPC call is completed.
	public get Complete(): boolean {
		return this._fields.Complete.value
	}
	public set Complete(value: boolean) {
		this._fields.Complete.value = value
	}

	// Error contains any error that caused the RPC to fail.
	// If set, implies complete=true.
	public get Error(): string {
		return this._fields.Error.value
	}
	public set Error(value: string) {
		this._fields.Error.value = value
	}

	public _fields: {
		unknownFields: $.VarRef<$.Slice<number>>
		Data: $.VarRef<$.Slice<number>>
		DataIsZero: $.VarRef<boolean>
		Complete: $.VarRef<boolean>
		Error: $.VarRef<string>
	}

	constructor(init?: Partial<{unknownFields?: $.Slice<number>, Data?: $.Slice<number>, DataIsZero?: boolean, Complete?: boolean, Error?: string}>) {
		this._fields = {
			unknownFields: $.varRef(init?.unknownFields ?? (null as $.Slice<number>)),
			Data: $.varRef(init?.Data ?? (null as $.Slice<number>)),
			DataIsZero: $.varRef(init?.DataIsZero ?? (false as boolean)),
			Complete: $.varRef(init?.Complete ?? (false as boolean)),
			Error: $.varRef(init?.Error ?? ("" as string))
		}
	}

	public clone(): CallData {
		const cloned = new CallData()
		cloned._fields = {
			unknownFields: $.varRef(this._fields.unknownFields.value),
			Data: $.varRef(this._fields.Data.value),
			DataIsZero: $.varRef(this._fields.DataIsZero.value),
			Complete: $.varRef(this._fields.Complete.value),
			Error: $.varRef(this._fields.Error.value)
		}
		return $.markAsStructValue(cloned)
	}

	public CloneMessageVT(): protobuf_go_lite.CloneMessage | null {
		const m: CallData | $.VarRef<CallData> | null = this
		return $.interfaceValue<protobuf_go_lite.CloneMessage | null>(CallData.prototype.CloneVT.call(m), "*srpc.CallData")
	}

	public CloneVT(): CallData | $.VarRef<CallData> | null {
		const m: CallData | $.VarRef<CallData> | null = this
		if (m == null) {
			return null
		}
		let r: CallData | $.VarRef<CallData> | null = new CallData()
		$.pointerValue<CallData>(r).DataIsZero = $.pointerValue<CallData>(m).DataIsZero
		$.pointerValue<CallData>(r).Complete = $.pointerValue<CallData>(m).Complete
		$.pointerValue<CallData>(r).Error = $.pointerValue<CallData>(m).Error
		{
			let rhs: $.Slice<number> = $.pointerValue<CallData>(m).Data
			if (rhs != null) {
				$.pointerValue<CallData>(r).Data = (slices.Clone(rhs) as $.Slice<number>)
			}
		}
		if ($.len($.pointerValue<CallData>(m).unknownFields) > 0) {
			$.pointerValue<CallData>(r).unknownFields = (slices.Clone($.pointerValue<CallData>(m).unknownFields) as $.Slice<number>)
		}
		return r
	}

	public EqualMessageVT(thatMsg: any): boolean {
		const _this: CallData | $.VarRef<CallData> | null = this
		let __goscriptTuple21: any = $.typeAssertTuple<CallData | $.VarRef<CallData> | null>(thatMsg, { kind: $.TypeKind.Pointer, elemType: "srpc.CallData" })
		let that: CallData | $.VarRef<CallData> | null = __goscriptTuple21[0]
		let ok = __goscriptTuple21[1]
		if (!ok) {
			return false
		}
		return CallData.prototype.EqualVT.call(_this, that)
	}

	public EqualVT(that: CallData | $.VarRef<CallData> | null): boolean {
		const _this: CallData | $.VarRef<CallData> | null = this
		if (_this == that) {
			return true
		} else {
			if ((_this == null) || (that == null)) {
				return false
			}
		}
		if (!$.stringEqual($.bytesToString($.pointerValue<CallData>(_this).Data), $.bytesToString($.pointerValue<CallData>(that).Data))) {
			return false
		}
		if ($.pointerValue<CallData>(_this).DataIsZero != $.pointerValue<CallData>(that).DataIsZero) {
			return false
		}
		if ($.pointerValue<CallData>(_this).Complete != $.pointerValue<CallData>(that).Complete) {
			return false
		}
		if (!$.stringEqual($.pointerValue<CallData>(_this).Error, $.pointerValue<CallData>(that).Error)) {
			return false
		}
		return $.stringEqual($.bytesToString($.pointerValue<CallData>(_this).unknownFields), $.bytesToString($.pointerValue<CallData>(that).unknownFields))
	}

	public GetComplete(): boolean {
		const x: CallData | $.VarRef<CallData> | null = this
		if (x != null) {
			return $.pointerValue<CallData>(x).Complete
		}
		return false
	}

	public GetData(): $.Slice<number> {
		const x: CallData | $.VarRef<CallData> | null = this
		if (x != null) {
			return $.pointerValue<CallData>(x).Data
		}
		return null
	}

	public GetDataIsZero(): boolean {
		const x: CallData | $.VarRef<CallData> | null = this
		if (x != null) {
			return $.pointerValue<CallData>(x).DataIsZero
		}
		return false
	}

	public GetError(): string {
		const x: CallData | $.VarRef<CallData> | null = this
		if (x != null) {
			return $.pointerValue<CallData>(x).Error
		}
		return ""
	}

	public MarshalJSON(): [$.Slice<number>, $.GoError] {
		const x: CallData | $.VarRef<CallData> | null = this
		return $.markAsStructValue($.cloneStructValue($.pointerValue<json.MarshalerConfig>(json.DefaultMarshalerConfig))).Marshal($.pointerValueOrNil($.interfaceValue<json.Marshaler | null>(x, "*srpc.CallData"))!)
	}

	public MarshalProtoJSON(s: json.MarshalState | $.VarRef<json.MarshalState> | null): void {
		const x: CallData | $.VarRef<CallData> | null = this
		if (x == null) {
			json.MarshalState.prototype.WriteNil.call($.pointerValue<json.MarshalState>(s))
			return
		}
		json.MarshalState.prototype.WriteObjectStart.call($.pointerValue<json.MarshalState>(s))
		let wroteField: $.VarRef<boolean> = $.varRef(false)
		if (($.len($.pointerValue<CallData>(x).Data) > 0) || json.MarshalState.prototype.HasField.call($.pointerValue<json.MarshalState>(s), "data")) {
			json.MarshalState.prototype.WriteMoreIf.call($.pointerValue<json.MarshalState>(s), wroteField)
			json.MarshalState.prototype.WriteObjectField.call($.pointerValue<json.MarshalState>(s), "data")
			json.MarshalState.prototype.WriteBytes.call($.pointerValue<json.MarshalState>(s), $.pointerValue<CallData>(x).Data)
		}
		if ($.pointerValue<CallData>(x).DataIsZero || json.MarshalState.prototype.HasField.call($.pointerValue<json.MarshalState>(s), "dataIsZero")) {
			json.MarshalState.prototype.WriteMoreIf.call($.pointerValue<json.MarshalState>(s), wroteField)
			json.MarshalState.prototype.WriteObjectField.call($.pointerValue<json.MarshalState>(s), "dataIsZero")
			json.MarshalState.prototype.WriteBool.call($.pointerValue<json.MarshalState>(s), $.pointerValue<CallData>(x).DataIsZero)
		}
		if ($.pointerValue<CallData>(x).Complete || json.MarshalState.prototype.HasField.call($.pointerValue<json.MarshalState>(s), "complete")) {
			json.MarshalState.prototype.WriteMoreIf.call($.pointerValue<json.MarshalState>(s), wroteField)
			json.MarshalState.prototype.WriteObjectField.call($.pointerValue<json.MarshalState>(s), "complete")
			json.MarshalState.prototype.WriteBool.call($.pointerValue<json.MarshalState>(s), $.pointerValue<CallData>(x).Complete)
		}
		if ((!$.stringEqual($.pointerValue<CallData>(x).Error, "")) || json.MarshalState.prototype.HasField.call($.pointerValue<json.MarshalState>(s), "error")) {
			json.MarshalState.prototype.WriteMoreIf.call($.pointerValue<json.MarshalState>(s), wroteField)
			json.MarshalState.prototype.WriteObjectField.call($.pointerValue<json.MarshalState>(s), "error")
			json.MarshalState.prototype.WriteString.call($.pointerValue<json.MarshalState>(s), $.pointerValue<CallData>(x).Error)
		}
		json.MarshalState.prototype.WriteObjectEnd.call($.pointerValue<json.MarshalState>(s))
	}

	public MarshalProtoText(): string {
		const x: CallData | $.VarRef<CallData> | null = this
		let sb: $.VarRef<strings.Builder> = $.varRef($.markAsStructValue(new strings.Builder()))
		sb.value.WriteString("CallData {")
		if ($.pointerValue<CallData>(x).Data != null) {
			if (sb.value.Len() > 10) {
				sb.value.WriteString(" ")
			}
			sb.value.WriteString("data: ")
			sb.value.WriteString("\"")
			sb.value.WriteString(base64.Encoding.prototype.EncodeToString.call(base64.StdEncoding, $.pointerValue<CallData>(x).Data))
			sb.value.WriteString("\"")
		}
		if ($.pointerValue<CallData>(x).DataIsZero != false) {
			if (sb.value.Len() > 10) {
				sb.value.WriteString(" ")
			}
			sb.value.WriteString("data_is_zero: ")
			sb.value.WriteString(strconv.FormatBool($.pointerValue<CallData>(x).DataIsZero))
		}
		if ($.pointerValue<CallData>(x).Complete != false) {
			if (sb.value.Len() > 10) {
				sb.value.WriteString(" ")
			}
			sb.value.WriteString("complete: ")
			sb.value.WriteString(strconv.FormatBool($.pointerValue<CallData>(x).Complete))
		}
		if (!$.stringEqual($.pointerValue<CallData>(x).Error, "")) {
			if (sb.value.Len() > 10) {
				sb.value.WriteString(" ")
			}
			sb.value.WriteString("error: ")
			sb.value.WriteString(strconv.Quote($.pointerValue<CallData>(x).Error))
		}
		sb.value.WriteString("}")
		return sb.value.String()
	}

	public MarshalToSizedBufferVT(dAtA: $.Slice<number>): [number, $.GoError] {
		const m: CallData | $.VarRef<CallData> | null = this
		if (m == null) {
			return [0, null]
		}
		let i = $.len(dAtA)
		i
		let l: number = 0
		l
		if ($.pointerValue<CallData>(m).unknownFields != null) {
			i = i - ($.len($.pointerValue<CallData>(m).unknownFields))
			$.copy($.goSlice(dAtA, i, undefined), $.pointerValue<CallData>(m).unknownFields)
		}
		if ($.len($.pointerValue<CallData>(m).Error) > 0) {
			i = i - ($.len($.pointerValue<CallData>(m).Error))
			$.copy($.goSlice(dAtA, i, undefined), $.pointerValue<CallData>(m).Error)
			i = protobuf_go_lite.EncodeVarint(dAtA, i, $.uint64($.len($.pointerValue<CallData>(m).Error)))
			i--
			dAtA![i] = $.uint(0x22, 8)
		}
		if ($.pointerValue<CallData>(m).Complete) {
			i--
			if ($.pointerValue<CallData>(m).Complete) {
				dAtA![i] = $.uint(1, 8)
			} else {
				dAtA![i] = $.uint(0, 8)
			}
			i--
			dAtA![i] = $.uint(0x18, 8)
		}
		if ($.pointerValue<CallData>(m).DataIsZero) {
			i--
			if ($.pointerValue<CallData>(m).DataIsZero) {
				dAtA![i] = $.uint(1, 8)
			} else {
				dAtA![i] = $.uint(0, 8)
			}
			i--
			dAtA![i] = $.uint(0x10, 8)
		}
		if ($.len($.pointerValue<CallData>(m).Data) > 0) {
			i = i - ($.len($.pointerValue<CallData>(m).Data))
			$.copy($.goSlice(dAtA, i, undefined), $.pointerValue<CallData>(m).Data)
			i = protobuf_go_lite.EncodeVarint(dAtA, i, $.uint64($.len($.pointerValue<CallData>(m).Data)))
			i--
			dAtA![i] = $.uint(0xa, 8)
		}
		return [$.len(dAtA) - i, null]
	}

	public MarshalToVT(dAtA: $.Slice<number>): [number, $.GoError] {
		const m: CallData | $.VarRef<CallData> | null = this
		let size = CallData.prototype.SizeVT.call(m)
		return CallData.prototype.MarshalToSizedBufferVT.call(m, $.goSlice(dAtA, undefined, size))
	}

	public MarshalVT(): [$.Slice<number>, $.GoError] {
		const m: CallData | $.VarRef<CallData> | null = this
		let dAtA: $.Slice<number> = null as $.Slice<number>
		let err: $.GoError = null as $.GoError
		if (m == null) {
			return [null, null]
		}
		let size = CallData.prototype.SizeVT.call(m)
		dAtA = $.makeSlice<number>(size, undefined, "byte")
		let __goscriptTuple22: any = CallData.prototype.MarshalToSizedBufferVT.call(m, $.goSlice(dAtA, undefined, size))
		let n = __goscriptTuple22[0]
		err = __goscriptTuple22[1]
		if (err != null) {
			return [null, err]
		}
		return [$.goSlice(dAtA, undefined, n), null]
	}

	public ProtoMessage(): void {
	}

	public Reset(): void {
		let x: CallData | $.VarRef<CallData> | null = this
		$.assignStruct($.pointerValue<CallData>(x), $.markAsStructValue(new CallData()))
	}

	public SizeVT(): number {
		const m: CallData | $.VarRef<CallData> | null = this
		let n: number = 0
		if (m == null) {
			return 0
		}
		let l: number = 0
		l
		l = $.len($.pointerValue<CallData>(m).Data)
		if (l > 0) {
			n = n + ((1 + l) + protobuf_go_lite.SizeOfVarint($.uint64(l)))
		}
		if ($.pointerValue<CallData>(m).DataIsZero) {
			n = n + (2)
		}
		if ($.pointerValue<CallData>(m).Complete) {
			n = n + (2)
		}
		l = $.len($.pointerValue<CallData>(m).Error)
		if (l > 0) {
			n = n + ((1 + l) + protobuf_go_lite.SizeOfVarint($.uint64(l)))
		}
		n = n + ($.len($.pointerValue<CallData>(m).unknownFields))
		return n
	}

	public String(): string {
		const x: CallData | $.VarRef<CallData> | null = this
		return CallData.prototype.MarshalProtoText.call(x)
	}

	public UnmarshalJSON(b: $.Slice<number>): $.GoError {
		const x: CallData | $.VarRef<CallData> | null = this
		return $.markAsStructValue($.cloneStructValue($.pointerValue<json.UnmarshalerConfig>(json.DefaultUnmarshalerConfig))).Unmarshal(b, $.pointerValueOrNil($.interfaceValue<json.Unmarshaler | null>(x, "*srpc.CallData"))!)
	}

	public UnmarshalProtoJSON(s: json.UnmarshalState | $.VarRef<json.UnmarshalState> | null): void {
		const x: CallData | $.VarRef<CallData> | null = this
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
				case "data":
				{
					json.UnmarshalState.prototype.AddField.call($.pointerValue<json.UnmarshalState>(s), "data")
					$.pointerValue<CallData>(x).Data = json.UnmarshalState.prototype.ReadBytes.call($.pointerValue<json.UnmarshalState>(s))
					break
				}
				case "data_is_zero":
				case "dataIsZero":
				{
					json.UnmarshalState.prototype.AddField.call($.pointerValue<json.UnmarshalState>(s), "data_is_zero")
					$.pointerValue<CallData>(x).DataIsZero = json.UnmarshalState.prototype.ReadBool.call($.pointerValue<json.UnmarshalState>(s))
					break
				}
				case "complete":
				{
					json.UnmarshalState.prototype.AddField.call($.pointerValue<json.UnmarshalState>(s), "complete")
					$.pointerValue<CallData>(x).Complete = json.UnmarshalState.prototype.ReadBool.call($.pointerValue<json.UnmarshalState>(s))
					break
				}
				case "error":
				{
					json.UnmarshalState.prototype.AddField.call($.pointerValue<json.UnmarshalState>(s), "error")
					$.pointerValue<CallData>(x).Error = json.UnmarshalState.prototype.ReadString.call($.pointerValue<json.UnmarshalState>(s))
					break
				}
			}
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [] } as $.FunctionTypeInfo)))
	}

	public UnmarshalVT(dAtA: $.Slice<number>): $.GoError {
		let m: CallData | $.VarRef<CallData> | null = this
		let l = $.len(dAtA)
		let iNdEx = 0
		let err: $.GoError = null as $.GoError
		while (iNdEx < l) {
			let preIndex = iNdEx
			let wire: bigint = 0n
			let __goscriptTuple23: any = protobuf_go_lite.DecodeVarint(dAtA, iNdEx)
			wire = __goscriptTuple23[0]
			iNdEx = __goscriptTuple23[1]
			err = __goscriptTuple23[2]
			if (err != null) {
				return err
			}
			let fieldNum = $.int($.int($.uint64Shr(wire, 3), 32), 32)
			let wireType = $.int($.uint64And(wire, 0x7))
			if (wireType == 4) {
				return fmt.Errorf("proto: CallData: wiretype end group for non-group")
			}
			if (fieldNum <= 0) {
				return fmt.Errorf("proto: CallData: illegal tag %d (wire type %d)", $.namedValueInterfaceValue<any>(fieldNum, "int32", {}, { kind: $.TypeKind.Basic, name: "int32" }), $.namedValueInterfaceValue<any>(wire, "uint64", {}, { kind: $.TypeKind.Basic, name: "uint64" }))
			}
			switch (fieldNum) {
				case 1:
				{
					if (wireType != 2) {
						return fmt.Errorf("proto: wrong wireType = %d for field Data", $.namedValueInterfaceValue<any>(wireType, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
					}
					let byteLen: number = 0
					let _v: bigint = 0n
					let __goscriptTuple24: any = protobuf_go_lite.DecodeVarint(dAtA, iNdEx)
					_v = __goscriptTuple24[0]
					iNdEx = __goscriptTuple24[1]
					err = __goscriptTuple24[2]
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
					$.pointerValue<CallData>(m).Data = $.appendSlice($.goSlice($.pointerValue<CallData>(m).Data, undefined, 0), $.goSlice(dAtA, iNdEx, postIndex))
					if ($.pointerValue<CallData>(m).Data == null) {
						$.pointerValue<CallData>(m).Data = $.arrayToSlice<number>([])
					}
					iNdEx = postIndex
					break
				}
				case 2:
				{
					if (wireType != 0) {
						return fmt.Errorf("proto: wrong wireType = %d for field DataIsZero", $.namedValueInterfaceValue<any>(wireType, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
					}
					let v: number = 0
					let _v: bigint = 0n
					let __goscriptTuple25: any = protobuf_go_lite.DecodeVarint(dAtA, iNdEx)
					_v = __goscriptTuple25[0]
					iNdEx = __goscriptTuple25[1]
					err = __goscriptTuple25[2]
					v = $.int(_v)
					if (err != null) {
						return err
					}
					$.pointerValue<CallData>(m).DataIsZero = v != 0
					break
				}
				case 3:
				{
					if (wireType != 0) {
						return fmt.Errorf("proto: wrong wireType = %d for field Complete", $.namedValueInterfaceValue<any>(wireType, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
					}
					let v: number = 0
					let _v: bigint = 0n
					let __goscriptTuple26: any = protobuf_go_lite.DecodeVarint(dAtA, iNdEx)
					_v = __goscriptTuple26[0]
					iNdEx = __goscriptTuple26[1]
					err = __goscriptTuple26[2]
					v = $.int(_v)
					if (err != null) {
						return err
					}
					$.pointerValue<CallData>(m).Complete = v != 0
					break
				}
				case 4:
				{
					if (wireType != 2) {
						return fmt.Errorf("proto: wrong wireType = %d for field Error", $.namedValueInterfaceValue<any>(wireType, "int", {}, { kind: $.TypeKind.Basic, name: "int" }))
					}
					let stringLen: bigint = 0n
					let __goscriptTuple27: any = protobuf_go_lite.DecodeVarint(dAtA, iNdEx)
					stringLen = __goscriptTuple27[0]
					iNdEx = __goscriptTuple27[1]
					err = __goscriptTuple27[2]
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
					$.pointerValue<CallData>(m).Error = $.bytesToString($.goSlice(dAtA, iNdEx, postIndex))
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
					$.pointerValue<CallData>(m).unknownFields = $.appendSlice($.pointerValue<CallData>(m).unknownFields, $.goSlice(dAtA, iNdEx, iNdEx + skippy))
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

	public Validate(): $.GoError {
		const p: CallData | $.VarRef<CallData> | null = this
		if (((($.len(CallData.prototype.GetData.call(p)) == 0) && !CallData.prototype.GetComplete.call(p)) && ($.len(CallData.prototype.GetError.call(p)) == 0)) && !CallData.prototype.GetDataIsZero.call(p)) {
			return __goscript_errors.ErrEmptyPacket
		}
		return null
	}

	static __typeInfo = $.registerStructType(
		"srpc.CallData",
		() => new CallData(),
		[{ name: "CloneMessageVT", args: [], returns: [{ name: "_r0", type: "protobuf_go_lite.CloneMessage" }] }, { name: "CloneVT", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Pointer, elemType: "srpc.CallData" } }] }, { name: "EqualMessageVT", args: [{ name: "thatMsg", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "EqualVT", args: [{ name: "that", type: { kind: $.TypeKind.Pointer, elemType: "srpc.CallData" } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "GetComplete", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "GetData", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }] }, { name: "GetDataIsZero", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "GetError", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "MarshalJSON", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "_r1", type: "error" }] }, { name: "MarshalProtoJSON", args: [{ name: "s", type: { kind: $.TypeKind.Pointer, elemType: "json.MarshalState" } }], returns: [] }, { name: "MarshalProtoText", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "MarshalToSizedBufferVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "MarshalToVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "_r1", type: "error" }] }, { name: "MarshalVT", args: [], returns: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "err", type: "error" }] }, { name: "ProtoMessage", args: [], returns: [] }, { name: "Reset", args: [], returns: [] }, { name: "SizeVT", args: [], returns: [{ name: "n", type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "String", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "UnmarshalJSON", args: [{ name: "b", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "UnmarshalProtoJSON", args: [{ name: "s", type: { kind: $.TypeKind.Pointer, elemType: "json.UnmarshalState" } }], returns: [] }, { name: "UnmarshalVT", args: [{ name: "dAtA", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [{ name: "_r0", type: "error" }] }, { name: "Validate", args: [], returns: [{ name: "_r0", type: "error" }] }],
		CallData,
		[{ name: "unknownFields", key: "unknownFields", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, pkgPath: "github.com/aperturerobotics/starpc/srpc", index: [0], offset: 0, exported: false }, { name: "Data", key: "Data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } }, tag: "protobuf:\"bytes,1,opt,name=data,proto3\" json:\"data,omitempty\"", index: [1], offset: 24, exported: true }, { name: "DataIsZero", key: "DataIsZero", type: { kind: $.TypeKind.Basic, name: "bool" }, tag: "protobuf:\"varint,2,opt,name=data_is_zero,json=dataIsZero,proto3\" json:\"dataIsZero,omitempty\"", index: [2], offset: 48, exported: true }, { name: "Complete", key: "Complete", type: { kind: $.TypeKind.Basic, name: "bool" }, tag: "protobuf:\"varint,3,opt,name=complete,proto3\" json:\"complete,omitempty\"", index: [3], offset: 49, exported: true }, { name: "Error", key: "Error", type: { kind: $.TypeKind.Basic, name: "string" }, tag: "protobuf:\"bytes,4,opt,name=error,proto3\" json:\"error,omitempty\"", index: [4], offset: 56, exported: true }]
	)
}

export type isPacket_Body = {
	isPacket_Body(): void
}

$.registerInterfaceType(
	"srpc.isPacket_Body",
	null,
	[{ name: "isPacket_Body", args: [], returns: [] }]
);
