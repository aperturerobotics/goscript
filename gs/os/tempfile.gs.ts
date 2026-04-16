import * as $ from "@goscript/builtin/index.js";
import { ErrUnimplemented } from "./error.gs.js";
import { TempDir } from "./file_constants_js.gs.js";
import { Create, Mkdir } from "./file_js.gs.js";
import { File } from "./types_js.gs.js";

export function joinPath(dir: string, file: string): string {
  if (dir === "" || dir === ".") {
    return file
  }
  if (file === "") {
    return dir
  }
  if (dir.endsWith("/")) {
    dir = dir.slice(0, -1)
  }
  if (file.startsWith("/")) {
    file = file.slice(1)
  }
  return dir + "/" + file
}

function nextTempPath(dir: string, pattern: string): string {
  const baseDir = dir === "" ? TempDir() : dir
  const suffix = Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
  const name = pattern.includes("*") ? pattern.replace("*", suffix) : pattern + suffix
  return joinPath(baseDir, name)
}

export function CreateTemp(dir: string, pattern: string): [File | null, $.GoError] {
  const template = pattern === "" ? "tmp-*" : pattern
  for (let i = 0; i < 16; i++) {
    const path = nextTempPath(dir, template)
    const [file, err] = Create(path)
    if (err === null) {
      return [file, null]
    }
  }
  return [null, ErrUnimplemented]
}

export function MkdirTemp(dir: string, pattern: string): [string, $.GoError] {
  const template = pattern === "" ? "tmp-*" : pattern
  for (let i = 0; i < 16; i++) {
    const path = nextTempPath(dir, template)
    const err = Mkdir(path, 0o700)
    if (err === null) {
      return [path, null]
    }
  }
  return ["", ErrUnimplemented]
}
