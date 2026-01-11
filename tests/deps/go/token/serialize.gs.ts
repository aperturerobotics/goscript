import * as $ from "@goscript/builtin/index.js"
import { File, FileSet, lineInfo } from "./position.gs.js";

import * as slices from "@goscript/slices/index.js"

export class serializedFile {
	// fields correspond 1:1 to fields with same (lower-case) name in File
	public get Name(): string {
		return this._fields.Name.value
	}
	public set Name(value: string) {
		this._fields.Name.value = value
	}

	public get Base(): number {
		return this._fields.Base.value
	}
	public set Base(value: number) {
		this._fields.Base.value = value
	}

	public get Size(): number {
		return this._fields.Size.value
	}
	public set Size(value: number) {
		this._fields.Size.value = value
	}

	public get Lines(): $.Slice<number> {
		return this._fields.Lines.value
	}
	public set Lines(value: $.Slice<number>) {
		this._fields.Lines.value = value
	}

	public get Infos(): $.Slice<lineInfo> {
		return this._fields.Infos.value
	}
	public set Infos(value: $.Slice<lineInfo>) {
		this._fields.Infos.value = value
	}

	public _fields: {
		Name: $.VarRef<string>;
		Base: $.VarRef<number>;
		Size: $.VarRef<number>;
		Lines: $.VarRef<$.Slice<number>>;
		Infos: $.VarRef<$.Slice<lineInfo>>;
	}

	constructor(init?: Partial<{Base?: number, Infos?: $.Slice<lineInfo>, Lines?: $.Slice<number>, Name?: string, Size?: number}>) {
		this._fields = {
			Name: $.varRef(init?.Name ?? ""),
			Base: $.varRef(init?.Base ?? 0),
			Size: $.varRef(init?.Size ?? 0),
			Lines: $.varRef(init?.Lines ?? null),
			Infos: $.varRef(init?.Infos ?? null)
		}
	}

	public clone(): serializedFile {
		const cloned = new serializedFile()
		cloned._fields = {
			Name: $.varRef(this._fields.Name.value),
			Base: $.varRef(this._fields.Base.value),
			Size: $.varRef(this._fields.Size.value),
			Lines: $.varRef(this._fields.Lines.value),
			Infos: $.varRef(this._fields.Infos.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'go/token.serializedFile',
	  new serializedFile(),
	  [],
	  serializedFile,
	  {"Name": { kind: $.TypeKind.Basic, name: "string" }, "Base": { kind: $.TypeKind.Basic, name: "int" }, "Size": { kind: $.TypeKind.Basic, name: "int" }, "Lines": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Basic, name: "int" } }, "Infos": { kind: $.TypeKind.Slice, elemType: "lineInfo" }}
	);
}

export class serializedFileSet {
	public get Base(): number {
		return this._fields.Base.value
	}
	public set Base(value: number) {
		this._fields.Base.value = value
	}

	public get Files(): $.Slice<serializedFile> {
		return this._fields.Files.value
	}
	public set Files(value: $.Slice<serializedFile>) {
		this._fields.Files.value = value
	}

	public _fields: {
		Base: $.VarRef<number>;
		Files: $.VarRef<$.Slice<serializedFile>>;
	}

	constructor(init?: Partial<{Base?: number, Files?: $.Slice<serializedFile>}>) {
		this._fields = {
			Base: $.varRef(init?.Base ?? 0),
			Files: $.varRef(init?.Files ?? null)
		}
	}

	public clone(): serializedFileSet {
		const cloned = new serializedFileSet()
		cloned._fields = {
			Base: $.varRef(this._fields.Base.value),
			Files: $.varRef(this._fields.Files.value)
		}
		return cloned
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'go/token.serializedFileSet',
	  new serializedFileSet(),
	  [],
	  serializedFileSet,
	  {"Base": { kind: $.TypeKind.Basic, name: "int" }, "Files": { kind: $.TypeKind.Slice, elemType: "serializedFile" }}
	);
}

