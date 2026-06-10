import * as $ from '@goscript/builtin/index.js'
import * as errors from '@goscript/errors/index.js'
import * as io from '@goscript/io/index.js'

type maybeAsyncWriter = {
  Write(p: $.Bytes): [number, $.GoError] | Promise<[number, $.GoError]>
}

type compressionRuntime = {
  gzipSync?: (data: Uint8Array, opts?: Record<string, unknown>) => Uint8Array
  gunzipSync?: (data: Uint8Array) => Uint8Array
}

export const NoCompression = 0
export const BestSpeed = 1
export const BestCompression = 9
export const DefaultCompression = -1
export const HuffmanOnly = -2

export let ErrChecksum = errors.New('gzip: invalid checksum')
export let ErrHeader = errors.New('gzip: invalid header')

export function __goscript_set_ErrChecksum(value: $.GoError): void {
  ErrChecksum = value
}

export function __goscript_set_ErrHeader(value: $.GoError): void {
  ErrHeader = value
}

export class Header {
  Comment = ''
  Extra: $.Bytes = null
  ModTime: any = null
  Name = ''
  OS = 255
}

export class Reader {
  private data: Uint8Array = new Uint8Array(0)
  private offset = 0
  private pending: Promise<{ data: Uint8Array | null; err: $.GoError }> | null =
    null

  constructor(r?: io.Reader | null) {
    if (r != null) {
      this.Reset(r)
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

  Reset(r: io.Reader | null): $.GoError {
    if (r == null) {
      return errors.New('gzip: nil reader')
    }
    const result = readGunzipped(r)
    this.data = new Uint8Array(0)
    this.offset = 0
    if (result instanceof Promise) {
      this.pending = result
      return null
    }
    this.pending = null
    if (result.err != null) {
      return result.err
    }
    this.data = result.data ?? new Uint8Array(0)
    return null
  }
}

export class Writer {
  private chunks: Uint8Array[] = []
  private closed = false

  constructor(
    private w: io.Writer | null,
    private level = DefaultCompression,
  ) {}

  Write(p: $.Bytes): [number, $.GoError] {
    if (this.closed) {
      return [0, errors.New('gzip: writer closed')]
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
      return errors.New('gzip: nil writer')
    }
    const compressed = await gzipBytes(concat(this.chunks), this.level)
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

export function NewReader(
  r: io.Reader | null,
): [io.ReadCloser | null, $.GoError] {
  const reader = new Reader()
  const err = reader.Reset(r)
  if (err != null) {
    return [null, err]
  }
  return [reader as any, null]
}

export function NewWriter(w: io.Writer | null): Writer {
  return new Writer(w)
}

export function NewWriterLevel(
  w: io.Writer | null,
  level: number,
): [Writer | null, $.GoError] {
  if (level < HuffmanOnly || level > BestCompression) {
    return [null, errors.New(`gzip: invalid compression level: ${level}`)]
  }
  return [new Writer(w, level), null]
}

async function gzipBytes(data: Uint8Array, level: number): Promise<Uint8Array> {
  const runtime = nodeCompressionRuntime()
  if (runtime?.gzipSync != null) {
    return runtime.gzipSync(data, { level })
  }

  const CompressionStreamCtor = (globalThis as any).CompressionStream
  if (typeof CompressionStreamCtor !== 'function') {
    throw new Error('compress/gzip: CompressionStream unavailable')
  }
  return streamTransform(data, new CompressionStreamCtor('gzip'))
}

function gunzipBytes(
  data: Uint8Array,
): Uint8Array | Promise<Uint8Array> {
  const runtime = nodeCompressionRuntime()
  if (runtime?.gunzipSync != null) {
    return runtime.gunzipSync(data)
  }

  const DecompressionStreamCtor = (globalThis as any).DecompressionStream
  if (typeof DecompressionStreamCtor !== 'function') {
    throw new Error('compress/gzip: DecompressionStream unavailable')
  }
  return streamTransform(data, new DecompressionStreamCtor('gzip'))
}

async function streamTransform(
  data: Uint8Array,
  stream: ReadableWritablePair<Uint8Array, Uint8Array>,
): Promise<Uint8Array> {
  const body = new ArrayBuffer(data.length)
  new Uint8Array(body).set(data)
  const response = new Response(
    new Blob([body]).stream().pipeThrough(stream as any),
  )
  return new Uint8Array(await response.arrayBuffer())
}

function readGunzipped(
  r: io.Reader,
):
  | { data: Uint8Array | null; err: $.GoError }
  | Promise<{ data: Uint8Array | null; err: $.GoError }> {
  const chunks: Uint8Array[] = []
  const buf = $.makeSlice<number>(1, undefined, 'byte')
  while (true) {
    const read = r.Read(buf)
    if (read instanceof Promise) {
      return readGunzippedAsync(read, r, buf, chunks)
    }
    const [n, err] = read
    recordChunk(chunks, buf, n)
    if (err != null) {
      if (err === io.EOF) {
        return inflateRecorded(chunks)
      }
      return { data: null, err }
    }
  }
}

async function readGunzippedAsync(
  read: Promise<[number, $.GoError]>,
  r: io.Reader,
  buf: $.Bytes,
  chunks: Uint8Array[],
): Promise<{ data: Uint8Array | null; err: $.GoError }> {
  while (true) {
    const [n, err] = await read
    recordChunk(chunks, buf, n)
    if (err != null) {
      if (err === io.EOF) {
        return inflateRecorded(chunks)
      }
      return { data: null, err }
    }
    read = r.Read(buf) as any
  }
}

function recordChunk(chunks: Uint8Array[], buf: $.Bytes, n: number): void {
  if (n > 0) {
    chunks.push($.bytesToUint8Array($.goSlice(buf, 0, n)).slice())
  }
}

function inflateRecorded(
  chunks: Uint8Array[],
): { data: Uint8Array | null; err: $.GoError } | Promise<{
  data: Uint8Array | null
  err: $.GoError
}> {
  try {
    const inflated = gunzipBytes(concat(chunks))
    if (inflated instanceof Promise) {
      return inflated
        .then((data) => ({ data, err: null }))
        .catch(() => ({ data: null, err: ErrHeader }))
    }
    return { data: inflated, err: null }
  } catch {
    return { data: null, err: ErrHeader }
  }
}

function concat(chunks: Uint8Array[]): Uint8Array {
  let length = 0
  for (const chunk of chunks) {
    length += chunk.length
  }
  const out = new Uint8Array(length)
  let offset = 0
  for (const chunk of chunks) {
    out.set(chunk, offset)
    offset += chunk.length
  }
  return out
}

function nodeCompressionRuntime(): compressionRuntime | null {
  const processObj = (globalThis as any).process
  if (processObj && typeof processObj.getBuiltinModule === 'function') {
    const mod = processObj.getBuiltinModule('zlib')
    if (mod && typeof mod.gzipSync === 'function') {
      return {
        gzipSync: (data, opts) => new Uint8Array(mod.gzipSync(data, opts)),
        gunzipSync: (data) => new Uint8Array(mod.gunzipSync(data)),
      }
    }
  }
  return null
}
