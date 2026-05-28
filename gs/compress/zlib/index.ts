import * as $ from '@goscript/builtin/index.js'
import * as errors from '@goscript/errors/index.js'
import * as io from '@goscript/io/index.js'

export type Resetter = {
  Reset(r: io.Reader | null, dict: $.Bytes | null): $.GoError
}

type maybeAsyncWriter = {
  Write(p: $.Bytes): [number, $.GoError] | Promise<[number, $.GoError]>
}

export let ErrChecksum = errors.New('zlib: invalid checksum')
export let ErrDictionary = errors.New('zlib: invalid dictionary')
export let ErrHeader = errors.New('zlib: invalid header')

export function __goscript_set_ErrChecksum(value: $.GoError): void {
  ErrChecksum = value
}

export function __goscript_set_ErrDictionary(value: $.GoError): void {
  ErrDictionary = value
}

export function __goscript_set_ErrHeader(value: $.GoError): void {
  ErrHeader = value
}

class zlibReader implements Resetter {
  private data: Uint8Array = new Uint8Array(0)
  private offset = 0
  private pending:
    | Promise<{ data: Uint8Array | null; err: $.GoError }>
    | null = null

  constructor(data?: Uint8Array) {
    if (data != null) {
      this.data = data
    }
  }

  async Read(p: $.Bytes): Promise<[number, $.GoError]> {
    const pending = this.pending
    if (pending != null) {
      this.pending = null
      const result = await pending
      if (result.err != null) {
        return [0, result.err]
      }
      this.data = result.data ?? new Uint8Array(0)
      this.offset = 0
    }
    if (this.offset >= this.data.length) {
      return [0, io.EOF]
    }
    const out = $.bytesToUint8Array(p)
    const n = Math.min(out.length, this.data.length - this.offset)
    out.set(this.data.subarray(this.offset, this.offset + n))
    this.offset += n
    return [n, null]
  }

  Close(): $.GoError {
    return null
  }

  Reset(r: io.Reader | null, dict: $.Bytes | null): $.GoError {
    if (r == null) {
      return errors.New('zlib: nil reader')
    }
    const result = readInflated(r, dict)
    if (result instanceof Promise) {
      this.data = new Uint8Array(0)
      this.offset = 0
      this.pending = result
      return null
    }
    if (result.err != null) {
      return result.err
    }
    this.data = result.data ?? new Uint8Array(0)
    this.offset = 0
    this.pending = null
    return null
  }
}

export class Writer {
  private chunks: Uint8Array[] = []
  private closed = false

  constructor(private w: io.Writer | null) {}

  Write(p: $.Bytes): [number, $.GoError] {
    if (this.closed) {
      return [0, errors.New('zlib: writer closed')]
    }
    const data = $.bytesToUint8Array(p)
    this.chunks.push(data.slice())
    return [data.length, null]
  }

  async Close(): Promise<$.GoError> {
    if (this.closed) {
      return null
    }
    this.closed = true
    if (this.w == null) {
      return errors.New('zlib: nil writer')
    }
    const compressed = deflate(concat(this.chunks))
    const writer = $.pointerValue<maybeAsyncWriter>(this.w)
    const [, err] = await writer.Write(compressed)
    return err
  }

  Flush(): $.GoError {
    return null
  }

  Reset(w: io.Writer | null): void {
    this.w = w
    this.chunks = []
    this.closed = false
  }
}

export function NewWriter(w: io.Writer | null): Writer {
  return new Writer(w)
}

export function NewWriterLevel(
  w: io.Writer | null,
  _level: number,
): [Writer | null, $.GoError] {
  return [new Writer(w), null]
}

export function NewWriterLevelDict(
  w: io.Writer | null,
  _level: number,
  _dict: $.Bytes | null,
): [Writer | null, $.GoError] {
  return [new Writer(w), null]
}

export function NewReader(
  r: io.Reader | null,
): [io.ReadCloser | null, $.GoError] {
  return NewReaderDict(r, null)
}

export function NewReaderDict(
  r: io.Reader | null,
  dict: $.Bytes | null,
): [io.ReadCloser | null, $.GoError] {
  const reader = new zlibReader()
  const err = reader.Reset(r, dict)
  if (err != null) {
    return [null, err]
  }
  return [reader as any, null]
}

function deflate(data: Uint8Array): Uint8Array {
  const zlib = nodeZlib()
  return new Uint8Array(zlib.deflateSync(data))
}

function inflate(data: Uint8Array): Uint8Array {
  const zlib = nodeZlib()
  return new Uint8Array(zlib.inflateSync(data))
}

function nodeZlib(): any {
  const processObj = (globalThis as any).process
  if (processObj && typeof processObj.getBuiltinModule === 'function') {
    const mod = processObj.getBuiltinModule('zlib')
    if (mod && typeof mod.deflateSync === 'function') {
      return mod
    }
  }
  const requireFn = (() => {
    try {
      return Function(
        "return typeof require !== 'undefined' ? require : null",
      )() as ((specifier: string) => unknown) | null
    } catch {
      return null
    }
  })()
  if (requireFn != null) {
    for (const specifier of ['node:zlib', 'zlib']) {
      try {
        const mod = requireFn(specifier) as any
        if (mod && typeof mod.deflateSync === 'function') {
          return mod
        }
      } catch {
        // Try the next fallback.
      }
    }
  }
  throw new Error('compress/zlib: node zlib module unavailable')
}

function readInflated(
  r: io.Reader,
  dict: $.Bytes | null,
):
  | { data: Uint8Array | null; err: $.GoError }
  | Promise<{ data: Uint8Array | null; err: $.GoError }> {
  const chunks: number[] = []
  const buf = $.makeSlice<number>(1, undefined, 'byte')
  while (true) {
    const read = r.Read(buf)
    if (read instanceof Promise) {
      return readInflatedAsync(read, r, buf, chunks, dict)
    }
    const [n, err] = read
    const result = recordCompressedBytes(chunks, buf, n, dict)
    if (result.err == null && result.data != null) {
      return result
    }
    if (err != null) {
      if (err === io.EOF) {
        return result
      }
      return { data: null, err }
    }
  }
}

async function readInflatedAsync(
  first: Promise<[number, $.GoError]>,
  r: io.Reader,
  buf: $.Bytes,
  chunks: number[],
  dict: $.Bytes | null,
): Promise<{ data: Uint8Array | null; err: $.GoError }> {
  let read = await first
  while (true) {
    const [n, err] = read
    const result = recordCompressedBytes(chunks, buf, n, dict)
    if (result.err == null && result.data != null) {
      return result
    }
    if (err != null) {
      if (err === io.EOF) {
        return result
      }
      return { data: null, err }
    }
    read = await r.Read(buf)
  }
}

function recordCompressedBytes(
  chunks: number[],
  buf: $.Bytes,
  n: number,
  dict: $.Bytes | null,
): { data: Uint8Array | null; err: $.GoError } {
  if (n > 0) {
    chunks.push(...$.bytesToUint8Array($.goSlice(buf, 0, n)))
  }
  const compressed = new Uint8Array(chunks)
  try {
    return { data: inflate(compressed), err: null }
  } catch {
    if (dict != null && $.len(dict) > 0) {
      return { data: null, err: ErrDictionary }
    }
    return { data: null, err: ErrHeader }
  }
}

function concat(chunks: Uint8Array[]): Uint8Array {
  let total = 0
  for (const chunk of chunks) {
    total += chunk.length
  }
  const out = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    out.set(chunk, offset)
    offset += chunk.length
  }
  return out
}
