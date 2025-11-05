import * as $ from "@goscript/builtin/index.js"

import * as errors from "@goscript/errors/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as io from "@goscript/io/index.js"

import * as fs from "@goscript/io/fs/index.js"

import * as maps from "@goscript/maps/index.js"

import * as path from "@goscript/path/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strings from "@goscript/strings/index.js"

import * as iotest from "@goscript/testing/iotest/index.js"

export class fsTester {
	public get fsys(): fs.FS {
		return this._fields.fsys.value
	}
	public set fsys(value: fs.FS) {
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
		fsys: $.VarRef<fs.FS>;
		errors: $.VarRef<$.Slice<$.GoError>>;
		dirs: $.VarRef<$.Slice<string>>;
		files: $.VarRef<$.Slice<string>>;
	}

	constructor(init?: Partial<{dirs?: $.Slice<string>, errors?: $.Slice<$.GoError>, files?: $.Slice<string>, fsys?: fs.FS}>) {
		this._fields = {
			fsys: $.varRef(init?.fsys ?? null),
			errors: $.varRef(init?.errors ?? null),
			dirs: $.varRef(init?.dirs ?? null),
			files: $.varRef(init?.files ?? null)
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
		return cloned
	}

	// errorf adds an error to the list of errors.
	public errorf(format: string, ...args: any[]): void {
		const t = this
		t.errors = $.append(t.errors, fmt.Errorf(format, ...(args ?? [])))
	}

	public openDir(dir: string): fs.ReadDirFile {
		const t = this
		let [f, err] = t.fsys!.Open(dir)
		if (err != null) {
			t.errorf("%s: Open: %w", dir, err)
			return null
		}
		let { value: d, ok: ok } = $.typeAssert<fs.ReadDirFile>(f, 'fs.ReadDirFile')
		if (!ok) {
			f!.Close()
			t.errorf("%s: Open returned File type %T, not a fs.ReadDirFile", dir, f)
			return null
		}
		return d
	}

	// checkDir checks the directory dir, which is expected to exist
	// (it is either the root or was found in a directory listing with IsDir true).
	public checkDir(dir: string): void {
		const t = this
		using __defer = new $.DisposableStack();
		t.dirs = $.append(t.dirs, dir)
		let d = t.openDir(dir)
		if (d == null) {
			return 
		}
		let [list, err] = d!.ReadDir(-1)
		if (err != null) {
			d!.Close()
			t.errorf("%s: ReadDir(-1): %w", dir, err)
			return 
		}
		let prefix: string = ""
		if (dir == ".") {
			prefix = ""
		}
		 else {
			prefix = dir + "/"
		}
		for (let _i = 0; _i < $.len(list); _i++) {
			const info = list![_i]
			{
				let name = info!.Name()
				switch (true) {
					case name == ".":
					case name == "..":
					case name == "": {
						t.errorf("%s: ReadDir: child has invalid name: %#q", dir, name)
						continue
						break
					}
					case strings.Contains(name, "/"): {
						t.errorf("%s: ReadDir: child name contains slash: %#q", dir, name)
						continue
						break
					}
					case strings.Contains(name, "\\"): {
						t.errorf("%s: ReadDir: child name contains backslash: %#q", dir, name)
						continue
						break
					}
				}
				let path = prefix + name
				t.checkStat(path, info)
				t.checkOpen(path)

				// No further processing.
				// Avoid following symlinks to avoid potentially unbounded recursion.
				switch (info!.Type()) {
					case fs.ModeDir: {
						t.checkDir(path)
						break
					}
					case fs.ModeSymlink: {
						t.files = $.append(t.files, path)
						break
					}
					default: {
						t.checkFile(path)
						break
					}
				}
			}
		}
		let list2: $.Slice<fs.DirEntry>
		[list2, err] = d!.ReadDir(-1)
		if ($.len(list2) > 0 || err != null) {
			d!.Close()
			t.errorf("%s: ReadDir(-1) at EOF = %d entries, %w, wanted 0 entries, nil", dir, $.len(list2), err)
			return 
		}
		;[list2, err] = d!.ReadDir(1)
		if ($.len(list2) > 0 || err != io.EOF) {
			d!.Close()
			t.errorf("%s: ReadDir(1) at EOF = %d entries, %w, wanted 0 entries, EOF", dir, $.len(list2), err)
			return 
		}
		{
			let err = d!.Close()
			if (err != null) {
				t.errorf("%s: Close: %w", dir, err)
			}
		}
		d!.Close()
		{
			d = t.openDir(dir)
			if (d == null) {
				return 
			}
		}
		__defer.defer(() => {
			d!.Close()
		});
		;[list2, err] = d!.ReadDir(-1)
		if (err != null) {
			t.errorf("%s: second Open+ReadDir(-1): %w", dir, err)
			return 
		}
		t.checkDirList(dir, "first Open+ReadDir(-1) vs second Open+ReadDir(-1)", list, list2)
		{
			d = t.openDir(dir)
			if (d == null) {
				return 
			}
		}
		__defer.defer(() => {
			d!.Close()
		});
		list2 = null
		for (; ; ) {
			let n = 1
			if ($.len(list2) > 0) {
				n = 2
			}
			let [frag, err] = d!.ReadDir(n)
			if ($.len(frag) > n) {
				t.errorf("%s: third Open: ReadDir(%d) after %d: %d entries (too many)", dir, n, $.len(list2), $.len(frag))
				return 
			}
			list2 = $.append(list2, frag)
			if (err == io.EOF) {
				break
			}
			if (err != null) {
				t.errorf("%s: third Open: ReadDir(%d) after %d: %w", dir, n, $.len(list2), err)
				return 
			}
			if (n == 0) {
				t.errorf("%s: third Open: ReadDir(%d) after %d: 0 entries but nil error", dir, n, $.len(list2))
				return 
			}
		}
		t.checkDirList(dir, "first Open+ReadDir(-1) vs third Open+ReadDir(1,2) loop", list, list2)
		{
			let { value: fsys, ok: ok } = $.typeAssert<fs.ReadDirFS>(t.fsys, 'fs.ReadDirFS')
			if (ok) {
				let [list2, err] = fsys!.ReadDir(dir)
				if (err != null) {
					t.errorf("%s: fsys.ReadDir: %w", dir, err)
					return 
				}
				t.checkDirList(dir, "first Open+ReadDir(-1) vs fsys.ReadDir", list, list2)

				for (let i = 0; i + 1 < $.len(list2); i++) {
					if (list2![i]!.Name() >= list2![i + 1]!.Name()) {
						t.errorf("%s: fsys.ReadDir: list not sorted: %s before %s", dir, list2![i]!.Name(), list2![i + 1]!.Name())
					}
				}
			}
		}
		;[list2, err] = fs.ReadDir(t.fsys, dir)
		if (err != null) {
			t.errorf("%s: fs.ReadDir: %w", dir, err)
			return 
		}
		t.checkDirList(dir, "first Open+ReadDir(-1) vs fs.ReadDir", list, list2)
		for (let i = 0; i + 1 < $.len(list2); i++) {
			if (list2![i]!.Name() >= list2![i + 1]!.Name()) {
				t.errorf("%s: fs.ReadDir: list not sorted: %s before %s", dir, list2![i]!.Name(), list2![i + 1]!.Name())
			}
		}
		t.checkGlob(dir, list2)
	}

	// checkGlob checks that various glob patterns work if the file system implements GlobFS.
	public checkGlob(dir: string, list: $.Slice<fs.DirEntry>): void {
		const t = this
		{
			let { ok: ok } = $.typeAssert<fs.GlobFS>(t.fsys, 'fs.GlobFS')
			if (!ok) {
				return 
			}
		}
		let glob: string = ""
		if (dir != ".") {
			let elem = strings.Split(dir, "/")
			for (let i = 0; i < $.len(elem); i++) {
				const e = elem![i]
				{
					let pattern: $.Slice<number> = null
					{
						const _runes = $.stringToRunes(e)
						for (let j = 0; j < _runes.length; j++) {
							const r = _runes[j]
							{
								if (r == 42 || r == 63 || r == 92 || r == 91 || r == 45) {
									pattern = $.append(pattern, 92, r)
									continue
								}
								switch ((i + j) % 5) {
									case 0: {
										pattern = $.append(pattern, r)
										break
									}
									case 1: {
										pattern = $.append(pattern, 91, r, 93)
										break
									}
									case 2: {
										pattern = $.append(pattern, 91, r, 45, r, 93)
										break
									}
									case 3: {
										pattern = $.append(pattern, 91, 92, r, 93)
										break
									}
									case 4: {
										pattern = $.append(pattern, 91, 92, r, 45, 92, r, 93)
										break
									}
								}
							}
						}
					}
					elem![i] = $.runesToString(pattern)
				}
			}
			glob = strings.Join(elem, "/") + "/"
		}
		{
			let [, err] = $.mustTypeAssert<fs.GlobFS>(t.fsys, 'fs.GlobFS')!.Glob(glob + "nonexist/[]")
			if (err == null) {
				t.errorf("%s: Glob(%#q): bad pattern not detected", dir, glob + "nonexist/[]")
			}
		}
		let c = (97 as number)
		for (; c <= 122; c++) {
			let [have, haveNot] = [false, false]
			for (let _i = 0; _i < $.len(list); _i++) {
				const d = list![_i]
				{
					if (strings.ContainsRune(d!.Name(), c)) {
						have = true
					}
					 else {
						haveNot = true
					}
				}
			}
			if (have && haveNot) {
				break
			}
		}
		if (c > 122) {
			c = 97
		}
		glob += "*" + $.runeOrStringToString(c) + "*"
		let want: $.Slice<string> = null
		for (let _i = 0; _i < $.len(list); _i++) {
			const d = list![_i]
			{
				if (strings.ContainsRune(d!.Name(), c)) {
					want = $.append(want, path.Join(dir, d!.Name()))
				}
			}
		}
		let [names, err] = $.mustTypeAssert<fs.GlobFS>(t.fsys, 'fs.GlobFS')!.Glob(glob)
		if (err != null) {
			t.errorf("%s: Glob(%#q): %w", dir, glob, err)
			return 
		}
		if (slices.Equal(want, names)) {
			return 
		}
		if (!slices.IsSorted(names)) {
			t.errorf("%s: Glob(%#q): unsorted output:\n%s", dir, glob, strings.Join(names, "\n"))
			slices.Sort(names)
		}
		let problems: $.Slice<string> = null
		for (; $.len(want) > 0 || $.len(names) > 0; ) {
			switch (true) {
				case $.len(want) > 0 && $.len(names) > 0 && want![0] == names![0]: {
					;[want, names] = [$.goSlice(want, 1, undefined), $.goSlice(names, 1, undefined)]
					break
				}
				case $.len(want) > 0 && ($.len(names) == 0 || want![0] < names![0]): {
					problems = $.append(problems, "missing: " + want![0])
					want = $.goSlice(want, 1, undefined)
					break
				}
				default: {
					problems = $.append(problems, "extra: " + names![0])
					names = $.goSlice(names, 1, undefined)
					break
				}
			}
		}
		t.errorf("%s: Glob(%#q): wrong output:\n%s", dir, glob, strings.Join(problems, "\n"))
	}

	// checkStat checks that a direct stat of path matches entry,
	// which was found in the parent's directory listing.
	public checkStat(path: string, entry: fs.DirEntry): void {
		const t = this
		let [file, err] = t.fsys!.Open(path)
		if (err != null) {
			t.errorf("%s: Open: %w", path, err)
			return 
		}
		let info: fs.FileInfo
		[info, err] = file!.Stat()
		file!.Close()
		if (err != null) {
			t.errorf("%s: Stat: %w", path, err)
			return 
		}
		let fentry = formatEntry(entry)
		let fientry = formatInfoEntry(info)
		if (fentry != fientry && (entry!.Type() & fs.ModeSymlink) == 0) {
			t.errorf("%s: mismatch:\n\tentry = %s\n\tfile.Stat() = %s", path, fentry, fientry)
		}
		let einfo: fs.FileInfo
		[einfo, err] = entry!.Info()
		if (err != null) {
			t.errorf("%s: entry.Info: %w", path, err)
			return 
		}
		let finfo = formatInfo(info)
		if ((entry!.Type() & fs.ModeSymlink) != 0) {
			// For symlink, just check that entry.Info matches entry on common fields.
			// Open deferences symlink, so info itself may differ.
			let feentry = formatInfoEntry(einfo)
			if (fentry != feentry) {
				t.errorf("%s: mismatch\n\tentry = %s\n\tentry.Info() = %s\n", path, fentry, feentry)
			}
		}
		 else {
			let feinfo = formatInfo(einfo)
			if (feinfo != finfo) {
				t.errorf("%s: mismatch:\n\tentry.Info() = %s\n\tfile.Stat() = %s\n", path, feinfo, finfo)
			}
		}
		let info2: fs.FileInfo
		[info2, err] = fs.Stat(t.fsys, path)
		if (err != null) {
			t.errorf("%s: fs.Stat: %w", path, err)
			return 
		}
		let finfo2 = formatInfo(info2)
		if (finfo2 != finfo) {
			t.errorf("%s: fs.Stat(...) = %s\n\twant %s", path, finfo2, finfo)
		}
		{
			let { value: fsys, ok: ok } = $.typeAssert<fs.StatFS>(t.fsys, 'fs.StatFS')
			if (ok) {
				let [info2, err] = fsys!.Stat(path)
				if (err != null) {
					t.errorf("%s: fsys.Stat: %w", path, err)
					return 
				}
				let finfo2 = formatInfo(info2)
				if (finfo2 != finfo) {
					t.errorf("%s: fsys.Stat(...) = %s\n\twant %s", path, finfo2, finfo)
				}
			}
		}
		{
			let { value: fsys, ok: ok } = $.typeAssert<fs.ReadLinkFS>(t.fsys, 'fs.ReadLinkFS')
			if (ok) {
				let [info2, err] = fsys!.Lstat(path)
				if (err != null) {
					t.errorf("%s: fsys.Lstat: %v", path, err)
					return 
				}
				let fientry2 = formatInfoEntry(info2)
				if (fentry != fientry2) {
					t.errorf("%s: mismatch:\n\tentry = %s\n\tfsys.Lstat(...) = %s", path, fentry, fientry2)
				}
				let feinfo = formatInfo(einfo)
				let finfo2 = formatInfo(info2)
				if (feinfo != finfo2) {
					t.errorf("%s: mismatch:\n\tentry.Info() = %s\n\tfsys.Lstat(...) = %s\n", path, feinfo, finfo2)
				}
			}
		}
	}

	// checkDirList checks that two directory lists contain the same files and file info.
	// The order of the lists need not match.
	public checkDirList(dir: string, desc: string, list1: $.Slice<fs.DirEntry>, list2: $.Slice<fs.DirEntry>): void {
		const t = this
		let old = $.makeMap<string, fs.DirEntry>()
		let checkMode = (entry: fs.DirEntry): void => {
			if (entry!.IsDir() != ((entry!.Type() & fs.ModeDir) != 0)) {
				if (entry!.IsDir()) {
					t.errorf("%s: ReadDir returned %s with IsDir() = true, Type() & ModeDir = 0", dir, entry!.Name())
				}
				 else {
					t.errorf("%s: ReadDir returned %s with IsDir() = false, Type() & ModeDir = ModeDir", dir, entry!.Name())
				}
			}
		}
		for (let _i = 0; _i < $.len(list1); _i++) {
			const entry1 = list1![_i]
			{
				$.mapSet(old, entry1!.Name(), entry1)
				checkMode!(entry1)
			}
		}
		let diffs: $.Slice<string> = null
		for (let _i = 0; _i < $.len(list2); _i++) {
			const entry2 = list2![_i]
			{
				let entry1 = $.mapGet(old, entry2!.Name(), null)[0]
				if (entry1 == null) {
					checkMode!(entry2)
					diffs = $.append(diffs, "+ " + formatEntry(entry2))
					continue
				}
				if (formatEntry(entry1) != formatEntry(entry2)) {
					diffs = $.append(diffs, "- " + formatEntry(entry1), "+ " + formatEntry(entry2))
				}
				$.deleteMapEntry(old, entry2!.Name())
			}
		}
		for (const [_k, entry1] of old?.entries() ?? []) {
			{
				diffs = $.append(diffs, "- " + formatEntry(entry1))
			}
		}
		if ($.len(diffs) == 0) {
			return 
		}
		slices.SortFunc(diffs, (a: string, b: string): number => {
			let fa = strings.Fields(a)
			let fb = strings.Fields(b)
			// sort by name (i < j) and then +/- (j < i, because + < -)
			return strings.Compare(fa![1] + " " + fb![0], fb![1] + " " + fa![0])
		})
		t.errorf("%s: diff %s:\n\t%s", dir, desc, strings.Join(diffs, "\n\t"))
	}

	// checkFile checks that basic file reading works correctly.
	public checkFile(file: string): void {
		const t = this
		using __defer = new $.DisposableStack();
		t.files = $.append(t.files, file)
		let [f, err] = t.fsys!.Open(file)
		if (err != null) {
			t.errorf("%s: Open: %w", file, err)
			return 
		}
		let data: $.Bytes
		[data, err] = io.ReadAll(f)
		if (err != null) {
			f!.Close()
			t.errorf("%s: Open+ReadAll: %w", file, err)
			return 
		}
		{
			let err = f!.Close()
			if (err != null) {
				t.errorf("%s: Close: %w", file, err)
			}
		}
		f!.Close()
		{
			let { value: fsys, ok: ok } = $.typeAssert<fs.ReadFileFS>(t.fsys, 'fs.ReadFileFS')
			if (ok) {
				let [data2, err] = fsys!.ReadFile(file)
				if (err != null) {
					t.errorf("%s: fsys.ReadFile: %w", file, err)
					return 
				}
				t.checkFileRead(file, "ReadAll vs fsys.ReadFile", data, data2)

				// Modify the data and check it again. Modifying the
				// returned byte slice should not affect the next call.
				for (let i = 0; i < $.len(data2); i++) {
					{
						data2![i]++
					}
				}
				;[data2, err] = fsys!.ReadFile(file)
				if (err != null) {
					t.errorf("%s: second call to fsys.ReadFile: %w", file, err)
					return 
				}
				t.checkFileRead(file, "Readall vs second fsys.ReadFile", data, data2)

				t.checkBadPath(file, "ReadFile", (name: string): $.GoError => {
					let [, err] = fsys!.ReadFile(name)
					return err
				})
			}
		}
		let data2: $.Bytes
		[data2, err] = fs.ReadFile(t.fsys, file)
		if (err != null) {
			t.errorf("%s: fs.ReadFile: %w", file, err)
			return 
		}
		t.checkFileRead(file, "ReadAll vs fs.ReadFile", data, data2)
		;[f, err] = t.fsys!.Open(file)
		if (err != null) {
			t.errorf("%s: second Open: %w", file, err)
			return 
		}
		__defer.defer(() => {
			f!.Close()
		});
		{
			let err = iotest.TestReader(f, data)
			if (err != null) {
				t.errorf("%s: failed TestReader:\n\t%s", file, strings.ReplaceAll(err!.Error(), "\n", "\n\t"))
			}
		}
	}

	public checkFileRead(file: string, desc: string, data1: $.Bytes, data2: $.Bytes): void {
		const t = this
		if ($.bytesToString(data1) != $.bytesToString(data2)) {
			t.errorf("%s: %s: different data returned\n\t%q\n\t%q", file, desc, data1, data2)
			return 
		}
	}

	// checkOpen validates file opening behavior by attempting to open and then close the given file path.
	public checkOpen(file: string): void {
		const t = this
		t.checkBadPath(file, "Open", (file: string): $.GoError => {
			let [f, err] = t.fsys!.Open(file)
			if (err == null) {
				f!.Close()
			}
			return err
		})
	}

	// checkBadPath checks that various invalid forms of file's name cannot be opened using open.
	public checkBadPath(file: string, desc: string, open: ((p0: string) => $.GoError) | null): void {
		const t = this
		let bad = $.arrayToSlice<string>(["/" + file, file + "/."])
		if (file == ".") {
			bad = $.append(bad, "/")
		}
		{
			let i = strings.Index(file, "/")
			if (i >= 0) {
				bad = $.append(bad, $.sliceString(file, undefined, i) + "//" + $.sliceString(file, i + 1, undefined), $.sliceString(file, undefined, i) + "/./" + $.sliceString(file, i + 1, undefined), $.sliceString(file, undefined, i) + "\\" + $.sliceString(file, i + 1, undefined), $.sliceString(file, undefined, i) + "/../" + file)
			}
		}
		{
			let i = strings.LastIndex(file, "/")
			if (i >= 0) {
				bad = $.append(bad, $.sliceString(file, undefined, i) + "//" + $.sliceString(file, i + 1, undefined), $.sliceString(file, undefined, i) + "/./" + $.sliceString(file, i + 1, undefined), $.sliceString(file, undefined, i) + "\\" + $.sliceString(file, i + 1, undefined), file + "/../" + $.sliceString(file, i + 1, undefined))
			}
		}
		for (let _i = 0; _i < $.len(bad); _i++) {
			const b = bad![_i]
			{
				{
					let err = open!(b)
					if (err == null) {
						t.errorf("%s: %s(%s) succeeded, want error", file, desc, b)
					}
				}
			}
		}
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'fsTester',
	  new fsTester(),
	  [{ name: "errorf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "openDir", args: [{ name: "dir", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [{ type: "ReadDirFile" }] }, { name: "checkDir", args: [{ name: "dir", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [] }, { name: "checkGlob", args: [{ name: "dir", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "list", type: { kind: $.TypeKind.Slice, elemType: "DirEntry" } }], returns: [] }, { name: "checkStat", args: [{ name: "path", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "entry", type: "DirEntry" }], returns: [] }, { name: "checkDirList", args: [{ name: "dir", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "desc", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "list1", type: { kind: $.TypeKind.Slice, elemType: "DirEntry" } }, { name: "list2", type: { kind: $.TypeKind.Slice, elemType: "DirEntry" } }], returns: [] }, { name: "checkFile", args: [{ name: "file", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [] }, { name: "checkFileRead", args: [{ name: "file", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "desc", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "data1", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } } }, { name: "data2", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "number" } } }], returns: [] }, { name: "checkOpen", args: [{ name: "file", type: { kind: $.TypeKind.Basic, name: "string" } }], returns: [] }, { name: "checkBadPath", args: [{ name: "file", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "desc", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "open", type: { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Basic, name: "string" }], results: [{ kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] }] } }], returns: [] }],
	  fsTester,
	  {"fsys": "FS", "errors": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }, "dirs": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }, "files": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "string" } }}
	);
}

// TestFS tests a file system implementation.
// It walks the entire tree of files in fsys,
// opening and checking that each file behaves correctly.
// Symbolic links are not followed,
// but their Lstat values are checked
// if the file system implements [fs.ReadLinkFS].
// It also checks that the file system contains at least the expected files.
// As a special case, if no expected files are listed, fsys must be empty.
// Otherwise, fsys must contain at least the listed files; it can also contain others.
// The contents of fsys must not change concurrently with TestFS.
//
// If TestFS finds any misbehaviors, it returns either the first error or a
// list of errors. Use [errors.Is] or [errors.As] to inspect.
//
// Typical usage inside a test is:
//
//	if err := fstest.TestFS(myFS, "file/that/should/be/present"); err != nil {
//		t.Fatal(err)
//	}
export function TestFS(fsys: fs.FS, ...expected: string[]): $.GoError {
	{
		let err = testFS(fsys, ...(expected ?? []))
		if (err != null) {
			return err
		}
	}

	// one sub-test is enough
	for (let _i = 0; _i < $.len(expected); _i++) {
		const name = expected![_i]
		{

			// one sub-test is enough
			{
				let i = strings.Index(name, "/")
				if (i >= 0) {
					let [dir, dirSlash] = [$.sliceString(name, undefined, i), $.sliceString(name, undefined, i + 1)]
					let subExpected: $.Slice<string> = null
					for (let _i = 0; _i < $.len(expected); _i++) {
						const name = expected![_i]
						{
							if (strings.HasPrefix(name, dirSlash)) {
								subExpected = $.append(subExpected, $.sliceString(name, $.len(dirSlash), undefined))
							}
						}
					}
					let [sub, err] = fs.Sub(fsys, dir)
					if (err != null) {
						return err
					}
					{
						let err = testFS(sub, ...(subExpected ?? []))
						if (err != null) {
							return fmt.Errorf("testing fs.Sub(fsys, %s): %w", dir, err)
						}
					}
					break
				}
			}
		}
	}
	return null
}

export function testFS(fsys: fs.FS, ...expected: string[]): $.GoError {
	let t = $.varRef($.markAsStructValue(new fsTester({fsys: fsys})))
	t!.value.checkDir(".")
	t!.value.checkOpen(".")
	let found = $.makeMap<string, boolean>()
	for (let _i = 0; _i < $.len(t!.value.dirs); _i++) {
		const dir = t!.value.dirs![_i]
		{
			$.mapSet(found, dir, true)
		}
	}
	for (let _i = 0; _i < $.len(t!.value.files); _i++) {
		const file = t!.value.files![_i]
		{
			$.mapSet(found, file, true)
		}
	}
	$.deleteMapEntry(found, ".")
	if ($.len(expected) == 0 && $.len(found) > 0) {
		let list = slices.Sorted(maps.Keys(found))
		if ($.len(list) > 15) {
			list = $.append($.goSlice(list, undefined, 10), "...")
		}
		t!.value.errorf("expected empty file system but found files:\n%s", strings.Join(list, "\n"))
	}
	for (let _i = 0; _i < $.len(expected); _i++) {
		const name = expected![_i]
		{
			if (!$.mapGet(found, name, false)[0]) {
				t!.value.errorf("expected but not found: %s", name)
			}
		}
	}
	if ($.len(t!.value.errors) == 0) {
		return null
	}
	return fmt.Errorf("TestFS found errors:\n%w", errors.Join(...(t!.value.errors ?? [])))
}

// formatEntry formats an fs.DirEntry into a string for error messages and comparison.
export function formatEntry(entry: fs.DirEntry): string {
	return fmt.Sprintf("%s IsDir=%v Type=%v", entry!.Name(), entry!.IsDir(), entry!.Type())
}

// formatInfoEntry formats an fs.FileInfo into a string like the result of formatEntry, for error messages and comparison.
export function formatInfoEntry(info: fs.FileInfo): string {
	return fmt.Sprintf("%s IsDir=%v Type=%v", info!.Name(), info!.IsDir(), fs.FileMode_Type(info!.Mode()))
}

// formatInfo formats an fs.FileInfo into a string for error messages and comparison.
export function formatInfo(info: fs.FileInfo): string {
	return fmt.Sprintf("%s IsDir=%v Mode=%v Size=%d ModTime=%v", info!.Name(), info!.IsDir(), info!.Mode(), info!.Size(), info!.ModTime())
}

