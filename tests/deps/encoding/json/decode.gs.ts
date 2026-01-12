import * as $ from "@goscript/builtin/index.js"
import { cachedTypeFields, isValidNumber } from "./encode.gs.js";
import { foldName } from "./fold.gs.js";
import { checkValid, stateEndValue } from "./scanner.gs.js";
import { structFields } from "./encode.gs.js";
import { scanner } from "./scanner.gs.js";
import { scanArrayValue, scanBeginArray, scanBeginLiteral, scanBeginObject, scanEnd, scanEndArray, scanEndObject, scanObjectKey, scanObjectValue, scanSkipSpace } from "./scanner.gs.js";

import * as encoding from "@goscript/encoding/index.js"

import * as base64 from "@goscript/encoding/base64/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as reflect from "@goscript/reflect/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as strings from "@goscript/strings/index.js"

import * as unicode from "@goscript/unicode/index.js"

import * as utf16 from "@goscript/unicode/utf16/index.js"

import * as utf8 from "@goscript/unicode/utf8/index.js"

// for linkname

export let phasePanicMsg: string = "JSON decoder out of sync - data changing underfoot?"

export class InvalidUnmarshalError {
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

	public clone(): InvalidUnmarshalError {
		const cloned = new InvalidUnmarshalError()
		cloned._fields = {
			Type: $.varRef(this._fields.Type.value)
		}
		return cloned
	}

	public Error(): string {
		const e = this
		if (e.Type == null) {
			return "json: Unmarshal(nil)"
		}
		if (e.Type!.Kind() != reflect.Ptr) {
			return "json: Unmarshal(non-pointer " + e.Type!.String() + ")"
		}
		return "json: Unmarshal(nil " + e.Type!.String() + ")"
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.InvalidUnmarshalError',
	  new InvalidUnmarshalError(),
	  [{ name: "Error", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  InvalidUnmarshalError,
	  {"Type": "Type"}
	);
}

export type Number = string;

export function Number_String(n: Number): string {
	return n
}

export function Number_Float64(n: Number): [number, $.GoError] {
	return strconv.ParseFloat(n, 64)
}

export function Number_Int64(n: Number): [number, $.GoError] {
	return strconv.ParseInt(n, 10, 64)
}


export class UnmarshalFieldError {
	public get Key(): string {
		return this._fields.Key.value
	}
	public set Key(value: string) {
		this._fields.Key.value = value
	}

	public get Type(): null | reflect.Type {
		return this._fields.Type.value
	}
	public set Type(value: null | reflect.Type) {
		this._fields.Type.value = value
	}

	public get Field(): reflect.StructField {
		return this._fields.Field.value
	}
	public set Field(value: reflect.StructField) {
		this._fields.Field.value = value
	}

	public _fields: {
		Key: $.VarRef<string>;
		Type: $.VarRef<null | reflect.Type>;
		Field: $.VarRef<reflect.StructField>;
	}

	constructor(init?: Partial<{Field?: reflect.StructField, Key?: string, Type?: null | reflect.Type}>) {
		this._fields = {
			Key: $.varRef(init?.Key ?? ""),
			Type: $.varRef(init?.Type ?? null),
			Field: $.varRef(init?.Field ? $.markAsStructValue(init.Field.clone()) : new reflect.StructField())
		}
	}

	public clone(): UnmarshalFieldError {
		const cloned = new UnmarshalFieldError()
		cloned._fields = {
			Key: $.varRef(this._fields.Key.value),
			Type: $.varRef(this._fields.Type.value),
			Field: $.varRef($.markAsStructValue(this._fields.Field.value.clone()))
		}
		return cloned
	}

	public Error(): string {
		const e = this
		return "json: cannot unmarshal object key " + strconv.Quote(e.Key) + " into unexported field " + e.Field.Name + " of type " + e.Type!.String()
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.UnmarshalFieldError',
	  new UnmarshalFieldError(),
	  [{ name: "Error", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  UnmarshalFieldError,
	  {"Key": { kind: $.TypeKind.Basic, name: "string" }, "Type": "Type", "Field": "StructField"}
	);
}

export class UnmarshalTypeError {
	// description of JSON value - "bool", "array", "number -5"
	public get Value(): string {
		return this._fields.Value.value
	}
	public set Value(value: string) {
		this._fields.Value.value = value
	}

	// type of Go value it could not be assigned to
	public get Type(): null | reflect.Type {
		return this._fields.Type.value
	}
	public set Type(value: null | reflect.Type) {
		this._fields.Type.value = value
	}

	// error occurred after reading Offset bytes
	public get Offset(): number {
		return this._fields.Offset.value
	}
	public set Offset(value: number) {
		this._fields.Offset.value = value
	}

	// name of the struct type containing the field
	public get Struct(): string {
		return this._fields.Struct.value
	}
	public set Struct(value: string) {
		this._fields.Struct.value = value
	}

	// the full path from root node to the field, include embedded struct
	public get Field(): string {
		return this._fields.Field.value
	}
	public set Field(value: string) {
		this._fields.Field.value = value
	}

	public _fields: {
		Value: $.VarRef<string>;
		Type: $.VarRef<null | reflect.Type>;
		Offset: $.VarRef<number>;
		Struct: $.VarRef<string>;
		Field: $.VarRef<string>;
	}

	constructor(init?: Partial<{Field?: string, Offset?: number, Struct?: string, Type?: null | reflect.Type, Value?: string}>) {
		this._fields = {
			Value: $.varRef(init?.Value ?? ""),
			Type: $.varRef(init?.Type ?? null),
			Offset: $.varRef(init?.Offset ?? 0),
			Struct: $.varRef(init?.Struct ?? ""),
			Field: $.varRef(init?.Field ?? "")
		}
	}

	public clone(): UnmarshalTypeError {
		const cloned = new UnmarshalTypeError()
		cloned._fields = {
			Value: $.varRef(this._fields.Value.value),
			Type: $.varRef(this._fields.Type.value),
			Offset: $.varRef(this._fields.Offset.value),
			Struct: $.varRef(this._fields.Struct.value),
			Field: $.varRef(this._fields.Field.value)
		}
		return cloned
	}

	public Error(): string {
		const e = this
		if (e.Struct != "" || e.Field != "") {
			return "json: cannot unmarshal " + e.Value + " into Go struct field " + e.Struct + "." + e.Field + " of type " + e.Type!.String()
		}
		return "json: cannot unmarshal " + e.Value + " into Go value of type " + e.Type!.String()
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.UnmarshalTypeError',
	  new UnmarshalTypeError(),
	  [{ name: "Error", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  UnmarshalTypeError,
	  {"Value": { kind: $.TypeKind.Basic, name: "string" }, "Type": "Type", "Offset": { kind: $.TypeKind.Basic, name: "int64" }, "Struct": { kind: $.TypeKind.Basic, name: "string" }, "Field": { kind: $.TypeKind.Basic, name: "string" }}
	);
}

export type Unmarshaler = null | {
	UnmarshalJSON(_p0: $.Bytes): $.GoError
}

$.registerInterfaceType(
  'encoding/json.Unmarshaler',
  null, // Zero value for interface is null
  [{ name: "UnmarshalJSON", args: [{ name: "", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }]
);

export class decodeState {
	public get data(): $.Bytes {
		return this._fields.data.value
	}
	public set data(value: $.Bytes) {
		this._fields.data.value = value
	}

	// next read offset in data
	public get off(): number {
		return this._fields.off.value
	}
	public set off(value: number) {
		this._fields.off.value = value
	}

	// last read result
	public get opcode(): number {
		return this._fields.opcode.value
	}
	public set opcode(value: number) {
		this._fields.opcode.value = value
	}

	public get scan(): scanner {
		return this._fields.scan.value
	}
	public set scan(value: scanner) {
		this._fields.scan.value = value
	}

	public get errorContext(): errorContext | null {
		return this._fields.errorContext.value
	}
	public set errorContext(value: errorContext | null) {
		this._fields.errorContext.value = value
	}

	public get savedError(): $.GoError {
		return this._fields.savedError.value
	}
	public set savedError(value: $.GoError) {
		this._fields.savedError.value = value
	}

	public get useNumber(): boolean {
		return this._fields.useNumber.value
	}
	public set useNumber(value: boolean) {
		this._fields.useNumber.value = value
	}

	public get disallowUnknownFields(): boolean {
		return this._fields.disallowUnknownFields.value
	}
	public set disallowUnknownFields(value: boolean) {
		this._fields.disallowUnknownFields.value = value
	}

	public _fields: {
		data: $.VarRef<$.Bytes>;
		off: $.VarRef<number>;
		opcode: $.VarRef<number>;
		scan: $.VarRef<scanner>;
		errorContext: $.VarRef<errorContext | null>;
		savedError: $.VarRef<$.GoError>;
		useNumber: $.VarRef<boolean>;
		disallowUnknownFields: $.VarRef<boolean>;
	}

	constructor(init?: Partial<{data?: $.Bytes, disallowUnknownFields?: boolean, errorContext?: errorContext | null, off?: number, opcode?: number, savedError?: $.GoError, scan?: scanner, useNumber?: boolean}>) {
		this._fields = {
			data: $.varRef(init?.data ?? new Uint8Array(0)),
			off: $.varRef(init?.off ?? 0),
			opcode: $.varRef(init?.opcode ?? 0),
			scan: $.varRef(init?.scan ? $.markAsStructValue(init.scan.clone()) : new scanner()),
			errorContext: $.varRef(init?.errorContext ?? null),
			savedError: $.varRef(init?.savedError ?? null),
			useNumber: $.varRef(init?.useNumber ?? false),
			disallowUnknownFields: $.varRef(init?.disallowUnknownFields ?? false)
		}
	}

	public clone(): decodeState {
		const cloned = new decodeState()
		cloned._fields = {
			data: $.varRef(this._fields.data.value),
			off: $.varRef(this._fields.off.value),
			opcode: $.varRef(this._fields.opcode.value),
			scan: $.varRef($.markAsStructValue(this._fields.scan.value.clone())),
			errorContext: $.varRef(this._fields.errorContext.value ? $.markAsStructValue(this._fields.errorContext.value.clone()) : null),
			savedError: $.varRef(this._fields.savedError.value),
			useNumber: $.varRef(this._fields.useNumber.value),
			disallowUnknownFields: $.varRef(this._fields.disallowUnknownFields.value)
		}
		return cloned
	}

	public async unmarshal(v: null | any): Promise<$.GoError> {
		const d = this
		let rv = $.markAsStructValue(reflect.ValueOf(v).clone())
		if (rv.Kind() != reflect.Ptr || rv.IsNil()) {
			return new InvalidUnmarshalError({Type: reflect.TypeOf(v)})
		}
		d.scan.reset()
		d.scanWhile(9)
		let err = await d.value(rv)
		if (err != null) {
			return d.addErrorContext(err)
		}
		return d.savedError
	}

	// readIndex returns the position of the last byte read.
	public readIndex(): number {
		const d = this
		return d.off - 1
	}

	public init(data: $.Bytes): decodeState | null {
		const d = this
		d.data = data
		d.off = 0
		d.savedError = null
		if (d.errorContext != null) {
			d.errorContext!.Struct = null
			// Reuse the allocated space for the FieldStack slice.
			d.errorContext!.FieldStack = $.goSlice(d.errorContext!.FieldStack, undefined, 0)
		}
		return d
	}

	// saveError saves the first err it is called with,
	// for reporting at the end of the unmarshal.
	public saveError(err: $.GoError): void {
		const d = this
		if (d.savedError == null) {
			d.savedError = d.addErrorContext(err)
		}
	}

	// addErrorContext returns a new error enhanced with information from d.errorContext
	public addErrorContext(err: $.GoError): $.GoError {
		const d = this
		if (d.errorContext != null && (d.errorContext!.Struct != null || $.len(d.errorContext!.FieldStack) > 0)) {
			$.typeSwitch(err, [{ types: [{kind: $.TypeKind.Pointer, elemType: 'encoding/json.UnmarshalTypeError'}], body: (err) => {
				err!.Struct = d.errorContext!.Struct!.Name()
				let fieldStack = d.errorContext!.FieldStack
				if (err!.Field != "") {
					fieldStack = $.append(fieldStack, err!.Field)
				}
				err!.Field = strings.Join(fieldStack, ".")
			}}])
		}
		return err
	}

	// skip scans to the end of what was started.
	public skip(): void {
		const d = this
		let [s, data, i] = [d.scan, d.data, d.off]
		let depth = $.len(s!.parseState)
		for (; ; ) {
			let op = s!.step!(s, data![i])
			i++
			if ($.len(s!.parseState) < depth) {
				d.off = i
				d.opcode = op
				return 
			}
		}
	}

	// scanNext processes the byte at d.data[d.off].
	public scanNext(): void {
		const d = this
		if (d.off < $.len(d.data)) {
			d.opcode = d.scan.step!(d.scan, d.data![d.off])
			d.off++
		} else {
			d.opcode = d.scan.eof()
			d.off = $.len(d.data) + 1 // mark processed EOF with len+1
		}
	}

	// scanWhile processes bytes in d.data[d.off:] until it
	// receives a scan code not equal to op.
	public scanWhile(op: number): void {
		const d = this
		let [s, data, i] = [d.scan, d.data, d.off]
		for (; i < $.len(data); ) {
			let newOp = s!.step!(s, data![i])
			i++
			if (newOp != op) {
				d.opcode = newOp
				d.off = i
				return 
			}
		}
		d.off = $.len(data) + 1 // mark processed EOF with len+1
		d.opcode = d.scan.eof()
	}

	// rescanLiteral is similar to scanWhile(scanContinue), but it specialises the
	// common case where we're decoding a literal. The decoder scans the input
	// twice, once for syntax errors and to check the length of the value, and the
	// second to perform the decoding.
	//
	// Only in the second step do we use decodeState to tokenize literals, so we
	// know there aren't any syntax errors. We can take advantage of that knowledge,
	// and scan a literal's bytes much more quickly.
	public rescanLiteral(): void {
		const d = this
		let [data, i] = [d.data, d.off]
		Switch: switch (data![i - 1]) {
			case 34: {
				for (; i < $.len(data); i++) {

					// escaped char

					// tokenize the closing quote too
					switch (data![i]) {
						case 92: {
							i++
							break
						}
						case 34: {
							i++
							break Switch
							break
						}
					}
				}
				break
			}
			case 48:
			case 49:
			case 50:
			case 51:
			case 52:
			case 53:
			case 54:
			case 55:
			case 56:
			case 57:
			case 45: {
				for (; i < $.len(data); i++) {
					switch (data![i]) {
						case 48:
						case 49:
						case 50:
						case 51:
						case 52:
						case 53:
						case 54:
						case 55:
						case 56:
						case 57:
						case 46:
						case 101:
						case 69:
						case 43:
						case 45: {
							break
						}
						default: {
							break Switch
							break
						}
					}
				}
				break
			}
			case 116: {
				i += $.len("rue")
				break
			}
			case 102: {
				i += $.len("alse")
				break
			}
			case 110: {
				i += $.len("ull")
				break
			}
		}
		if (i < $.len(data)) {
			d.opcode = stateEndValue(d.scan, data![i])
		} else {
			d.opcode = 10
		}
		d.off = i + 1
	}

	// value consumes a JSON value from d.data[d.off-1:], decoding into v, and
	// reads the following byte ahead. If v is invalid, the value is discarded.
	// The first byte of the value has been read already.
	public async value(v: reflect.Value): Promise<$.GoError> {
		const d = this
		switch (d.opcode) {
			default: {
				$.panic("JSON decoder out of sync - data changing underfoot?")
				break
			}
			case 6: {
				if (v.IsValid()) {
					{
						let err = await d.array(v)
						if (err != null) {
							return err
						}
					}
				} else {
					d.skip()
				}
				d.scanNext()
				break
			}
			case 2: {
				if (v.IsValid()) {
					{
						let err = await d._object(v)
						if (err != null) {
							return err
						}
					}
				} else {
					d.skip()
				}
				d.scanNext()
				break
			}
			case 1: {
				let start = d.readIndex()
				d.rescanLiteral()
				if (v.IsValid()) {
					{
						let err = d.literalStore($.goSlice(d.data, start, d.readIndex()), v, false)
						if (err != null) {
							return err
						}
					}
				}
				break
			}
		}
		return null
	}

	// valueQuoted is like value but decodes a
	// quoted string literal or literal null into an interface value.
	// If it finds anything other than a quoted string literal or null,
	// valueQuoted returns unquotedValue{}.
	public valueQuoted(): null | any {
		const d = this
		switch (d.opcode) {
			default: {
				$.panic("JSON decoder out of sync - data changing underfoot?")
				break
			}
			case 6:
			case 2: {
				d.skip()
				d.scanNext()
				break
			}
			case 1: {
				let v = d.literalInterface()
				$.typeSwitch(v, [{ types: ['nil', {kind: $.TypeKind.Basic, name: 'string'}], body: () => {
					return v
				}}])
				break
			}
		}
		return $.markAsStructValue(new unquotedValue({}))
	}

	// array consumes an array from d.data[d.off-1:], decoding into v.
	// The first byte of the array ('[') has been read already.
	public async array(v: reflect.Value): Promise<$.GoError> {
		const d = this
		let [u, ut, pv] = indirect(v, false)
		if (u != null) {
			let start = d.readIndex()
			d.skip()
			return u!.UnmarshalJSON($.goSlice(d.data, start, d.off))
		}
		if (ut != null) {
			d.saveError(new UnmarshalTypeError({Offset: (d.off as number), Type: v.Type(), Value: "array"}))
			d.skip()
			return null
		}
		v = $.markAsStructValue(pv.clone())
		switch (v.Kind()) {
			case reflect.Interface: {
				if (v.NumMethod() == 0) {
					// Decoding into nil interface? Switch to non-reflect code.
					let ai = d.arrayInterface()
					v.Set(reflect.ValueOf(ai))
					return null
				}
				// fallthrough // fallthrough statement skipped
				break
			}
			default: {
				d.saveError(new UnmarshalTypeError({Offset: (d.off as number), Type: v.Type(), Value: "array"}))
				d.skip()
				return null
				break
			}
			case reflect.Array:
			case reflect.Slice: {
				break
				break
			}
		}
		let i = 0
		for (; ; ) {
			// Look ahead for ] - can only happen on first iteration.
			d.scanWhile(9)
			if (Number(d.opcode) == 8) {
				break
			}

			// Expand slice length, growing the slice if necessary.
			if (v.Kind() == reflect.Slice) {
				if (i >= v.Cap()) {
					v.Grow(1)
				}
				if (i >= v.Len()) {
					v.SetLen(i + 1)
				}
			}

			// Decode into element.

			// Ran out of fixed array: skip.
			if (i < v.Len()) {
				// Decode into element.
				{
					let err = await d.value(v.Index(i))
					if (err != null) {
						return err
					}
				}
			} else {
				// Ran out of fixed array: skip.
				{
					let err = await d.value($.markAsStructValue(new reflect.Value({})))
					if (err != null) {
						return err
					}
				}
			}
			i++

			// Next token must be , or ].
			if (Number(d.opcode) == 9) {
				d.scanWhile(9)
			}
			if (Number(d.opcode) == 8) {
				break
			}
			if (Number(d.opcode) != 7) {
				$.panic("JSON decoder out of sync - data changing underfoot?")
			}
		}
		if (i < v.Len()) {

			// zero remainder of array

			// truncate the slice
			if (v.Kind() == reflect.Array) {

				// zero remainder of array
				for (; i < v.Len(); i++) {
					v.Index(i)!.SetZero() // zero remainder of array
				}
			} else {
				v.SetLen(i) // truncate the slice
			}
		}
		if (i == 0 && v.Kind() == reflect.Slice) {
			v.Set(reflect.MakeSlice(v.Type(), 0, 0))
		}
		return null
	}

	// object consumes an object from d.data[d.off-1:], decoding into v.
	// The first byte ('{') of the object has been read already.
	public async _object(v: reflect.Value): Promise<$.GoError> {
		const d = this
		let [u, ut, pv] = indirect(v, false)
		if (u != null) {
			let start = d.readIndex()
			d.skip()
			return u!.UnmarshalJSON($.goSlice(d.data, start, d.off))
		}
		if (ut != null) {
			d.saveError(new UnmarshalTypeError({Offset: (d.off as number), Type: v.Type(), Value: "object"}))
			d.skip()
			return null
		}
		v = $.markAsStructValue(pv.clone())
		let t = v.Type()
		if (v.Kind() == reflect.Interface && v.NumMethod() == 0) {
			let oi = d.objectInterface()
			v.Set(reflect.ValueOf(oi))
			return null
		}
		let fields: structFields = new structFields()
		switch (v.Kind()) {
			case reflect.Map: {
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
						if (!reflect.PointerTo(t!.Key())!.Implements(textUnmarshalerType)) {
							d.saveError(new UnmarshalTypeError({Offset: (d.off as number), Type: t, Value: "object"}))
							d.skip()
							return null
						}
						break
					}
				}
				if (v.IsNil()) {
					v.Set(reflect.MakeMap(t))
				}
				break
			}
			case reflect.Struct: {
				fields = $.markAsStructValue((await cachedTypeFields(t)).clone())
				break
			}
			default: {
				d.saveError(new UnmarshalTypeError({Offset: (d.off as number), Type: t, Value: "object"}))
				d.skip()
				return null
				break
			}
		}
		let mapElem: reflect.Value = new reflect.Value()
		let origErrorContext: errorContext = new errorContext()
		if (d.errorContext != null) {
			origErrorContext = $.markAsStructValue(d.errorContext!.clone())
		}
		for (; ; ) {
			// Read opening " of string key or closing }.
			d.scanWhile(9)

			// closing } - can only happen on first iteration.
			if (Number(d.opcode) == 5) {
				// closing } - can only happen on first iteration.
				break
			}
			if (Number(d.opcode) != 1) {
				$.panic("JSON decoder out of sync - data changing underfoot?")
			}

			// Read key.
			let start = d.readIndex()
			d.rescanLiteral()
			let item = $.goSlice(d.data, start, d.readIndex())
			let [key, ok] = unquoteBytes(item)
			if (!ok) {
				$.panic("JSON decoder out of sync - data changing underfoot?")
			}

			// Figure out field corresponding to key.
			let subv: reflect.Value = new reflect.Value()
			let destring = false // whether the value is wrapped in a string to be decoded first

			// If a struct embeds a pointer to an unexported type,
			// it is not possible to set a newly allocated value
			// since the field is unexported.
			//
			// See https://golang.org/issue/21357

			// Invalidate subv to ensure d.value(subv) skips over
			// the JSON value without assigning it to subv.
			if (v.Kind() == reflect.Map) {
				let elemType = t!.Elem()
				if (!mapElem.IsValid()) {
					mapElem = $.markAsStructValue(reflect.New(elemType)!.Elem().clone())
				} else {
					mapElem.SetZero()
				}
				subv = $.markAsStructValue(mapElem.clone())
			} else {
				let f = $.mapGet(fields.byExactName, $.bytesToString(key), null)[0]
				if (f == null) {
					f = $.mapGet(fields.byFoldedName, $.bytesToString(foldName(key)), null)[0]
				}

				// If a struct embeds a pointer to an unexported type,
				// it is not possible to set a newly allocated value
				// since the field is unexported.
				//
				// See https://golang.org/issue/21357

				// Invalidate subv to ensure d.value(subv) skips over
				// the JSON value without assigning it to subv.
				if (f != null) {
					subv = $.markAsStructValue(v.clone())
					destring = f!.quoted
					if (d.errorContext == null) {
						d.errorContext = new errorContext()
					}

					// If a struct embeds a pointer to an unexported type,
					// it is not possible to set a newly allocated value
					// since the field is unexported.
					//
					// See https://golang.org/issue/21357

					// Invalidate subv to ensure d.value(subv) skips over
					// the JSON value without assigning it to subv.
					for (let i = 0; i < $.len(f!.index); i++) {
						let ind = f!.index![i]
						{

							// If a struct embeds a pointer to an unexported type,
							// it is not possible to set a newly allocated value
							// since the field is unexported.
							//
							// See https://golang.org/issue/21357

							// Invalidate subv to ensure d.value(subv) skips over
							// the JSON value without assigning it to subv.
							if (subv.Kind() == reflect.Ptr) {

								// If a struct embeds a pointer to an unexported type,
								// it is not possible to set a newly allocated value
								// since the field is unexported.
								//
								// See https://golang.org/issue/21357

								// Invalidate subv to ensure d.value(subv) skips over
								// the JSON value without assigning it to subv.
								if (subv.IsNil()) {
									// If a struct embeds a pointer to an unexported type,
									// it is not possible to set a newly allocated value
									// since the field is unexported.
									//
									// See https://golang.org/issue/21357

									// Invalidate subv to ensure d.value(subv) skips over
									// the JSON value without assigning it to subv.
									if (!subv.CanSet()) {
										d.saveError(fmt.Errorf("json: cannot set embedded pointer to unexported struct: %v", subv.Type()!.Elem()))
										// Invalidate subv to ensure d.value(subv) skips over
										// the JSON value without assigning it to subv.
										subv = $.markAsStructValue(new reflect.Value({}))
										destring = false
										break
									}
									subv.Set(reflect.New(subv.Type()!.Elem()))
								}
								subv = $.markAsStructValue(subv.Elem().clone())
							}
							if (i < $.len(f!.index) - 1) {
								d.errorContext!.FieldStack = $.append(d.errorContext!.FieldStack, subv.Type()!.Field(ind)!.Name)
							}
							subv = $.markAsStructValue(subv.Field(ind).clone())
						}
					}
					d.errorContext!.Struct = t
					d.errorContext!.FieldStack = $.append(d.errorContext!.FieldStack, f!.name)
				} else if (d.disallowUnknownFields) {
					d.saveError(fmt.Errorf("json: unknown field %q", key))
				}
			}

			// Read : before value.
			if (Number(d.opcode) == 9) {
				d.scanWhile(9)
			}
			if (Number(d.opcode) != 3) {
				$.panic("JSON decoder out of sync - data changing underfoot?")
			}
			d.scanWhile(9)

			if (destring) {
				$.typeSwitch(d.valueQuoted(), [{ types: ['nil'], body: (qv) => {
					{
						let err = d.literalStore(nullLiteral, subv, false)
						if (err != null) {
							return err
						}
					}
				}},
				{ types: [{kind: $.TypeKind.Basic, name: 'string'}], body: (qv) => {
					{
						let err = d.literalStore($.stringToBytes(qv), subv, true)
						if (err != null) {
							return err
						}
					}
				}}], () => {
					d.saveError(fmt.Errorf("json: invalid use of ,string struct tag, trying to unmarshal unquoted value into %v", subv.Type()))
				})
			} else {
				{
					let err = await d.value(subv)
					if (err != null) {
						return err
					}
				}
			}

			// Write value back to map;
			// if using struct, subv points into struct already.

			// should never occur
			if (v.Kind() == reflect.Map) {
				let kt = t!.Key()
				let kv: reflect.Value = new reflect.Value()

				// should never occur
				if (reflect.PointerTo(kt)!.Implements(textUnmarshalerType)) {
					kv = $.markAsStructValue(reflect.New(kt).clone())
					{
						let err = d.literalStore(item, kv, true)
						if (err != null) {
							return err
						}
					}
					kv = $.markAsStructValue(kv.Elem().clone())
				} else {

					// should never occur
					switch (kt!.Kind()) {
						case reflect.String: {
							kv = $.markAsStructValue(reflect.New(kt)!.Elem().clone())
							kv.SetString($.bytesToString(key))
							break
						}
						case reflect.Int:
						case reflect.Int8:
						case reflect.Int16:
						case reflect.Int32:
						case reflect.Int64: {
							let s = $.bytesToString(key)
							let [n, err] = strconv.ParseInt(s, 10, 64)
							if (err != null || kt!.OverflowInt(n)) {
								d.saveError(new UnmarshalTypeError({Offset: (start + 1 as number), Type: kt, Value: "number " + s}))
								break
							}
							kv = $.markAsStructValue(reflect.New(kt)!.Elem().clone())
							kv.SetInt(n)
							break
						}
						case reflect.Uint:
						case reflect.Uint8:
						case reflect.Uint16:
						case reflect.Uint32:
						case reflect.Uint64:
						case reflect.Uintptr: {
							let s = $.bytesToString(key)
							let [n, err] = strconv.ParseUint(s, 10, 64)
							if (err != null || kt!.OverflowUint(n)) {
								d.saveError(new UnmarshalTypeError({Offset: (start + 1 as number), Type: kt, Value: "number " + s}))
								break
							}
							kv = $.markAsStructValue(reflect.New(kt)!.Elem().clone())
							kv.SetUint(n)
							break
						}
						default: {
							$.panic("json: Unexpected key type")
							break
						}
					}
				}
				if (kv.IsValid()) {
					v.SetMapIndex(kv, subv)
				}
			}

			// Next token must be , or }.
			if (Number(d.opcode) == 9) {
				d.scanWhile(9)
			}

			// Reset errorContext to its original state.
			// Keep the same underlying array for FieldStack, to reuse the
			// space and avoid unnecessary allocs.
			if (d.errorContext != null) {
				// Reset errorContext to its original state.
				// Keep the same underlying array for FieldStack, to reuse the
				// space and avoid unnecessary allocs.
				d.errorContext!.FieldStack = $.goSlice(d.errorContext!.FieldStack, undefined, $.len(origErrorContext.FieldStack))
				d.errorContext!.Struct = origErrorContext.Struct
			}
			if (Number(d.opcode) == 5) {
				break
			}
			if (Number(d.opcode) != 4) {
				$.panic("JSON decoder out of sync - data changing underfoot?")
			}
		}
		return null
	}

	// convertNumber converts the number literal s to a float64 or a Number
	// depending on the setting of d.useNumber.
	public convertNumber(s: string): [null | any, $.GoError] {
		const d = this
		if (d.useNumber) {
			return [(s as Number), null]
		}
		let [f, err] = strconv.ParseFloat(s, 64)
		if (err != null) {
			return [null, new UnmarshalTypeError({Offset: (d.off as number), Type: reflect.TypeOf(0), Value: "number " + s})]
		}
		return [f, null]
	}

	// literalStore decodes a literal stored in item into v.
	//
	// fromQuoted indicates whether this literal came from unwrapping a
	// string from the ",string" struct tag option. this is used only to
	// produce more helpful error messages.
	public literalStore(item: $.Bytes, v: reflect.Value, fromQuoted: boolean): $.GoError {
		const d = this
		if ($.len(item) == 0) {
			// Empty string given.
			d.saveError(fmt.Errorf("json: invalid use of ,string struct tag, trying to unmarshal %q into %v", item, v.Type()))
			return null
		}
		let isNull = item![0] == 110 // null
		let [u, ut, pv] = indirect(v, isNull)
		if (u != null) {
			return u!.UnmarshalJSON(item)
		}
		if (ut != null) {
			if (item![0] != 34) {
				if (fromQuoted) {
					d.saveError(fmt.Errorf("json: invalid use of ,string struct tag, trying to unmarshal %q into %v", item, v.Type()))
					return null
				}
				let val = "number"
				switch (item![0]) {
					case 110: {
						val = "null"
						break
					}
					case 116:
					case 102: {
						val = "bool"
						break
					}
				}
				d.saveError(new UnmarshalTypeError({Offset: (d.readIndex() as number), Type: v.Type(), Value: val}))
				return null
			}
			let [s, ok] = unquoteBytes(item)
			if (!ok) {
				if (fromQuoted) {
					return fmt.Errorf("json: invalid use of ,string struct tag, trying to unmarshal %q into %v", item, v.Type())
				}
				$.panic("JSON decoder out of sync - data changing underfoot?")
			}
			return ut!.UnmarshalText(s)
		}
		v = $.markAsStructValue(pv.clone())
		{let c = item![0]
			switch (c) {
				case 110: {
					if (fromQuoted && $.bytesToString(item) != "null") {
						d.saveError(fmt.Errorf("json: invalid use of ,string struct tag, trying to unmarshal %q into %v", item, v.Type()))
						break
					}
					switch (v.Kind()) {
						case reflect.Interface:
						case reflect.Ptr:
						case reflect.Map:
						case reflect.Slice: {
							v.SetZero()
							break
						}
					}
					break
				}
				case 116:
				case 102: {
					let value = item![0] == 116
					if (fromQuoted && $.bytesToString(item) != "true" && $.bytesToString(item) != "false") {
						d.saveError(fmt.Errorf("json: invalid use of ,string struct tag, trying to unmarshal %q into %v", item, v.Type()))
						break
					}
					switch (v.Kind()) {
						default: {
							if (fromQuoted) {
								d.saveError(fmt.Errorf("json: invalid use of ,string struct tag, trying to unmarshal %q into %v", item, v.Type()))
							} else {
								d.saveError(new UnmarshalTypeError({Offset: (d.readIndex() as number), Type: v.Type(), Value: "bool"}))
							}
							break
						}
						case reflect.Bool: {
							v.SetBool(value)
							break
						}
						case reflect.Interface: {
							if (v.NumMethod() == 0) {
								v.Set(reflect.ValueOf(value))
							} else {
								d.saveError(new UnmarshalTypeError({Offset: (d.readIndex() as number), Type: v.Type(), Value: "bool"}))
							}
							break
						}
					}
					break
				}
				case 34: {
					let [s, ok] = unquoteBytes(item)
					if (!ok) {
						if (fromQuoted) {
							return fmt.Errorf("json: invalid use of ,string struct tag, trying to unmarshal %q into %v", item, v.Type())
						}
						$.panic("JSON decoder out of sync - data changing underfoot?")
					}
					switch (v.Kind()) {
						default: {
							d.saveError(new UnmarshalTypeError({Offset: (d.readIndex() as number), Type: v.Type(), Value: "string"}))
							break
						}
						case reflect.Slice: {
							if (v.Type()!.Elem()!.Kind() != reflect.Uint8) {
								d.saveError(new UnmarshalTypeError({Offset: (d.readIndex() as number), Type: v.Type(), Value: "string"}))
								break
							}
							let b = new Uint8Array(base64.StdEncoding!.DecodedLen($.len(s)))
							let [n, err] = base64.StdEncoding!.Decode(b, s)
							if (err != null) {
								d.saveError(err)
								break
							}
							v.SetBytes($.goSlice(b, undefined, n))
							break
						}
						case reflect.String: {
							let t = $.bytesToString(s)
							if (v.Type() == numberType && !isValidNumber(t)) {
								return fmt.Errorf("json: invalid number literal, trying to unmarshal %q into Number", item)
							}
							v.SetString(t)
							break
						}
						case reflect.Interface: {
							if (v.NumMethod() == 0) {
								v.Set(reflect.ValueOf($.bytesToString(s)))
							} else {
								d.saveError(new UnmarshalTypeError({Offset: (d.readIndex() as number), Type: v.Type(), Value: "string"}))
							}
							break
						}
					}
					break
				}
				default: {
					if (c != 45 && (c < 48 || c > 57)) {
						if (fromQuoted) {
							return fmt.Errorf("json: invalid use of ,string struct tag, trying to unmarshal %q into %v", item, v.Type())
						}
						$.panic("JSON decoder out of sync - data changing underfoot?")
					}
					switch (v.Kind()) {
						default: {
							if (v.Kind() == reflect.String && v.Type() == numberType) {
								// s must be a valid number, because it's
								// already been tokenized.
								v.SetString($.bytesToString(item))
								break
							}
							if (fromQuoted) {
								return fmt.Errorf("json: invalid use of ,string struct tag, trying to unmarshal %q into %v", item, v.Type())
							}
							d.saveError(new UnmarshalTypeError({Offset: (d.readIndex() as number), Type: v.Type(), Value: "number"}))
							break
						}
						case reflect.Interface: {
							let [n, err] = d.convertNumber($.bytesToString(item))
							if (err != null) {
								d.saveError(err)
								break
							}
							if (v.NumMethod() != 0) {
								d.saveError(new UnmarshalTypeError({Offset: (d.readIndex() as number), Type: v.Type(), Value: "number"}))
								break
							}
							v.Set(reflect.ValueOf(n))
							break
						}
						case reflect.Int:
						case reflect.Int8:
						case reflect.Int16:
						case reflect.Int32:
						case reflect.Int64: {
							let [n, err] = strconv.ParseInt($.bytesToString(item), 10, 64)
							if (err != null || v.OverflowInt(n)) {
								d.saveError(new UnmarshalTypeError({Offset: (d.readIndex() as number), Type: v.Type(), Value: "number " + $.bytesToString(item)}))
								break
							}
							v.SetInt(n)
							break
						}
						case reflect.Uint:
						case reflect.Uint8:
						case reflect.Uint16:
						case reflect.Uint32:
						case reflect.Uint64:
						case reflect.Uintptr: {
							let [n, err] = strconv.ParseUint($.bytesToString(item), 10, 64)
							if (err != null || v.OverflowUint(n)) {
								d.saveError(new UnmarshalTypeError({Offset: (d.readIndex() as number), Type: v.Type(), Value: "number " + $.bytesToString(item)}))
								break
							}
							v.SetUint(n)
							break
						}
						case reflect.Float32:
						case reflect.Float64: {
							let [n, err] = strconv.ParseFloat($.bytesToString(item), v.Type()!.Bits())
							if (err != null || v.OverflowFloat(n)) {
								d.saveError(new UnmarshalTypeError({Offset: (d.readIndex() as number), Type: v.Type(), Value: "number " + $.bytesToString(item)}))
								break
							}
							v.SetFloat(n)
							break
						}
					}
					break
				}
			}
		}return null
	}

	// valueInterface is like value but returns any.
	public valueInterface(): null | any {
		const d = this
		let val: null | any = null
		switch (d.opcode) {
			default: {
				$.panic("JSON decoder out of sync - data changing underfoot?")
				break
			}
			case 6: {
				val = d.arrayInterface()
				d.scanNext()
				break
			}
			case 2: {
				val = d.objectInterface()
				d.scanNext()
				break
			}
			case 1: {
				val = d.literalInterface()
				break
			}
		}
		return val
	}

	// arrayInterface is like array but returns []any.
	public arrayInterface(): $.Slice<null | any> {
		const d = this
		let v: $.Slice<null | any> = $.makeSlice<null | any>(0)
		for (; ; ) {
			// Look ahead for ] - can only happen on first iteration.
			d.scanWhile(9)
			if (Number(d.opcode) == 8) {
				break
			}

			v = $.append(v, d.valueInterface())

			// Next token must be , or ].
			if (Number(d.opcode) == 9) {
				d.scanWhile(9)
			}
			if (Number(d.opcode) == 8) {
				break
			}
			if (Number(d.opcode) != 7) {
				$.panic("JSON decoder out of sync - data changing underfoot?")
			}
		}
		return v
	}

	// objectInterface is like object but returns map[string]any.
	public objectInterface(): Map<string, null | any> | null {
		const d = this
		let m = $.makeMap<string, null | any>()
		for (; ; ) {
			// Read opening " of string key or closing }.
			d.scanWhile(9)

			// closing } - can only happen on first iteration.
			if (Number(d.opcode) == 5) {
				// closing } - can only happen on first iteration.
				break
			}
			if (Number(d.opcode) != 1) {
				$.panic("JSON decoder out of sync - data changing underfoot?")
			}

			// Read string key.
			let start = d.readIndex()
			d.rescanLiteral()
			let item = $.goSlice(d.data, start, d.readIndex())
			let [key, ok] = unquote(item)
			if (!ok) {
				$.panic("JSON decoder out of sync - data changing underfoot?")
			}

			// Read : before value.
			if (Number(d.opcode) == 9) {
				d.scanWhile(9)
			}
			if (Number(d.opcode) != 3) {
				$.panic("JSON decoder out of sync - data changing underfoot?")
			}
			d.scanWhile(9)

			// Read value.
			$.mapSet(m, key, d.valueInterface())

			// Next token must be , or }.
			if (Number(d.opcode) == 9) {
				d.scanWhile(9)
			}
			if (Number(d.opcode) == 5) {
				break
			}
			if (Number(d.opcode) != 4) {
				$.panic("JSON decoder out of sync - data changing underfoot?")
			}
		}
		return m
	}

	// literalInterface consumes and returns a literal from d.data[d.off-1:] and
	// it reads the following byte ahead. The first byte of the literal has been
	// read already (that's how the caller knows it's a literal).
	public literalInterface(): null | any {
		const d = this
		let start = d.readIndex()
		d.rescanLiteral()
		let item = $.goSlice(d.data, start, d.readIndex())
		{let c = item![0]
			switch (c) {
				case 110: {
					return null
					break
				}
				case 116:
				case 102: {
					return c == 116
					break
				}
				case 34: {
					let [s, ok] = unquote(item)
					if (!ok) {
						$.panic("JSON decoder out of sync - data changing underfoot?")
					}
					return s
					break
				}
				default: {
					if (c != 45 && (c < 48 || c > 57)) {
						$.panic("JSON decoder out of sync - data changing underfoot?")
					}
					let [n, err] = d.convertNumber($.bytesToString(item))
					if (err != null) {
						d.saveError(err)
					}
					return n
					break
				}
			}
		}}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.decodeState',
	  new decodeState(),
	  [{ name: "unmarshal", args: [{ name: "v", type: { kind: $.TypeKind.Interface, methods: [] } }], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "readIndex", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "init", args: [{ name: "data", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "decodeState" } }] }, { name: "saveError", args: [{ name: "err", type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }], returns: [] }, { name: "addErrorContext", args: [{ name: "err", type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "skip", args: [], returns: [] }, { name: "scanNext", args: [], returns: [] }, { name: "scanWhile", args: [{ name: "op", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [] }, { name: "rescanLiteral", args: [], returns: [] }, { name: "value", args: [{ name: "v", type: "Value" }], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "valueQuoted", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "array", args: [{ name: "v", type: "Value" }], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "object", args: [{ name: "v", type: "Value" }], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "convertNumber", args: [{ name: "s", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }, { type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "literalStore", args: [{ name: "item", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }, { name: "v", type: "Value" }, { name: "fromQuoted", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "valueInterface", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }, { name: "arrayInterface", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }] }, { name: "objectInterface", args: [], returns: [{ type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "string" }, elemType: { kind: $.TypeKind.Interface, methods: [] } } }] }, { name: "literalInterface", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }],
	  decodeState,
	  {"data": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } }, "off": { kind: $.TypeKind.Basic, name: "int" }, "opcode": { kind: $.TypeKind.Basic, name: "int" }, "scan": "scanner", "errorContext": { kind: $.TypeKind.Pointer, elemType: "errorContext" }, "savedError": { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] }, "useNumber": { kind: $.TypeKind.Basic, name: "bool" }, "disallowUnknownFields": { kind: $.TypeKind.Basic, name: "bool" }}
	);
}

export class errorContext {
	public get Struct(): null | reflect.Type {
		return this._fields.Struct.value
	}
	public set Struct(value: null | reflect.Type) {
		this._fields.Struct.value = value
	}

	public get FieldStack(): $.Slice<string> {
		return this._fields.FieldStack.value
	}
	public set FieldStack(value: $.Slice<string>) {
		this._fields.FieldStack.value = value
	}

	public _fields: {
		Struct: $.VarRef<null | reflect.Type>;
		FieldStack: $.VarRef<$.Slice<string>>;
	}

	constructor(init?: Partial<{FieldStack?: $.Slice<string>, Struct?: null | reflect.Type}>) {
		this._fields = {
			Struct: $.varRef(init?.Struct ?? null),
			FieldStack: $.varRef(init?.FieldStack ?? null)
		}
	}

	public clone(): errorContext {
		const cloned = new errorContext()
		cloned._fields = {
			Struct: $.varRef(this._fields.Struct.value),
			FieldStack: $.varRef(this._fields.FieldStack.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.errorContext',
	  new errorContext(),
	  [],
	  errorContext,
	  {"Struct": "Type", "FieldStack": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }}
	);
}

export class unquotedValue {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {}
	}

	public clone(): unquotedValue {
		const cloned = new unquotedValue()
		cloned._fields = {
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'encoding/json.unquotedValue',
	  new unquotedValue(),
	  [],
	  unquotedValue,
	  {}
	);
}

export let nullLiteral: $.Bytes = $.stringToBytes("null")

export let numberType: reflect.Type = reflect.TypeOf("")

export let textUnmarshalerType: reflect.Type = reflect.getInterfaceTypeByName("encoding.TextUnmarshaler")

// Unmarshal parses the JSON-encoded data and stores the result
// in the value pointed to by v. If v is nil or not a pointer,
// Unmarshal returns an [InvalidUnmarshalError].
//
// Unmarshal uses the inverse of the encodings that
// [Marshal] uses, allocating maps, slices, and pointers as necessary,
// with the following additional rules:
//
// To unmarshal JSON into a pointer, Unmarshal first handles the case of
// the JSON being the JSON literal null. In that case, Unmarshal sets
// the pointer to nil. Otherwise, Unmarshal unmarshals the JSON into
// the value pointed at by the pointer. If the pointer is nil, Unmarshal
// allocates a new value for it to point to.
//
// To unmarshal JSON into a value implementing [Unmarshaler],
// Unmarshal calls that value's [Unmarshaler.UnmarshalJSON] method, including
// when the input is a JSON null.
// Otherwise, if the value implements [encoding.TextUnmarshaler]
// and the input is a JSON quoted string, Unmarshal calls
// [encoding.TextUnmarshaler.UnmarshalText] with the unquoted form of the string.
//
// To unmarshal JSON into a struct, Unmarshal matches incoming object keys to
// the keys used by [Marshal] (either the struct field name or its tag),
// ignoring case. If multiple struct fields match an object key, an exact case
// match is preferred over a case-insensitive one.
//
// Incoming object members are processed in the order observed. If an object
// includes duplicate keys, later duplicates will replace or be merged into
// prior values.
//
// To unmarshal JSON into an interface value,
// Unmarshal stores one of these in the interface value:
//
//   - bool, for JSON booleans
//   - float64, for JSON numbers
//   - string, for JSON strings
//   - []any, for JSON arrays
//   - map[string]any, for JSON objects
//   - nil for JSON null
//
// To unmarshal a JSON array into a slice, Unmarshal resets the slice length
// to zero and then appends each element to the slice.
// As a special case, to unmarshal an empty JSON array into a slice,
// Unmarshal replaces the slice with a new empty slice.
//
// To unmarshal a JSON array into a Go array, Unmarshal decodes
// JSON array elements into corresponding Go array elements.
// If the Go array is smaller than the JSON array,
// the additional JSON array elements are discarded.
// If the JSON array is smaller than the Go array,
// the additional Go array elements are set to zero values.
//
// To unmarshal a JSON object into a map, Unmarshal first establishes a map to
// use. If the map is nil, Unmarshal allocates a new map. Otherwise Unmarshal
// reuses the existing map, keeping existing entries. Unmarshal then stores
// key-value pairs from the JSON object into the map. The map's key type must
// either be any string type, an integer, or implement [encoding.TextUnmarshaler].
//
// If the JSON-encoded data contain a syntax error, Unmarshal returns a [SyntaxError].
//
// If a JSON value is not appropriate for a given target type,
// or if a JSON number overflows the target type, Unmarshal
// skips that field and completes the unmarshaling as best it can.
// If no more serious errors are encountered, Unmarshal returns
// an [UnmarshalTypeError] describing the earliest such error. In any
// case, it's not guaranteed that all the remaining fields following
// the problematic one will be unmarshaled into the target object.
//
// The JSON null value unmarshals into an interface, map, pointer, or slice
// by setting that Go value to nil. Because null is often used in JSON to mean
// “not present,” unmarshaling a JSON null into any other Go type has no effect
// on the value and produces no error.
//
// When unmarshaling quoted strings, invalid UTF-8 or
// invalid UTF-16 surrogate pairs are not treated as an error.
// Instead, they are replaced by the Unicode replacement
// character U+FFFD.
export async function Unmarshal(data: $.Bytes, v: null | any): Promise<$.GoError> {
	// Check for well-formedness.
	// Avoids filling out half a data structure
	// before discovering a JSON syntax error.
	let d: $.VarRef<decodeState> = $.varRef(new decodeState())
	let err = checkValid(data, d!.value.scan)
	if (err != null) {
		return err
	}

	d!.value.init(data)
	return await d!.value.unmarshal(v)
}

// indirect walks down v allocating pointers as needed,
// until it gets to a non-pointer.
// If it encounters an Unmarshaler, indirect stops and returns that.
// If decodingNull is true, indirect stops at the first settable pointer so it
// can be set to nil.
export function indirect(v: reflect.Value, decodingNull: boolean): [Unmarshaler, null | encoding.TextUnmarshaler, reflect.Value] {
	// Issue #24153 indicates that it is generally not a guaranteed property
	// that you may round-trip a reflect.Value by calling Value.Addr().Elem()
	// and expect the value to still be settable for values derived from
	// unexported embedded struct fields.
	//
	// The logic below effectively does this when it first addresses the value
	// (to satisfy possible pointer methods) and continues to dereference
	// subsequent pointers as necessary.
	//
	// After the first round-trip, we set v back to the original value to
	// preserve the original RW flags contained in reflect.Value.
	let v0 = $.markAsStructValue(v.clone())
	let haveAddr = false

	// If v is a named type and is addressable,
	// start with its address, so that if the type has pointer methods,
	// we find them.
	if (v.Kind() != reflect.Ptr && v.Type()!.Name() != "" && v.CanAddr()) {
		haveAddr = true
		v = $.markAsStructValue(v.Addr().clone())
	}

	// Load value from interface, but only if the result will be
	// usefully addressable.

	// Prevent infinite loop if v is an interface pointing to its own address:
	//     var v any
	//     v = &v

	// restore original value after round-trip Value.Addr().Elem()
	for (; ; ) {
		// Load value from interface, but only if the result will be
		// usefully addressable.
		if (v.Kind() == reflect.Interface && !v.IsNil()) {
			let e = $.markAsStructValue(v.Elem().clone())
			if (e.Kind() == reflect.Ptr && !e.IsNil() && (!decodingNull || e.Elem()!.Kind() == reflect.Ptr)) {
				haveAddr = false
				v = $.markAsStructValue(e.clone())
				continue
			}
		}

		if (v.Kind() != reflect.Ptr) {
			break
		}

		if (decodingNull && v.CanSet()) {
			break
		}

		// Prevent infinite loop if v is an interface pointing to its own address:
		//     var v any
		//     v = &v
		if (v.Elem()!.Kind() == reflect.Interface && v.Elem()!.Elem()!.Equal(v)) {
			v = $.markAsStructValue(v.Elem().clone())
			break
		}
		if (v.IsNil()) {
			v.Set(reflect.New(v.Type()!.Elem()))
		}
		if (v.Type()!.NumMethod() > 0 && v.CanInterface()) {
			{
				let { value: u, ok: ok } = $.typeAssert<Unmarshaler>(v.Interface(), 'encoding/json.Unmarshaler')
				if (ok) {
					return [u, null, $.markAsStructValue(new reflect.Value({}))]
				}
			}
			if (!decodingNull) {
				{
					let { value: u, ok: ok } = $.typeAssert<null | encoding.TextUnmarshaler>(v.Interface(), 'encoding.TextUnmarshaler')
					if (ok) {
						return [null, u, $.markAsStructValue(new reflect.Value({}))]
					}
				}
			}
		}

		// restore original value after round-trip Value.Addr().Elem()
		if (haveAddr) {
			v = $.markAsStructValue(v0.clone()) // restore original value after round-trip Value.Addr().Elem()
			haveAddr = false
		} else {
			v = $.markAsStructValue(v.Elem().clone())
		}
	}
	return [null, null, v]
}

// getu4 decodes \uXXXX from the beginning of s, returning the hex value,
// or it returns -1.
export function getu4(s: $.Bytes): number {
	if ($.len(s) < 6 || s![0] != 92 || s![1] != 117) {
		return -1
	}
	let r: number = 0
	for (let _i = 0; _i < $.len($.goSlice(s, 2, 6)); _i++) {
		let c = $.goSlice(s, 2, 6)![_i]
		{
			switch (true) {
				case 48 <= c && c <= 57: {
					c = c - 48
					break
				}
				case 97 <= c && c <= 102: {
					c = c - 97 + 10
					break
				}
				case 65 <= c && c <= 70: {
					c = c - 65 + 10
					break
				}
				default: {
					return -1
					break
				}
			}
			r = r * 16 + (c as number)
		}
	}
	return r
}

// unquote converts a quoted JSON string literal s into an actual string t.
// The rules are different than for Go, so cannot use strconv.Unquote.
export function unquote(s: $.Bytes): [string, boolean] {
	let t: string = ""
	let ok: boolean = false
	{
		;[s, ok] = unquoteBytes(s)
		t = $.bytesToString(s)
		return [t, ok]
	}
}

// unquoteBytes should be an internal detail,
// but widely used packages access it using linkname.
// Notable members of the hall of shame include:
//   - github.com/bytedance/sonic
//
// Do not remove or change the type signature.
// See go.dev/issue/67401.
//
//go:linkname unquoteBytes
export function unquoteBytes(s: $.Bytes): [$.Bytes, boolean] {
	let t: $.Bytes = new Uint8Array(0)
	let ok: boolean = false
	{
		if ($.len(s) < 2 || s![0] != 34 || s![$.len(s) - 1] != 34) {
			return [t, ok]
		}
		s = $.goSlice(s, 1, $.len(s) - 1)

		// Check for unusual characters. If there are none,
		// then no unquoting is needed, so return a slice of the
		// original bytes.
		let r = 0
		for (; r < $.len(s); ) {
			let c = s![r]
			if (c == 92 || c == 34 || c < 32) {
				break
			}
			if (c < utf8.RuneSelf) {
				r++
				continue
			}
			let [rr, size] = utf8.DecodeRune($.goSlice(s, r, undefined))
			if (rr == utf8.RuneError && size == 1) {
				break
			}
			r += size
		}
		if (r == $.len(s)) {
			return [s, true]
		}

		let b = new Uint8Array($.len(s) + 2 * utf8.UTFMax)
		let w = $.copy(b, $.goSlice(s, 0, r))

		// Out of room? Can only happen if s is full of
		// malformed UTF-8 and we're replacing each
		// byte with RuneError.

		// A valid pair; consume.

		// Invalid surrogate; fall back to replacement rune.

		// Quote, control characters are invalid.

		// ASCII

		// Coerce to well-formed UTF-8.
		for (; r < $.len(s); ) {
			// Out of room? Can only happen if s is full of
			// malformed UTF-8 and we're replacing each
			// byte with RuneError.
			if (w >= $.len(b) - 2 * utf8.UTFMax) {
				let nb = new Uint8Array(($.len(b) + utf8.UTFMax) * 2)
				$.copy(nb, $.goSlice(b, 0, w))
				b = nb
			}

			// A valid pair; consume.

			// Invalid surrogate; fall back to replacement rune.

			// Quote, control characters are invalid.

			// ASCII

			// Coerce to well-formed UTF-8.
			{let c = s![r]
				switch (true) {
					case c == 92: {
						r++
						if (r >= $.len(s)) {
							return [t, ok]
						}
						switch (s![r]) {
							default: {
								return [t, ok]
								break
							}
							case 34:
							case 92:
							case 47:
							case 39: {
								b![w] = s![r]
								r++
								w++
								break
							}
							case 98: {
								b![w] = 8
								r++
								w++
								break
							}
							case 102: {
								b![w] = 12
								r++
								w++
								break
							}
							case 110: {
								b![w] = 10
								r++
								w++
								break
							}
							case 114: {
								b![w] = 13
								r++
								w++
								break
							}
							case 116: {
								b![w] = 9
								r++
								w++
								break
							}
							case 117: {
								r--
								let rr = getu4($.goSlice(s, r, undefined))
								if (rr < 0) {
									return [t, ok]
								}
								r += 6
								if (utf16.IsSurrogate(rr)) {
									let rr1 = getu4($.goSlice(s, r, undefined))

									// A valid pair; consume.
									{
										let dec = utf16.DecodeRune(rr, rr1)
										if (dec != unicode.ReplacementChar) {
											// A valid pair; consume.
											r += 6
											w += utf8.EncodeRune($.goSlice(b, w, undefined), dec)
											break
										}
									}
									// Invalid surrogate; fall back to replacement rune.
									rr = unicode.ReplacementChar
								}
								w += utf8.EncodeRune($.goSlice(b, w, undefined), rr)
								break
							}
						}
						break
					}
					case c == 34:
					case c < 32: {
						return [t, ok]
						break
					}
					case c < utf8.RuneSelf: {
						b![w] = c
						r++
						w++
						break
					}
					default: {
						let [rr, size] = utf8.DecodeRune($.goSlice(s, r, undefined))
						r += size
						w += utf8.EncodeRune($.goSlice(b, w, undefined), rr)
						break
					}
				}
			}}
		return [$.goSlice(b, 0, w), true]
	}
}

