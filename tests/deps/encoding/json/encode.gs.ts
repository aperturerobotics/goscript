import * as $ from "@goscript/builtin/index.js"
import { indirect } from "./decode.gs.js";
import { foldName } from "./fold.gs.js";
import { appendCompact, appendHTMLEscape, appendIndent } from "./indent.gs.js";
import { parseTag, tagOptions_Contains } from "./tags.gs.js";
import { numberType } from "./decode.gs.js";
import { indentGrowthFactor } from "./indent.gs.js";
import { htmlSafeSet, safeSet } from "./tables.gs.js";
import * as io from "@goscript/io/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as cmp from "@goscript/cmp/index.js"

import * as encoding from "@goscript/encoding/index.js"

import * as base64 from "@goscript/encoding/base64/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as math from "@goscript/math/index.js"

import * as reflect from "@goscript/reflect/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as strings from "@goscript/strings/index.js"

import * as sync from "@goscript/sync/index.js"

import * as unicode from "@goscript/unicode/index.js"

import * as utf8 from "@goscript/unicode/utf8/index.js"

// for linkname

export let hex: string = "0123456789abcdef"

export let startDetectingCyclesAfter: number = 1000

export class InvalidUTF8Error {
	// the whole string value that caused the error
	public get S(): string {
		return this._fields.S.value
	}
	public set S(value: string) {
		this._fields.S.value = value
	}

	public _fields: {
		S: $.VarRef<string>;
	}

	constructor(init?: Partial<{S?: string}>) {
		this._fields = {
			S: $.varRef(init?.S ?? "")
		}
	}

	public clone(): InvalidUTF8Error {
		const cloned = new InvalidUTF8Error()
		cloned._fields = {
			S: $.varRef(this._fields.S.value)
		}
		return cloned
	}

	public Error(): string {
		const e = this
		return "json: invalid UTF-8 in string: " + strconv.Quote(e.S)
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.InvalidUTF8Error',
	  new InvalidUTF8Error(),
	  [{ name: "Error", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  InvalidUTF8Error,
	  {"S": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

export type Marshaler = null | {
	MarshalJSON(): [$.Bytes, $.GoError]
}

$.registerInterfaceType(
  'encoding/json.Marshaler',
  null, // Zero value for interface is null
  [{ name: "MarshalJSON", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }]
);

export class MarshalerError {
	public get Type(): null | reflect.Type {
		return this._fields.Type.value
	}
	public set Type(value: null | reflect.Type) {
		this._fields.Type.value = value
	}

	public get Err(): $.GoError {
		return this._fields.Err.value
	}
	public set Err(value: $.GoError) {
		this._fields.Err.value = value
	}

	public get sourceFunc(): string {
		return this._fields.sourceFunc.value
	}
	public set sourceFunc(value: string) {
		this._fields.sourceFunc.value = value
	}

	public _fields: {
		Type: $.VarRef<null | reflect.Type>;
		Err: $.VarRef<$.GoError>;
		sourceFunc: $.VarRef<string>;
	}

	constructor(init?: Partial<{Err?: $.GoError, Type?: null | reflect.Type, sourceFunc?: string}>) {
		this._fields = {
			Type: $.varRef(init?.Type ?? null),
			Err: $.varRef(init?.Err ?? null),
			sourceFunc: $.varRef(init?.sourceFunc ?? "")
		}
	}

	public clone(): MarshalerError {
		const cloned = new MarshalerError()
		cloned._fields = {
			Type: $.varRef(this._fields.Type.value),
			Err: $.varRef(this._fields.Err.value),
			sourceFunc: $.varRef(this._fields.sourceFunc.value)
		}
		return cloned
	}

	public Error(): string {
		const e = this
		let srcFunc = e.sourceFunc
		if (srcFunc == "") {
			srcFunc = "MarshalJSON"
		}
		return "json: error calling " + srcFunc + " for type " + e.Type!.String() + ": " + e.Err!.Error()
	}

	// Unwrap returns the underlying error.
	public Unwrap(): $.GoError {
		const e = this
		return e.Err
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.MarshalerError',
	  new MarshalerError(),
	  [{ name: "Error", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Unwrap", args: [], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }],
	  MarshalerError,
	  {"Type": "Type", "Err": { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] }, "sourceFunc": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

export class UnsupportedTypeError {
	public get Type(): null | reflect.Type {
		return this._fields.Type.value
	}
	public set Type(value: null | reflect.Type) {
		this._fields.Type.value = value
	}

	public _fields: {
		Type: $.VarRef<null | reflect.Type>;
	}

	constructor(init?: Partial<{Type?: null | reflect.Type}>) {
		this._fields = {
			Type: $.varRef(init?.Type ?? null)
		}
	}

	public clone(): UnsupportedTypeError {
		const cloned = new UnsupportedTypeError()
		cloned._fields = {
			Type: $.varRef(this._fields.Type.value)
		}
		return cloned
	}

	public Error(): string {
		const e = this
		return "json: unsupported type: " + e.Type!.String()
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.UnsupportedTypeError',
	  new UnsupportedTypeError(),
	  [{ name: "Error", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  UnsupportedTypeError,
	  {"Type": "Type"}
	);
}

export class UnsupportedValueError {
	public get Value(): reflect.Value {
		return this._fields.Value.value
	}
	public set Value(value: reflect.Value) {
		this._fields.Value.value = value
	}

	public get Str(): string {
		return this._fields.Str.value
	}
	public set Str(value: string) {
		this._fields.Str.value = value
	}

	public _fields: {
		Value: $.VarRef<reflect.Value>;
		Str: $.VarRef<string>;
	}

	constructor(init?: Partial<{Str?: string, Value?: reflect.Value}>) {
		this._fields = {
			Value: $.varRef(init?.Value ? $.markAsStructValue(init.Value.clone()) : new reflect.Value()),
			Str: $.varRef(init?.Str ?? "")
		}
	}

	public clone(): UnsupportedValueError {
		const cloned = new UnsupportedValueError()
		cloned._fields = {
			Value: $.varRef($.markAsStructValue(this._fields.Value.value.clone())),
			Str: $.varRef(this._fields.Str.value)
		}
		return cloned
	}

	public Error(): string {
		const e = this
		return "json: unsupported value: " + e.Str
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.UnsupportedValueError',
	  new UnsupportedValueError(),
	  [{ name: "Error", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  UnsupportedValueError,
	  {"Value": "Value", "Str": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

export class encOpts {
	// quoted causes primitive fields to be encoded inside JSON strings.
	public get quoted(): boolean {
		return this._fields.quoted.value
	}
	public set quoted(value: boolean) {
		this._fields.quoted.value = value
	}

	// escapeHTML causes '<', '>', and '&' to be escaped in JSON strings.
	public get escapeHTML(): boolean {
		return this._fields.escapeHTML.value
	}
	public set escapeHTML(value: boolean) {
		this._fields.escapeHTML.value = value
	}

	public _fields: {
		quoted: $.VarRef<boolean>;
		escapeHTML: $.VarRef<boolean>;
	}

	constructor(init?: Partial<{escapeHTML?: boolean, quoted?: boolean}>) {
		this._fields = {
			quoted: $.varRef(init?.quoted ?? false),
			escapeHTML: $.varRef(init?.escapeHTML ?? false)
		}
	}

	public clone(): encOpts {
		const cloned = new encOpts()
		cloned._fields = {
			quoted: $.varRef(this._fields.quoted.value),
			escapeHTML: $.varRef(this._fields.escapeHTML.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.encOpts',
	  new encOpts(),
	  [],
	  encOpts,
	  {"quoted": { kind: $.TypeKind.Basic, name: "bool" }, "escapeHTML": { kind: $.TypeKind.Basic, name: "bool" }}
	);
}

export class encodeState {
	// Keep track of what pointers we've seen in the current recursive call
	// path, to avoid cycles that could lead to a stack overflow. Only do
	// the relatively expensive map operations if ptrLevel is larger than
	// startDetectingCyclesAfter, so that we skip the work if we're within a
	// reasonable amount of nested pointers deep.
	public get ptrLevel(): number {
		return this._fields.ptrLevel.value
	}
	public set ptrLevel(value: number) {
		this._fields.ptrLevel.value = value
	}

	public get ptrSeen(): Map<null | any, {  }> | null {
		return this._fields.ptrSeen.value
	}
	public set ptrSeen(value: Map<null | any, {  }> | null) {
		this._fields.ptrSeen.value = value
	}

	public get Buffer(): bytes.Buffer {
		return this._fields.Buffer.value
	}
	public set Buffer(value: bytes.Buffer) {
		this._fields.Buffer.value = value
	}

	public _fields: {
		Buffer: $.VarRef<bytes.Buffer>;
		ptrLevel: $.VarRef<number>;
		ptrSeen: $.VarRef<Map<null | any, {  }> | null>;
	}

	constructor(init?: Partial<{Buffer?: Partial<ConstructorParameters<typeof bytes.Buffer>[0]>, ptrLevel?: number, ptrSeen?: Map<null | any, {  }> | null}>) {
		this._fields = {
			Buffer: $.varRef(new bytes.Buffer(init?.Buffer)),
			ptrLevel: $.varRef(init?.ptrLevel ?? 0),
			ptrSeen: $.varRef(init?.ptrSeen ?? null)
		}
	}

	public clone(): encodeState {
		const cloned = new encodeState()
		cloned._fields = {
			Buffer: $.varRef($.markAsStructValue(this._fields.Buffer.value.clone())),
			ptrLevel: $.varRef(this._fields.ptrLevel.value),
			ptrSeen: $.varRef(this._fields.ptrSeen.value)
		}
		return cloned
	}

	public async marshal(v: null | any, opts: encOpts): Promise<$.GoError> {
		const e = this
		using __defer = new $.DisposableStack();
		let err: $.GoError = null
		__defer.defer(() => {
			{
				let r = $.recover()
				if (r != null) {
					{
						let { value: je, ok: ok } = $.typeAssert<jsonError>(r, 'encoding/json.jsonError')
						if (ok) {
							err = je.error
						} else {
							$.panic(r)
						}
					}
				}
			}
		});
		await e.reflectValue(reflect.ValueOf(v), opts)
		return null
	}

	// error aborts the encoding by panicking with err wrapped in jsonError.
	public error(err: $.GoError): void {
		$.panic($.markAsStructValue(new jsonError({})))
	}

	public async reflectValue(v: reflect.Value, opts: encOpts): Promise<void> {
		const e = this
		;(await valueEncoder(v))!(e, v, opts)
	}

	public Available(): number {
		return this.Buffer.Available()
	}

	public AvailableBuffer(): $.Bytes {
		return this.Buffer.AvailableBuffer()
	}

	public Bytes(): $.Bytes {
		return this.Buffer.Bytes()
	}

	public Cap(): number {
		return this.Buffer.Cap()
	}

	public Grow(n: number): void {
		this.Buffer.Grow(n)
	}

	public Len(): number {
		return this.Buffer.Len()
	}

	public Next(n: number): $.Bytes {
		return this.Buffer.Next(n)
	}

	public Read(p: $.Bytes): [number, $.GoError] {
		return this.Buffer.Read(p)
	}

	public ReadByte(): [number, $.GoError] {
		return this.Buffer.ReadByte()
	}

	public ReadBytes(delim: number): [$.Bytes, $.GoError] {
		return this.Buffer.ReadBytes(delim)
	}

	public ReadFrom(r: io.Reader): [number, $.GoError] {
		return this.Buffer.ReadFrom(r)
	}

	public ReadRune(): [number, number, $.GoError] {
		return this.Buffer.ReadRune()
	}

	public ReadString(delim: number): [string, $.GoError] {
		return this.Buffer.ReadString(delim)
	}

	public Reset(): void {
		this.Buffer.Reset()
	}

	public String(): string {
		return this.Buffer.String()
	}

	public Truncate(n: number): void {
		this.Buffer.Truncate(n)
	}

	public UnreadByte(): $.GoError {
		return this.Buffer.UnreadByte()
	}

	public UnreadRune(): $.GoError {
		return this.Buffer.UnreadRune()
	}

	public Write(p: $.Bytes): [number, $.GoError] {
		return this.Buffer.Write(p)
	}

	public WriteByte(c: number): $.GoError {
		return this.Buffer.WriteByte(c)
	}

	public WriteRune(r: number): [number, $.GoError] {
		return this.Buffer.WriteRune(r)
	}

	public WriteString(s: string): [number, $.GoError] {
		return this.Buffer.WriteString(s)
	}

	public WriteTo(w: io.Writer): [number, $.GoError] {
		return this.Buffer.WriteTo(w)
	}

	public empty(): boolean {
		return this.Buffer.empty()
	}

	public grow(n: number): number {
		return this.Buffer.grow(n)
	}

	public readSlice(delim: number): [$.Bytes, $.GoError] {
		return this.Buffer.readSlice(delim)
	}

	public tryGrowByReslice(n: number): [number, boolean] {
		return this.Buffer.tryGrowByReslice(n)
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.encodeState',
	  new encodeState(),
	  [{ name: "marshal", args: [{ name: "v", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "opts", type: "encOpts" }], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "error", args: [{ name: "err", type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }], returns: [] }, { name: "reflectValue", args: [{ name: "v", type: "Value" }, { name: "opts", type: "encOpts" }], returns: [] }],
	  encodeState,
	  {"Buffer": "Buffer", "ptrLevel": { kind: $.TypeKind.Basic, name: "uint" }, "ptrSeen": { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Interface, methods: [] }, elemType: { kind: $.TypeKind.Struct, fields: {}, methods: [] } }}
	);
}

export type encoderFunc = ((e: encodeState | null, v: reflect.Value, opts: encOpts) => void) | null;

// number of bits
export type floatEncoder = number;

export function floatEncoder_encode(bits: floatEncoder, e: encodeState | null, v: reflect.Value, opts: encOpts): void {
	let f = v.Float()
	if (math.IsInf(f, 0) || math.IsNaN(f)) {
		e!.error(new UnsupportedValueError({Str: strconv.FormatFloat(f, 103, -1, bits), Value: v}))
	}
	let b = e!.AvailableBuffer()
	b = mayAppendQuote(b, opts.quoted)
	let abs = math.Abs(f)
	let fmt = $.byte(102)
	if (abs != 0) {
		if (bits == 64 && (abs < 1e-6 || abs >= 1e21) || bits == 32 && ((abs as number) < 1e-6 || (abs as number) >= 1e21)) {
			fmt = 101
		}
	}
	b = strconv.AppendFloat(b, f, fmt, -1, bits)
	if (fmt == 101) {
		// clean up e-09 to e-9
		let n = $.len(b)
		if (n >= 4 && b![n - 4] == 101 && b![n - 3] == 45 && b![n - 2] == 48) {
			b![n - 2] = b![n - 1]
			b = $.goSlice(b, undefined, n - 1)
		}
	}
	b = mayAppendQuote(b, opts.quoted)
	e!.Write(b)
}


export type isZeroer = null | {
	IsZero(): boolean
}

$.registerInterfaceType(
  'encoding/json.isZeroer',
  null, // Zero value for interface is null
  [{ name: "IsZero", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }]
);

export class jsonError {
	public get error(): $.GoError {
		return this._fields.error.value
	}
	public set error(value: $.GoError) {
		this._fields.error.value = value
	}

	public _fields: {
		error: $.VarRef<$.GoError>;
	}

	constructor(init?: Partial<{error?: $.GoError}>) {
		this._fields = {
			error: $.varRef(init?.error ?? null)
		}
	}

	public clone(): jsonError {
		const cloned = new jsonError()
		cloned._fields = {
			error: $.varRef(this._fields.error.value)
		}
		return cloned
	}

	public Error(): string {
		return this.error!.Error()
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.jsonError',
	  new jsonError(),
	  [],
	  jsonError,
	  {"error": { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] }}
	);
}

export class reflectWithString {
	public get v(): reflect.Value {
		return this._fields.v.value
	}
	public set v(value: reflect.Value) {
		this._fields.v.value = value
	}

	public get ks(): string {
		return this._fields.ks.value
	}
	public set ks(value: string) {
		this._fields.ks.value = value
	}

	public _fields: {
		v: $.VarRef<reflect.Value>;
		ks: $.VarRef<string>;
	}

	constructor(init?: Partial<{ks?: string, v?: reflect.Value}>) {
		this._fields = {
			v: $.varRef(init?.v ? $.markAsStructValue(init.v.clone()) : new reflect.Value()),
			ks: $.varRef(init?.ks ?? "")
		}
	}

	public clone(): reflectWithString {
		const cloned = new reflectWithString()
		cloned._fields = {
			v: $.varRef($.markAsStructValue(this._fields.v.value.clone())),
			ks: $.varRef(this._fields.ks.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.reflectWithString',
	  new reflectWithString(),
	  [],
	  reflectWithString,
	  {"v": "Value", "ks": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

export class arrayEncoder {
	public get elemEnc(): encoderFunc | null {
		return this._fields.elemEnc.value
	}
	public set elemEnc(value: encoderFunc | null) {
		this._fields.elemEnc.value = value
	}

	public _fields: {
		elemEnc: $.VarRef<encoderFunc | null>;
	}

	constructor(init?: Partial<{elemEnc?: encoderFunc | null}>) {
		this._fields = {
			elemEnc: $.varRef(init?.elemEnc ?? null)
		}
	}

	public clone(): arrayEncoder {
		const cloned = new arrayEncoder()
		cloned._fields = {
			elemEnc: $.varRef(this._fields.elemEnc.value)
		}
		return cloned
	}

	public encode(e: encodeState | null, v: reflect.Value, opts: encOpts): void {
		const ae = this
		e!.WriteByte(91)
		let n = v.Len()
		for (let i = 0; i < n; i++) {
			if (i > 0) {
				e!.WriteByte(44)
			}
			ae.elemEnc!(e, v.Index(i), opts)
		}
		e!.WriteByte(93)
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.arrayEncoder',
	  new arrayEncoder(),
	  [{ name: "encode", args: [{ name: "e", type: { kind: $.TypeKind.Pointer, elemType: "encodeState" } }, { name: "v", type: "Value" }, { name: "opts", type: "encOpts" }], returns: [] }],
	  arrayEncoder,
	  {"elemEnc": "encoderFunc"}
	);
}

export class condAddrEncoder {
	public get canAddrEnc(): encoderFunc | null {
		return this._fields.canAddrEnc.value
	}
	public set canAddrEnc(value: encoderFunc | null) {
		this._fields.canAddrEnc.value = value
	}

	public get elseEnc(): encoderFunc | null {
		return this._fields.elseEnc.value
	}
	public set elseEnc(value: encoderFunc | null) {
		this._fields.elseEnc.value = value
	}

	public _fields: {
		canAddrEnc: $.VarRef<encoderFunc | null>;
		elseEnc: $.VarRef<encoderFunc | null>;
	}

	constructor(init?: Partial<{canAddrEnc?: encoderFunc | null, elseEnc?: encoderFunc | null}>) {
		this._fields = {
			canAddrEnc: $.varRef(init?.canAddrEnc ?? null),
			elseEnc: $.varRef(init?.elseEnc ?? null)
		}
	}

	public clone(): condAddrEncoder {
		const cloned = new condAddrEncoder()
		cloned._fields = {
			canAddrEnc: $.varRef(this._fields.canAddrEnc.value),
			elseEnc: $.varRef(this._fields.elseEnc.value)
		}
		return cloned
	}

	public encode(e: encodeState | null, v: reflect.Value, opts: encOpts): void {
		const ce = this
		if (v.CanAddr()) {
			ce.canAddrEnc!(e, v, opts)
		} else {
			ce.elseEnc!(e, v, opts)
		}
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.condAddrEncoder',
	  new condAddrEncoder(),
	  [{ name: "encode", args: [{ name: "e", type: { kind: $.TypeKind.Pointer, elemType: "encodeState" } }, { name: "v", type: "Value" }, { name: "opts", type: "encOpts" }], returns: [] }],
	  condAddrEncoder,
	  {"canAddrEnc": "encoderFunc", "elseEnc": "encoderFunc"}
	);
}

export class field {
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	// []byte(name)
	public get nameBytes(): $.Bytes {
		return this._fields.nameBytes.value
	}
	public set nameBytes(value: $.Bytes) {
		this._fields.nameBytes.value = value
	}

	// `"` + name + `":`
	public get nameNonEsc(): string {
		return this._fields.nameNonEsc.value
	}
	public set nameNonEsc(value: string) {
		this._fields.nameNonEsc.value = value
	}

	// `"` + HTMLEscape(name) + `":`
	public get nameEscHTML(): string {
		return this._fields.nameEscHTML.value
	}
	public set nameEscHTML(value: string) {
		this._fields.nameEscHTML.value = value
	}

	public get tag(): boolean {
		return this._fields.tag.value
	}
	public set tag(value: boolean) {
		this._fields.tag.value = value
	}

	public get index(): $.Slice<number> {
		return this._fields.index.value
	}
	public set index(value: $.Slice<number>) {
		this._fields.index.value = value
	}

	public get typ(): null | reflect.Type {
		return this._fields.typ.value
	}
	public set typ(value: null | reflect.Type) {
		this._fields.typ.value = value
	}

	public get omitEmpty(): boolean {
		return this._fields.omitEmpty.value
	}
	public set omitEmpty(value: boolean) {
		this._fields.omitEmpty.value = value
	}

	public get omitZero(): boolean {
		return this._fields.omitZero.value
	}
	public set omitZero(value: boolean) {
		this._fields.omitZero.value = value
	}

	public get isZero(): ((p0: reflect.Value) => boolean) | null {
		return this._fields.isZero.value
	}
	public set isZero(value: ((p0: reflect.Value) => boolean) | null) {
		this._fields.isZero.value = value
	}

	public get quoted(): boolean {
		return this._fields.quoted.value
	}
	public set quoted(value: boolean) {
		this._fields.quoted.value = value
	}

	public get encoder(): encoderFunc | null {
		return this._fields.encoder.value
	}
	public set encoder(value: encoderFunc | null) {
		this._fields.encoder.value = value
	}

	public _fields: {
		name: $.VarRef<string>;
		nameBytes: $.VarRef<$.Bytes>;
		nameNonEsc: $.VarRef<string>;
		nameEscHTML: $.VarRef<string>;
		tag: $.VarRef<boolean>;
		index: $.VarRef<$.Slice<number>>;
		typ: $.VarRef<null | reflect.Type>;
		omitEmpty: $.VarRef<boolean>;
		omitZero: $.VarRef<boolean>;
		isZero: $.VarRef<((p0: reflect.Value) => boolean) | null>;
		quoted: $.VarRef<boolean>;
		encoder: $.VarRef<encoderFunc | null>;
	}

	constructor(init?: Partial<{encoder?: encoderFunc | null, index?: $.Slice<number>, isZero?: ((p0: reflect.Value) => boolean) | null, name?: string, nameBytes?: $.Bytes, nameEscHTML?: string, nameNonEsc?: string, omitEmpty?: boolean, omitZero?: boolean, quoted?: boolean, tag?: boolean, typ?: null | reflect.Type}>) {
		this._fields = {
			name: $.varRef(init?.name ?? ""),
			nameBytes: $.varRef(init?.nameBytes ?? new Uint8Array(0)),
			nameNonEsc: $.varRef(init?.nameNonEsc ?? ""),
			nameEscHTML: $.varRef(init?.nameEscHTML ?? ""),
			tag: $.varRef(init?.tag ?? false),
			index: $.varRef(init?.index ?? null),
			typ: $.varRef(init?.typ ?? null),
			omitEmpty: $.varRef(init?.omitEmpty ?? false),
			omitZero: $.varRef(init?.omitZero ?? false),
			isZero: $.varRef(init?.isZero ?? null),
			quoted: $.varRef(init?.quoted ?? false),
			encoder: $.varRef(init?.encoder ?? null)
		}
	}

	public clone(): field {
		const cloned = new field()
		cloned._fields = {
			name: $.varRef(this._fields.name.value),
			nameBytes: $.varRef(this._fields.nameBytes.value),
			nameNonEsc: $.varRef(this._fields.nameNonEsc.value),
			nameEscHTML: $.varRef(this._fields.nameEscHTML.value),
			tag: $.varRef(this._fields.tag.value),
			index: $.varRef(this._fields.index.value),
			typ: $.varRef(this._fields.typ.value),
			omitEmpty: $.varRef(this._fields.omitEmpty.value),
			omitZero: $.varRef(this._fields.omitZero.value),
			isZero: $.varRef(this._fields.isZero.value),
			quoted: $.varRef(this._fields.quoted.value),
			encoder: $.varRef(this._fields.encoder.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.field',
	  new field(),
	  [],
	  field,
	  {"name": { kind: $.TypeKind.Basic, name: "string" }, "nameBytes": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } }, "nameNonEsc": { kind: $.TypeKind.Basic, name: "string" }, "nameEscHTML": { kind: $.TypeKind.Basic, name: "string" }, "tag": { kind: $.TypeKind.Basic, name: "bool" }, "index": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, "typ": "Type", "omitEmpty": { kind: $.TypeKind.Basic, name: "bool" }, "omitZero": { kind: $.TypeKind.Basic, name: "bool" }, "isZero": { kind: $.TypeKind.Function, params: ["Value"], results: [{ kind: $.TypeKind.Basic, name: "bool" }] }, "quoted": { kind: $.TypeKind.Basic, name: "bool" }, "encoder": "encoderFunc"}
	);
}

export class mapEncoder {
	public get elemEnc(): encoderFunc | null {
		return this._fields.elemEnc.value
	}
	public set elemEnc(value: encoderFunc | null) {
		this._fields.elemEnc.value = value
	}

	public _fields: {
		elemEnc: $.VarRef<encoderFunc | null>;
	}

	constructor(init?: Partial<{elemEnc?: encoderFunc | null}>) {
		this._fields = {
			elemEnc: $.varRef(init?.elemEnc ?? null)
		}
	}

	public clone(): mapEncoder {
		const cloned = new mapEncoder()
		cloned._fields = {
			elemEnc: $.varRef(this._fields.elemEnc.value)
		}
		return cloned
	}

	public encode(e: encodeState | null, v: reflect.Value, opts: encOpts): void {
		const me = this
		using __defer = new $.DisposableStack();
		if (v.IsNil()) {
			e!.WriteString("null")
			return 
		}
		{
			e!.ptrLevel++
			if (e!.ptrLevel > 1000) {
				using __defer = new $.DisposableStack();
				// We're a large number of nested ptrEncoder.encode calls deep;
				// start checking if we've run into a pointer cycle.
				let ptr = v.UnsafePointer()
				{
					let [, ok] = $.mapGet(e!.ptrSeen, ptr, {})
					if (ok) {
						e!.error(new UnsupportedValueError({Str: fmt.Sprintf("encountered a cycle via %s", v.Type()), Value: v}))
					}
				}
				$.mapSet(e!.ptrSeen, ptr, {})
				__defer.defer(() => {
					$.deleteMapEntry(e!.ptrSeen, ptr)
				});
			}
		}
		e!.WriteByte(123)
		let sv: $.Slice<reflectWithString> = $.makeSlice<reflectWithString>(v.Len())
		let mi: reflect.MapIter | null = v.MapRange()
		let err: $.GoError = null
		for (let i = 0; mi!.Next(); i++) {
			{
				{
				  const _tmp = resolveKeyName(mi!.Key())
				  sv![i].ks = _tmp[0]
				  err = _tmp[1]
				}
				if (err != null) {
					e!.error(fmt.Errorf("json: encoding error for type %q: %q", v.Type()!.String(), err!.Error()))
				}
			}
			sv![i].v = $.markAsStructValue(mi!.Value().clone())
		}
		slices.SortFunc(sv, (i: reflectWithString, j: reflectWithString): number => {
			return strings.Compare(i.ks, j.ks)
		})
		for (let i = 0; i < $.len(sv); i++) {
			let kv = sv![i]
			{
				if (i > 0) {
					e!.WriteByte(44)
				}
				e!.Write(appendString(e!.AvailableBuffer(), kv.ks, opts.escapeHTML))
				e!.WriteByte(58)
				me.elemEnc!(e, kv.v, opts)
			}
		}
		e!.WriteByte(125)
		e!.ptrLevel--
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.mapEncoder',
	  new mapEncoder(),
	  [{ name: "encode", args: [{ name: "e", type: { kind: $.TypeKind.Pointer, elemType: "encodeState" } }, { name: "v", type: "Value" }, { name: "opts", type: "encOpts" }], returns: [] }],
	  mapEncoder,
	  {"elemEnc": "encoderFunc"}
	);
}

export class ptrEncoder {
	public get elemEnc(): encoderFunc | null {
		return this._fields.elemEnc.value
	}
	public set elemEnc(value: encoderFunc | null) {
		this._fields.elemEnc.value = value
	}

	public _fields: {
		elemEnc: $.VarRef<encoderFunc | null>;
	}

	constructor(init?: Partial<{elemEnc?: encoderFunc | null}>) {
		this._fields = {
			elemEnc: $.varRef(init?.elemEnc ?? null)
		}
	}

	public clone(): ptrEncoder {
		const cloned = new ptrEncoder()
		cloned._fields = {
			elemEnc: $.varRef(this._fields.elemEnc.value)
		}
		return cloned
	}

	public encode(e: encodeState | null, v: reflect.Value, opts: encOpts): void {
		const pe = this
		using __defer = new $.DisposableStack();
		if (v.IsNil()) {
			e!.WriteString("null")
			return 
		}
		{
			e!.ptrLevel++
			if (e!.ptrLevel > 1000) {
				using __defer = new $.DisposableStack();
				// We're a large number of nested ptrEncoder.encode calls deep;
				// start checking if we've run into a pointer cycle.
				let ptr = v.Interface()
				{
					let [, ok] = $.mapGet(e!.ptrSeen, ptr, {})
					if (ok) {
						e!.error(new UnsupportedValueError({Str: fmt.Sprintf("encountered a cycle via %s", v.Type()), Value: v}))
					}
				}
				$.mapSet(e!.ptrSeen, ptr, {})
				__defer.defer(() => {
					$.deleteMapEntry(e!.ptrSeen, ptr)
				});
			}
		}
		pe.elemEnc!(e, v.Elem(), opts)
		e!.ptrLevel--
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.ptrEncoder',
	  new ptrEncoder(),
	  [{ name: "encode", args: [{ name: "e", type: { kind: $.TypeKind.Pointer, elemType: "encodeState" } }, { name: "v", type: "Value" }, { name: "opts", type: "encOpts" }], returns: [] }],
	  ptrEncoder,
	  {"elemEnc": "encoderFunc"}
	);
}

export class sliceEncoder {
	public get arrayEnc(): encoderFunc | null {
		return this._fields.arrayEnc.value
	}
	public set arrayEnc(value: encoderFunc | null) {
		this._fields.arrayEnc.value = value
	}

	public _fields: {
		arrayEnc: $.VarRef<encoderFunc | null>;
	}

	constructor(init?: Partial<{arrayEnc?: encoderFunc | null}>) {
		this._fields = {
			arrayEnc: $.varRef(init?.arrayEnc ?? null)
		}
	}

	public clone(): sliceEncoder {
		const cloned = new sliceEncoder()
		cloned._fields = {
			arrayEnc: $.varRef(this._fields.arrayEnc.value)
		}
		return cloned
	}

	public encode(e: encodeState | null, v: reflect.Value, opts: encOpts): void {
		const se = this
		using __defer = new $.DisposableStack();
		if (v.IsNil()) {
			e!.WriteString("null")
			return 
		}
		{
			e!.ptrLevel++
			if (e!.ptrLevel > 1000) {
				using __defer = new $.DisposableStack();
				// We're a large number of nested ptrEncoder.encode calls deep;
				// start checking if we've run into a pointer cycle.
				// Here we use a struct to memorize the pointer to the first element of the slice
				// and its length.

				// always an unsafe.Pointer, but avoids a dependency on package unsafe
				let ptr = {len: v.Len(), ptr: v.UnsafePointer()}
				{
					let [, ok] = $.mapGet(e!.ptrSeen, ptr, {})
					if (ok) {
						e!.error(new UnsupportedValueError({Str: fmt.Sprintf("encountered a cycle via %s", v.Type()), Value: v}))
					}
				}
				$.mapSet(e!.ptrSeen, ptr, {})
				__defer.defer(() => {
					$.deleteMapEntry(e!.ptrSeen, ptr)
				});
			}
		}
		se.arrayEnc!(e, v, opts)
		e!.ptrLevel--
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.sliceEncoder',
	  new sliceEncoder(),
	  [{ name: "encode", args: [{ name: "e", type: { kind: $.TypeKind.Pointer, elemType: "encodeState" } }, { name: "v", type: "Value" }, { name: "opts", type: "encOpts" }], returns: [] }],
	  sliceEncoder,
	  {"arrayEnc": "encoderFunc"}
	);
}

export class structFields {
	public get list(): $.Slice<field> {
		return this._fields.list.value
	}
	public set list(value: $.Slice<field>) {
		this._fields.list.value = value
	}

	public get byExactName(): Map<string, field | null> | null {
		return this._fields.byExactName.value
	}
	public set byExactName(value: Map<string, field | null> | null) {
		this._fields.byExactName.value = value
	}

	public get byFoldedName(): Map<string, field | null> | null {
		return this._fields.byFoldedName.value
	}
	public set byFoldedName(value: Map<string, field | null> | null) {
		this._fields.byFoldedName.value = value
	}

	public _fields: {
		list: $.VarRef<$.Slice<field>>;
		byExactName: $.VarRef<Map<string, field | null> | null>;
		byFoldedName: $.VarRef<Map<string, field | null> | null>;
	}

	constructor(init?: Partial<{byExactName?: Map<string, field | null> | null, byFoldedName?: Map<string, field | null> | null, list?: $.Slice<field>}>) {
		this._fields = {
			list: $.varRef(init?.list ?? null),
			byExactName: $.varRef(init?.byExactName ?? null),
			byFoldedName: $.varRef(init?.byFoldedName ?? null)
		}
	}

	public clone(): structFields {
		const cloned = new structFields()
		cloned._fields = {
			list: $.varRef(this._fields.list.value),
			byExactName: $.varRef(this._fields.byExactName.value),
			byFoldedName: $.varRef(this._fields.byFoldedName.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.structFields',
	  new structFields(),
	  [],
	  structFields,
	  {"list": { kind: $.TypeKind.Slice, elemType: "field" }, "byExactName": { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Pointer, elemType: "field" } }, "byFoldedName": { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Pointer, elemType: "field" } }}
	);
}

export class structEncoder {
	public get fields(): structFields {
		return this._fields.fields.value
	}
	public set fields(value: structFields) {
		this._fields.fields.value = value
	}

	public _fields: {
		fields: $.VarRef<structFields>;
	}

	constructor(init?: Partial<{fields?: structFields}>) {
		this._fields = {
			fields: $.varRef(init?.fields ? $.markAsStructValue(init.fields.clone()) : new structFields())
		}
	}

	public clone(): structEncoder {
		const cloned = new structEncoder()
		cloned._fields = {
			fields: $.varRef($.markAsStructValue(this._fields.fields.value.clone()))
		}
		return cloned
	}

	public encode(e: encodeState | null, v: reflect.Value, opts: encOpts): void {
		const se = this
		let next = $.byte(123)
		FieldLoop: for (let i = 0; i < $.len(se.fields.list); i++) {
			{
				let f = se.fields.list![i]

				// Find the nested struct field by following f.index.
				let fv = $.markAsStructValue(v.clone())
				for (let _i = 0; _i < $.len(f!.index); _i++) {
					let i = f!.index![_i]
					{
						if (fv.Kind() == reflect.Ptr) {
							if (fv.IsNil()) {
								continue FieldLoop
							}
							fv = $.markAsStructValue(fv.Elem().clone())
						}
						fv = $.markAsStructValue(fv.Field(i).clone())
					}
				}

				if ((f!.omitEmpty && isEmptyValue(fv)) || (f!.omitZero && (f!.isZero == null && fv.IsZero() || (f!.isZero != null && f!.isZero!(fv))))) {
					continue
				}
				e!.WriteByte(next)
				next = 44
				if (opts.escapeHTML) {
					e!.WriteString(f!.nameEscHTML)
				} else {
					e!.WriteString(f!.nameNonEsc)
				}
				opts.quoted = f!.quoted
				f!.encoder!(e, fv, opts)
			}
		}
		if (next == 123) {
			e!.WriteString("{}")
		} else {
			e!.WriteByte(125)
		}
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.structEncoder',
	  new structEncoder(),
	  [{ name: "encode", args: [{ name: "e", type: { kind: $.TypeKind.Pointer, elemType: "encodeState" } }, { name: "v", type: "Value" }, { name: "opts", type: "encOpts" }], returns: [] }],
	  structEncoder,
	  {"fields": "structFields"}
	);
}

export let encodeStatePool: $.VarRef<sync.Pool> = $.varRef(new sync.Pool())

// map[reflect.Type]encoderFunc
export let encoderCache: $.VarRef<sync.Map> = $.varRef(new sync.Map())

// map[reflect.Type]structFields
export let fieldCache: $.VarRef<sync.Map> = $.varRef(new sync.Map())

export let float32Encoder: ((e: encodeState | null, v: reflect.Value, opts: encOpts) => void) | null = ((_p0: encodeState | null, _p1: reflect.Value, _p2: encOpts) => floatEncoder_encode(((32 as floatEncoder)), _p0, _p1, _p2))

export let float64Encoder: ((e: encodeState | null, v: reflect.Value, opts: encOpts) => void) | null = ((_p0: encodeState | null, _p1: reflect.Value, _p2: encOpts) => floatEncoder_encode(((64 as floatEncoder)), _p0, _p1, _p2))

export let isZeroerType: reflect.Type = reflect.getInterfaceTypeByName("encoding/json.isZeroer")

export let marshalerType: reflect.Type = reflect.getInterfaceTypeByName("encoding/json.Marshaler")

export let textMarshalerType: reflect.Type = reflect.getInterfaceTypeByName("encoding.TextMarshaler")

// Marshal returns the JSON encoding of v.
//
// Marshal traverses the value v recursively.
// If an encountered value implements [Marshaler]
// and is not a nil pointer, Marshal calls [Marshaler.MarshalJSON]
// to produce JSON. If no [Marshaler.MarshalJSON] method is present but the
// value implements [encoding.TextMarshaler] instead, Marshal calls
// [encoding.TextMarshaler.MarshalText] and encodes the result as a JSON string.
// The nil pointer exception is not strictly necessary
// but mimics a similar, necessary exception in the behavior of
// [Unmarshaler.UnmarshalJSON].
//
// Otherwise, Marshal uses the following type-dependent default encodings:
//
// Boolean values encode as JSON booleans.
//
// Floating point, integer, and [Number] values encode as JSON numbers.
// NaN and +/-Inf values will return an [UnsupportedValueError].
//
// String values encode as JSON strings coerced to valid UTF-8,
// replacing invalid bytes with the Unicode replacement rune.
// So that the JSON will be safe to embed inside HTML <script> tags,
// the string is encoded using [HTMLEscape],
// which replaces "<", ">", "&", U+2028, and U+2029 are escaped
// to "\u003c","\u003e", "\u0026", "\u2028", and "\u2029".
// This replacement can be disabled when using an [Encoder],
// by calling [Encoder.SetEscapeHTML](false).
//
// Array and slice values encode as JSON arrays, except that
// []byte encodes as a base64-encoded string, and a nil slice
// encodes as the null JSON value.
//
// Struct values encode as JSON objects.
// Each exported struct field becomes a member of the object, using the
// field name as the object key, unless the field is omitted for one of the
// reasons given below.
//
// The encoding of each struct field can be customized by the format string
// stored under the "json" key in the struct field's tag.
// The format string gives the name of the field, possibly followed by a
// comma-separated list of options. The name may be empty in order to
// specify options without overriding the default field name.
//
// The "omitempty" option specifies that the field should be omitted
// from the encoding if the field has an empty value, defined as
// false, 0, a nil pointer, a nil interface value, and any array,
// slice, map, or string of length zero.
//
// As a special case, if the field tag is "-", the field is always omitted.
// Note that a field with name "-" can still be generated using the tag "-,".
//
// Examples of struct field tags and their meanings:
//
//	// Field appears in JSON as key "myName".
//	Field int `json:"myName"`
//
//	// Field appears in JSON as key "myName" and
//	// the field is omitted from the object if its value is empty,
//	// as defined above.
//	Field int `json:"myName,omitempty"`
//
//	// Field appears in JSON as key "Field" (the default), but
//	// the field is skipped if empty.
//	// Note the leading comma.
//	Field int `json:",omitempty"`
//
//	// Field is ignored by this package.
//	Field int `json:"-"`
//
//	// Field appears in JSON as key "-".
//	Field int `json:"-,"`
//
// The "omitzero" option specifies that the field should be omitted
// from the encoding if the field has a zero value, according to rules:
//
// 1) If the field type has an "IsZero() bool" method, that will be used to
// determine whether the value is zero.
//
// 2) Otherwise, the value is zero if it is the zero value for its type.
//
// If both "omitempty" and "omitzero" are specified, the field will be omitted
// if the value is either empty or zero (or both).
//
// The "string" option signals that a field is stored as JSON inside a
// JSON-encoded string. It applies only to fields of string, floating point,
// integer, or boolean types. This extra level of encoding is sometimes used
// when communicating with JavaScript programs:
//
//	Int64String int64 `json:",string"`
//
// The key name will be used if it's a non-empty string consisting of
// only Unicode letters, digits, and ASCII punctuation except quotation
// marks, backslash, and comma.
//
// Embedded struct fields are usually marshaled as if their inner exported fields
// were fields in the outer struct, subject to the usual Go visibility rules amended
// as described in the next paragraph.
// An anonymous struct field with a name given in its JSON tag is treated as
// having that name, rather than being anonymous.
// An anonymous struct field of interface type is treated the same as having
// that type as its name, rather than being anonymous.
//
// The Go visibility rules for struct fields are amended for JSON when
// deciding which field to marshal or unmarshal. If there are
// multiple fields at the same level, and that level is the least
// nested (and would therefore be the nesting level selected by the
// usual Go rules), the following extra rules apply:
//
// 1) Of those fields, if any are JSON-tagged, only tagged fields are considered,
// even if there are multiple untagged fields that would otherwise conflict.
//
// 2) If there is exactly one field (tagged or not according to the first rule), that is selected.
//
// 3) Otherwise there are multiple fields, and all are ignored; no error occurs.
//
// Handling of anonymous struct fields is new in Go 1.1.
// Prior to Go 1.1, anonymous struct fields were ignored. To force ignoring of
// an anonymous struct field in both current and earlier versions, give the field
// a JSON tag of "-".
//
// Map values encode as JSON objects. The map's key type must either be a
// string, an integer type, or implement [encoding.TextMarshaler]. The map keys
// are sorted and used as JSON object keys by applying the following rules,
// subject to the UTF-8 coercion described for string values above:
//   - keys of any string type are used directly
//   - keys that implement [encoding.TextMarshaler] are marshaled
//   - integer keys are converted to strings
//
// Pointer values encode as the value pointed to.
// A nil pointer encodes as the null JSON value.
//
// Interface values encode as the value contained in the interface.
// A nil interface value encodes as the null JSON value.
//
// Channel, complex, and function values cannot be encoded in JSON.
// Attempting to encode such a value causes Marshal to return
// an [UnsupportedTypeError].
//
// JSON cannot represent cyclic data structures and Marshal does not
// handle them. Passing cyclic structures to Marshal will result in
// an error.
export async function Marshal(v: null | any): Promise<[$.Bytes, $.GoError]> {
	using __defer = new $.DisposableStack();
	let e = newEncodeState()
	__defer.defer(() => {
		encodeStatePool!.value.Put(e)
	});

	let err = await e!.marshal(v, $.markAsStructValue(new encOpts({escapeHTML: true})))
	if (err != null) {
		return [null, err]
	}
	let buf = $.append(null, ...(e!.Bytes() || []))

	return [buf, null]
}

// MarshalIndent is like [Marshal] but applies [Indent] to format the output.
// Each JSON element in the output will begin on a new line beginning with prefix
// followed by one or more copies of indent according to the indentation nesting.
export async function MarshalIndent(v: null | any, prefix: string, indent: string): Promise<[$.Bytes, $.GoError]> {
	let [b, err] = await Marshal(v)
	if (err != null) {
		return [null, err]
	}
	let b2 = $.makeSlice<number>(0, 2 * $.len(b), 'byte')
	;[b2, err] = appendIndent(b2, b, prefix, indent)
	if (err != null) {
		return [null, err]
	}
	return [b2, null]
}

export function newEncodeState(): encodeState | null {
	{
		let v = encodeStatePool!.value.Get()
		if (v != null) {
			let e = $.mustTypeAssert<encodeState | null>(v, {kind: $.TypeKind.Pointer, elemType: 'encoding/json.encodeState'})
			e!.Reset()
			if ($.len(e!.ptrSeen) > 0) {
				$.panic("ptrEncoder.encode should have emptied ptrSeen via defers")
			}
			e!.ptrLevel = 0
			return e
		}
	}
	return new encodeState({ptrSeen: $.makeMap<null | any, {  }>()})
}

export function isEmptyValue(v: reflect.Value): boolean {
	switch (v.Kind()) {
		case reflect.Array:
		case reflect.Map:
		case reflect.Slice:
		case reflect.String: {
			return v.Len() == 0
			break
		}
		case reflect.Bool:
		case reflect.Int:
		case reflect.Int8:
		case reflect.Int16:
		case reflect.Int32:
		case reflect.Int64:
		case reflect.Uint:
		case reflect.Uint8:
		case reflect.Uint16:
		case reflect.Uint32:
		case reflect.Uint64:
		case reflect.Uintptr:
		case reflect.Float32:
		case reflect.Float64:
		case reflect.Interface:
		case reflect.Ptr: {
			return v.IsZero()
			break
		}
	}
	return false
}

export async function valueEncoder(v: reflect.Value): Promise<encoderFunc | null> {
	if (!v.IsValid()) {
		return invalidValueEncoder
	}
	return await typeEncoder(v.Type())
}

export async function typeEncoder(t: null | reflect.Type): Promise<encoderFunc | null> {
	{
		let [fi, ok] = await encoderCache!.value.Load(t)
		if (ok) {
			return $.mustTypeAssert<encoderFunc | null>(fi, {kind: $.TypeKind.Function, name: 'encoderFunc', params: [{ kind: $.TypeKind.Pointer, elemType: "encodeState" }, "Value", "encOpts"], results: []})
		}
	}

	// To deal with recursive types, populate the map with an
	// indirect func before we build it. If the type is recursive,
	// the second lookup for the type will return the indirect func.
	//
	// This indirect func is only used for recursive types,
	// and briefly during racing calls to typeEncoder.
	let indirect = sync.OnceValue(async (): Promise<encoderFunc | null> => {
		return await newTypeEncoder(t, true)
	})
	let [fi, loaded] = await encoderCache!.value.LoadOrStore(t, Object.assign(async (e: encodeState | null, v: reflect.Value, opts: encOpts): Promise<void> => {
		;(await indirect!())!(e, v, opts)
	}, { __goTypeName: 'encoderFunc' }))
	if (loaded) {
		return $.mustTypeAssert<encoderFunc | null>(fi, {kind: $.TypeKind.Function, name: 'encoderFunc', params: [{ kind: $.TypeKind.Pointer, elemType: "encodeState" }, "Value", "encOpts"], results: []})
	}

	let f = await indirect!()
	await encoderCache!.value.Store(t, f)
	return f
}

// newTypeEncoder constructs an encoderFunc for a type.
// The returned encoder only checks CanAddr when allowAddr is true.
export async function newTypeEncoder(t: null | reflect.Type, allowAddr: boolean): Promise<encoderFunc | null> {
	// If we have a non-pointer value whose type implements
	// Marshaler with a value receiver, then we're better off taking
	// the address of the value - otherwise we end up with an
	// allocation as we cast the value to an interface.
	if (t!.Kind() != reflect.Ptr && allowAddr && reflect.PointerTo(t)!.Implements(marshalerType)) {
		return newCondAddrEncoder(addrMarshalerEncoder, await newTypeEncoder(t, false))
	}
	if (t!.Implements(marshalerType)) {
		return marshalerEncoder
	}
	if (t!.Kind() != reflect.Ptr && allowAddr && reflect.PointerTo(t)!.Implements(textMarshalerType)) {
		return newCondAddrEncoder(addrTextMarshalerEncoder, await newTypeEncoder(t, false))
	}
	if (t!.Implements(textMarshalerType)) {
		return textMarshalerEncoder
	}

	switch (t!.Kind()) {
		case reflect.Bool: {
			return boolEncoder
			break
		}
		case reflect.Int:
		case reflect.Int8:
		case reflect.Int16:
		case reflect.Int32:
		case reflect.Int64: {
			return intEncoder
			break
		}
		case reflect.Uint:
		case reflect.Uint8:
		case reflect.Uint16:
		case reflect.Uint32:
		case reflect.Uint64:
		case reflect.Uintptr: {
			return uintEncoder
			break
		}
		case reflect.Float32: {
			return float32Encoder
			break
		}
		case reflect.Float64: {
			return float64Encoder
			break
		}
		case reflect.String: {
			return stringEncoder
			break
		}
		case reflect.Interface: {
			return interfaceEncoder
			break
		}
		case reflect.Struct: {
			return await newStructEncoder(t)
			break
		}
		case reflect.Map: {
			return await newMapEncoder(t)
			break
		}
		case reflect.Slice: {
			return await newSliceEncoder(t)
			break
		}
		case reflect.Array: {
			return await newArrayEncoder(t)
			break
		}
		case reflect.Ptr: {
			return await newPtrEncoder(t)
			break
		}
		default: {
			return unsupportedTypeEncoder
			break
		}
	}
}

export function invalidValueEncoder(e: encodeState | null, v: reflect.Value, _: encOpts): void {
	e!.WriteString("null")
}

export function marshalerEncoder(e: encodeState | null, v: reflect.Value, opts: encOpts): void {
	if (v.Kind() == reflect.Ptr && v.IsNil()) {
		e!.WriteString("null")
		return 
	}
	let { value: m, ok: ok } = $.typeAssert<Marshaler>(v.Interface(), 'encoding/json.Marshaler')
	if (!ok) {
		e!.WriteString("null")
		return 
	}
	let [b, err] = m!.MarshalJSON()
	if (err == null) {
		e!.Grow($.len(b))
		let out = e!.AvailableBuffer()
		;[out, err] = appendCompact(out, b, opts.escapeHTML)
		e!.Buffer.Write(out)
	}
	if (err != null) {
		e!.error(new MarshalerError({Err: err, Type: v.Type(), sourceFunc: "MarshalJSON"}))
	}
}

export function addrMarshalerEncoder(e: encodeState | null, v: reflect.Value, opts: encOpts): void {
	let va = $.markAsStructValue(v.Addr().clone())
	if (va.IsNil()) {
		e!.WriteString("null")
		return 
	}
	let m = $.mustTypeAssert<Marshaler>(va.Interface(), 'encoding/json.Marshaler')
	let [b, err] = m!.MarshalJSON()
	if (err == null) {
		e!.Grow($.len(b))
		let out = e!.AvailableBuffer()
		;[out, err] = appendCompact(out, b, opts.escapeHTML)
		e!.Buffer.Write(out)
	}
	if (err != null) {
		e!.error(new MarshalerError({Err: err, Type: v.Type(), sourceFunc: "MarshalJSON"}))
	}
}

export function textMarshalerEncoder(e: encodeState | null, v: reflect.Value, opts: encOpts): void {
	if (v.Kind() == reflect.Ptr && v.IsNil()) {
		e!.WriteString("null")
		return 
	}
	let { value: m, ok: ok } = $.typeAssert<null | encoding.TextMarshaler>(v.Interface(), 'encoding.TextMarshaler')
	if (!ok) {
		e!.WriteString("null")
		return 
	}
	let [b, err] = m!.MarshalText()
	if (err != null) {
		e!.error(new MarshalerError({Err: err, Type: v.Type(), sourceFunc: "MarshalText"}))
	}
	e!.Write(appendString(e!.AvailableBuffer(), b, opts.escapeHTML))
}

export function addrTextMarshalerEncoder(e: encodeState | null, v: reflect.Value, opts: encOpts): void {
	let va = $.markAsStructValue(v.Addr().clone())
	if (va.IsNil()) {
		e!.WriteString("null")
		return 
	}
	let m = $.mustTypeAssert<null | encoding.TextMarshaler>(va.Interface(), 'encoding.TextMarshaler')
	let [b, err] = m!.MarshalText()
	if (err != null) {
		e!.error(new MarshalerError({Err: err, Type: v.Type(), sourceFunc: "MarshalText"}))
	}
	e!.Write(appendString(e!.AvailableBuffer(), b, opts.escapeHTML))
}

export function boolEncoder(e: encodeState | null, v: reflect.Value, opts: encOpts): void {
	let b = e!.AvailableBuffer()
	b = mayAppendQuote(b, opts.quoted)
	b = strconv.AppendBool(b, v.Bool())
	b = mayAppendQuote(b, opts.quoted)
	e!.Write(b)
}

export function intEncoder(e: encodeState | null, v: reflect.Value, opts: encOpts): void {
	let b = e!.AvailableBuffer()
	b = mayAppendQuote(b, opts.quoted)
	b = strconv.AppendInt(b, v.Int(), 10)
	b = mayAppendQuote(b, opts.quoted)
	e!.Write(b)
}

export function uintEncoder(e: encodeState | null, v: reflect.Value, opts: encOpts): void {
	let b = e!.AvailableBuffer()
	b = mayAppendQuote(b, opts.quoted)
	b = strconv.AppendUint(b, v.Uint(), 10)
	b = mayAppendQuote(b, opts.quoted)
	e!.Write(b)
}

export function stringEncoder(e: encodeState | null, v: reflect.Value, opts: encOpts): void {

	// In Go1.5 the empty string encodes to "0", while this is not a valid number literal
	// we keep compatibility so check validity after this.

	// Number's zero-val
	if (v.Type() == numberType) {
		let numStr = v.String()
		// In Go1.5 the empty string encodes to "0", while this is not a valid number literal
		// we keep compatibility so check validity after this.

		// Number's zero-val
		if (numStr == "") {
			numStr = "0" // Number's zero-val
		}
		if (!isValidNumber(numStr)) {
			e!.error(fmt.Errorf("json: invalid number literal %q", numStr))
		}
		let b = e!.AvailableBuffer()
		b = mayAppendQuote(b, opts.quoted)
		b = $.append(b, ...$.stringToBytes(numStr))
		b = mayAppendQuote(b, opts.quoted)
		e!.Write(b)
		return 
	}

	// no need to escape again since it is already escaped
	if (opts.quoted) {
		let b = appendString(null, v.String(), opts.escapeHTML)
		e!.Write(appendString(e!.AvailableBuffer(), b, false)) // no need to escape again since it is already escaped
	} else {
		e!.Write(appendString(e!.AvailableBuffer(), v.String(), opts.escapeHTML))
	}
}

// isValidNumber reports whether s is a valid JSON number literal.
//
// isValidNumber should be an internal detail,
// but widely used packages access it using linkname.
// Notable members of the hall of shame include:
//   - github.com/bytedance/sonic
//
// Do not remove or change the type signature.
// See go.dev/issue/67401.
//
//go:linkname isValidNumber
export function isValidNumber(s: string): boolean {
	// This function implements the JSON numbers grammar.
	// See https://tools.ietf.org/html/rfc7159#section-6
	// and https://www.json.org/img/number.png

	if (s == "") {
		return false
	}

	// Optional -
	if ($.indexString(s, 0) == 45) {
		s = $.sliceString(s, 1, undefined)
		if (s == "") {
			return false
		}
	}

	// Digits
	switch (true) {
		default: {
			return false
			break
		}
		case $.indexString(s, 0) == 48: {
			s = $.sliceString(s, 1, undefined)
			break
		}
		case 49 <= $.indexString(s, 0) && $.indexString(s, 0) <= 57: {
			s = $.sliceString(s, 1, undefined)
			for (; $.len(s) > 0 && 48 <= $.indexString(s, 0) && $.indexString(s, 0) <= 57; ) {
				s = $.sliceString(s, 1, undefined)
			}
			break
		}
	}

	// . followed by 1 or more digits.
	if ($.len(s) >= 2 && $.indexString(s, 0) == 46 && 48 <= $.indexString(s, 1) && $.indexString(s, 1) <= 57) {
		s = $.sliceString(s, 2, undefined)
		for (; $.len(s) > 0 && 48 <= $.indexString(s, 0) && $.indexString(s, 0) <= 57; ) {
			s = $.sliceString(s, 1, undefined)
		}
	}

	// e or E followed by an optional - or + and
	// 1 or more digits.
	if ($.len(s) >= 2 && ($.indexString(s, 0) == 101 || $.indexString(s, 0) == 69)) {
		s = $.sliceString(s, 1, undefined)
		if ($.indexString(s, 0) == 43 || $.indexString(s, 0) == 45) {
			s = $.sliceString(s, 1, undefined)
			if (s == "") {
				return false
			}
		}
		for (; $.len(s) > 0 && 48 <= $.indexString(s, 0) && $.indexString(s, 0) <= 57; ) {
			s = $.sliceString(s, 1, undefined)
		}
	}

	// Make sure we are at the end.
	return s == ""
}

export async function interfaceEncoder(e: encodeState | null, v: reflect.Value, opts: encOpts): Promise<void> {
	if (v.IsNil()) {
		e!.WriteString("null")
		return 
	}
	await e!.reflectValue(v.Elem(), opts)
}

export function unsupportedTypeEncoder(e: encodeState | null, v: reflect.Value, _: encOpts): void {
	e!.error(new UnsupportedTypeError({Type: v.Type()}))
}

export async function newStructEncoder(t: null | reflect.Type): Promise<encoderFunc | null> {
	let se = $.markAsStructValue(new structEncoder({fields: await cachedTypeFields(t)}))
	return se.encode.bind($.markAsStructValue(se.clone()))
}

export async function newMapEncoder(t: null | reflect.Type): Promise<encoderFunc | null> {
	switch (t!.Key()!.Kind()) {
		case reflect.String:
		case reflect.Int:
		case reflect.Int8:
		case reflect.Int16:
		case reflect.Int32:
		case reflect.Int64:
		case reflect.Uint:
		case reflect.Uint8:
		case reflect.Uint16:
		case reflect.Uint32:
		case reflect.Uint64:
		case reflect.Uintptr: {
			break
		}
		default: {
			if (!t!.Key()!.Implements(textMarshalerType)) {
				return unsupportedTypeEncoder
			}
			break
		}
	}
	let me = $.markAsStructValue(new mapEncoder({elemEnc: await typeEncoder(t!.Elem())}))
	return me.encode.bind($.markAsStructValue(me.clone()))
}

export function encodeByteSlice(e: encodeState | null, v: reflect.Value, _: encOpts): void {
	if (v.IsNil()) {
		e!.WriteString("null")
		return 
	}

	let s = v.Bytes()
	let b = e!.AvailableBuffer()
	b = $.append(b, 34)
	b = base64.StdEncoding!.AppendEncode(b, s)
	b = $.append(b, 34)
	e!.Write(b)
}

export async function newSliceEncoder(t: null | reflect.Type): Promise<encoderFunc | null> {
	// Byte slices get special treatment; arrays don't.
	if (t!.Elem()!.Kind() == reflect.Uint8) {
		let p = reflect.PointerTo(t!.Elem())
		if (!p!.Implements(marshalerType) && !p!.Implements(textMarshalerType)) {
			return encodeByteSlice
		}
	}
	let enc = $.markAsStructValue(new sliceEncoder({arrayEnc: await newArrayEncoder(t)}))
	return enc.encode.bind($.markAsStructValue(enc.clone()))
}

export async function newArrayEncoder(t: null | reflect.Type): Promise<encoderFunc | null> {
	let enc = $.markAsStructValue(new arrayEncoder({elemEnc: await typeEncoder(t!.Elem())}))
	return enc.encode.bind($.markAsStructValue(enc.clone()))
}

export async function newPtrEncoder(t: null | reflect.Type): Promise<encoderFunc | null> {
	let enc = $.markAsStructValue(new ptrEncoder({elemEnc: await typeEncoder(t!.Elem())}))
	return enc.encode.bind($.markAsStructValue(enc.clone()))
}

// newCondAddrEncoder returns an encoder that checks whether its value
// CanAddr and delegates to canAddrEnc if so, else to elseEnc.
export function newCondAddrEncoder(canAddrEnc: encoderFunc | null, elseEnc: encoderFunc | null): encoderFunc | null {
	let enc = $.markAsStructValue(new condAddrEncoder({canAddrEnc: canAddrEnc, elseEnc: elseEnc}))
	return enc.encode.bind($.markAsStructValue(enc.clone()))
}

export function isValidTag(s: string): boolean {
	if (s == "") {
		return false
	}

	// Backslash and quote chars are reserved, but
	// otherwise any punctuation chars are allowed
	// in a tag name.
	{
		const _runes = $.stringToRunes(s)
		for (let i = 0; i < _runes.length; i++) {
			let c = _runes[i]
			{

				// Backslash and quote chars are reserved, but
				// otherwise any punctuation chars are allowed
				// in a tag name.
				switch (true) {
					case strings.ContainsRune("!#$%&()*+-./:;<=>?@[]^_{|}~ ", c): {
						break
					}
					case !unicode.IsLetter(c) && !unicode.IsDigit(c): {
						return false
						break
					}
				}
			}
		}
	}
	return true
}

export function typeByIndex(t: null | reflect.Type, index: $.Slice<number>): null | reflect.Type {
	for (let _i = 0; _i < $.len(index); _i++) {
		let i = index![_i]
		{
			if (t!.Kind() == reflect.Ptr) {
				t = t!.Elem()
			}
			t = t!.Field(i)!.Type
		}
	}
	return t
}

export function resolveKeyName(k: reflect.Value): [string, $.GoError] {
	if (k.Kind() == reflect.String) {
		return [k.String(), null]
	}
	{
		let { value: tm, ok: ok } = $.typeAssert<null | encoding.TextMarshaler>(k.Interface(), 'encoding.TextMarshaler')
		if (ok) {
			if (k.Kind() == reflect.Ptr && k.IsNil()) {
				return ["", null]
			}
			let [buf, err] = tm!.MarshalText()
			return [$.bytesToString(buf), err]
		}
	}
	switch (k.Kind()) {
		case reflect.Int:
		case reflect.Int8:
		case reflect.Int16:
		case reflect.Int32:
		case reflect.Int64: {
			return [strconv.FormatInt(k.Int(), 10), null]
			break
		}
		case reflect.Uint:
		case reflect.Uint8:
		case reflect.Uint16:
		case reflect.Uint32:
		case reflect.Uint64:
		case reflect.Uintptr: {
			return [strconv.FormatUint(k.Uint(), 10), null]
			break
		}
	}
	$.panic("unexpected map key type")
}

export function appendString<Bytes extends $.Bytes | string>(dst: $.Bytes, src: Bytes, escapeHTML: boolean): $.Bytes {
	dst = $.append(dst, 34)
	let start = 0

	// This encodes bytes < 0x20 except for \b, \f, \n, \r and \t.
	// If escapeHTML is set, it also escapes <, >, and &
	// because they can lead to security holes when
	// user-controlled strings are rendered into JSON
	// and served to some browsers.

	// TODO(https://go.dev/issue/56948): Use generic utf8 functionality.
	// For now, cast only a small portion of byte slices to a string
	// so that it can be stack allocated. This slows down []byte slightly
	// due to the extra copy, but keeps string performance roughly the same.

	// U+2028 is LINE SEPARATOR.
	// U+2029 is PARAGRAPH SEPARATOR.
	// They are both technically valid characters in JSON strings,
	// but don't work in JSONP, which has to be evaluated as JavaScript,
	// and can lead to security holes there. It is valid JSON to
	// escape them, so we do so unconditionally.
	// See https://en.wikipedia.org/wiki/JSON#Safety.
	for (let i = 0; i < $.len(src); ) {

		// This encodes bytes < 0x20 except for \b, \f, \n, \r and \t.
		// If escapeHTML is set, it also escapes <, >, and &
		// because they can lead to security holes when
		// user-controlled strings are rendered into JSON
		// and served to some browsers.
		{
			let b = $.indexString(src, i)
			if (b < utf8.RuneSelf) {
				if (htmlSafeSet![b] || (!escapeHTML && safeSet![b])) {
					i++
					continue
				}
				dst = $.append(dst, ...$.stringToBytes($.sliceStringOrBytes(src, start, i)))

				// This encodes bytes < 0x20 except for \b, \f, \n, \r and \t.
				// If escapeHTML is set, it also escapes <, >, and &
				// because they can lead to security holes when
				// user-controlled strings are rendered into JSON
				// and served to some browsers.
				switch (b) {
					case 92:
					case 34: {
						dst = $.append(dst, 92, b)
						break
					}
					case 8: {
						dst = $.append(dst, 92, 98)
						break
					}
					case 12: {
						dst = $.append(dst, 92, 102)
						break
					}
					case 10: {
						dst = $.append(dst, 92, 110)
						break
					}
					case 13: {
						dst = $.append(dst, 92, 114)
						break
					}
					case 9: {
						dst = $.append(dst, 92, 116)
						break
					}
					default: {
						dst = $.append(dst, 92, 117, 48, 48, $.indexString("0123456789abcdef", (b >> 4)), $.indexString("0123456789abcdef", (b & 0xF)))
						break
					}
				}
				i++
				start = i
				continue
			}
		}
		// TODO(https://go.dev/issue/56948): Use generic utf8 functionality.
		// For now, cast only a small portion of byte slices to a string
		// so that it can be stack allocated. This slows down []byte slightly
		// due to the extra copy, but keeps string performance roughly the same.
		let n = Math.min($.len(src) - i, utf8.UTFMax)
		let [c, size] = utf8.DecodeRuneInString($.sliceStringOrBytes(src, i, i + n))
		if (c == utf8.RuneError && size == 1) {
			dst = $.append(dst, ...$.stringToBytes($.sliceStringOrBytes(src, start, i)))
			dst = $.append(dst, ...$.stringToBytes("\\ufffd"))
			i += size
			start = i
			continue
		}
		// U+2028 is LINE SEPARATOR.
		// U+2029 is PARAGRAPH SEPARATOR.
		// They are both technically valid characters in JSON strings,
		// but don't work in JSONP, which has to be evaluated as JavaScript,
		// and can lead to security holes there. It is valid JSON to
		// escape them, so we do so unconditionally.
		// See https://en.wikipedia.org/wiki/JSON#Safety.
		if (c == 8232 || c == 8233) {
			dst = $.append(dst, ...$.stringToBytes($.sliceStringOrBytes(src, start, i)))
			dst = $.append(dst, 92, 117, 50, 48, 50, $.indexString("0123456789abcdef", (c & 0xF)))
			i += size
			start = i
			continue
		}
		i += size
	}
	dst = $.append(dst, ...$.stringToBytes($.sliceStringOrBytes(src, start, undefined)))
	dst = $.append(dst, 34)
	return dst
}

// typeFields returns a list of fields that JSON should recognize for the given type.
// The algorithm is breadth-first search over the set of structs to include - the top struct
// and then any reachable anonymous structs.
//
// typeFields should be an internal detail,
// but widely used packages access it using linkname.
// Notable members of the hall of shame include:
//   - github.com/bytedance/sonic
//
// Do not remove or change the type signature.
// See go.dev/issue/67401.
//
//go:linkname typeFields
export async function typeFields(t: null | reflect.Type): Promise<structFields> {
	// Anonymous fields to explore at the current level and the next.
	let current = $.arrayToSlice<field>([])
	let next = $.arrayToSlice<field>([$.markAsStructValue(new field({typ: t}))])

	// Count of queued names for current level and the next.
	let count: Map<reflect.Type, number> | null = null
	let nextCount: Map<reflect.Type, number> | null = null

	// Types already visited at an earlier level.
	let visited = new Map([])

	// Fields found.
	let fields: $.Slice<field> = null

	// Buffer to run appendHTMLEscape on field names.
	let nameEscBuf: $.Bytes = new Uint8Array(0)

	// Scan f.typ for fields to include.

	// Ignore embedded fields of unexported non-struct types.

	// Do not ignore embedded fields of unexported struct types
	// since they may have exported fields.

	// Ignore unexported non-embedded fields.

	// Follow pointer.

	// Only strings, floats, integers, and booleans can be quoted.

	// Record found field and index sequence.

	// Build nameEscHTML and nameNonEsc ahead of time.

	// Provide a function that uses a type's IsZero method.

	// Avoid panics calling IsZero on a nil interface or
	// non-nil interface with nil pointer.

	// Avoid panics calling IsZero on nil pointer.

	// Temporarily box v so we can take the address.

	// If there were multiple instances, add a second,
	// so that the annihilation code will see a duplicate.
	// It only cares about the distinction between 1 and 2,
	// so don't bother generating any more copies.

	// Record new anonymous struct to explore in next round.
	for (; $.len(next) > 0; ) {
		;[current, next] = [next, $.goSlice(current, undefined, 0)]
		;[count, nextCount] = [nextCount, new Map([])]

		// Scan f.typ for fields to include.

		// Ignore embedded fields of unexported non-struct types.

		// Do not ignore embedded fields of unexported struct types
		// since they may have exported fields.

		// Ignore unexported non-embedded fields.

		// Follow pointer.

		// Only strings, floats, integers, and booleans can be quoted.

		// Record found field and index sequence.

		// Build nameEscHTML and nameNonEsc ahead of time.

		// Provide a function that uses a type's IsZero method.

		// Avoid panics calling IsZero on a nil interface or
		// non-nil interface with nil pointer.

		// Avoid panics calling IsZero on nil pointer.

		// Temporarily box v so we can take the address.

		// If there were multiple instances, add a second,
		// so that the annihilation code will see a duplicate.
		// It only cares about the distinction between 1 and 2,
		// so don't bother generating any more copies.

		// Record new anonymous struct to explore in next round.
		for (let _i = 0; _i < $.len(current); _i++) {
			let f = current![_i]
			{
				if ($.mapGet(visited, f.typ, false)[0]) {
					continue
				}
				$.mapSet(visited, f.typ, true)

				// Scan f.typ for fields to include.

				// Ignore embedded fields of unexported non-struct types.

				// Do not ignore embedded fields of unexported struct types
				// since they may have exported fields.

				// Ignore unexported non-embedded fields.

				// Follow pointer.

				// Only strings, floats, integers, and booleans can be quoted.

				// Record found field and index sequence.

				// Build nameEscHTML and nameNonEsc ahead of time.

				// Provide a function that uses a type's IsZero method.

				// Avoid panics calling IsZero on a nil interface or
				// non-nil interface with nil pointer.

				// Avoid panics calling IsZero on nil pointer.

				// Temporarily box v so we can take the address.

				// If there were multiple instances, add a second,
				// so that the annihilation code will see a duplicate.
				// It only cares about the distinction between 1 and 2,
				// so don't bother generating any more copies.

				// Record new anonymous struct to explore in next round.
				for (let i = 0; i < f.typ!.NumField(); i++) {
					let sf = $.markAsStructValue(f.typ!.Field(i).clone())

					// Ignore embedded fields of unexported non-struct types.

					// Do not ignore embedded fields of unexported struct types
					// since they may have exported fields.

					// Ignore unexported non-embedded fields.
					if (sf.Anonymous) {
						let t = sf.Type
						if (t!.Kind() == reflect.Ptr) {
							t = t!.Elem()
						}

						// Ignore embedded fields of unexported non-struct types.
						if (!sf.IsExported() && t!.Kind() != reflect.Struct) {
							// Ignore embedded fields of unexported non-struct types.
							continue
						}

					} else if (!sf.IsExported()) {
						// Ignore unexported non-embedded fields.
						continue
					}
					let tag = reflect.StructTag_Get(sf.Tag, "json")
					if (tag == "-") {
						continue
					}
					let [name, opts] = parseTag(tag)
					if (!isValidTag(name)) {
						name = ""
					}
					let index = $.makeSlice<number>($.len(f.index) + 1, undefined, 'number')
					$.copy(index, f.index)
					index![$.len(f.index)] = i

					let ft = sf.Type

					// Follow pointer.
					if (ft!.Name() == "" && ft!.Kind() == reflect.Ptr) {
						// Follow pointer.
						ft = ft!.Elem()
					}

					// Only strings, floats, integers, and booleans can be quoted.
					let quoted = false
					if (tagOptions_Contains(opts, "string")) {
						switch (ft!.Kind()) {
							case reflect.Bool:
							case reflect.Int:
							case reflect.Int8:
							case reflect.Int16:
							case reflect.Int32:
							case reflect.Int64:
							case reflect.Uint:
							case reflect.Uint8:
							case reflect.Uint16:
							case reflect.Uint32:
							case reflect.Uint64:
							case reflect.Uintptr:
							case reflect.Float32:
							case reflect.Float64:
							case reflect.String: {
								quoted = true
								break
							}
						}
					}

					// Record found field and index sequence.

					// Build nameEscHTML and nameNonEsc ahead of time.

					// Provide a function that uses a type's IsZero method.

					// Avoid panics calling IsZero on a nil interface or
					// non-nil interface with nil pointer.

					// Avoid panics calling IsZero on nil pointer.

					// Temporarily box v so we can take the address.

					// If there were multiple instances, add a second,
					// so that the annihilation code will see a duplicate.
					// It only cares about the distinction between 1 and 2,
					// so don't bother generating any more copies.
					if (name != "" || !sf.Anonymous || ft!.Kind() != reflect.Struct) {
						let tagged = name != ""
						if (name == "") {
							name = sf.Name
						}
						let field_ = $.markAsStructValue(new field({index: index, name: name, omitEmpty: tagOptions_Contains(opts, "omitempty"), omitZero: tagOptions_Contains(opts, "omitzero"), quoted: quoted, tag: tagged, typ: ft}))
						field_.nameBytes = $.stringToBytes(field_.name)

						// Build nameEscHTML and nameNonEsc ahead of time.
						nameEscBuf = appendHTMLEscape($.goSlice(nameEscBuf, undefined, 0), field_.nameBytes)
						field_.nameEscHTML = `"` + $.bytesToString(nameEscBuf) + `":`
						field_.nameNonEsc = `"` + field_.name + `":`

						// Provide a function that uses a type's IsZero method.

						// Avoid panics calling IsZero on a nil interface or
						// non-nil interface with nil pointer.

						// Avoid panics calling IsZero on nil pointer.

						// Temporarily box v so we can take the address.
						if (field_.omitZero) {
							let t = sf.Type
							// Provide a function that uses a type's IsZero method.

							// Avoid panics calling IsZero on a nil interface or
							// non-nil interface with nil pointer.

							// Avoid panics calling IsZero on nil pointer.

							// Temporarily box v so we can take the address.
							switch (true) {
								case t!.Kind() == reflect.Interface && t!.Implements(isZeroerType): {
									field_.isZero = (v: reflect.Value): boolean => {
										// Avoid panics calling IsZero on a nil interface or
										// non-nil interface with nil pointer.
										return v.IsNil() || (v.Elem()!.Kind() == reflect.Ptr && v.Elem()!.IsNil()) || $.mustTypeAssert<isZeroer>(v.Interface(), 'encoding/json.isZeroer')!.IsZero()
									}
									break
								}
								case t!.Kind() == reflect.Ptr && t!.Implements(isZeroerType): {
									field_.isZero = (v: reflect.Value): boolean => {
										// Avoid panics calling IsZero on nil pointer.
										return v.IsNil() || $.mustTypeAssert<isZeroer>(v.Interface(), 'encoding/json.isZeroer')!.IsZero()
									}
									break
								}
								case t!.Implements(isZeroerType): {
									field_.isZero = (v: reflect.Value): boolean => {
										return $.mustTypeAssert<isZeroer>(v.Interface(), 'encoding/json.isZeroer')!.IsZero()
									}
									break
								}
								case reflect.PointerTo(t)!.Implements(isZeroerType): {
									field_.isZero = (v: reflect.Value): boolean => {

										// Temporarily box v so we can take the address.
										if (!v.CanAddr()) {
											// Temporarily box v so we can take the address.
											let v2 = $.markAsStructValue(reflect.New(v.Type())!.Elem().clone())
											v2.Set(v)
											v = $.markAsStructValue(v2.clone())
										}
										return $.mustTypeAssert<isZeroer>(v.Addr()!.Interface(), 'encoding/json.isZeroer')!.IsZero()
									}
									break
								}
							}
						}

						fields = $.append(fields, field_)

						// If there were multiple instances, add a second,
						// so that the annihilation code will see a duplicate.
						// It only cares about the distinction between 1 and 2,
						// so don't bother generating any more copies.
						if ($.mapGet(count, f.typ, 0)[0] > 1) {
							// If there were multiple instances, add a second,
							// so that the annihilation code will see a duplicate.
							// It only cares about the distinction between 1 and 2,
							// so don't bother generating any more copies.
							fields = $.append(fields, fields![$.len(fields) - 1])
						}
						continue
					}

					// Record new anonymous struct to explore in next round.
					$.mapGet(nextCount, ft, 0)[0]++
					if ($.mapGet(nextCount, ft, 0)[0] == 1) {
						next = $.append(next, $.markAsStructValue(new field({index: index, name: ft!.Name(), typ: ft})))
					}
				}
			}
		}
	}

	// sort field by name, breaking ties with depth, then
	// breaking ties with "name came from json tag", then
	// breaking ties with index sequence.
	slices.SortFunc(fields, (a: field, b: field): number => {
		// sort field by name, breaking ties with depth, then
		// breaking ties with "name came from json tag", then
		// breaking ties with index sequence.
		{
			let c = strings.Compare(a.name, b.name)
			if (c != 0) {
				return c
			}
		}
		{
			let c = cmp.Compare($.len(a.index), $.len(b.index))
			if (c != 0) {
				return c
			}
		}
		if (a.tag != b.tag) {
			if (a.tag) {
				return -1
			}
			return +1
		}
		return slices.Compare(a.index, b.index)
	})

	// Delete all fields that are hidden by the Go rules for embedded fields,
	// except that fields with JSON tags are promoted.

	// The fields are sorted in primary order of name, secondary order
	// of field index length. Loop over names; for each name, delete
	// hidden fields by choosing the one dominant field that survives.
	let out = $.goSlice(fields, undefined, 0)

	// One iteration per name.
	// Find the sequence of fields with the name of this first field.

	// Only one field with this name
	for (let advance = 0, i = 0; i < $.len(fields); i += advance) {
		// One iteration per name.
		// Find the sequence of fields with the name of this first field.
		let fi = $.markAsStructValue(fields![i].clone())
		let name = fi.name
		for (advance = 1; i + advance < $.len(fields); advance++) {
			let fj = $.markAsStructValue(fields![i + advance].clone())
			if (fj.name != name) {
				break
			}
		}
		// Only one field with this name
		if (advance == 1) {
			// Only one field with this name
			out = $.append(out, fi)
			continue
		}
		let [dominant, ok] = dominantField($.goSlice(fields, i, i + advance))
		if (ok) {
			out = $.append(out, dominant)
		}
	}

	fields = out
	slices.SortFunc(fields, (i: field, j: field): number => {
		return slices.Compare(i.index, j.index)
	})

	for (let i = 0; i < $.len(fields); i++) {
		{
			let f = fields![i]
			f!.encoder = await typeEncoder(typeByIndex(t, f!.index))
		}
	}
	let exactNameIndex = $.makeMap<string, field | null>()
	let foldedNameIndex = $.makeMap<string, field | null>()

	// For historical reasons, first folded match takes precedence.
	for (let i = 0; i < $.len(fields); i++) {
		let field = fields![i]
		{
			$.mapSet(exactNameIndex, field.name, fields![i])
			// For historical reasons, first folded match takes precedence.
			{
				let [, ok] = $.mapGet(foldedNameIndex, $.bytesToString(foldName(field.nameBytes)), null)
				if (!ok) {
					$.mapSet(foldedNameIndex, $.bytesToString(foldName(field.nameBytes)), fields![i])
				}
			}
		}
	}
	return $.markAsStructValue(new structFields({byExactName: exactNameIndex, byFoldedName: foldedNameIndex, list: fields}))
}

// dominantField looks through the fields, all of which are known to
// have the same name, to find the single field that dominates the
// others using Go's embedding rules, modified by the presence of
// JSON tags. If there are multiple top-level fields, the boolean
// will be false: This condition is an error in Go and we skip all
// the fields.
export function dominantField(fields: $.Slice<field>): [field, boolean] {
	// The fields are sorted in increasing index-length order, then by presence of tag.
	// That means that the first field is the dominant one. We need only check
	// for error cases: two fields at top level, either both tagged or neither tagged.
	if ($.len(fields) > 1 && $.len(fields![0].index) == $.len(fields![1].index) && fields![0].tag == fields![1].tag) {
		return [$.markAsStructValue(new field({})), false]
	}
	return [fields![0], true]
}

// cachedTypeFields is like typeFields but uses a cache to avoid repeated work.
export async function cachedTypeFields(t: null | reflect.Type): Promise<structFields> {
	{
		let [f, ok] = await fieldCache!.value.Load(t)
		if (ok) {
			return $.mustTypeAssert<structFields>(f, 'encoding/json.structFields')
		}
	}
	let [f, ] = await fieldCache!.value.LoadOrStore(t, await typeFields(t))
	return $.mustTypeAssert<structFields>(f, 'encoding/json.structFields')
}

export function mayAppendQuote(b: $.Bytes, quoted: boolean): $.Bytes {
	if (quoted) {
		b = $.append(b, 34)
	}
	return b
}

