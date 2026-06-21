// Generated file based on testfs.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as errors2 from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as io from "@goscript/io/index.js"

import * as fs from "@goscript/io/fs/index.js"

import * as maps from "@goscript/maps/index.js"

import * as path2 from "@goscript/path/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strings from "@goscript/strings/index.js"

import * as iotest from "@goscript/testing/iotest/index.js"

import type * as iter from "@goscript/iter/index.js"

import * as time from "@goscript/time/index.js"
import "@goscript/errors/index.js"
import "@goscript/fmt/index.js"
import "@goscript/io/index.js"
import "@goscript/io/fs/index.js"
import "@goscript/maps/index.js"
import "@goscript/path/index.js"
import "@goscript/slices/index.js"
import "@goscript/strings/index.js"
import "@goscript/testing/iotest/index.js"
import "@goscript/time/index.js"

export class fsTester {
	public get fsys(): fs.FS | null {
		return this._fields.fsys.value
	}
	public set fsys(value: fs.FS | null) {
		this._fields.fsys.value = value
	}

	public get errors(): $.Slice<$.GoError> {
		return this._fields.errors.value
	}
	public set errors(value: $.Slice<$.GoError>) {
		this._fields.errors.value = value
	}

	public get dirs(): $.Slice<string> {
		return this._fields.dirs.value
	}
	public set dirs(value: $.Slice<string>) {
		this._fields.dirs.value = value
	}

	public get files(): $.Slice<string> {
		return this._fields.files.value
	}
	public set files(value: $.Slice<string>) {
		this._fields.files.value = value
	}

	public _fields: {
		fsys: $.VarRef<fs.FS | null>
		errors: $.VarRef<$.Slice<$.GoError>>
		dirs: $.VarRef<$.Slice<string>>
		files: $.VarRef<$.Slice<string>>
	}

	constructor(init?: Partial<{fsys?: fs.FS | null, errors?: $.Slice<$.GoError>, dirs?: $.Slice<string>, files?: $.Slice<string>}>) {
		this._fields = {
			fsys: $.varRef(init?.fsys ?? (null as unknown as fs.FS | null)),
			errors: $.varRef(init?.errors ?? (null as unknown as $.Slice<$.GoError>)),
			dirs: $.varRef(init?.dirs ?? (null as unknown as $.Slice<string>)),
			files: $.varRef(init?.files ?? (null as unknown as $.Slice<string>))
		}
	}

	public clone(): fsTester {
		const cloned = new fsTester()
		cloned._fields = {
			fsys: $.varRef(this._fields.fsys.value),
			errors: $.varRef(this._fields.errors.value),
			dirs: $.varRef(this._fields.dirs.value),
			files: $.varRef(this._fields.files.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async checkBadPath(file: string, desc: string, open: ((_p0: string) => $.GoError | globalThis.Promise<$.GoError>) | null): globalThis.Promise<void> {
		const t: fsTester | $.VarRef<fsTester> | null = this
		let bad: $.Slice<string> = $.arrayToSlice<string>(["/" + file, file + "/."])
		if ($.stringEqual(file, ".")) {
			bad = $.append(bad, "/")
		}
		{
			let i = strings.Index(file, "/")
			if (i >= 0) {
				bad = $.append(bad, ($.sliceStringOrBytes(file, undefined, i) + "//") + $.sliceStringOrBytes(file, i + 1, undefined), ($.sliceStringOrBytes(file, undefined, i) + "/./") + $.sliceStringOrBytes(file, i + 1, undefined), ($.sliceStringOrBytes(file, undefined, i) + "\\") + $.sliceStringOrBytes(file, i + 1, undefined), ($.sliceStringOrBytes(file, undefined, i) + "/../") + file)
			}
		}
		{
			let i = strings.LastIndex(file, "/")
			if (i >= 0) {
				bad = $.append(bad, ($.sliceStringOrBytes(file, undefined, i) + "//") + $.sliceStringOrBytes(file, i + 1, undefined), ($.sliceStringOrBytes(file, undefined, i) + "/./") + $.sliceStringOrBytes(file, i + 1, undefined), ($.sliceStringOrBytes(file, undefined, i) + "\\") + $.sliceStringOrBytes(file, i + 1, undefined), (file + "/../") + $.sliceStringOrBytes(file, i + 1, undefined))
			}
		}

		for (let __goscriptRangeTarget5 = bad, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget5); __rangeIndex++) {
			let b = __goscriptRangeTarget5![__rangeIndex]
			{
				let err = await open!(b)
				if (err == null) {
					fsTester.prototype.errorf.call(t, "%s: %s(%s) succeeded, want error", $.arrayToSlice<any>([file, desc, b]))
				}
			}
		}
	}

	public async checkDir(dir: string): globalThis.Promise<void> {
		let t: fsTester | $.VarRef<fsTester> | null = this
		await using __defer = new $.AsyncDisposableStack()
		// Read entire directory.
		$.pointerValue<fsTester>(t).dirs = $.append($.pointerValue<fsTester>(t).dirs, dir)
		let d = await fsTester.prototype.openDir.call(t, dir)
		if (d == null) {
			return
		}
		let __goscriptTuple0: any = await $.pointerValue<Exclude<fs.ReadDirFile, null>>(d).ReadDir(-1)
		let list: $.Slice<fs.DirEntry | null> = __goscriptTuple0[0]
		let err = __goscriptTuple0[1]
		if (err != null) {
			await $.pointerValue<Exclude<fs.ReadDirFile, null>>(d).Close()
			fsTester.prototype.errorf.call(t, "%s: ReadDir(-1): %w", $.arrayToSlice<any>([dir, (err as any)]))
			return
		}

		// Check all children.
		let prefix: string = ""
		if ($.stringEqual(dir, ".")) {
			prefix = ""
		} else {
			prefix = dir + "/"
		}
		for (let __goscriptRangeTarget6 = list, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget6); __rangeIndex++) {
			let info = __goscriptRangeTarget6![__rangeIndex]
			let name = await $.pointerValue<Exclude<fs.DirEntry, null>>(info).Name()
			switch (true) {
				case $.stringEqual(name, "."):
				case $.stringEqual(name, ".."):
				case $.stringEqual(name, ""):
				{
					fsTester.prototype.errorf.call(t, "%s: ReadDir: child has invalid name: %#q", $.arrayToSlice<any>([dir, name]))
					continue
					break
				}
				case strings.Contains(name, "/"):
				{
					fsTester.prototype.errorf.call(t, "%s: ReadDir: child name contains slash: %#q", $.arrayToSlice<any>([dir, name]))
					continue
					break
				}
				case strings.Contains(name, "\\"):
				{
					fsTester.prototype.errorf.call(t, "%s: ReadDir: child name contains backslash: %#q", $.arrayToSlice<any>([dir, name]))
					continue
					break
				}
			}
			let __goscriptShadow1 = prefix + name
			await fsTester.prototype.checkStat.call(t, __goscriptShadow1, info)
			await fsTester.prototype.checkOpen.call(t, __goscriptShadow1)
			switch (await $.pointerValue<Exclude<fs.DirEntry, null>>(info).Type()) {
				case fs.ModeDir:
				{
					await fsTester.prototype.checkDir.call(t, __goscriptShadow1)
					break
				}
				case fs.ModeSymlink:
				{
					$.pointerValue<fsTester>(t).files = $.append($.pointerValue<fsTester>(t).files, __goscriptShadow1)
					break
				}
				default:
				{
					await fsTester.prototype.checkFile.call(t, __goscriptShadow1)
					break
				}
			}
		}

		// Check ReadDir(-1) at EOF.
		let __goscriptTuple1: any = await $.pointerValue<Exclude<fs.ReadDirFile, null>>(d).ReadDir(-1)
		let list2: $.Slice<fs.DirEntry | null> = __goscriptTuple1[0]
		err = __goscriptTuple1[1]
		if (($.len(list2) > 0) || (err != null)) {
			await $.pointerValue<Exclude<fs.ReadDirFile, null>>(d).Close()
			fsTester.prototype.errorf.call(t, "%s: ReadDir(-1) at EOF = %d entries, %w, wanted 0 entries, nil", $.arrayToSlice<any>([dir, $.namedValueInterfaceValue<any>($.len(list2), "int", {}, { kind: $.TypeKind.Basic, name: "int" }), (err as any)]))
			return
		}

		// Check ReadDir(1) at EOF (different results).
		let __goscriptTuple2: any = await $.pointerValue<Exclude<fs.ReadDirFile, null>>(d).ReadDir(1)
		list2 = __goscriptTuple2[0]
		err = __goscriptTuple2[1]
		if (($.len(list2) > 0) || (!$.comparableEqual(err, io.EOF))) {
			await $.pointerValue<Exclude<fs.ReadDirFile, null>>(d).Close()
			fsTester.prototype.errorf.call(t, "%s: ReadDir(1) at EOF = %d entries, %w, wanted 0 entries, EOF", $.arrayToSlice<any>([dir, $.namedValueInterfaceValue<any>($.len(list2), "int", {}, { kind: $.TypeKind.Basic, name: "int" }), (err as any)]))
			return
		}

		// Check that close does not report an error.
		{
			let __goscriptShadow2 = await $.pointerValue<Exclude<fs.ReadDirFile, null>>(d).Close()
			if (__goscriptShadow2 != null) {
				fsTester.prototype.errorf.call(t, "%s: Close: %w", $.arrayToSlice<any>([dir, (__goscriptShadow2 as any)]))
			}
		}

		// Check that closing twice doesn't crash.
		// The return value doesn't matter.
		await $.pointerValue<Exclude<fs.ReadDirFile, null>>(d).Close()

		// Reopen directory, read a second time, make sure contents match.
		{
			d = await fsTester.prototype.openDir.call(t, dir)
			if (d == null) {
				return
			}
		}
		__defer.defer(async () => { await $.pointerValue<Exclude<fs.ReadDirFile, null>>(d).Close() })
		let __goscriptTuple3: any = await $.pointerValue<Exclude<fs.ReadDirFile, null>>(d).ReadDir(-1)
		list2 = __goscriptTuple3[0]
		err = __goscriptTuple3[1]
		if (err != null) {
			fsTester.prototype.errorf.call(t, "%s: second Open+ReadDir(-1): %w", $.arrayToSlice<any>([dir, (err as any)]))
			return
		}
		await fsTester.prototype.checkDirList.call(t, dir, "first Open+ReadDir(-1) vs second Open+ReadDir(-1)", list, list2)

		// Reopen directory, read a third time in pieces, make sure contents match.
		{
			d = await fsTester.prototype.openDir.call(t, dir)
			if (d == null) {
				return
			}
		}
		__defer.defer(async () => { await $.pointerValue<Exclude<fs.ReadDirFile, null>>(d).Close() })
		list2 = null
		while (true) {
			let n = 1
			if ($.len(list2) > 0) {
				n = 2
			}
			let __goscriptTuple4: any = await $.pointerValue<Exclude<fs.ReadDirFile, null>>(d).ReadDir(n)
			let frag: $.Slice<fs.DirEntry | null> = __goscriptTuple4[0]
			let __goscriptShadow3 = __goscriptTuple4[1]
			if ($.len(frag) > n) {
				fsTester.prototype.errorf.call(t, "%s: third Open: ReadDir(%d) after %d: %d entries (too many)", $.arrayToSlice<any>([dir, $.namedValueInterfaceValue<any>(n, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>($.len(list2), "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>($.len(frag), "int", {}, { kind: $.TypeKind.Basic, name: "int" })]))
				return
			}
			list2 = $.appendSlice(list2, frag)
			if ($.comparableEqual(__goscriptShadow3, io.EOF)) {
				break
			}
			if (__goscriptShadow3 != null) {
				fsTester.prototype.errorf.call(t, "%s: third Open: ReadDir(%d) after %d: %w", $.arrayToSlice<any>([dir, $.namedValueInterfaceValue<any>(n, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>($.len(list2), "int", {}, { kind: $.TypeKind.Basic, name: "int" }), (__goscriptShadow3 as any)]))
				return
			}
			if (n == 0) {
				fsTester.prototype.errorf.call(t, "%s: third Open: ReadDir(%d) after %d: 0 entries but nil error", $.arrayToSlice<any>([dir, $.namedValueInterfaceValue<any>(n, "int", {}, { kind: $.TypeKind.Basic, name: "int" }), $.namedValueInterfaceValue<any>($.len(list2), "int", {}, { kind: $.TypeKind.Basic, name: "int" })]))
				return
			}
		}
		await fsTester.prototype.checkDirList.call(t, dir, "first Open+ReadDir(-1) vs third Open+ReadDir(1,2) loop", list, list2)

		// If fsys has ReadDir, check that it matches and is sorted.
		{
			let __goscriptTuple5: any = $.typeAssertTuple<fs.ReadDirFS | null>($.pointerValue<fsTester>(t).fsys, "fs.ReadDirFS")
			let fsys = __goscriptTuple5[0]
			let ok = __goscriptTuple5[1]
			if (ok) {
				let __goscriptTuple6: any = await $.pointerValue<Exclude<fs.ReadDirFS, null>>(fsys).ReadDir(dir)
				let __goscriptShadow4: $.Slice<fs.DirEntry | null> = __goscriptTuple6[0]
				let __goscriptShadow5 = __goscriptTuple6[1]
				if (__goscriptShadow5 != null) {
					fsTester.prototype.errorf.call(t, "%s: fsys.ReadDir: %w", $.arrayToSlice<any>([dir, (__goscriptShadow5 as any)]))
					return
				}
				await fsTester.prototype.checkDirList.call(t, dir, "first Open+ReadDir(-1) vs fsys.ReadDir", list, __goscriptShadow4)

				for (let i = 0; (i + 1) < $.len(__goscriptShadow4); i++) {
					if ($.stringCompare(await $.pointerValue<Exclude<fs.DirEntry, null>>(__goscriptShadow4![i]).Name(), await $.pointerValue<Exclude<fs.DirEntry, null>>(__goscriptShadow4![i + 1]).Name()) >= 0) {
						fsTester.prototype.errorf.call(t, "%s: fsys.ReadDir: list not sorted: %s before %s", $.arrayToSlice<any>([dir, await $.pointerValue<Exclude<fs.DirEntry, null>>(__goscriptShadow4![i]).Name(), await $.pointerValue<Exclude<fs.DirEntry, null>>(__goscriptShadow4![i + 1]).Name()]))
					}
				}
			}
		}

		// Check fs.ReadDir as well.
		let __goscriptTuple7: any = await fs.ReadDir($.pointerValueOrNil($.pointerValue<fsTester>(t).fsys)!, dir)
		list2 = __goscriptTuple7[0]
		err = __goscriptTuple7[1]
		if (err != null) {
			fsTester.prototype.errorf.call(t, "%s: fs.ReadDir: %w", $.arrayToSlice<any>([dir, (err as any)]))
			return
		}
		await fsTester.prototype.checkDirList.call(t, dir, "first Open+ReadDir(-1) vs fs.ReadDir", list, list2)

		for (let i = 0; (i + 1) < $.len(list2); i++) {
			if ($.stringCompare(await $.pointerValue<Exclude<fs.DirEntry, null>>(list2![i]).Name(), await $.pointerValue<Exclude<fs.DirEntry, null>>(list2![i + 1]).Name()) >= 0) {
				fsTester.prototype.errorf.call(t, "%s: fs.ReadDir: list not sorted: %s before %s", $.arrayToSlice<any>([dir, await $.pointerValue<Exclude<fs.DirEntry, null>>(list2![i]).Name(), await $.pointerValue<Exclude<fs.DirEntry, null>>(list2![i + 1]).Name()]))
			}
		}

		await fsTester.prototype.checkGlob.call(t, dir, list2)
	}

	public async checkDirList(dir: string, desc: string, list1: $.Slice<fs.DirEntry | null>, list2: $.Slice<fs.DirEntry | null>): globalThis.Promise<void> {
		const t: fsTester | $.VarRef<fsTester> | null = this
		let old: globalThis.Map<string, fs.DirEntry | null> | null = $.makeMap<string, fs.DirEntry | null>()
		let checkMode: ((entry: fs.DirEntry | null) => void) | null = $.functionValue(async (entry: fs.DirEntry | null): globalThis.Promise<void> => {
			if (await $.pointerValue<Exclude<fs.DirEntry, null>>(entry).IsDir() != ($.uint((await $.pointerValue<Exclude<fs.DirEntry, null>>(entry).Type() & fs.ModeDir), 32) != $.uint(0, 32))) {
				if (await $.pointerValue<Exclude<fs.DirEntry, null>>(entry).IsDir()) {
					fsTester.prototype.errorf.call(t, "%s: ReadDir returned %s with IsDir() = true, Type() & ModeDir = 0", $.arrayToSlice<any>([dir, await $.pointerValue<Exclude<fs.DirEntry, null>>(entry).Name()]))
				} else {
					fsTester.prototype.errorf.call(t, "%s: ReadDir returned %s with IsDir() = false, Type() & ModeDir = ModeDir", $.arrayToSlice<any>([dir, await $.pointerValue<Exclude<fs.DirEntry, null>>(entry).Name()]))
				}
			}
		}, ({ kind: $.TypeKind.Function, params: ["fs.DirEntry"], results: [] } as $.FunctionTypeInfo))

		for (let __goscriptRangeTarget7 = list1, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget7); __rangeIndex++) {
			let entry1 = __goscriptRangeTarget7![__rangeIndex]
			$.mapSet(old, await $.pointerValue<Exclude<fs.DirEntry, null>>(entry1).Name(), entry1)
			await checkMode!(entry1)
		}

		let diffs: $.Slice<string> = null as $.Slice<string>
		for (let __goscriptRangeTarget8 = list2, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget8); __rangeIndex++) {
			let entry2 = __goscriptRangeTarget8![__rangeIndex]
			let entry1 = $.mapGet(old, await $.pointerValue<Exclude<fs.DirEntry, null>>(entry2).Name(), null)[0]
			if (entry1 == null) {
				await checkMode!(entry2)
				diffs = $.append(diffs, "+ " + await formatEntry(entry2))
				continue
			}
			if (!$.stringEqual(await formatEntry(entry1), await formatEntry(entry2))) {
				diffs = $.append(diffs, "- " + await formatEntry(entry1), "+ " + await formatEntry(entry2))
			}
			$.deleteMapEntry(old, await $.pointerValue<Exclude<fs.DirEntry, null>>(entry2).Name())
		}
		for (const [__rangeKey, entry1] of old?.entries() ?? []) {
			diffs = $.append(diffs, "- " + await formatEntry(entry1))
		}

		if ($.len(diffs) == 0) {
			return
		}

		await slices.SortFunc(diffs, $.functionValue((a: string, b: string): number => {
			let fa: $.Slice<string> = strings.Fields(a)
			let fb: $.Slice<string> = strings.Fields(b)
			// sort by name (i < j) and then +/- (j < i, because + < -)
			return strings.Compare((fa![1] + " ") + fb![0], (fb![1] + " ") + fa![0])
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }, { kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Basic, name: "int" }] } as $.FunctionTypeInfo)))

		fsTester.prototype.errorf.call(t, "%s: diff %s:\n\t%s", $.arrayToSlice<any>([dir, desc, strings.Join(diffs, "\n\t")]))
	}

	public async checkFile(file: string): globalThis.Promise<void> {
		let t: fsTester | $.VarRef<fsTester> | null = this
		await using __defer = new $.AsyncDisposableStack()
		$.pointerValue<fsTester>(t).files = $.append($.pointerValue<fsTester>(t).files, file)

		// Read entire file.
		let [f, err] = await $.pointerValue<Exclude<fs.FS, null>>($.pointerValue<fsTester>(t).fsys).Open(file)
		if (err != null) {
			fsTester.prototype.errorf.call(t, "%s: Open: %w", $.arrayToSlice<any>([file, (err as any)]))
			return
		}

		let __goscriptTuple8: any = await io.ReadAll($.pointerValueOrNil((f as io.Reader | null))!)
		let data: $.Slice<number> = __goscriptTuple8[0]
		err = __goscriptTuple8[1]
		if (err != null) {
			await $.pointerValue<Exclude<fs.File, null>>(f).Close()
			fsTester.prototype.errorf.call(t, "%s: Open+ReadAll: %w", $.arrayToSlice<any>([file, (err as any)]))
			return
		}

		{
			let __goscriptShadow6 = await $.pointerValue<Exclude<fs.File, null>>(f).Close()
			if (__goscriptShadow6 != null) {
				fsTester.prototype.errorf.call(t, "%s: Close: %w", $.arrayToSlice<any>([file, (__goscriptShadow6 as any)]))
			}
		}

		// Check that closing twice doesn't crash.
		// The return value doesn't matter.
		await $.pointerValue<Exclude<fs.File, null>>(f).Close()

		// Check that ReadFile works if present.
		{
			let __goscriptTuple9: any = $.typeAssertTuple<fs.ReadFileFS | null>($.pointerValue<fsTester>(t).fsys, "fs.ReadFileFS")
			let fsys = __goscriptTuple9[0]
			let ok = __goscriptTuple9[1]
			if (ok) {
				let __goscriptTuple10: any = await $.pointerValue<Exclude<fs.ReadFileFS, null>>(fsys).ReadFile(file)
				let data2: $.Slice<number> = __goscriptTuple10[0]
				let __goscriptShadow7 = __goscriptTuple10[1]
				if (__goscriptShadow7 != null) {
					fsTester.prototype.errorf.call(t, "%s: fsys.ReadFile: %w", $.arrayToSlice<any>([file, (__goscriptShadow7 as any)]))
					return
				}
				fsTester.prototype.checkFileRead.call(t, file, "ReadAll vs fsys.ReadFile", data, data2)

				// Modify the data and check it again. Modifying the
				// returned byte slice should not affect the next call.
				for (let __goscriptRangeTarget9 = data2, i = 0; i < $.len(__goscriptRangeTarget9); i++) {
					data2![i]++
				}
				let __goscriptTuple11: any = await $.pointerValue<Exclude<fs.ReadFileFS, null>>(fsys).ReadFile(file)
				data2 = __goscriptTuple11[0]
				__goscriptShadow7 = __goscriptTuple11[1]
				if (__goscriptShadow7 != null) {
					fsTester.prototype.errorf.call(t, "%s: second call to fsys.ReadFile: %w", $.arrayToSlice<any>([file, (__goscriptShadow7 as any)]))
					return
				}
				fsTester.prototype.checkFileRead.call(t, file, "Readall vs second fsys.ReadFile", data, data2)

				await fsTester.prototype.checkBadPath.call(t, file, "ReadFile", $.functionValue(async (name: string): globalThis.Promise<$.GoError> => {
					let [, __goscriptShadow8] = await $.pointerValue<Exclude<fs.ReadFileFS, null>>(fsys).ReadFile(name)
					return __goscriptShadow8
				}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: ["error"] } as $.FunctionTypeInfo)))
			}
		}

		// Check that fs.ReadFile works with t.fsys.
		let __goscriptTuple12: any = fs.ReadFile($.pointerValueOrNil($.pointerValue<fsTester>(t).fsys)!, file)
		let data2: $.Slice<number> = __goscriptTuple12[0]
		err = __goscriptTuple12[1]
		if (err != null) {
			fsTester.prototype.errorf.call(t, "%s: fs.ReadFile: %w", $.arrayToSlice<any>([file, (err as any)]))
			return
		}
		fsTester.prototype.checkFileRead.call(t, file, "ReadAll vs fs.ReadFile", data, data2)

		// Use iotest.TestReader to check small reads, Seek, ReadAt.
		let __goscriptTuple13: any = await $.pointerValue<Exclude<fs.FS, null>>($.pointerValue<fsTester>(t).fsys).Open(file)
		f = __goscriptTuple13[0]
		err = __goscriptTuple13[1]
		if (err != null) {
			fsTester.prototype.errorf.call(t, "%s: second Open: %w", $.arrayToSlice<any>([file, (err as any)]))
			return
		}
		__defer.defer(async () => { await $.pointerValue<Exclude<fs.File, null>>(f).Close() })
		{
			let __goscriptShadow9 = await iotest.TestReader((f as io.Reader | null), data)
			if (__goscriptShadow9 != null) {
				fsTester.prototype.errorf.call(t, "%s: failed TestReader:\n\t%s", $.arrayToSlice<any>([file, strings.ReplaceAll($.pointerValue<Exclude<$.GoError, null>>(__goscriptShadow9).Error(), "\n", "\n\t")]))
			}
		}
	}

	public checkFileRead(file: string, desc: string, data1: $.Slice<number>, data2: $.Slice<number>): void {
		const t: fsTester | $.VarRef<fsTester> | null = this
		if (!$.stringEqual($.bytesToString(data1), $.bytesToString(data2))) {
			fsTester.prototype.errorf.call(t, "%s: %s: different data returned\n\t%q\n\t%q", $.arrayToSlice<any>([file, desc, $.interfaceValue<any>(data1, "[]byte"), $.interfaceValue<any>(data2, "[]byte")]))
			return
		}
	}

	public async checkGlob(dir: string, list: $.Slice<fs.DirEntry | null>): globalThis.Promise<void> {
		const t: fsTester | $.VarRef<fsTester> | null = this
		{
			let [, ok] = $.typeAssertTuple<fs.GlobFS | null>($.pointerValue<fsTester>(t).fsys, "fs.GlobFS")
			if (!ok) {
				return
			}
		}

		// Make a complex glob pattern prefix that only matches dir.
		let glob: string = ""
		if (!$.stringEqual(dir, ".")) {
			let elem: $.Slice<string> = strings.Split(dir, "/")
			for (let __goscriptRangeTarget10 = elem, i = 0; i < $.len(__goscriptRangeTarget10); i++) {
				let e = __goscriptRangeTarget10![i]
				let pattern: $.Slice<number> = null as $.Slice<number>
				for (const [j, r] of $.rangeString(e)) {
					if ((((($.int(r, 32) == $.int(42, 32)) || ($.int(r, 32) == $.int(63, 32))) || ($.int(r, 32) == $.int(92, 32))) || ($.int(r, 32) == $.int(91, 32))) || ($.int(r, 32) == $.int(45, 32))) {
						pattern = $.append(pattern, $.int(92, 32), $.int(r, 32))
						continue
					}
					switch ((i + j) % 5) {
						case 0:
						{
							pattern = $.append(pattern, $.int(r, 32))
							break
						}
						case 1:
						{
							pattern = $.append(pattern, $.int(91, 32), $.int(r, 32), $.int(93, 32))
							break
						}
						case 2:
						{
							pattern = $.append(pattern, $.int(91, 32), $.int(r, 32), $.int(45, 32), $.int(r, 32), $.int(93, 32))
							break
						}
						case 3:
						{
							pattern = $.append(pattern, $.int(91, 32), $.int(92, 32), $.int(r, 32), $.int(93, 32))
							break
						}
						case 4:
						{
							pattern = $.append(pattern, $.int(91, 32), $.int(92, 32), $.int(r, 32), $.int(45, 32), $.int(92, 32), $.int(r, 32), $.int(93, 32))
							break
						}
					}
				}
				elem![i] = $.runesToString(pattern)
			}
			glob = strings.Join(elem, "/") + "/"
		}

		// Test that malformed patterns are detected.
		// The error is likely path.ErrBadPattern but need not be.
		{
			let [, err] = await $.pointerValue<Exclude<fs.GlobFS, null>>($.mustTypeAssert<fs.GlobFS | null>($.pointerValue<fsTester>(t).fsys, "fs.GlobFS")).Glob(glob + "nonexist/[]")
			if (err == null) {
				fsTester.prototype.errorf.call(t, "%s: Glob(%#q): bad pattern not detected", $.arrayToSlice<any>([dir, glob + "nonexist/[]"]))
			}
		}

		// Try to find a letter that appears in only some of the final names.
		let c = $.int($.int(97, 32), 32)
		for (; c <= 122; c++) {
			let have = false
			let haveNot = false
			for (let __goscriptRangeTarget11 = list, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget11); __rangeIndex++) {
				let d = __goscriptRangeTarget11![__rangeIndex]
				if (strings.ContainsRune(await $.pointerValue<Exclude<fs.DirEntry, null>>(d).Name(), $.int(c, 32))) {
					have = true
				} else {
					haveNot = true
				}
			}
			if (have && haveNot) {
				break
			}
		}
		if (c > 122) {
			c = $.int(97, 32)
		}
		glob = glob + (("*" + String.fromCodePoint(c)) + "*")

		let want: $.Slice<string> = null as $.Slice<string>
		for (let __goscriptRangeTarget12 = list, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget12); __rangeIndex++) {
			let d = __goscriptRangeTarget12![__rangeIndex]
			if (strings.ContainsRune(await $.pointerValue<Exclude<fs.DirEntry, null>>(d).Name(), $.int(c, 32))) {
				want = $.append(want, path2.Join(dir, await $.pointerValue<Exclude<fs.DirEntry, null>>(d).Name()))
			}
		}

		let __goscriptTuple14: any = await $.pointerValue<Exclude<fs.GlobFS, null>>($.mustTypeAssert<fs.GlobFS | null>($.pointerValue<fsTester>(t).fsys, "fs.GlobFS")).Glob(glob)
		let names: $.Slice<string> = __goscriptTuple14[0]
		let err = __goscriptTuple14[1]
		if (err != null) {
			fsTester.prototype.errorf.call(t, "%s: Glob(%#q): %w", $.arrayToSlice<any>([dir, glob, (err as any)]))
			return
		}
		if (slices.Equal(want, names)) {
			return
		}

		if (!slices.IsSorted(names)) {
			fsTester.prototype.errorf.call(t, "%s: Glob(%#q): unsorted output:\n%s", $.arrayToSlice<any>([dir, glob, strings.Join(names, "\n")]))
			slices.Sort(names)
		}

		let problems: $.Slice<string> = null as $.Slice<string>
		while (($.len(want) > 0) || ($.len(names) > 0)) {
			switch (true) {
				case (($.len(want) > 0) && ($.len(names) > 0)) && ($.stringEqual(want![0], names![0])):
				{
					let __goscriptAssign0_0: $.Slice<string> = $.goSlice(want, 1, undefined)
					let __goscriptAssign0_1: $.Slice<string> = $.goSlice(names, 1, undefined)
					want = __goscriptAssign0_0
					names = __goscriptAssign0_1
					break
				}
				case ($.len(want) > 0) && (($.len(names) == 0) || ($.stringCompare(want![0], names![0]) < 0)):
				{
					problems = $.append(problems, "missing: " + want![0])
					want = $.goSlice(want, 1, undefined)
					break
				}
				default:
				{
					problems = $.append(problems, "extra: " + names![0])
					names = $.goSlice(names, 1, undefined)
					break
				}
			}
		}
		fsTester.prototype.errorf.call(t, "%s: Glob(%#q): wrong output:\n%s", $.arrayToSlice<any>([dir, glob, strings.Join(problems, "\n")]))
	}

	public async checkOpen(file: string): globalThis.Promise<void> {
		const t: fsTester | $.VarRef<fsTester> | null = this
		await fsTester.prototype.checkBadPath.call(t, file, "Open", $.functionValue(async (file: string): globalThis.Promise<$.GoError> => {
			let [f, err] = await $.pointerValue<Exclude<fs.FS, null>>($.pointerValue<fsTester>(t).fsys).Open(file)
			if (err == null) {
				await $.pointerValue<Exclude<fs.File, null>>(f).Close()
			}
			return err
		}, ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: ["error"] } as $.FunctionTypeInfo)))
	}

	public async checkStat(path: string, entry: fs.DirEntry | null): globalThis.Promise<void> {
		const t: fsTester | $.VarRef<fsTester> | null = this
		let [file, err] = await $.pointerValue<Exclude<fs.FS, null>>($.pointerValue<fsTester>(t).fsys).Open(path)
		if (err != null) {
			fsTester.prototype.errorf.call(t, "%s: Open: %w", $.arrayToSlice<any>([path, (err as any)]))
			return
		}
		let __goscriptTuple15: any = await $.pointerValue<Exclude<fs.File, null>>(file).Stat()
		let info = __goscriptTuple15[0]
		err = __goscriptTuple15[1]
		await $.pointerValue<Exclude<fs.File, null>>(file).Close()
		if (err != null) {
			fsTester.prototype.errorf.call(t, "%s: Stat: %w", $.arrayToSlice<any>([path, (err as any)]))
			return
		}
		let fentry = await formatEntry(entry)
		let fientry = await formatInfoEntry(info)
		// Note: mismatch here is OK for symlink, because Open dereferences symlink.
		if ((!$.stringEqual(fentry, fientry)) && ($.uint((await $.pointerValue<Exclude<fs.DirEntry, null>>(entry).Type() & fs.ModeSymlink), 32) == $.uint(0, 32))) {
			fsTester.prototype.errorf.call(t, "%s: mismatch:\n\tentry = %s\n\tfile.Stat() = %s", $.arrayToSlice<any>([path, fentry, fientry]))
		}

		let __goscriptTuple16: any = await $.pointerValue<Exclude<fs.DirEntry, null>>(entry).Info()
		let einfo = __goscriptTuple16[0]
		err = __goscriptTuple16[1]
		if (err != null) {
			fsTester.prototype.errorf.call(t, "%s: entry.Info: %w", $.arrayToSlice<any>([path, (err as any)]))
			return
		}
		let finfo = await formatInfo(info)
		if ($.uint((await $.pointerValue<Exclude<fs.DirEntry, null>>(entry).Type() & fs.ModeSymlink), 32) != $.uint(0, 32)) {
			// For symlink, just check that entry.Info matches entry on common fields.
			// Open deferences symlink, so info itself may differ.
			let feentry = await formatInfoEntry(einfo)
			if (!$.stringEqual(fentry, feentry)) {
				fsTester.prototype.errorf.call(t, "%s: mismatch\n\tentry = %s\n\tentry.Info() = %s\n", $.arrayToSlice<any>([path, fentry, feentry]))
			}
		} else {
			let feinfo = await formatInfo(einfo)
			if (!$.stringEqual(feinfo, finfo)) {
				fsTester.prototype.errorf.call(t, "%s: mismatch:\n\tentry.Info() = %s\n\tfile.Stat() = %s\n", $.arrayToSlice<any>([path, feinfo, finfo]))
			}
		}

		// Stat should be the same as Open+Stat, even for symlinks.
		let __goscriptTuple17: any = await fs.Stat($.pointerValueOrNil($.pointerValue<fsTester>(t).fsys)!, path)
		let info2 = __goscriptTuple17[0]
		err = __goscriptTuple17[1]
		if (err != null) {
			fsTester.prototype.errorf.call(t, "%s: fs.Stat: %w", $.arrayToSlice<any>([path, (err as any)]))
			return
		}
		let finfo2 = await formatInfo(info2)
		if (!$.stringEqual(finfo2, finfo)) {
			fsTester.prototype.errorf.call(t, "%s: fs.Stat(...) = %s\n\twant %s", $.arrayToSlice<any>([path, finfo2, finfo]))
		}

		{
			let __goscriptTuple18: any = $.typeAssertTuple<fs.StatFS | null>($.pointerValue<fsTester>(t).fsys, "fs.StatFS")
			let fsys = __goscriptTuple18[0]
			let ok = __goscriptTuple18[1]
			if (ok) {
				let [__goscriptShadow10, __goscriptShadow11] = await $.pointerValue<Exclude<fs.StatFS, null>>(fsys).Stat(path)
				if (__goscriptShadow11 != null) {
					fsTester.prototype.errorf.call(t, "%s: fsys.Stat: %w", $.arrayToSlice<any>([path, (__goscriptShadow11 as any)]))
					return
				}
				let __goscriptShadow12 = await formatInfo(__goscriptShadow10)
				if (!$.stringEqual(__goscriptShadow12, finfo)) {
					fsTester.prototype.errorf.call(t, "%s: fsys.Stat(...) = %s\n\twant %s", $.arrayToSlice<any>([path, __goscriptShadow12, finfo]))
				}
			}
		}

		{
			let __goscriptTuple19: any = $.typeAssertTuple<fs.ReadLinkFS | null>($.pointerValue<fsTester>(t).fsys, "fs.ReadLinkFS")
			let fsys = __goscriptTuple19[0]
			let ok = __goscriptTuple19[1]
			if (ok) {
				let [__goscriptShadow13, __goscriptShadow14] = await $.pointerValue<Exclude<fs.ReadLinkFS, null>>(fsys).Lstat(path)
				if (__goscriptShadow14 != null) {
					fsTester.prototype.errorf.call(t, "%s: fsys.Lstat: %v", $.arrayToSlice<any>([path, (__goscriptShadow14 as any)]))
					return
				}
				let fientry2 = await formatInfoEntry(__goscriptShadow13)
				if (!$.stringEqual(fentry, fientry2)) {
					fsTester.prototype.errorf.call(t, "%s: mismatch:\n\tentry = %s\n\tfsys.Lstat(...) = %s", $.arrayToSlice<any>([path, fentry, fientry2]))
				}
				let feinfo = await formatInfo(einfo)
				let __goscriptShadow15 = await formatInfo(__goscriptShadow13)
				if (!$.stringEqual(feinfo, __goscriptShadow15)) {
					fsTester.prototype.errorf.call(t, "%s: mismatch:\n\tentry.Info() = %s\n\tfsys.Lstat(...) = %s\n", $.arrayToSlice<any>([path, feinfo, __goscriptShadow15]))
				}
			}
		}
	}

	public errorf(format: string, args: $.Slice<any>): void {
		let t: fsTester | $.VarRef<fsTester> | null = this
		$.pointerValue<fsTester>(t).errors = $.append($.pointerValue<fsTester>(t).errors, fmt.Errorf(format, ...(args ?? [])))
	}

	public async openDir(dir: string): globalThis.Promise<fs.ReadDirFile | null> {
		const t: fsTester | $.VarRef<fsTester> | null = this
		let [f, err] = await $.pointerValue<Exclude<fs.FS, null>>($.pointerValue<fsTester>(t).fsys).Open(dir)
		if (err != null) {
			fsTester.prototype.errorf.call(t, "%s: Open: %w", $.arrayToSlice<any>([dir, (err as any)]))
			return null
		}
		let [d, ok] = $.typeAssertTuple<fs.ReadDirFile | null>(f, "fs.ReadDirFile")
		if (!ok) {
			await $.pointerValue<Exclude<fs.File, null>>(f).Close()
			fsTester.prototype.errorf.call(t, "%s: Open returned File type %T, not a fs.ReadDirFile", $.arrayToSlice<any>([dir, (f as any)]))
			return null
		}
		return d
	}

	static __typeInfo = $.registerStructType(
		"fstest.fsTester",
		() => new fsTester(),
		[{ name: "checkBadPath", args: [{ name: "file", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "desc", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "open", type: ({ kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: ["error"] } as $.FunctionTypeInfo) }], returns: [] }, { name: "checkDir", args: [{ name: "dir", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [] }, { name: "checkDirList", args: [{ name: "dir", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "desc", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "list1", type: { kind: $.TypeKind.Slice, elemType: "fs.DirEntry" } }, { name: "list2", type: { kind: $.TypeKind.Slice, elemType: "fs.DirEntry" } }], returns: [] }, { name: "checkFile", args: [{ name: "file", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [] }, { name: "checkFileRead", args: [{ name: "file", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "desc", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "data1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }, { name: "data2", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "uint8" } } }], returns: [] }, { name: "checkGlob", args: [{ name: "dir", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "list", type: { kind: $.TypeKind.Slice, elemType: "fs.DirEntry" } }], returns: [] }, { name: "checkOpen", args: [{ name: "file", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [] }, { name: "checkStat", args: [{ name: "path", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "entry", type: "fs.DirEntry" }], returns: [] }, { name: "errorf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "openDir", args: [{ name: "dir", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ name: "_r0", type: "fs.ReadDirFile" }] }],
		fsTester,
		[{ name: "fsys", key: "fsys", type: "fs.FS", pkgPath: "testing/fstest", index: [0], offset: 0, exported: false }, { name: "errors", key: "errors", type: { kind: $.TypeKind.Slice, elemType: "error" }, pkgPath: "testing/fstest", index: [1], offset: 16, exported: false }, { name: "dirs", key: "dirs", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, pkgPath: "testing/fstest", index: [2], offset: 40, exported: false }, { name: "files", key: "files", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, pkgPath: "testing/fstest", index: [3], offset: 64, exported: false }]
	)
}

export async function TestFS(fsys: fs.FS | null, expected: $.Slice<string>): globalThis.Promise<$.GoError> {
	{
		let err = await testFS(fsys, expected)
		if (err != null) {
			return err
		}
	}
	for (let __goscriptRangeTarget1 = expected, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let name = __goscriptRangeTarget1![__rangeIndex]
		{
			let i = strings.Index(name, "/")
			if (i >= 0) {
				let dir = $.sliceStringOrBytes(name, undefined, i)
				let dirSlash = $.sliceStringOrBytes(name, undefined, i + 1)
				let subExpected: $.Slice<string> = null as $.Slice<string>
				for (let __goscriptRangeTarget0 = expected, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
					let name = __goscriptRangeTarget0![__rangeIndex]
					if (strings.HasPrefix(name, dirSlash)) {
						subExpected = $.append(subExpected, $.sliceStringOrBytes(name, $.len(dirSlash), undefined))
					}
				}
				let [sub, err] = await fs.Sub($.pointerValueOrNil(fsys)!, dir)
				if (err != null) {
					return err
				}
				{
					let __goscriptShadow0 = await testFS(sub, subExpected)
					if (__goscriptShadow0 != null) {
						return fmt.Errorf("testing fs.Sub(fsys, %s): %w", dir, (__goscriptShadow0 as any))
					}
				}
				break
			}
		}
	}
	return null
}

export async function testFS(fsys: fs.FS | null, expected: $.Slice<string>): globalThis.Promise<$.GoError> {
	let t = $.varRef($.markAsStructValue(new fsTester({fsys: fsys})))
	await t.value.checkDir(".")
	await t.value.checkOpen(".")
	let found: globalThis.Map<string, boolean> | null = $.makeMap<string, boolean>()
	for (let __goscriptRangeTarget2 = t.value.dirs, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget2); __rangeIndex++) {
		let dir = __goscriptRangeTarget2![__rangeIndex]
		$.mapSet(found, dir, true)
	}
	for (let __goscriptRangeTarget3 = t.value.files, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget3); __rangeIndex++) {
		let file = __goscriptRangeTarget3![__rangeIndex]
		$.mapSet(found, file, true)
	}
	$.deleteMapEntry(found, ".")
	if (($.len(expected) == 0) && ($.len(found) > 0)) {
		let list: $.Slice<string> = (slices.Sorted(maps.Keys(found)) as $.Slice<string>)
		if ($.len(list) > 15) {
			list = $.append($.goSlice(list, undefined, 10), "...")
		}
		t.value.errorf("expected empty file system but found files:\n%s", $.arrayToSlice<any>([strings.Join(list, "\n")]))
	}
	for (let __goscriptRangeTarget4 = expected, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget4); __rangeIndex++) {
		let name = __goscriptRangeTarget4![__rangeIndex]
		if (!$.mapGet(found, name, false)[0]) {
			t.value.errorf("expected but not found: %s", $.arrayToSlice<any>([name]))
		}
	}
	if ($.len(t.value.errors) == 0) {
		return null
	}
	return fmt.Errorf("TestFS found errors:\n%w", (errors2.Join(...(t.value.errors ?? [])) as any))
}

export async function formatEntry(entry: fs.DirEntry | null): globalThis.Promise<string> {
	return fmt.Sprintf("%s IsDir=%v Type=%v", await $.pointerValue<Exclude<fs.DirEntry, null>>(entry).Name(), await $.pointerValue<Exclude<fs.DirEntry, null>>(entry).IsDir(), $.namedValueInterfaceValue<any>(await $.pointerValue<Exclude<fs.DirEntry, null>>(entry).Type(), "fs.FileMode", {IsDir: (receiver: any, ...args: any[]) => (fs.FileMode_IsDir as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), IsRegular: (receiver: any, ...args: any[]) => (fs.FileMode_IsRegular as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Perm: (receiver: any, ...args: any[]) => (fs.FileMode_Perm as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), String: (receiver: any, ...args: any[]) => (fs.FileMode_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Type: (receiver: any, ...args: any[]) => (fs.FileMode_Type as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "uint32", typeName: "fs.FileMode" }))
}

export async function formatInfoEntry(info: fs.FileInfo | null): globalThis.Promise<string> {
	return fmt.Sprintf("%s IsDir=%v Type=%v", await $.pointerValue<Exclude<fs.FileInfo, null>>(info).Name(), await $.pointerValue<Exclude<fs.FileInfo, null>>(info).IsDir(), $.namedValueInterfaceValue<any>(fs.FileMode_Type((await $.pointerValue<Exclude<fs.FileInfo, null>>(info).Mode())), "fs.FileMode", {IsDir: (receiver: any, ...args: any[]) => (fs.FileMode_IsDir as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), IsRegular: (receiver: any, ...args: any[]) => (fs.FileMode_IsRegular as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Perm: (receiver: any, ...args: any[]) => (fs.FileMode_Perm as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), String: (receiver: any, ...args: any[]) => (fs.FileMode_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Type: (receiver: any, ...args: any[]) => (fs.FileMode_Type as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "uint32", typeName: "fs.FileMode" }))
}

export async function formatInfo(info: fs.FileInfo | null): globalThis.Promise<string> {
	return fmt.Sprintf("%s IsDir=%v Mode=%v Size=%d ModTime=%v", await $.pointerValue<Exclude<fs.FileInfo, null>>(info).Name(), await $.pointerValue<Exclude<fs.FileInfo, null>>(info).IsDir(), $.namedValueInterfaceValue<any>(await $.pointerValue<Exclude<fs.FileInfo, null>>(info).Mode(), "fs.FileMode", {IsDir: (receiver: any, ...args: any[]) => (fs.FileMode_IsDir as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), IsRegular: (receiver: any, ...args: any[]) => (fs.FileMode_IsRegular as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Perm: (receiver: any, ...args: any[]) => (fs.FileMode_Perm as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), String: (receiver: any, ...args: any[]) => (fs.FileMode_String as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args), Type: (receiver: any, ...args: any[]) => (fs.FileMode_Type as any)(($.isVarRef(receiver) ? receiver.value : receiver), ...args)}, { kind: $.TypeKind.Basic, name: "uint32", typeName: "fs.FileMode" }), $.namedValueInterfaceValue<any>(await $.pointerValue<Exclude<fs.FileInfo, null>>(info).Size(), "int64", {}, { kind: $.TypeKind.Basic, name: "int64" }), $.interfaceValue<any>($.markAsStructValue($.cloneStructValue(await $.pointerValue<Exclude<fs.FileInfo, null>>(info).ModTime())), "time.Time"))
}
