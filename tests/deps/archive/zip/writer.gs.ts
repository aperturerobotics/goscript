// Generated file based on writer.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bufio from "@goscript/bufio/index.js"

import * as binary from "@goscript/encoding/binary/index.js"

import * as errors from "@goscript/errors/index.js"

import * as hash from "@goscript/hash/index.js"

import * as crc322 from "@goscript/hash/crc32/index.js"

import * as io from "@goscript/io/index.js"

import * as fs from "@goscript/io/fs/index.js"

import * as strings from "@goscript/strings/index.js"

import * as utf8 from "@goscript/unicode/utf8/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_reader from "./reader.gs.ts"

import * as __goscript_register from "./register.gs.ts"

import * as __goscript_struct from "./struct.gs.ts"
import "@goscript/bufio/index.js"
import "@goscript/encoding/binary/index.js"
import "@goscript/errors/index.js"
import "@goscript/hash/index.js"
import "@goscript/hash/crc32/index.js"
import "@goscript/io/index.js"
import "@goscript/io/fs/index.js"
import "@goscript/strings/index.js"
import "@goscript/unicode/utf8/index.js"
import "@goscript/sync/index.js"
import "@goscript/time/index.js"
import "./reader.gs.ts"
import "./register.gs.ts"
import "./struct.gs.ts"

export class Writer {
	public get cw(): countWriter | $.VarRef<countWriter> | null {
		return this._fields.cw.value
	}
	public set cw(value: countWriter | $.VarRef<countWriter> | null) {
		this._fields.cw.value = value
	}

	public get dir(): $.Slice<header | $.VarRef<header> | null> {
		return this._fields.dir.value
	}
	public set dir(value: $.Slice<header | $.VarRef<header> | null>) {
		this._fields.dir.value = value
	}

	public get last(): fileWriter | $.VarRef<fileWriter> | null {
		return this._fields.last.value
	}
	public set last(value: fileWriter | $.VarRef<fileWriter> | null) {
		this._fields.last.value = value
	}

	public get closed(): boolean {
		return this._fields.closed.value
	}
	public set closed(value: boolean) {
		this._fields.closed.value = value
	}

	public get compressors(): Map<number, __goscript_register.Compressor | null> | null {
		return this._fields.compressors.value
	}
	public set compressors(value: Map<number, __goscript_register.Compressor | null> | null) {
		this._fields.compressors.value = value
	}

	public get comment(): string {
		return this._fields.comment.value
	}
	public set comment(value: string) {
		this._fields.comment.value = value
	}

	// testHookCloseSizeOffset if non-nil is called with the size
	// of offset of the central directory at Close.
	public get testHookCloseSizeOffset(): ((size: number, offset: number) => void) | null {
		return this._fields.testHookCloseSizeOffset.value
	}
	public set testHookCloseSizeOffset(value: ((size: number, offset: number) => void) | null) {
		this._fields.testHookCloseSizeOffset.value = value
	}

	public _fields: {
		cw: $.VarRef<countWriter | $.VarRef<countWriter> | null>
		dir: $.VarRef<$.Slice<header | $.VarRef<header> | null>>
		last: $.VarRef<fileWriter | $.VarRef<fileWriter> | null>
		closed: $.VarRef<boolean>
		compressors: $.VarRef<Map<number, __goscript_register.Compressor | null> | null>
		comment: $.VarRef<string>
		testHookCloseSizeOffset: $.VarRef<((size: number, offset: number) => void) | null>
	}

	constructor(init?: Partial<{cw?: countWriter | $.VarRef<countWriter> | null, dir?: $.Slice<header | $.VarRef<header> | null>, last?: fileWriter | $.VarRef<fileWriter> | null, closed?: boolean, compressors?: Map<number, __goscript_register.Compressor | null> | null, comment?: string, testHookCloseSizeOffset?: ((size: number, offset: number) => void) | null}>) {
		this._fields = {
			cw: $.varRef(init?.cw ?? null),
			dir: $.varRef(init?.dir ?? null),
			last: $.varRef(init?.last ?? null),
			closed: $.varRef(init?.closed ?? false),
			compressors: $.varRef(init?.compressors ?? null),
			comment: $.varRef(init?.comment ?? ""),
			testHookCloseSizeOffset: $.varRef(init?.testHookCloseSizeOffset ?? null)
		}
	}

	public clone(): Writer {
		const cloned = new Writer()
		cloned._fields = {
			cw: $.varRef(this._fields.cw.value),
			dir: $.varRef(this._fields.dir.value),
			last: $.varRef(this._fields.last.value),
			closed: $.varRef(this._fields.closed.value),
			compressors: $.varRef(this._fields.compressors.value),
			comment: $.varRef(this._fields.comment.value),
			testHookCloseSizeOffset: $.varRef(this._fields.testHookCloseSizeOffset.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async AddFS(fsys: fs.FS | null): globalThis.Promise<$.GoError> {
		const w: Writer | $.VarRef<Writer> | null = this
		return await fs.WalkDir($.pointerValueOrNil(fsys)!, ".", $.functionValue(async (name: string, d: fs.DirEntry | null, err: $.GoError): globalThis.Promise<$.GoError> => {
			await using __defer = new $.AsyncDisposableStack()
			if (err != null) {
				return err
			}
			if ($.stringEqual(name, ".")) {
				return null
			}
			let __goscriptTuple0: any = $.pointerValue<Exclude<fs.DirEntry, null>>(d).Info()
			let info = __goscriptTuple0[0]
			err = __goscriptTuple0[1]
			if (err != null) {
				return err
			}
			if (!$.pointerValue<Exclude<fs.DirEntry, null>>(d).IsDir() && !fs.FileMode_IsRegular($.pointerValue<Exclude<fs.FileInfo, null>>(info).Mode())) {
				return errors.New("zip: cannot add non-regular file")
			}
			let __goscriptTuple1: any = __goscript_struct.FileInfoHeader(info)
			let h: __goscript_struct.FileHeader | $.VarRef<__goscript_struct.FileHeader> | null = __goscriptTuple1[0]
			err = __goscriptTuple1[1]
			if (err != null) {
				return err
			}
			$.pointerValue<__goscript_struct.FileHeader>(h).Name = name
			if ($.pointerValue<Exclude<fs.DirEntry, null>>(d).IsDir()) {
				$.pointerValue<__goscript_struct.FileHeader>(h).Name = $.pointerValue<__goscript_struct.FileHeader>(h).Name + ("/")
			}
			$.pointerValue<__goscript_struct.FileHeader>(h).Method = $.uint(8, 16)
			let __goscriptTuple2: any = await Writer.prototype.CreateHeader.call(w, h)
			let fw = __goscriptTuple2[0]
			err = __goscriptTuple2[1]
			if (err != null) {
				return err
			}
			if ($.pointerValue<Exclude<fs.DirEntry, null>>(d).IsDir()) {
				return null
			}
			let __goscriptTuple3: any = await $.pointerValue<Exclude<fs.FS, null>>(fsys).Open(name)
			let f = __goscriptTuple3[0]
			err = __goscriptTuple3[1]
			if (err != null) {
				return err
			}
			__defer.defer(async () => { await $.pointerValue<Exclude<fs.File, null>>(f).Close() })
			let __goscriptTuple4: any = await io.Copy($.pointerValueOrNil(fw)!, $.pointerValueOrNil((f as io.Reader | null))!)
			err = __goscriptTuple4[1]
			return err
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, "fs.DirEntry", "error"], results: ["error"] } as $.FunctionTypeInfo)))
	}

	public async Close(): globalThis.Promise<$.GoError> {
		let w: Writer | $.VarRef<Writer> | null = this
		if (($.pointerValue<Writer>(w).last != null) && !$.pointerValue<fileWriter>($.pointerValue<Writer>(w).last).closed) {
			{
				let err = await fileWriter.prototype.close.call($.pointerValue<Writer>(w).last)
				if (err != null) {
					return err
				}
			}
			$.pointerValue<Writer>(w).last = null
		}
		if ($.pointerValue<Writer>(w).closed) {
			return errors.New("zip: writer closed twice")
		}
		$.pointerValue<Writer>(w).closed = true

		// write central directory
		let start = $.int($.pointerValue<countWriter>($.pointerValue<Writer>(w).cw).count)
		for (let __goscriptRangeTarget0 = $.pointerValue<Writer>(w).dir, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
			let h = __goscriptRangeTarget0![__rangeIndex]
			let buf: Uint8Array = new Uint8Array(46)
			let b: $.VarRef<writeBuf> = $.varRef((($.goSlice(buf, undefined, undefined) as writeBuf) as writeBuf))
			writeBuf_uint32(b, $.uint($.uint(33639248, 32), 32))
			writeBuf_uint16(b, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).CreatorVersion, 16))
			writeBuf_uint16(b, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).ReaderVersion, 16))
			writeBuf_uint16(b, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).Flags, 16))
			writeBuf_uint16(b, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).Method, 16))
			writeBuf_uint16(b, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).ModifiedTime, 16))
			writeBuf_uint16(b, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).ModifiedDate, 16))
			writeBuf_uint32(b, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).CRC32, 32))
			if ($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).isZip64() || ($.pointerValue<header>(h).offset >= 4294967295)) {
				// the file needs a zip64 header. store maxint in both
				// 32 bit size fields (and offset later) to signal that the
				// zip64 extra header should be used.
				writeBuf_uint32(b, $.uint(4294967295, 32))
				writeBuf_uint32(b, $.uint(4294967295, 32))

				// append a zip64 extra block to Extra
				let __goscriptShadow0: Uint8Array = new Uint8Array(28)
				let eb: $.VarRef<writeBuf> = $.varRef((($.goSlice(__goscriptShadow0, undefined, undefined) as writeBuf) as writeBuf))
				writeBuf_uint16(eb, $.uint(1, 16))
				writeBuf_uint16(eb, $.uint(24, 16))
				writeBuf_uint64(eb, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).UncompressedSize64, 64))
				writeBuf_uint64(eb, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).CompressedSize64, 64))
				writeBuf_uint64(eb, $.uint($.pointerValue<header>(h).offset, 64))
				$.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).Extra = $.append($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).Extra, ...($.goSlice(__goscriptShadow0, undefined, undefined) ?? []))
			} else {
				writeBuf_uint32(b, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).CompressedSize, 32))
				writeBuf_uint32(b, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).UncompressedSize, 32))
			}

			writeBuf_uint16(b, $.uint($.uint($.len($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).Name), 16), 16))
			writeBuf_uint16(b, $.uint($.uint($.len($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).Extra), 16), 16))
			writeBuf_uint16(b, $.uint($.uint($.len($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).Comment), 16), 16))
			b.value = ($.goSlice(b.value, 4, undefined) as writeBuf)
			writeBuf_uint32(b, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).ExternalAttrs, 32))
			if ($.pointerValue<header>(h).offset > 4294967295) {
				writeBuf_uint32(b, $.uint(4294967295, 32))
			} else {
				writeBuf_uint32(b, $.uint($.uint($.pointerValue<header>(h).offset, 32), 32))
			}
			{
				let [, err] = await countWriter.prototype.Write.call($.pointerValue<Writer>(w).cw, $.goSlice(buf, undefined, undefined))
				if (err != null) {
					return err
				}
			}
			{
				let [, err] = await io.WriteString($.pointerValueOrNil($.interfaceValue<io.Writer | null>($.pointerValue<Writer>(w).cw, "*zip.countWriter"))!, $.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).Name)
				if (err != null) {
					return err
				}
			}
			{
				let [, err] = await countWriter.prototype.Write.call($.pointerValue<Writer>(w).cw, $.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).Extra)
				if (err != null) {
					return err
				}
			}
			{
				let [, err] = await io.WriteString($.pointerValueOrNil($.interfaceValue<io.Writer | null>($.pointerValue<Writer>(w).cw, "*zip.countWriter"))!, $.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).Comment)
				if (err != null) {
					return err
				}
			}
		}
		let end = $.int($.pointerValue<countWriter>($.pointerValue<Writer>(w).cw).count)

		let records = $.uint($.uint($.len($.pointerValue<Writer>(w).dir), 64), 64)
		let size = $.uint($.uint($.int64Sub(end, start), 64), 64)
		let offset = $.uint($.uint(start, 64), 64)

		{
			let f: ((size: number, offset: number) => void) | null = $.pointerValue<Writer>(w).testHookCloseSizeOffset
			if (f != null) {
				await f!($.uint(size, 64), $.uint(offset, 64))
			}
		}

		if (((records >= 65535) || (size >= 4294967295)) || (offset >= 4294967295)) {
			let buf: Uint8Array = new Uint8Array(76)
			let b: $.VarRef<writeBuf> = $.varRef((($.goSlice(buf, undefined, undefined) as writeBuf) as writeBuf))

			// zip64 end of central directory record
			writeBuf_uint32(b, $.uint(101075792, 32))
			writeBuf_uint64(b, $.uint($.uint64Sub(56, 12), 64))
			writeBuf_uint16(b, $.uint(45, 16))
			writeBuf_uint16(b, $.uint(45, 16))
			writeBuf_uint32(b, $.uint(0, 32))
			writeBuf_uint32(b, $.uint(0, 32))
			writeBuf_uint64(b, $.uint(records, 64))
			writeBuf_uint64(b, $.uint(records, 64))
			writeBuf_uint64(b, $.uint(size, 64))
			writeBuf_uint64(b, $.uint(offset, 64))

			// zip64 end of central directory locator
			writeBuf_uint32(b, $.uint(117853008, 32))
			writeBuf_uint32(b, $.uint(0, 32))
			writeBuf_uint64(b, $.uint($.uint(end, 64), 64))
			writeBuf_uint32(b, $.uint(1, 32))

			{
				let [, err] = await countWriter.prototype.Write.call($.pointerValue<Writer>(w).cw, $.goSlice(buf, undefined, undefined))
				if (err != null) {
					return err
				}
			}

			// store max values in the regular end record to signal
			// that the zip64 values should be used instead
			records = $.uint(65535, 64)
			size = $.uint(4294967295, 64)
			offset = $.uint(4294967295, 64)
		}

		// write end record
		let buf: Uint8Array = new Uint8Array(22)
		let b: $.VarRef<writeBuf> = $.varRef((($.goSlice(buf, undefined, undefined) as writeBuf) as writeBuf))
		writeBuf_uint32(b, $.uint($.uint(101010256, 32), 32))
		b.value = ($.goSlice(b.value, 4, undefined) as writeBuf)
		writeBuf_uint16(b, $.uint($.uint(records, 16), 16))
		writeBuf_uint16(b, $.uint($.uint(records, 16), 16))
		writeBuf_uint32(b, $.uint($.uint(size, 32), 32))
		writeBuf_uint32(b, $.uint($.uint(offset, 32), 32))
		writeBuf_uint16(b, $.uint($.uint($.len($.pointerValue<Writer>(w).comment), 16), 16))
		{
			let [, err] = await countWriter.prototype.Write.call($.pointerValue<Writer>(w).cw, $.goSlice(buf, undefined, undefined))
			if (err != null) {
				return err
			}
		}
		{
			let [, err] = await io.WriteString($.pointerValueOrNil($.interfaceValue<io.Writer | null>($.pointerValue<Writer>(w).cw, "*zip.countWriter"))!, $.pointerValue<Writer>(w).comment)
			if (err != null) {
				return err
			}
		}

		return await bufio.Writer.prototype.Flush.call($.mustTypeAssert<bufio.Writer | $.VarRef<bufio.Writer> | null>($.pointerValue<countWriter>($.pointerValue<Writer>(w).cw).w, { kind: $.TypeKind.Pointer, elemType: "bufio.Writer" }))
	}

	public async Copy(f: __goscript_reader.File | $.VarRef<__goscript_reader.File> | null): globalThis.Promise<$.GoError> {
		const w: Writer | $.VarRef<Writer> | null = this
		let [r, err] = __goscript_reader.File.prototype.OpenRaw.call(f)
		if (err != null) {
			return err
		}
		// Copy the FileHeader so w doesn't store a pointer to the data
		// of f's entire archive. See #65499.
		let fh = $.varRef($.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_reader.File>(f).FileHeader)))
		let __goscriptTuple5: any = await Writer.prototype.CreateRaw.call(w, fh)
		let fw = __goscriptTuple5[0]
		err = __goscriptTuple5[1]
		if (err != null) {
			return err
		}
		let __goscriptTuple6: any = await io.Copy($.pointerValueOrNil(fw)!, $.pointerValueOrNil(r)!)
		err = __goscriptTuple6[1]
		return err
	}

	public async Create(name: string): globalThis.Promise<[io.Writer | null, $.GoError]> {
		const w: Writer | $.VarRef<Writer> | null = this
		let __goscriptShadow1: __goscript_struct.FileHeader | $.VarRef<__goscript_struct.FileHeader> | null = new __goscript_struct.FileHeader({Name: name, Method: $.uint(8, 16)})
		return await Writer.prototype.CreateHeader.call(w, __goscriptShadow1)
	}

	public async CreateHeader(fh: __goscript_struct.FileHeader | $.VarRef<__goscript_struct.FileHeader> | null): globalThis.Promise<[io.Writer | null, $.GoError]> {
		let w: Writer | $.VarRef<Writer> | null = this
		{
			let err = await Writer.prototype.prepare.call(w, fh)
			if (err != null) {
				return [null, err]
			}
		}

		// The ZIP format has a sad state of affairs regarding character encoding.
		// Officially, the name and comment fields are supposed to be encoded
		// in CP-437 (which is mostly compatible with ASCII), unless the UTF-8
		// flag bit is set. However, there are several problems:
		//
		//	* Many ZIP readers still do not support UTF-8.
		//	* If the UTF-8 flag is cleared, several readers simply interpret the
		//	name and comment fields as whatever the local system encoding is.
		//
		// In order to avoid breaking readers without UTF-8 support,
		// we avoid setting the UTF-8 flag if the strings are CP-437 compatible.
		// However, if the strings require multibyte UTF-8 encoding and is a
		// valid UTF-8 string, then we set the UTF-8 bit.
		//
		// For the case, where the user explicitly wants to specify the encoding
		// as UTF-8, they will need to set the flag bit themselves.
		let [utf8Valid1, utf8Require1] = detectUTF8($.pointerValue<__goscript_struct.FileHeader>(fh).Name)
		let [utf8Valid2, utf8Require2] = detectUTF8($.pointerValue<__goscript_struct.FileHeader>(fh).Comment)
		switch (true) {
			case $.pointerValue<__goscript_struct.FileHeader>(fh).NonUTF8:
			{
				$.pointerValue<__goscript_struct.FileHeader>(fh).Flags = $.pointerValue<__goscript_struct.FileHeader>(fh).Flags & ~(($.uint(0x800, 16)))
				break
			}
			case (utf8Require1 || utf8Require2) && (utf8Valid1 && utf8Valid2):
			{
				$.pointerValue<__goscript_struct.FileHeader>(fh).Flags = $.pointerValue<__goscript_struct.FileHeader>(fh).Flags | ($.uint(0x800, 16))
				break
			}
		}

		$.pointerValue<__goscript_struct.FileHeader>(fh).CreatorVersion = $.uint(($.pointerValue<__goscript_struct.FileHeader>(fh).CreatorVersion & 0xff00) | 20, 16)
		$.pointerValue<__goscript_struct.FileHeader>(fh).ReaderVersion = $.uint(20, 16)

		// If Modified is set, this takes precedence over MS-DOS timestamp fields.
		if (!$.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_struct.FileHeader>(fh).Modified)).IsZero()) {
			// Contrary to the FileHeader.SetModTime method, we intentionally
			// do not convert to UTC, because we assume the user intends to encode
			// the date using the specified timezone. A user may want this control
			// because many legacy ZIP readers interpret the timestamp according
			// to the local timezone.
			//
			// The timezone is only non-UTC if a user directly sets the Modified
			// field directly themselves. All other approaches sets UTC.
			let __goscriptTuple7: any = __goscript_struct.timeToMsDosTime($.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_struct.FileHeader>(fh).Modified)))
			$.pointerValue<__goscript_struct.FileHeader>(fh).ModifiedDate = $.uint(__goscriptTuple7[0], 16)
			$.pointerValue<__goscript_struct.FileHeader>(fh).ModifiedTime = $.uint(__goscriptTuple7[1], 16)

			// Use "extended timestamp" format since this is what Info-ZIP uses.
			// Nearly every major ZIP implementation uses a different format,
			// but at least most seem to be able to understand the other formats.
			//
			// This format happens to be identical for both local and central header
			// if modification time is the only timestamp being encoded.
			let mbuf: Uint8Array = new Uint8Array(9)
			let mt = $.uint($.uint($.markAsStructValue($.cloneStructValue($.pointerValue<__goscript_struct.FileHeader>(fh).Modified)).Unix(), 32), 32)
			let eb: $.VarRef<writeBuf> = $.varRef((($.goSlice(mbuf, undefined, undefined) as writeBuf) as writeBuf))
			writeBuf_uint16(eb, $.uint(21589, 16))
			writeBuf_uint16(eb, $.uint(5, 16))
			writeBuf_uint8(eb, $.uint(1, 8))
			writeBuf_uint32(eb, $.uint(mt, 32))
			$.pointerValue<__goscript_struct.FileHeader>(fh).Extra = $.append($.pointerValue<__goscript_struct.FileHeader>(fh).Extra, ...($.goSlice(mbuf, undefined, undefined) ?? []))
		}

		let ow: io.Writer | null = null as io.Writer | null
		let fw: fileWriter | $.VarRef<fileWriter> | null = null as fileWriter | $.VarRef<fileWriter> | null
		let h: header | $.VarRef<header> | null = new header({FileHeader: fh, offset: $.uint($.uint($.pointerValue<countWriter>($.pointerValue<Writer>(w).cw).count, 64), 64)})

		if (strings.HasSuffix($.pointerValue<__goscript_struct.FileHeader>(fh).Name, "/")) {
			// Set the compression method to Store to ensure data length is truly zero,
			// which the writeHeader method always encodes for the size fields.
			// This is necessary as most compression formats have non-zero lengths
			// even when compressing an empty string.
			$.pointerValue<__goscript_struct.FileHeader>(fh).Method = $.uint(0, 16)
			$.pointerValue<__goscript_struct.FileHeader>(fh).Flags = $.pointerValue<__goscript_struct.FileHeader>(fh).Flags & ~(($.uint(0x8, 16)))

			// Explicitly clear sizes as they have no meaning for directories.
			$.pointerValue<__goscript_struct.FileHeader>(fh).CompressedSize = $.uint(0, 32)
			$.pointerValue<__goscript_struct.FileHeader>(fh).CompressedSize64 = $.uint(0, 64)
			$.pointerValue<__goscript_struct.FileHeader>(fh).UncompressedSize = $.uint(0, 32)
			$.pointerValue<__goscript_struct.FileHeader>(fh).UncompressedSize64 = $.uint(0, 64)

			ow = $.interfaceValue<io.Writer | null>($.markAsStructValue(new dirWriter()), "zip.dirWriter")
		} else {
			$.pointerValue<__goscript_struct.FileHeader>(fh).Flags = $.pointerValue<__goscript_struct.FileHeader>(fh).Flags | ($.uint(0x8, 16))

			fw = (await (async () => { const __goscriptLiteralField0 = await crc322.NewIEEE(); return new fileWriter({zipw: $.interfaceValue<io.Writer | null>($.pointerValue<Writer>(w).cw, "*zip.countWriter"), compCount: new countWriter({w: $.interfaceValue<io.Writer | null>($.pointerValue<Writer>(w).cw, "*zip.countWriter")}), crc32: __goscriptLiteralField0}) })())
			let comp = await Writer.prototype.compressor.call(w, $.uint($.pointerValue<__goscript_struct.FileHeader>(fh).Method, 16))
			if (comp == null) {
				return [null, __goscript_reader.ErrAlgorithm]
			}
			let err: $.GoError = null as $.GoError
			let __goscriptTuple8: any = await comp!($.interfaceValue<io.Writer | null>($.pointerValue<fileWriter>(fw).compCount, "*zip.countWriter"))
			$.pointerValue<fileWriter>(fw).comp = __goscriptTuple8[0]
			err = __goscriptTuple8[1]
			if (err != null) {
				return [null, err]
			}
			$.pointerValue<fileWriter>(fw).rawCount = new countWriter({w: ($.pointerValue<fileWriter>(fw).comp as io.Writer | null)})
			$.pointerValue<fileWriter>(fw).header = h
			ow = $.interfaceValue<io.Writer | null>(fw, "*zip.fileWriter")
		}
		$.pointerValue<Writer>(w).dir = $.append($.pointerValue<Writer>(w).dir, h)
		{
			let err = await writeHeader($.interfaceValue<io.Writer | null>($.pointerValue<Writer>(w).cw, "*zip.countWriter"), h)
			if (err != null) {
				return [null, err]
			}
		}
		// If we're creating a directory, fw is nil.
		$.pointerValue<Writer>(w).last = fw
		return [ow, null]
	}

	public async CreateRaw(fh: __goscript_struct.FileHeader | $.VarRef<__goscript_struct.FileHeader> | null): globalThis.Promise<[io.Writer | null, $.GoError]> {
		let w: Writer | $.VarRef<Writer> | null = this
		{
			let err = await Writer.prototype.prepare.call(w, fh)
			if (err != null) {
				return [null, err]
			}
		}

		$.pointerValue<__goscript_struct.FileHeader>(fh).CompressedSize = $.uint($.uint($.min($.uint($.pointerValue<__goscript_struct.FileHeader>(fh).CompressedSize64, 64), $.uint(4294967295, 64)), 32), 32)
		$.pointerValue<__goscript_struct.FileHeader>(fh).UncompressedSize = $.uint($.uint($.min($.uint($.pointerValue<__goscript_struct.FileHeader>(fh).UncompressedSize64, 64), $.uint(4294967295, 64)), 32), 32)

		let h: header | $.VarRef<header> | null = new header({FileHeader: fh, offset: $.uint($.uint($.pointerValue<countWriter>($.pointerValue<Writer>(w).cw).count, 64), 64), raw: true})
		$.pointerValue<Writer>(w).dir = $.append($.pointerValue<Writer>(w).dir, h)
		{
			let err = await writeHeader($.interfaceValue<io.Writer | null>($.pointerValue<Writer>(w).cw, "*zip.countWriter"), h)
			if (err != null) {
				return [null, err]
			}
		}

		if (strings.HasSuffix($.pointerValue<__goscript_struct.FileHeader>(fh).Name, "/")) {
			$.pointerValue<Writer>(w).last = null
			return [$.interfaceValue<io.Writer | null>($.markAsStructValue(new dirWriter()), "zip.dirWriter"), null]
		}

		let fw: fileWriter | $.VarRef<fileWriter> | null = new fileWriter({header: h, zipw: $.interfaceValue<io.Writer | null>($.pointerValue<Writer>(w).cw, "*zip.countWriter")})
		$.pointerValue<Writer>(w).last = fw
		return [$.interfaceValue<io.Writer | null>(fw, "*zip.fileWriter"), null]
	}

	public async Flush(): globalThis.Promise<$.GoError> {
		const w: Writer | $.VarRef<Writer> | null = this
		return await bufio.Writer.prototype.Flush.call($.mustTypeAssert<bufio.Writer | $.VarRef<bufio.Writer> | null>($.pointerValue<countWriter>($.pointerValue<Writer>(w).cw).w, { kind: $.TypeKind.Pointer, elemType: "bufio.Writer" }))
	}

	public RegisterCompressor(method: number, comp: __goscript_register.Compressor | null): void {
		let w: Writer | $.VarRef<Writer> | null = this
		if ($.pointerValue<Writer>(w).compressors == null) {
			$.pointerValue<Writer>(w).compressors = $.makeMap<number, __goscript_register.Compressor | null>()
		}
		$.mapSet($.pointerValue<Writer>(w).compressors, method, comp)
	}

	public SetComment(comment: string): $.GoError {
		let w: Writer | $.VarRef<Writer> | null = this
		if ($.len(comment) > 65535) {
			return errors.New("zip: Writer.Comment too long")
		}
		$.pointerValue<Writer>(w).comment = comment
		return null
	}

	public SetOffset(n: number): void {
		let w: Writer | $.VarRef<Writer> | null = this
		if ($.int($.pointerValue<countWriter>($.pointerValue<Writer>(w).cw).count) != $.int(0)) {
			$.panic("zip: SetOffset called after data was written")
		}
		$.pointerValue<countWriter>($.pointerValue<Writer>(w).cw).count = $.int(n)
	}

	public async compressor(method: number): globalThis.Promise<__goscript_register.Compressor | null> {
		const w: Writer | $.VarRef<Writer> | null = this
		let comp = $.mapGet($.pointerValue<Writer>(w).compressors, method, null)[0]
		if (comp == null) {
			comp = await __goscript_register.compressor($.uint(method, 16))
		}
		return comp
	}

	public async prepare(fh: __goscript_struct.FileHeader | $.VarRef<__goscript_struct.FileHeader> | null): globalThis.Promise<$.GoError> {
		const w: Writer | $.VarRef<Writer> | null = this
		if (($.pointerValue<Writer>(w).last != null) && !$.pointerValue<fileWriter>($.pointerValue<Writer>(w).last).closed) {
			{
				let err = await fileWriter.prototype.close.call($.pointerValue<Writer>(w).last)
				if (err != null) {
					return err
				}
			}
		}
		if (($.len($.pointerValue<Writer>(w).dir) > 0) && ($.pointerValue<header>($.pointerValue<Writer>(w).dir![$.len($.pointerValue<Writer>(w).dir) - 1]).FileHeader == fh)) {
			// See https://golang.org/issue/11144 confusion.
			return errors.New("archive/zip: invalid duplicate FileHeader")
		}
		return null
	}

	static __typeInfo = $.registerStructType(
		"zip.Writer",
		() => new Writer(),
		[{ name: "AddFS", args: [], returns: [] }, { name: "Close", args: [], returns: [] }, { name: "Copy", args: [], returns: [] }, { name: "Create", args: [], returns: [] }, { name: "CreateHeader", args: [], returns: [] }, { name: "CreateRaw", args: [], returns: [] }, { name: "Flush", args: [], returns: [] }, { name: "RegisterCompressor", args: [], returns: [] }, { name: "SetComment", args: [], returns: [] }, { name: "SetOffset", args: [], returns: [] }, { name: "compressor", args: [], returns: [] }, { name: "prepare", args: [], returns: [] }],
		Writer,
		[{ name: "cw", key: "cw", type: { kind: $.TypeKind.Pointer, elemType: "zip.countWriter" }, pkgPath: "archive/zip", index: [0], offset: 0, exported: false }, { name: "dir", key: "dir", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "zip.header" } }, pkgPath: "archive/zip", index: [1], offset: 8, exported: false }, { name: "last", key: "last", type: { kind: $.TypeKind.Pointer, elemType: "zip.fileWriter" }, pkgPath: "archive/zip", index: [2], offset: 32, exported: false }, { name: "closed", key: "closed", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "archive/zip", index: [3], offset: 40, exported: false }, { name: "compressors", key: "compressors", type: { kind: $.TypeKind.Map, keyType: { kind: $.TypeKind.Basic, name: "uint16" }, elemType: ({ kind: $.TypeKind.Function, name: "zip.Compressor", params: ["io.Writer"], results: ["io.WriteCloser", "error"] } as $.FunctionTypeInfo) }, pkgPath: "archive/zip", index: [4], offset: 48, exported: false }, { name: "comment", key: "comment", type: { kind: $.TypeKind.Basic, name: "string" }, pkgPath: "archive/zip", index: [5], offset: 56, exported: false }, { name: "testHookCloseSizeOffset", key: "testHookCloseSizeOffset", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "uint64" }, { kind: $.TypeKind.Basic, name: "uint64" }], results: [] } as $.FunctionTypeInfo), pkgPath: "archive/zip", index: [6], offset: 72, exported: false }]
	)
}

export class header {
	public get FileHeader(): __goscript_struct.FileHeader | $.VarRef<__goscript_struct.FileHeader> | null {
		return this._fields.FileHeader.value
	}
	public set FileHeader(value: __goscript_struct.FileHeader | $.VarRef<__goscript_struct.FileHeader> | null) {
		this._fields.FileHeader.value = value
	}

	public get offset(): number {
		return this._fields.offset.value
	}
	public set offset(value: number) {
		this._fields.offset.value = value
	}

	public get raw(): boolean {
		return this._fields.raw.value
	}
	public set raw(value: boolean) {
		this._fields.raw.value = value
	}

	public _fields: {
		FileHeader: $.VarRef<__goscript_struct.FileHeader | $.VarRef<__goscript_struct.FileHeader> | null>
		offset: $.VarRef<number>
		raw: $.VarRef<boolean>
	}

	constructor(init?: Partial<{FileHeader?: __goscript_struct.FileHeader | $.VarRef<__goscript_struct.FileHeader> | null, offset?: number, raw?: boolean}>) {
		this._fields = {
			FileHeader: $.varRef(init?.FileHeader ?? null),
			offset: $.varRef(init?.offset ?? 0),
			raw: $.varRef(init?.raw ?? false)
		}
	}

	public clone(): header {
		const cloned = new header()
		cloned._fields = {
			FileHeader: $.varRef(this._fields.FileHeader.value),
			offset: $.varRef(this._fields.offset.value),
			raw: $.varRef(this._fields.raw.value)
		}
		return $.markAsStructValue(cloned)
	}

	public FileInfo(): any {
		return $.pointerValue<__goscript_struct.FileHeader>(this.FileHeader).FileInfo()
	}

	public ModTime(): any {
		return $.pointerValue<__goscript_struct.FileHeader>(this.FileHeader).ModTime()
	}

	public Mode(): any {
		return $.pointerValue<__goscript_struct.FileHeader>(this.FileHeader).Mode()
	}

	public SetModTime(t: any): any {
		return $.pointerValue<__goscript_struct.FileHeader>(this.FileHeader).SetModTime(t)
	}

	public SetMode(mode: any): any {
		return $.pointerValue<__goscript_struct.FileHeader>(this.FileHeader).SetMode(mode)
	}

	public hasDataDescriptor(): any {
		return $.pointerValue<__goscript_struct.FileHeader>(this.FileHeader).hasDataDescriptor()
	}

	public isZip64(): any {
		return $.pointerValue<__goscript_struct.FileHeader>(this.FileHeader).isZip64()
	}

	static __typeInfo = $.registerStructType(
		"zip.header",
		() => new header(),
		[{ name: "FileInfo", args: [], returns: [] }, { name: "ModTime", args: [], returns: [] }, { name: "Mode", args: [], returns: [] }, { name: "SetModTime", args: [], returns: [] }, { name: "SetMode", args: [], returns: [] }, { name: "hasDataDescriptor", args: [], returns: [] }, { name: "isZip64", args: [], returns: [] }],
		header,
		[{ name: "FileHeader", key: "FileHeader", type: { kind: $.TypeKind.Pointer, elemType: "zip.FileHeader" }, anonymous: true, index: [0], offset: 0, exported: true }, { name: "offset", key: "offset", type: { kind: $.TypeKind.Basic, name: "uint64" }, pkgPath: "archive/zip", index: [1], offset: 8, exported: false }, { name: "raw", key: "raw", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "archive/zip", index: [2], offset: 16, exported: false }]
	)
}

export class dirWriter {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): dirWriter {
		const cloned = new dirWriter()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Write(b: $.Slice<number>): [number, $.GoError] {
		if ($.len(b) == 0) {
			return [0, null]
		}
		return [0, errors.New("zip: write to directory")]
	}

	static __typeInfo = $.registerStructType(
		"zip.dirWriter",
		() => new dirWriter(),
		[{ name: "Write", args: [], returns: [] }],
		dirWriter,
		[]
	)
}

export class fileWriter {
	public get header(): header | $.VarRef<header> | null {
		return this._fields.header.value
	}
	public set header(value: header | $.VarRef<header> | null) {
		this._fields.header.value = value
	}

	public get zipw(): io.Writer | null {
		return this._fields.zipw.value
	}
	public set zipw(value: io.Writer | null) {
		this._fields.zipw.value = value
	}

	public get rawCount(): countWriter | $.VarRef<countWriter> | null {
		return this._fields.rawCount.value
	}
	public set rawCount(value: countWriter | $.VarRef<countWriter> | null) {
		this._fields.rawCount.value = value
	}

	public get comp(): io.WriteCloser | null {
		return this._fields.comp.value
	}
	public set comp(value: io.WriteCloser | null) {
		this._fields.comp.value = value
	}

	public get compCount(): countWriter | $.VarRef<countWriter> | null {
		return this._fields.compCount.value
	}
	public set compCount(value: countWriter | $.VarRef<countWriter> | null) {
		this._fields.compCount.value = value
	}

	public get crc32(): hash.Hash32 | null {
		return this._fields.crc32.value
	}
	public set crc32(value: hash.Hash32 | null) {
		this._fields.crc32.value = value
	}

	public get closed(): boolean {
		return this._fields.closed.value
	}
	public set closed(value: boolean) {
		this._fields.closed.value = value
	}

	public _fields: {
		header: $.VarRef<header | $.VarRef<header> | null>
		zipw: $.VarRef<io.Writer | null>
		rawCount: $.VarRef<countWriter | $.VarRef<countWriter> | null>
		comp: $.VarRef<io.WriteCloser | null>
		compCount: $.VarRef<countWriter | $.VarRef<countWriter> | null>
		crc32: $.VarRef<hash.Hash32 | null>
		closed: $.VarRef<boolean>
	}

	constructor(init?: Partial<{header?: header | $.VarRef<header> | null, zipw?: io.Writer | null, rawCount?: countWriter | $.VarRef<countWriter> | null, comp?: io.WriteCloser | null, compCount?: countWriter | $.VarRef<countWriter> | null, crc32?: hash.Hash32 | null, closed?: boolean}>) {
		this._fields = {
			header: $.varRef(init?.header ?? null),
			zipw: $.varRef(init?.zipw ?? null),
			rawCount: $.varRef(init?.rawCount ?? null),
			comp: $.varRef(init?.comp ?? null),
			compCount: $.varRef(init?.compCount ?? null),
			crc32: $.varRef(init?.crc32 ?? null),
			closed: $.varRef(init?.closed ?? false)
		}
	}

	public clone(): fileWriter {
		const cloned = new fileWriter()
		cloned._fields = {
			header: $.varRef(this._fields.header.value),
			zipw: $.varRef(this._fields.zipw.value),
			rawCount: $.varRef(this._fields.rawCount.value),
			comp: $.varRef(this._fields.comp.value),
			compCount: $.varRef(this._fields.compCount.value),
			crc32: $.varRef(this._fields.crc32.value),
			closed: $.varRef(this._fields.closed.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Write(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		const w: fileWriter | $.VarRef<fileWriter> | null = this
		if ($.pointerValue<fileWriter>(w).closed) {
			return [0, errors.New("zip: write to closed file")]
		}
		if ($.pointerValue<header>($.pointerValue<fileWriter>(w).header).raw) {
			return await $.pointerValue<Exclude<io.Writer, null>>($.pointerValue<fileWriter>(w).zipw).Write(p)
		}
		await $.pointerValue<Exclude<hash.Hash32, null>>($.pointerValue<fileWriter>(w).crc32).Write(p)
		return await countWriter.prototype.Write.call($.pointerValue<fileWriter>(w).rawCount, p)
	}

	public async close(): globalThis.Promise<$.GoError> {
		let w: fileWriter | $.VarRef<fileWriter> | null = this
		if ($.pointerValue<fileWriter>(w).closed) {
			return errors.New("zip: file closed twice")
		}
		$.pointerValue<fileWriter>(w).closed = true
		if ($.pointerValue<header>($.pointerValue<fileWriter>(w).header).raw) {
			return await fileWriter.prototype.writeDataDescriptor.call(w)
		}
		{
			let err = await $.pointerValue<Exclude<io.WriteCloser, null>>($.pointerValue<fileWriter>(w).comp).Close()
			if (err != null) {
				return err
			}
		}

		// update FileHeader
		let fh: __goscript_struct.FileHeader | $.VarRef<__goscript_struct.FileHeader> | null = $.pointerValue<header>($.pointerValue<fileWriter>(w).header).FileHeader
		$.pointerValue<__goscript_struct.FileHeader>(fh).CRC32 = $.uint($.pointerValue<Exclude<hash.Hash32, null>>($.pointerValue<fileWriter>(w).crc32).Sum32(), 32)
		$.pointerValue<__goscript_struct.FileHeader>(fh).CompressedSize64 = $.uint($.uint($.pointerValue<countWriter>($.pointerValue<fileWriter>(w).compCount).count, 64), 64)
		$.pointerValue<__goscript_struct.FileHeader>(fh).UncompressedSize64 = $.uint($.uint($.pointerValue<countWriter>($.pointerValue<fileWriter>(w).rawCount).count, 64), 64)

		if (__goscript_struct.FileHeader.prototype.isZip64.call(fh)) {
			$.pointerValue<__goscript_struct.FileHeader>(fh).CompressedSize = $.uint(4294967295, 32)
			$.pointerValue<__goscript_struct.FileHeader>(fh).UncompressedSize = $.uint(4294967295, 32)
			$.pointerValue<__goscript_struct.FileHeader>(fh).ReaderVersion = $.uint(45, 16)
		} else {
			$.pointerValue<__goscript_struct.FileHeader>(fh).CompressedSize = $.uint($.uint($.pointerValue<__goscript_struct.FileHeader>(fh).CompressedSize64, 32), 32)
			$.pointerValue<__goscript_struct.FileHeader>(fh).UncompressedSize = $.uint($.uint($.pointerValue<__goscript_struct.FileHeader>(fh).UncompressedSize64, 32), 32)
		}

		return await fileWriter.prototype.writeDataDescriptor.call(w)
	}

	public async writeDataDescriptor(): globalThis.Promise<$.GoError> {
		const w: fileWriter | $.VarRef<fileWriter> | null = this
		if (!$.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>($.pointerValue<fileWriter>(w).header).FileHeader).hasDataDescriptor()) {
			return null
		}
		// Write data descriptor. This is more complicated than one would
		// think, see e.g. comments in zipfile.c:putextended() and
		// https://bugs.openjdk.org/browse/JDK-7073588.
		// The approach here is to write 8 byte sizes if needed without
		// adding a zip64 extra in the local header (too late anyway).
		let buf: $.Slice<number> = null as $.Slice<number>
		if ($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>($.pointerValue<fileWriter>(w).header).FileHeader).isZip64()) {
			buf = $.makeSlice<number>(24, undefined, "byte")
		} else {
			buf = $.makeSlice<number>(16, undefined, "byte")
		}
		let b: $.VarRef<writeBuf> = $.varRef(((buf as writeBuf) as writeBuf))
		writeBuf_uint32(b, $.uint(134695760, 32))
		writeBuf_uint32(b, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>($.pointerValue<fileWriter>(w).header).FileHeader).CRC32, 32))
		if ($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>($.pointerValue<fileWriter>(w).header).FileHeader).isZip64()) {
			writeBuf_uint64(b, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>($.pointerValue<fileWriter>(w).header).FileHeader).CompressedSize64, 64))
			writeBuf_uint64(b, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>($.pointerValue<fileWriter>(w).header).FileHeader).UncompressedSize64, 64))
		} else {
			writeBuf_uint32(b, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>($.pointerValue<fileWriter>(w).header).FileHeader).CompressedSize, 32))
			writeBuf_uint32(b, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>($.pointerValue<fileWriter>(w).header).FileHeader).UncompressedSize, 32))
		}
		let [, err] = await $.pointerValue<Exclude<io.Writer, null>>($.pointerValue<fileWriter>(w).zipw).Write(buf)
		return err
	}

	public FileInfo(): any {
		return $.pointerValue<any>($.pointerValue<header>(this.header).FileHeader).FileInfo()
	}

	public ModTime(): any {
		return $.pointerValue<any>($.pointerValue<header>(this.header).FileHeader).ModTime()
	}

	public Mode(): any {
		return $.pointerValue<any>($.pointerValue<header>(this.header).FileHeader).Mode()
	}

	public SetModTime(t: any): any {
		return $.pointerValue<any>($.pointerValue<header>(this.header).FileHeader).SetModTime(t)
	}

	public SetMode(mode: any): any {
		return $.pointerValue<any>($.pointerValue<header>(this.header).FileHeader).SetMode(mode)
	}

	public hasDataDescriptor(): any {
		return $.pointerValue<any>($.pointerValue<header>(this.header).FileHeader).hasDataDescriptor()
	}

	public isZip64(): any {
		return $.pointerValue<any>($.pointerValue<header>(this.header).FileHeader).isZip64()
	}

	static __typeInfo = $.registerStructType(
		"zip.fileWriter",
		() => new fileWriter(),
		[{ name: "Write", args: [], returns: [] }, { name: "close", args: [], returns: [] }, { name: "writeDataDescriptor", args: [], returns: [] }, { name: "FileInfo", args: [], returns: [] }, { name: "ModTime", args: [], returns: [] }, { name: "Mode", args: [], returns: [] }, { name: "SetModTime", args: [], returns: [] }, { name: "SetMode", args: [], returns: [] }, { name: "hasDataDescriptor", args: [], returns: [] }, { name: "isZip64", args: [], returns: [] }],
		fileWriter,
		[{ name: "header", key: "header", type: { kind: $.TypeKind.Pointer, elemType: "zip.header" }, pkgPath: "archive/zip", anonymous: true, index: [0], offset: 0, exported: false }, { name: "zipw", key: "zipw", type: "io.Writer", pkgPath: "archive/zip", index: [1], offset: 8, exported: false }, { name: "rawCount", key: "rawCount", type: { kind: $.TypeKind.Pointer, elemType: "zip.countWriter" }, pkgPath: "archive/zip", index: [2], offset: 24, exported: false }, { name: "comp", key: "comp", type: "io.WriteCloser", pkgPath: "archive/zip", index: [3], offset: 32, exported: false }, { name: "compCount", key: "compCount", type: { kind: $.TypeKind.Pointer, elemType: "zip.countWriter" }, pkgPath: "archive/zip", index: [4], offset: 48, exported: false }, { name: "crc32", key: "crc32", type: "hash.Hash32", pkgPath: "archive/zip", index: [5], offset: 56, exported: false }, { name: "closed", key: "closed", type: { kind: $.TypeKind.Basic, name: "bool" }, pkgPath: "archive/zip", index: [6], offset: 72, exported: false }]
	)
}

export class countWriter {
	public get w(): io.Writer | null {
		return this._fields.w.value
	}
	public set w(value: io.Writer | null) {
		this._fields.w.value = value
	}

	public get count(): number {
		return this._fields.count.value
	}
	public set count(value: number) {
		this._fields.count.value = value
	}

	public _fields: {
		w: $.VarRef<io.Writer | null>
		count: $.VarRef<number>
	}

	constructor(init?: Partial<{w?: io.Writer | null, count?: number}>) {
		this._fields = {
			w: $.varRef(init?.w ?? null),
			count: $.varRef(init?.count ?? 0)
		}
	}

	public clone(): countWriter {
		const cloned = new countWriter()
		cloned._fields = {
			w: $.varRef(this._fields.w.value),
			count: $.varRef(this._fields.count.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async Write(p: $.Slice<number>): globalThis.Promise<[number, $.GoError]> {
		let w: countWriter | $.VarRef<countWriter> | null = this
		let [n, err] = await $.pointerValue<Exclude<io.Writer, null>>($.pointerValue<countWriter>(w).w).Write(p)
		$.pointerValue<countWriter>(w).count = $.int64Add($.pointerValue<countWriter>(w).count, $.int($.int(n)))
		return [n, err]
	}

	static __typeInfo = $.registerStructType(
		"zip.countWriter",
		() => new countWriter(),
		[{ name: "Write", args: [], returns: [] }],
		countWriter,
		[{ name: "w", key: "w", type: "io.Writer", pkgPath: "archive/zip", index: [0], offset: 0, exported: false }, { name: "count", key: "count", type: { kind: $.TypeKind.Basic, name: "int64" }, pkgPath: "archive/zip", index: [1], offset: 16, exported: false }]
	)
}

export class nopCloser {
	public get Writer(): io.Writer | null {
		return this._fields.Writer.value
	}
	public set Writer(value: io.Writer | null) {
		this._fields.Writer.value = value
	}

	public _fields: {
		Writer: $.VarRef<io.Writer | null>
	}

	constructor(init?: Partial<{Writer?: io.Writer | null}>) {
		this._fields = {
			Writer: $.varRef(init?.Writer ?? null)
		}
	}

	public clone(): nopCloser {
		const cloned = new nopCloser()
		cloned._fields = {
			Writer: $.varRef(this._fields.Writer.value)
		}
		return $.markAsStructValue(cloned)
	}

	public Close(): $.GoError {
		const w = this
		return null
	}

	public async Write(p: any): globalThis.Promise<any> {
		return await $.pointerValue<Exclude<io.Writer | null, null>>(this.Writer).Write(p)
	}

	static __typeInfo = $.registerStructType(
		"zip.nopCloser",
		() => new nopCloser(),
		[{ name: "Close", args: [], returns: [] }, { name: "Write", args: [], returns: [] }],
		nopCloser,
		[{ name: "Writer", key: "Writer", type: "io.Writer", anonymous: true, index: [0], offset: 0, exported: true }]
	)
}

export let errLongName: $.GoError = errors.New("zip: FileHeader.Name too long")

export function __goscript_set_errLongName(__goscriptValue: $.GoError): void {
	errLongName = __goscriptValue
}

export let errLongExtra: $.GoError = errors.New("zip: FileHeader.Extra too long")

export function __goscript_set_errLongExtra(__goscriptValue: $.GoError): void {
	errLongExtra = __goscriptValue
}

export function NewWriter(w: io.Writer | null): Writer | $.VarRef<Writer> | null {
	return new Writer({cw: (() => { const __goscriptLiteralField1 = $.interfaceValue<io.Writer | null>(bufio.NewWriter(w), "*bufio.Writer"); return new countWriter({w: __goscriptLiteralField1}) })()})
}

export function detectUTF8(s: string): [boolean, boolean] {
	let valid: boolean = false
	let _require: boolean = false
	for (let i = 0; i < $.len(s); ) {
		let __goscriptTuple9: any = utf8.DecodeRuneInString($.sliceStringOrBytes(s, i, undefined))
		let r = $.int(__goscriptTuple9[0], 32)
		let size = __goscriptTuple9[1]
		i = i + (size)
		// Officially, ZIP uses CP-437, but many readers use the system's
		// local character encoding. Most encoding are compatible with a large
		// subset of CP-437, which itself is ASCII-like.
		//
		// Forbid 0x7e and 0x5c since EUC-KR and Shift-JIS replace those
		// characters with localized currency and overline characters.
		if (((r < 0x20) || (r > 0x7d)) || ($.int(r, 32) == $.int(0x5c, 32))) {
			if (!utf8.ValidRune($.int(r, 32)) || (($.int(r, 32) == $.int(utf8.RuneError, 32)) && (size == 1))) {
				return [false, false]
			}
			_require = true
		}
	}
	return [true, _require]
}

export async function writeHeader(w: io.Writer | null, h: header | $.VarRef<header> | null): globalThis.Promise<$.GoError> {
	const maxUint16: number = 65535
	if ($.len($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).Name) > 65535) {
		return errLongName
	}
	if ($.len($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).Extra) > 65535) {
		return errLongExtra
	}

	let buf: Uint8Array = new Uint8Array(30)
	let b: $.VarRef<writeBuf> = $.varRef((($.goSlice(buf, undefined, undefined) as writeBuf) as writeBuf))
	writeBuf_uint32(b, $.uint($.uint(67324752, 32), 32))
	writeBuf_uint16(b, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).ReaderVersion, 16))
	writeBuf_uint16(b, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).Flags, 16))
	writeBuf_uint16(b, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).Method, 16))
	writeBuf_uint16(b, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).ModifiedTime, 16))
	writeBuf_uint16(b, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).ModifiedDate, 16))
	// In raw mode (caller does the compression), the values are either
	// written here or in the trailing data descriptor based on the header
	// flags.
	if ($.pointerValue<header>(h).raw && !$.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).hasDataDescriptor()) {
		writeBuf_uint32(b, $.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).CRC32, 32))
		writeBuf_uint32(b, $.uint($.uint($.min($.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).CompressedSize64, 64), $.uint(4294967295, 64)), 32), 32))
		writeBuf_uint32(b, $.uint($.uint($.min($.uint($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).UncompressedSize64, 64), $.uint(4294967295, 64)), 32), 32))
	} else {
		// When this package handle the compression, these values are
		// always written to the trailing data descriptor.
		writeBuf_uint32(b, $.uint(0, 32))
		writeBuf_uint32(b, $.uint(0, 32))
		writeBuf_uint32(b, $.uint(0, 32))
	}
	writeBuf_uint16(b, $.uint($.uint($.len($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).Name), 16), 16))
	writeBuf_uint16(b, $.uint($.uint($.len($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).Extra), 16), 16))
	{
		let [, err] = await $.pointerValue<Exclude<io.Writer, null>>(w).Write($.goSlice(buf, undefined, undefined))
		if (err != null) {
			return err
		}
	}
	{
		let [, err] = await io.WriteString($.pointerValueOrNil(w)!, $.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).Name)
		if (err != null) {
			return err
		}
	}
	let [, err] = await $.pointerValue<Exclude<io.Writer, null>>(w).Write($.pointerValue<__goscript_struct.FileHeader>($.pointerValue<header>(h).FileHeader).Extra)
	return err
}

export type writeBuf = $.Slice<number>

export function writeBuf_uint8(b: $.VarRef<writeBuf> | null, v: number): void {
	($.pointerValue<writeBuf>(b))![0] = $.uint(v, 8)
	b!.value = ($.goSlice(($.pointerValue<writeBuf>(b)), 1, undefined) as writeBuf)
}

export function writeBuf_uint16(b: $.VarRef<writeBuf> | null, v: number): void {
	$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint16($.pointerValue<writeBuf>(b), $.uint(v, 16))
	b!.value = ($.goSlice(($.pointerValue<writeBuf>(b)), 2, undefined) as writeBuf)
}

export function writeBuf_uint32(b: $.VarRef<writeBuf> | null, v: number): void {
	$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint32($.pointerValue<writeBuf>(b), $.uint(v, 32))
	b!.value = ($.goSlice(($.pointerValue<writeBuf>(b)), 4, undefined) as writeBuf)
}

export function writeBuf_uint64(b: $.VarRef<writeBuf> | null, v: number): void {
	$.markAsStructValue($.cloneStructValue($.pointerValue<any>(binary.LittleEndian))).PutUint64($.pointerValue<writeBuf>(b), $.uint(v, 64))
	b!.value = ($.goSlice(($.pointerValue<writeBuf>(b)), 8, undefined) as writeBuf)
}
