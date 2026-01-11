// Generated file based on struct_embedding_bytes_buffer.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import * as io from "@goscript/io/index.js"

import * as bytes from "@goscript/bytes/index.js"

export class MyWriter {
	public get count(): number {
		return this._fields.count.value
	}
	public set count(value: number) {
		this._fields.count.value = value
	}

	public get Buffer(): bytes.Buffer {
		return this._fields.Buffer.value
	}
	public set Buffer(value: bytes.Buffer) {
		this._fields.Buffer.value = value
	}

	public _fields: {
		Buffer: $.VarRef<bytes.Buffer>;
		count: $.VarRef<number>;
	}

	constructor(init?: Partial<{Buffer?: Partial<ConstructorParameters<typeof bytes.Buffer>[0]>, count?: number}>) {
		this._fields = {
			Buffer: $.varRef(new bytes.Buffer(init?.Buffer)),
			count: $.varRef(init?.count ?? 0)
		}
	}

	public clone(): MyWriter {
		const cloned = new MyWriter()
		cloned._fields = {
			Buffer: $.varRef($.markAsStructValue(this._fields.Buffer.value.clone())),
			count: $.varRef(this._fields.count.value)
		}
		return cloned
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
	  'main.MyWriter',
	  new MyWriter(),
	  [],
	  MyWriter,
	  {"Buffer": "Buffer", "count": { kind: $.TypeKind.Basic, name: "int" }}
	);
}

export async function main(): Promise<void> {
	let w: $.VarRef<MyWriter> = $.varRef(new MyWriter())

	// Call promoted method WriteString from bytes.Buffer
	w!.value.WriteString("Hello ")
	w!.value.WriteString("World")

	$.println("Content:", w!.value.String())
	$.println("Length:", w!.value.Len())

	$.println("test finished")
}

