// Generated file based on package_import_archive_zip_writer.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as zip from "@goscript/archive/zip/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as io from "@goscript/io/index.js"
import "@goscript/archive/zip/index.js"
import "@goscript/bytes/index.js"
import "@goscript/io/index.js"

export async function main(): globalThis.Promise<void> {
	let buf: $.VarRef<bytes.Buffer> = $.varRef($.markAsStructValue(new bytes.Buffer()))
	let zw: zip.Writer | $.VarRef<zip.Writer> | null = zip.NewWriter($.interfaceValue<io.Writer | null>(buf, "*bytes.Buffer"))
	let [w, err] = await zip.Writer.prototype.Create.call(zw, "hello.txt")
	$.println("create", err == null)
	let __goscriptTuple0: any = await $.pointerValue<Exclude<io.Writer, null>>(w).Write(new Uint8Array([104, 101, 108, 108, 111]))
	let n = __goscriptTuple0[0]
	err = __goscriptTuple0[1]
	$.println("write", n, err == null)
	err = await zip.Writer.prototype.Close.call(zw)
	$.println("close", err == null, buf.value.Len() > 0)

	let __goscriptTuple1: any = await zip.NewReader($.interfaceValue<io.ReaderAt | null>(bytes.NewReader(buf.value.Bytes()), "*bytes.Reader"), $.int($.int(buf.value.Len())))
	let zr: zip.Reader | $.VarRef<zip.Reader> | null = __goscriptTuple1[0]
	err = __goscriptTuple1[1]
	if (err != null) {
		$.println("open error", $.pointerValue<Exclude<$.GoError, null>>(err).Error())
		return
	}
	$.println("open", err == null, $.len($.pointerValue<zip.Reader>(zr).File))
	let __goscriptTuple2: any = await zip.File.prototype.Open.call($.pointerValue<zip.Reader>(zr).File![0])
	let rc = __goscriptTuple2[0]
	err = __goscriptTuple2[1]
	$.println("file open", err == null)
	let __goscriptTuple3: any = await io.ReadAll($.pointerValueOrNil((rc as io.Reader | null))!)
	let data: $.Slice<number> = __goscriptTuple3[0]
	err = __goscriptTuple3[1]
	$.println("file", $.pointerValue<zip.File>($.pointerValue<zip.Reader>(zr).File![0]).FileHeader.Name, $.bytesToString(data), err == null)
	err = await $.pointerValue<Exclude<io.ReadCloser, null>>(rc).Close()
	$.println("file close", err == null)
}

if ($.isMainScript(import.meta)) {
	await main()
}
