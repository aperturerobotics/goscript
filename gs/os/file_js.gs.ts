import * as $ from "@goscript/builtin/index.js";
import { ErrInvalid, ErrUnimplemented } from "./error.gs.js";
import { File } from "./types_js.gs.js";
import { getDeno, getNodeFS, newHostError } from "./types_js.gs.js";
import { O_CREATE, O_RDONLY, O_RDWR, O_TRUNC } from "./file_constants_js.gs.js";
import { Link as linkPath, openFileNolog, readlink, Remove as removePath, rename as renamePath, Symlink as symlinkPath, Truncate as truncatePath } from "./file_unix_js.gs.js";
import { Lstat as lstatPath, Stat as statPath } from "./stat_js.gs.js";
import { ValidPath } from "@goscript/io/fs/index.js"

import * as fs from "@goscript/io/fs/index.js"

export function Open(name: string): [File | null, $.GoError] {
  return OpenFile(name, O_RDONLY, 0)
}

export function Create(name: string): [File | null, $.GoError] {
  return OpenFile(name, O_RDWR | O_CREATE | O_TRUNC, 0o666)
}

export function OpenFile(name: string, flag: number, perm: number): [File | null, $.GoError] {
  return openFileNolog(name, flag, perm)
}

export function ReadFile(name: string): [$.Bytes, $.GoError] {
  const denoObj = getDeno()
  if (denoObj?.readFileSync) {
    try {
      return [denoObj.readFileSync(name), null]
    } catch (err) {
      return [null, newHostError(err)]
    }
  }
  const nodeFS = getNodeFS()
  if (nodeFS?.readFileSync) {
    try {
      return [nodeFS.readFileSync(name), null]
    } catch (err) {
      return [null, newHostError(err)]
    }
  }
  return [null, ErrUnimplemented]
}

export function WriteFile(name: string, data: $.Bytes, perm: number): $.GoError {
  const buf = $.bytesToUint8Array(data)
  const denoObj = getDeno()
  if (denoObj?.writeFileSync) {
    try {
      denoObj.writeFileSync(name, buf, { mode: perm })
      return null
    } catch (err) {
      return newHostError(err)
    }
  }
  const nodeFS = getNodeFS()
  if (nodeFS?.writeFileSync) {
    try {
      nodeFS.writeFileSync(name, buf, { mode: perm })
      return null
    } catch (err) {
      return newHostError(err)
    }
  }
  return ErrUnimplemented
}

export function Mkdir(name: string, perm: number): $.GoError {
  const denoObj = getDeno()
  if (denoObj?.mkdirSync) {
    try {
      denoObj.mkdirSync(name, { mode: perm })
      return null
    } catch (err) {
      return newHostError(err)
    }
  }
  const nodeFS = getNodeFS()
  if (nodeFS?.mkdirSync) {
    try {
      nodeFS.mkdirSync(name, { mode: perm })
      return null
    } catch (err) {
      return newHostError(err)
    }
  }
  return ErrUnimplemented
}

export function MkdirAll(path: string, perm: number): $.GoError {
  const denoObj = getDeno()
  if (denoObj?.mkdirSync) {
    try {
      denoObj.mkdirSync(path, { mode: perm, recursive: true })
      return null
    } catch (err) {
      return newHostError(err)
    }
  }
  const nodeFS = getNodeFS()
  if (nodeFS?.mkdirSync) {
    try {
      nodeFS.mkdirSync(path, { mode: perm, recursive: true })
      return null
    } catch (err) {
      return newHostError(err)
    }
  }
  return ErrUnimplemented
}

export function Remove(name: string): $.GoError {
  return removePath(name)
}

export function RemoveAll(path: string): $.GoError {
  const denoObj = getDeno()
  if (denoObj?.removeSync) {
    try {
      denoObj.removeSync(path, { recursive: true })
      return null
    } catch (err) {
      return newHostError(err)
    }
  }
  const nodeFS = getNodeFS()
  if (nodeFS?.rmSync) {
    try {
      nodeFS.rmSync(path, { force: true, recursive: true })
      return null
    } catch (err) {
      return newHostError(err)
    }
  }
  return ErrUnimplemented
}

export function Chdir(dir: string): $.GoError {
  const denoObj = getDeno()
  if (denoObj?.chdir) {
    try {
      denoObj.chdir(dir)
      return null
    } catch (err) {
      return newHostError(err)
    }
  }
  const processObj = (globalThis as any).process
  if (processObj?.chdir) {
    try {
      processObj.chdir(dir)
      return null
    } catch (err) {
      return newHostError(err)
    }
  }
  return ErrUnimplemented
}

export function Chmod(name: string, mode: number): $.GoError {
  const denoObj = getDeno()
  if (denoObj?.chmodSync) {
    try {
      denoObj.chmodSync(name, mode)
      return null
    } catch (err) {
      return newHostError(err)
    }
  }
  const nodeFS = getNodeFS()
  if (nodeFS?.chmodSync) {
    try {
      nodeFS.chmodSync(name, mode)
      return null
    } catch (err) {
      return newHostError(err)
    }
  }
  return ErrUnimplemented
}

export function Rename(oldpath: string, newpath: string): $.GoError {
  return renamePath(oldpath, newpath)
}

export function Stat(name: string): [fs.FileInfo, $.GoError] {
  return statPath(name)
}

export function Lstat(name: string): [fs.FileInfo, $.GoError] {
  return lstatPath(name)
}

export function Link(oldname: string, newname: string): $.GoError {
  return linkPath(oldname, newname)
}

export function Symlink(oldname: string, newname: string): $.GoError {
  return symlinkPath(oldname, newname)
}

export function Readlink(name: string): [string, $.GoError] {
  return readlink(name)
}

export function Truncate(name: string, size: number): $.GoError {
  return truncatePath(name, size)
}

export function DirFS(dir: string): fs.FS {
  return new hostFS({ root: dir })
}

class hostFS {
  public root: string

  constructor(init?: Partial<{ root?: string }>) {
    this.root = init?.root ?? "."
  }

  public Open(name: string): [fs.File, $.GoError] {
    if (!ValidPath(name)) {
      return [null, ErrInvalid]
    }
    const fullPath = name === "." ? this.root : this.root.replace(/\/+$/, "") + "/" + name
    return Open(fullPath)
  }
}

 
