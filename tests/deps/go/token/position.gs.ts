import * as $ from "@goscript/builtin/index.js"
import { key, tree } from "./tree.gs.js";

import * as cmp from "@goscript/cmp/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strconv from "@goscript/strconv/index.js"

import * as sync from "@goscript/sync/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

export let debug: boolean = false

export let NoPos: Pos = 0

export class FileSet {
	// protects the file set
	public get mutex(): sync.RWMutex {
		return this._fields.mutex.value
	}
	public set mutex(value: sync.RWMutex) {
		this._fields.mutex.value = value
	}

	// base offset for the next file
	public get base(): number {
		return this._fields.base.value
	}
	public set base(value: number) {
		this._fields.base.value = value
	}

	// tree of files in ascending base order
	public get tree(): tree {
		return this._fields.tree.value
	}
	public set tree(value: tree) {
		this._fields.tree.value = value
	}

	// cache of last file looked up
	public get last(): atomic.Pointer<File> {
		return this._fields.last.value
	}
	public set last(value: atomic.Pointer<File>) {
		this._fields.last.value = value
	}

	public _fields: {
		mutex: $.VarRef<sync.RWMutex>;
		base: $.VarRef<number>;
		tree: $.VarRef<tree>;
		last: $.VarRef<atomic.Pointer<File>>;
	}

	constructor(init?: Partial<{base?: number, last?: atomic.Pointer<File>, mutex?: sync.RWMutex, tree?: tree}>) {
		this._fields = {
			mutex: $.varRef(init?.mutex ? $.markAsStructValue(init.mutex.clone()) : new sync.RWMutex()),
			base: $.varRef(init?.base ?? 0),
			tree: $.varRef(init?.tree ? $.markAsStructValue(init.tree.clone()) : new tree()),
			last: $.varRef(init?.last ? $.markAsStructValue(init.last.clone()) : new atomic.Pointer<File>())
		}
	}

	public clone(): FileSet {
		const cloned = new FileSet()
		cloned._fields = {
			mutex: $.varRef($.markAsStructValue(this._fields.mutex.value.clone())),
			base: $.varRef(this._fields.base.value),
			tree: $.varRef($.markAsStructValue(this._fields.tree.value.clone())),
			last: $.varRef($.markAsStructValue(this._fields.last.value.clone()))
		}
		return cloned
	}

	// Base returns the minimum base offset that must be provided to
	// [FileSet.AddFile] when adding the next file.
	public async Base(): Promise<number> {
		const s = this
		await s.mutex.RLock()
		let b = s.base
		s.mutex.RUnlock()
		return b
	}

	// AddFile adds a new file with a given filename, base offset, and file size
	// to the file set s and returns the file. Multiple files may have the same
	// name. The base offset must not be smaller than the [FileSet.Base], and
	// size must not be negative. As a special case, if a negative base is provided,
	// the current value of the [FileSet.Base] is used instead.
	//
	// Adding the file will set the file set's [FileSet.Base] value to base + size + 1
	// as the minimum base value for the next file. The following relationship
	// exists between a [Pos] value p for a given file offset offs:
	//
	//	int(p) = base + offs
	//
	// with offs in the range [0, size] and thus p in the range [base, base+size].
	// For convenience, [File.Pos] may be used to create file-specific position
	// values from a file offset.
	public async AddFile(filename: string, base: number, size: number): Promise<File | null> {
		const s = this
		using __defer = new $.DisposableStack();
		let f = new File({lines: $.arrayToSlice<number>([0]), name: filename, size: size})
		await s.mutex.Lock()
		__defer.defer(() => {
			s.mutex.Unlock()
		});
		if (base < 0) {
			base = s.base
		}
		if (base < s.base) {
			$.panic(fmt.Sprintf("invalid base %d (should be >= %d)", base, s.base))
		}
		f!.base = base
		if (size < 0) {
			$.panic(fmt.Sprintf("invalid size %d (should be >= 0)", size))
		}
		base += size + 1 // +1 because EOF also has a position
		if (base < 0) {
			$.panic("token.Pos offset overflow (> 2G of source code in file set)")
		}
		s.base = base
		s.tree.add(f)
		s.last.Store(f)
		return f
	}

	// AddExistingFiles adds the specified files to the
	// FileSet if they are not already present.
	// The caller must ensure that no pair of Files that
	// would appear in the resulting FileSet overlap.
	public async AddExistingFiles(...files: File | null[]): Promise<void> {
		const s = this
		using __defer = new $.DisposableStack();
		await s.mutex.Lock()
		__defer.defer(() => {
			s.mutex.Unlock()
		});
		for (let _i = 0; _i < $.len(files); _i++) {
			let f = files![_i]
			{
				s.tree.add(f)
				s.base = Math.max(s.base, f!.Base() + f!.Size() + 1)
			}
		}
	}

	// RemoveFile removes a file from the [FileSet] so that subsequent
	// queries for its [Pos] interval yield a negative result.
	// This reduces the memory usage of a long-lived [FileSet] that
	// encounters an unbounded stream of files.
	//
	// Removing a file that does not belong to the set has no effect.
	public async RemoveFile(file: File | null): Promise<void> {
		const s = this
		using __defer = new $.DisposableStack();
		s.last.CompareAndSwap(file, null) // clear last file cache
		await s.mutex.Lock()
		__defer.defer(() => {
			s.mutex.Unlock()
		});
		let [pn, ] = s.tree.locate(file!.key())
		if (pn!.value != null && ((pn!.value)!.file === file)) {
			s.tree._delete(pn)
		}
	}

	// Iterate calls yield for the files in the file set in ascending Base
	// order until yield returns false.
	public async Iterate(_yield: ((p0: File | null) => boolean) | null): Promise<void> {
		const s = this
		using __defer = new $.DisposableStack();
		await s.mutex.RLock()
		__defer.defer(() => {
			s.mutex.RUnlock()
		});
		;s.tree.all()!(async (f: File | null): Promise<boolean> => {
			await using __defer = new $.AsyncDisposableStack();
			s.mutex.RUnlock()
			__defer.defer(async () => {
				await s.mutex.RLock()
			});
			return _yield!(f)
		})
	}

	public async file(p: Pos): Promise<File | null> {
		const s = this
		using __defer = new $.DisposableStack();
		{
			let f = s.last.Load()
			if (f != null && f!.base <= p && p <= f!.base + f!.size) {
				return f
			}
		}
		await s.mutex.RLock()
		__defer.defer(() => {
			s.mutex.RUnlock()
		});
		let [pn, ] = s.tree.locate($.markAsStructValue(new key({end: p, start: p})))
		{
			let n = pn!.value
			if (n != null) {
				// Update cache of last file. A race is ok,
				// but an exclusive lock causes heavy contention.
				s.last.Store(n!.file)
				return n!.file
			}
		}
		return null
	}

	// File returns the file that contains the position p.
	// If no such file is found (for instance for p == [NoPos]),
	// the result is nil.
	public async File(p: Pos): Promise<File | null> {
		const s = this
		let f: File | null = null
		if (p != 0) {
			f = await s.file(p)
		}
		return f
	}

	// PositionFor converts a [Pos] p in the fileset into a [Position] value.
	// If adjusted is set, the position may be adjusted by position-altering
	// //line comments; otherwise those comments are ignored.
	// p must be a [Pos] value in s or [NoPos].
	public async PositionFor(p: Pos, adjusted: boolean): Promise<Position> {
		const s = this
		let pos: Position = new Position()
		if (p != 0) {
			{
				let f = await s.file(p)
				if (f != null) {
					return await f!.position(p, adjusted)
				}
			}
		}
		return pos
	}

	// Position converts a [Pos] p in the fileset into a Position value.
	// Calling s.Position(p) is equivalent to calling s.PositionFor(p, true).
	public async Position(p: Pos): Promise<Position> {
		const s = this
		let pos: Position = new Position()
		return await s.PositionFor(p, true)
	}

	// Read calls decode to deserialize a file set into s; s must not be nil.
	public async Read(decode: ((p0: null | any) => $.GoError) | null): Promise<$.GoError> {
		const s = this
		let ss: $.VarRef<serializedFileSet> = $.varRef(new serializedFileSet())
		{
			let err = decode!(ss)
			if (err != null) {
				return err
			}
		}
		await s.mutex.Lock()
		s.base = ss!.value.Base
		for (let _i = 0; _i < $.len(ss!.value.Files); _i++) {
			let f = ss!.value.Files![_i]
			{
				s.tree.add(new File({base: f.Base, infos: f.Infos, lines: f.Lines, name: f.Name, size: f.Size}))
			}
		}
		s.last.Store(null)
		s.mutex.Unlock()
		return null
	}

	// Write calls encode to serialize the file set s.
	public async Write(encode: ((p0: null | any) => $.GoError) | null): Promise<$.GoError> {
		const s = this
		let ss: serializedFileSet = new serializedFileSet()
		await s.mutex.Lock()
		ss.Base = s.base
		let files: $.Slice<serializedFile> = null
		;(() => {
			let shouldContinue = true
			s.tree.all()!((v) => {
				{
					await f!.mutex.Lock()
					files = $.append(files, $.markAsStructValue(new serializedFile({Base: f!.base, Infos: slices.Clone(f!.infos), Lines: slices.Clone(f!.lines), Name: f!.name, Size: f!.size})))
					f!.mutex.Unlock()
				}
				return shouldContinue
			})
		})()
		ss.Files = files
		s.mutex.Unlock()
		return encode!(ss)
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'go/token.FileSet',
	  new FileSet(),
	  [{ name: "Base", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "AddFile", args: [{ name: "filename", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "base", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "size", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "File" } }] }, { name: "AddExistingFiles", args: [{ name: "files", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "File" } } }], returns: [] }, { name: "RemoveFile", args: [{ name: "file", type: { kind: $.TypeKind.Pointer, elemType: "File" } }], returns: [] }, { name: "Iterate", args: [{ name: "yield", type: { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Pointer, elemType: "File" }], results: [{ kind: $.TypeKind.Basic, name: "bool" }] } }], returns: [] }, { name: "file", args: [{ name: "p", type: "Pos" }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "File" } }] }, { name: "File", args: [{ name: "p", type: "Pos" }], returns: [{ type: { kind: $.TypeKind.Pointer, elemType: "File" } }] }, { name: "PositionFor", args: [{ name: "p", type: "Pos" }, { name: "adjusted", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ type: "Position" }] }, { name: "Position", args: [{ name: "p", type: "Pos" }], returns: [{ type: "Position" }] }, { name: "Read", args: [{ name: "decode", type: { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Interface, methods: [] }], results: [{ kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] }] } }], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }, { name: "Write", args: [{ name: "encode", type: { kind: $.TypeKind.Function, params: [{ kind: $.TypeKind.Interface, methods: [] }], results: [{ kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] }] } }], returns: [{ type: { kind: $.TypeKind.Interface, name: 'GoError', methods: [{ name: 'Error', args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }] }] } }] }],
	  FileSet,
	  {"mutex": "RWMutex", "base": { kind: $.TypeKind.Basic, name: "int" }, "tree": "tree", "last": "Pointer"}
	);
}

export type Pos = number;

export function Pos_IsValid(p: Pos): boolean {
	return p != 0
}


export class Position {
	// filename, if any
	public get Filename(): string {
		return this._fields.Filename.value
	}
	public set Filename(value: string) {
		this._fields.Filename.value = value
	}

	// offset, starting at 0
	public get Offset(): number {
		return this._fields.Offset.value
	}
	public set Offset(value: number) {
		this._fields.Offset.value = value
	}

	// line number, starting at 1
	public get Line(): number {
		return this._fields.Line.value
	}
	public set Line(value: number) {
		this._fields.Line.value = value
	}

	// column number, starting at 1 (byte count)
	public get Column(): number {
		return this._fields.Column.value
	}
	public set Column(value: number) {
		this._fields.Column.value = value
	}

	public _fields: {
		Filename: $.VarRef<string>;
		Offset: $.VarRef<number>;
		Line: $.VarRef<number>;
		Column: $.VarRef<number>;
	}

	constructor(init?: Partial<{Column?: number, Filename?: string, Line?: number, Offset?: number}>) {
		this._fields = {
			Filename: $.varRef(init?.Filename ?? ""),
			Offset: $.varRef(init?.Offset ?? 0),
			Line: $.varRef(init?.Line ?? 0),
			Column: $.varRef(init?.Column ?? 0)
		}
	}

	public clone(): Position {
		const cloned = new Position()
		cloned._fields = {
			Filename: $.varRef(this._fields.Filename.value),
			Offset: $.varRef(this._fields.Offset.value),
			Line: $.varRef(this._fields.Line.value),
			Column: $.varRef(this._fields.Column.value)
		}
		return cloned
	}

	// IsValid reports whether the position is valid.
	public IsValid(): boolean {
		const pos = this
		return pos.Line > 0
	}

	// String returns a string in one of several forms:
	//
	//	file:line:column    valid position with file name
	//	file:line           valid position with file name but no column (column == 0)
	//	line:column         valid position without file name
	//	line                valid position without file name and no column (column == 0)
	//	file                invalid position with file name
	//	-                   invalid position without file name
	public String(): string {
		const pos = this
		let s = pos.Filename
		if (pos.IsValid()) {
			if (s != "") {
				s += ":"
			}
			s += strconv.Itoa(pos.Line)
			if (Number(pos.Column) != 0) {
				s += fmt.Sprintf(":%d", pos.Column)
			}
		}
		if (s == "") {
			s = "-"
		}
		return s
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'go/token.Position',
	  new Position(),
	  [{ name: "IsValid", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "String", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }],
	  Position,
	  {"Filename": { kind: $.TypeKind.Basic, name: "string" }, "Offset": { kind: $.TypeKind.Basic, name: "int" }, "Line": { kind: $.TypeKind.Basic, name: "int" }, "Column": { kind: $.TypeKind.Basic, name: "int" }}
	);
}

export class lineInfo {
	// fields are exported to make them accessible to gob
	public get Offset(): number {
		return this._fields.Offset.value
	}
	public set Offset(value: number) {
		this._fields.Offset.value = value
	}

	public get Filename(): string {
		return this._fields.Filename.value
	}
	public set Filename(value: string) {
		this._fields.Filename.value = value
	}

	public get Line(): number {
		return this._fields.Line.value
	}
	public set Line(value: number) {
		this._fields.Line.value = value
	}

	public get Column(): number {
		return this._fields.Column.value
	}
	public set Column(value: number) {
		this._fields.Column.value = value
	}

	public _fields: {
		Offset: $.VarRef<number>;
		Filename: $.VarRef<string>;
		Line: $.VarRef<number>;
		Column: $.VarRef<number>;
	}

	constructor(init?: Partial<{Column?: number, Filename?: string, Line?: number, Offset?: number}>) {
		this._fields = {
			Offset: $.varRef(init?.Offset ?? 0),
			Filename: $.varRef(init?.Filename ?? ""),
			Line: $.varRef(init?.Line ?? 0),
			Column: $.varRef(init?.Column ?? 0)
		}
	}

	public clone(): lineInfo {
		const cloned = new lineInfo()
		cloned._fields = {
			Offset: $.varRef(this._fields.Offset.value),
			Filename: $.varRef(this._fields.Filename.value),
			Line: $.varRef(this._fields.Line.value),
			Column: $.varRef(this._fields.Column.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'go/token.lineInfo',
	  new lineInfo(),
	  [],
	  lineInfo,
	  {"Offset": { kind: $.TypeKind.Basic, name: "int" }, "Filename": { kind: $.TypeKind.Basic, name: "string" }, "Line": { kind: $.TypeKind.Basic, name: "int" }, "Column": { kind: $.TypeKind.Basic, name: "int" }}
	);
}

export class File {
	// file name as provided to AddFile
	public get name(): string {
		return this._fields.name.value
	}
	public set name(value: string) {
		this._fields.name.value = value
	}

	// Pos value range for this file is [base...base+size]
	public get base(): number {
		return this._fields.base.value
	}
	public set base(value: number) {
		this._fields.base.value = value
	}

	// file size as provided to AddFile
	public get size(): number {
		return this._fields.size.value
	}
	public set size(value: number) {
		this._fields.size.value = value
	}

	// lines and infos are protected by mutex
	public get mutex(): sync.Mutex {
		return this._fields.mutex.value
	}
	public set mutex(value: sync.Mutex) {
		this._fields.mutex.value = value
	}

	// lines contains the offset of the first character for each line (the first entry is always 0)
	public get lines(): $.Slice<number> {
		return this._fields.lines.value
	}
	public set lines(value: $.Slice<number>) {
		this._fields.lines.value = value
	}

	public get infos(): $.Slice<lineInfo> {
		return this._fields.infos.value
	}
	public set infos(value: $.Slice<lineInfo>) {
		this._fields.infos.value = value
	}

	public _fields: {
		name: $.VarRef<string>;
		base: $.VarRef<number>;
		size: $.VarRef<number>;
		mutex: $.VarRef<sync.Mutex>;
		lines: $.VarRef<$.Slice<number>>;
		infos: $.VarRef<$.Slice<lineInfo>>;
	}

	constructor(init?: Partial<{base?: number, infos?: $.Slice<lineInfo>, lines?: $.Slice<number>, mutex?: sync.Mutex, name?: string, size?: number}>) {
		this._fields = {
			name: $.varRef(init?.name ?? ""),
			base: $.varRef(init?.base ?? 0),
			size: $.varRef(init?.size ?? 0),
			mutex: $.varRef(init?.mutex ? $.markAsStructValue(init.mutex.clone()) : new sync.Mutex()),
			lines: $.varRef(init?.lines ?? null),
			infos: $.varRef(init?.infos ?? null)
		}
	}

	public clone(): File {
		const cloned = new File()
		cloned._fields = {
			name: $.varRef(this._fields.name.value),
			base: $.varRef(this._fields.base.value),
			size: $.varRef(this._fields.size.value),
			mutex: $.varRef($.markAsStructValue(this._fields.mutex.value.clone())),
			lines: $.varRef(this._fields.lines.value),
			infos: $.varRef(this._fields.infos.value)
		}
		return cloned
	}

	// Name returns the file name of file f as registered with AddFile.
	public Name(): string {
		const f = this
		return f.name
	}

	// Base returns the base offset of file f as registered with AddFile.
	public Base(): number {
		const f = this
		return f.base
	}

	// Size returns the size of file f as registered with AddFile.
	public Size(): number {
		const f = this
		return f.size
	}

	// LineCount returns the number of lines in file f.
	public async LineCount(): Promise<number> {
		const f = this
		await f.mutex.Lock()
		let n = $.len(f.lines)
		f.mutex.Unlock()
		return n
	}

	// AddLine adds the line offset for a new line.
	// The line offset must be larger than the offset for the previous line
	// and smaller than the file size; otherwise the line offset is ignored.
	public async AddLine(offset: number): Promise<void> {
		const f = this
		await f.mutex.Lock()
		{
			let i = $.len(f.lines)
			if ((i == 0 || f.lines![i - 1] < offset) && offset < f.size) {
				f.lines = $.append(f.lines, offset)
			}
		}
		f.mutex.Unlock()
	}

	// MergeLine merges a line with the following line. It is akin to replacing
	// the newline character at the end of the line with a space (to not change the
	// remaining offsets). To obtain the line number, consult e.g. [Position.Line].
	// MergeLine will panic if given an invalid line number.
	public async MergeLine(line: number): Promise<void> {
		const f = this
		using __defer = new $.DisposableStack();
		if (line < 1) {
			$.panic(fmt.Sprintf("invalid line number %d (should be >= 1)", line))
		}
		await f.mutex.Lock()
		__defer.defer(() => {
			f.mutex.Unlock()
		});
		if (line >= $.len(f.lines)) {
			$.panic(fmt.Sprintf("invalid line number %d (should be < %d)", line, $.len(f.lines)))
		}
		$.copy($.goSlice(f.lines, line, undefined), $.goSlice(f.lines, line + 1, undefined))
		f.lines = $.goSlice(f.lines, undefined, $.len(f.lines) - 1)
	}

	// Lines returns the effective line offset table of the form described by [File.SetLines].
	// Callers must not mutate the result.
	public async Lines(): Promise<$.Slice<number>> {
		const f = this
		await f.mutex.Lock()
		let lines = f.lines
		f.mutex.Unlock()
		return lines
	}

	// SetLines sets the line offsets for a file and reports whether it succeeded.
	// The line offsets are the offsets of the first character of each line;
	// for instance for the content "ab\nc\n" the line offsets are {0, 3}.
	// An empty file has an empty line offset table.
	// Each line offset must be larger than the offset for the previous line
	// and smaller than the file size; otherwise SetLines fails and returns
	// false.
	// Callers must not mutate the provided slice after SetLines returns.
	public async SetLines(lines: $.Slice<number>): Promise<boolean> {
		const f = this
		let size = f.size
		for (let i = 0; i < $.len(lines); i++) {
			let offset = lines![i]
			{
				if (i > 0 && offset <= lines![i - 1] || size <= offset) {
					return false
				}
			}
		}
		await f.mutex.Lock()
		f.lines = lines
		f.mutex.Unlock()
		return true
	}

	// SetLinesForContent sets the line offsets for the given file content.
	// It ignores position-altering //line comments.
	public async SetLinesForContent(content: $.Bytes): Promise<void> {
		const f = this
		let lines: $.Slice<number> = null
		let line = 0
		for (let offset = 0; offset < $.len(content); offset++) {
			let b = content![offset]
			{
				if (line >= 0) {
					lines = $.append(lines, line)
				}
				line = -1
				if (b == 10) {
					line = offset + 1
				}
			}
		}
		await f.mutex.Lock()
		f.lines = lines
		f.mutex.Unlock()
	}

	// LineStart returns the [Pos] value of the start of the specified line.
	// It ignores any alternative positions set using [File.AddLineColumnInfo].
	// LineStart panics if the 1-based line number is invalid.
	public async LineStart(line: number): Promise<Pos> {
		const f = this
		using __defer = new $.DisposableStack();
		if (line < 1) {
			$.panic(fmt.Sprintf("invalid line number %d (should be >= 1)", line))
		}
		await f.mutex.Lock()
		__defer.defer(() => {
			f.mutex.Unlock()
		});
		if (line > $.len(f.lines)) {
			$.panic(fmt.Sprintf("invalid line number %d (should be < %d)", line, $.len(f.lines)))
		}
		return (f.base + f.lines![line - 1] as Pos)
	}

	// AddLineInfo is like [File.AddLineColumnInfo] with a column = 1 argument.
	// It is here for backward-compatibility for code prior to Go 1.11.
	public async AddLineInfo(offset: number, filename: string, line: number): Promise<void> {
		const f = this
		await f.AddLineColumnInfo(offset, filename, line, 1)
	}

	// AddLineColumnInfo adds alternative file, line, and column number
	// information for a given file offset. The offset must be larger
	// than the offset for the previously added alternative line info
	// and smaller than the file size; otherwise the information is
	// ignored.
	//
	// AddLineColumnInfo is typically used to register alternative position
	// information for line directives such as //line filename:line:column.
	public async AddLineColumnInfo(offset: number, filename: string, line: number, column: number): Promise<void> {
		const f = this
		await f.mutex.Lock()
		{
			let i = $.len(f.infos)
			if ((i == 0 || f.infos![i - 1].Offset < offset) && offset < f.size) {
				f.infos = $.append(f.infos, $.markAsStructValue(new lineInfo({Column: column, Filename: filename, Line: line, Offset: offset})))
			}
		}
		f.mutex.Unlock()
	}

	// fixOffset fixes an out-of-bounds offset such that 0 <= offset <= f.size.
	public fixOffset(offset: number): number {
		const f = this
		switch (true) {
			case offset < 0: {
				if (!false) {
					return 0
				}
				break
			}
			case offset > f.size: {
				if (!false) {
					return f.size
				}
				break
			}
			default: {
				return offset
				break
			}
		}
		if (false) {

			/* for symmetry */
			$.panic(fmt.Sprintf("offset %d out of bounds [%d, %d] (position %d out of bounds [%d, %d])", 0, offset, f.size, f.base + offset, f.base, f.base + f.size))
		}
		return 0
	}

	// Pos returns the Pos value for the given file offset.
	//
	// If offset is negative, the result is the file's start
	// position; if the offset is too large, the result is
	// the file's end position (see also go.dev/issue/57490).
	//
	// The following invariant, though not true for Pos values
	// in general, holds for the result p:
	// f.Pos(f.Offset(p)) == p.
	public Pos(offset: number): Pos {
		const f = this
		return (f.base + f.fixOffset(offset) as Pos)
	}

	// Offset returns the offset for the given file position p.
	//
	// If p is before the file's start position (or if p is NoPos),
	// the result is 0; if p is past the file's end position,
	// the result is the file size (see also go.dev/issue/57490).
	//
	// The following invariant, though not true for offset values
	// in general, holds for the result offset:
	// f.Offset(f.Pos(offset)) == offset
	public Offset(p: Pos): number {
		const f = this
		return f.fixOffset(p - f.base)
	}

	// Line returns the line number for the given file position p;
	// p must be a [Pos] value in that file or [NoPos].
	public async Line(p: Pos): Promise<number> {
		const f = this
		return (await f.Position(p))!.Line
	}

	// unpack returns the filename and line and column number for a file offset.
	// If adjusted is set, unpack will return the filename and line information
	// possibly adjusted by //line comments; otherwise those comments are ignored.
	public async unpack(offset: number, adjusted: boolean): Promise<[string, number, number]> {
		const f = this
		let filename: string = ""
		let line: number = 0
		let column: number = 0
		await f.mutex.Lock()
		filename = f.name
		{
			let i = searchInts(f.lines, offset)
			if (i >= 0) {
				;[line, column] = [i + 1, offset - f.lines![i] + 1]
			}
		}
		if (adjusted && $.len(f.infos) > 0) {
			// few files have extra line infos

			// i+1 is the line at which the alternative position was recorded
			// line distance from alternative position base

			// alternative column is unknown => relative column is unknown
			// (the current specification for line directives requires
			// this to apply until the next PosBase/line directive,
			// not just until the new newline)

			// the alternative position base is on the current line
			// => column is relative to alternative column
			{
				let i = searchLineInfos(f.infos, offset)
				if (i >= 0) {
					let alt = f.infos![i]
					filename = alt!.Filename

					// i+1 is the line at which the alternative position was recorded
					// line distance from alternative position base

					// alternative column is unknown => relative column is unknown
					// (the current specification for line directives requires
					// this to apply until the next PosBase/line directive,
					// not just until the new newline)

					// the alternative position base is on the current line
					// => column is relative to alternative column
					{
						let i = searchInts(f.lines, alt!.Offset)
						if (i >= 0) {
							// i+1 is the line at which the alternative position was recorded
							let d = line - (i + 1) // line distance from alternative position base
							line = alt!.Line + d

							// alternative column is unknown => relative column is unknown
							// (the current specification for line directives requires
							// this to apply until the next PosBase/line directive,
							// not just until the new newline)

							// the alternative position base is on the current line
							// => column is relative to alternative column
							if (Number(alt!.Column) == 0) {
								// alternative column is unknown => relative column is unknown
								// (the current specification for line directives requires
								// this to apply until the next PosBase/line directive,
								// not just until the new newline)
								column = 0
							} else if (d == 0) {
								// the alternative position base is on the current line
								// => column is relative to alternative column
								column = alt!.Column + (offset - alt!.Offset)
							}
						}
					}
				}
			}
		}
		f.mutex.Unlock()
		return [filename, line, column]
	}

	public async position(p: Pos, adjusted: boolean): Promise<Position> {
		const f = this
		let pos: Position = new Position()
		let offset = f.fixOffset(p - f.base)
		pos.Offset = offset
		{
		  const _tmp = await f.unpack(offset, adjusted)
		  pos.Filename = _tmp[0]
		  pos.Line = _tmp[1]
		  pos.Column = _tmp[2]
		}
		return pos
	}

	// PositionFor returns the Position value for the given file position p.
	// If p is out of bounds, it is adjusted to match the File.Offset behavior.
	// If adjusted is set, the position may be adjusted by position-altering
	// //line comments; otherwise those comments are ignored.
	// p must be a Pos value in f or NoPos.
	public async PositionFor(p: Pos, adjusted: boolean): Promise<Position> {
		const f = this
		let pos: Position = new Position()
		if (p != 0) {
			pos = $.markAsStructValue((await f.position(p, adjusted)).clone())
		}
		return pos
	}

	// Position returns the Position value for the given file position p.
	// If p is out of bounds, it is adjusted to match the File.Offset behavior.
	// Calling f.Position(p) is equivalent to calling f.PositionFor(p, true).
	public async Position(p: Pos): Promise<Position> {
		const f = this
		let pos: Position = new Position()
		return await f.PositionFor(p, true)
	}

	public key(): key {
		const f = this
		return $.markAsStructValue(new key({end: f.base + f.size, start: f.base}))
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'go/token.File',
	  new File(),
	  [{ name: "Name", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "Base", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Size", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "LineCount", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "AddLine", args: [{ name: "offset", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [] }, { name: "MergeLine", args: [{ name: "line", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [] }, { name: "Lines", args: [], returns: [{ type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }] }, { name: "SetLines", args: [{ name: "lines", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "SetLinesForContent", args: [{ name: "content", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "byte" } } }], returns: [] }, { name: "LineStart", args: [{ name: "line", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ type: "Pos" }] }, { name: "AddLineInfo", args: [{ name: "offset", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "filename", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "line", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [] }, { name: "AddLineColumnInfo", args: [{ name: "offset", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "filename", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "line", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "column", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [] }, { name: "fixOffset", args: [{ name: "offset", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Pos", args: [{ name: "offset", type: { kind: $.TypeKind.Basic, name: "int" } }], returns: [{ type: "Pos" }] }, { name: "Offset", args: [{ name: "p", type: "Pos" }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "Line", args: [{ name: "p", type: "Pos" }], returns: [{ type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "unpack", args: [{ name: "offset", type: { kind: $.TypeKind.Basic, name: "int" } }, { name: "adjusted", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }, { type: { kind: $.TypeKind.Basic, name: "int" } }, { type: { kind: $.TypeKind.Basic, name: "int" } }] }, { name: "position", args: [{ name: "p", type: "Pos" }, { name: "adjusted", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ type: "Position" }] }, { name: "PositionFor", args: [{ name: "p", type: "Pos" }, { name: "adjusted", type: { kind: $.TypeKind.Basic, name: "bool" } }], returns: [{ type: "Position" }] }, { name: "Position", args: [{ name: "p", type: "Pos" }], returns: [{ type: "Position" }] }, { name: "key", args: [], returns: [{ type: "key" }] }],
	  File,
	  {"name": { kind: $.TypeKind.Basic, name: "string" }, "base": { kind: $.TypeKind.Basic, name: "int" }, "size": { kind: $.TypeKind.Basic, name: "int" }, "mutex": "Mutex", "lines": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, "infos": { kind: $.TypeKind.Slice, elemType: "lineInfo" }}
	);
}

export function searchLineInfos(a: $.Slice<lineInfo>, x: number): number {
	let [i, found] = slices.BinarySearchFunc(a, x, (a: lineInfo, x: number): number => {
		return cmp.Compare(a.Offset, x)
	})

	// We want the lineInfo containing x, but if we didn't
	// find x then i is the next one.
	if (!found) {
		// We want the lineInfo containing x, but if we didn't
		// find x then i is the next one.
		i--
	}
	return i
}

// NewFileSet creates a new file set.
export function NewFileSet(): FileSet | null {

	// 0 == NoPos
	return new FileSet({base: 1})
}

export function searchInts(a: $.Slice<number>, x: number): number {
	// This function body is a manually inlined version of:
	//
	//   return sort.Search(len(a), func(i int) bool { return a[i] > x }) - 1
	//
	// With better compiler optimizations, this may not be needed in the
	// future, but at the moment this change improves the go/printer
	// benchmark performance by ~30%. This has a direct impact on the
	// speed of gofmt and thus seems worthwhile (2011-04-29).
	// TODO(gri): Remove this when compilers have caught up.
	let [i, j] = [0, $.len(a)]

	// avoid overflow when computing h
	// i ≤ h < j
	for (; i < j; ) {
		let h = $.int(((i + j as number) >> 1)) // avoid overflow when computing h
		// i ≤ h < j
		if (a![h] <= x) {
			i = h + 1
		} else {
			j = h
		}
	}
	return i - 1
}

