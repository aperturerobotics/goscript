import * as $ from "@goscript/builtin/index.js";
import { ErrUnimplemented } from "./error.gs.js";
import { TempDir } from "./file_constants_js.gs.js";
import { Mkdir } from "./file_js.gs.js";
import { createHostFile, File, getDeno, getNodeFS, newHostError } from "./types_js.gs.js";

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

function nextTempPath(dir: string, pattern: string): [string, $.GoError] {
  const baseDir = dir === "" ? TempDir() : dir
  const [suffix, err] = nextRandom()
  if (err !== null) {
    return ["", err]
  }
  const star = pattern.lastIndexOf("*")
  const name =
    star >= 0
      ? pattern.slice(0, star) + suffix + pattern.slice(star + 1)
      : pattern + suffix
  return [joinPath(baseDir, name), null]
}

function nextRandom(): [string, $.GoError] {
  const crypto = globalThis.crypto
  if (!crypto || typeof crypto.getRandomValues !== "function") {
    return ["", ErrUnimplemented]
  }
  const bytes = new Uint8Array(4)
  crypto.getRandomValues(bytes)
  const value =
    bytes[0] |
    (bytes[1] << 8) |
    (bytes[2] << 16) |
    (bytes[3] << 24)
  return [(value >>> 0).toString(10), null]
}

function createTempFile(path: string): [File | null, $.GoError] {
  const denoObj = getDeno()
  if (denoObj?.openSync) {
    try {
      const handle = denoObj.openSync(path, {
        createNew: true,
        mode: 0o600,
        read: true,
        write: true,
      })
      return [createHostFile(path, handle?.rid ?? -1, handle), null]
    } catch (err) {
      return [null, newHostError(err)]
    }
  }

  const nodeFS = getNodeFS()
  if (nodeFS?.openSync) {
    try {
      return [createHostFile(path, nodeFS.openSync(path, "wx+", 0o600)), null]
    } catch (err) {
      return [null, newHostError(err)]
    }
  }

  return [null, ErrUnimplemented]
}

export function CreateTemp(dir: string, pattern: string): [File | null, $.GoError] {
  const template = pattern === "" ? "tmp-*" : pattern
  let lastErr: $.GoError = ErrUnimplemented
  for (let i = 0; i < 16; i++) {
    const [path, randErr] = nextTempPath(dir, template)
    if (randErr !== null) {
      return [null, randErr]
    }
    const [file, err] = createTempFile(path)
    if (err === null) {
      return [file, null]
    }
    lastErr = err
  }
  return [null, lastErr]
}

export function MkdirTemp(dir: string, pattern: string): [string, $.GoError] {
  const template = pattern === "" ? "tmp-*" : pattern
  let lastErr: $.GoError = ErrUnimplemented
  for (let i = 0; i < 16; i++) {
    const [path, randErr] = nextTempPath(dir, template)
    if (randErr !== null) {
      return ["", randErr]
    }
    const err = Mkdir(path, 0o700)
    if (err === null) {
      return [path, null]
    }
    lastErr = err
  }
  return ["", lastErr]
}
