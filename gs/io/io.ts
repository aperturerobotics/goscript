// Package io provides basic interfaces to I/O primitives.
// Its primary job is to wrap existing implementations of such primitives,
// such as those in package os, into shared public interfaces that abstract
// the functionality, plus some other related primitives.

import * as $ from '@goscript/builtin/index.js'

// Simple error implementation for io package
class IOError {
  constructor(private message: string) {}

  Error(): string {
    return this.message
  }

  toString(): string {
    return this.message
  }
}

function newError(message: string): $.GoError {
  return new IOError(message)
}

// Error variables
export const EOF = newError('EOF')
export const ErrClosedPipe = newError('io: read/write on closed pipe')
export const ErrNoProgress = newError(
  'multiple Read calls return no data or error',
)
export const ErrShortBuffer = newError('short buffer')
export const ErrShortWrite = newError('short write')
export const ErrUnexpectedEOF = newError('unexpected EOF')

// Seek whence values
export const SeekStart = 0 // seek relative to the origin of the file
export const SeekCurrent = 1 // seek relative to the current offset
export const SeekEnd = 2 // seek relative to the end

// Core interfaces

// Reader is the interface that wraps the basic Read method
export interface Reader {
  Read(p: $.Bytes): [number, $.GoError]
}

// Writer is the interface that wraps the basic Write method
export interface Writer {
  Write(p: $.Bytes): [number, $.GoError]
}

type ReaderLike = Reader | { Reader: Reader | null } | null
type WriterLike = Writer | { Writer: Writer | null } | null

// Closer is the interface that wraps the basic Close method
export interface Closer {
  Close(): $.GoError
}

// Seeker is the interface that wraps the basic Seek method
export interface Seeker {
  Seek(offset: bigint, whence: number): [bigint, $.GoError]
}

// Combined interfaces
export interface ReadWriter extends Reader, Writer {}
export interface ReadCloser extends Reader, Closer {}
export interface WriteCloser extends Writer, Closer {}
export interface ReadWriteCloser extends Reader, Writer, Closer {}
export interface ReadSeeker extends Reader, Seeker {}
export interface ReadSeekCloser extends Reader, Seeker, Closer {}
export interface WriteSeeker extends Writer, Seeker {}
export interface ReadWriteSeeker extends Reader, Writer, Seeker {}

class pipeState {
  private readerClosed = false
  private writerClosed = false
  private readerErr: $.GoError = null
  private writerErr: $.GoError = null
  private pendingReads: Array<{
    data: $.Bytes
    resolve: (result: [number, $.GoError]) => void
  }> = []
  private pendingWrites: Array<{
    data: Uint8Array
    offset: number
    resolve: (result: [number, $.GoError]) => void
  }> = []

  Read(p: $.Bytes): Promise<[number, $.GoError]> {
    return (async (): Promise<[number, $.GoError]> => {
      if (this.readerClosed) {
        return [0, this.readerErr ?? ErrClosedPipe]
      }
      if ($.len(p) === 0) {
        return [0, null]
      }
      if (this.pendingWrites.length > 0) {
        return this.consumeNextWrite(p)
      }
      if (this.writerClosed) {
        return [0, this.writerErr ?? EOF]
      }
      return await new Promise<[number, $.GoError]>((resolve) => {
        this.pendingReads.push({ data: p, resolve })
      })
    })()
  }

  Write(p: $.Bytes): Promise<[number, $.GoError]> {
    return (async (): Promise<[number, $.GoError]> => {
      if (this.writerClosed || this.readerClosed) {
        return [0, this.readerErr ?? ErrClosedPipe]
      }
      if ($.len(p) === 0) {
        return [0, null]
      }
      const data = new Uint8Array($.len(p))
      $.copy(data, p)
      return await new Promise<[number, $.GoError]>((resolve) => {
        this.pendingWrites.push({ data, offset: 0, resolve })
        this.drain()
      })
    })()
  }

  CloseReader(err: $.GoError): $.GoError {
    this.readerClosed = true
    this.readerErr = err
    this.resolvePendingReads(ErrClosedPipe)
    this.resolvePendingWrites(ErrClosedPipe)
    return null
  }

  CloseWriter(err: $.GoError): $.GoError {
    this.writerClosed = true
    this.writerErr = err
    if (this.pendingWrites.length === 0) {
      this.resolvePendingReads(err ?? EOF)
    }
    return null
  }

  private drain(): void {
    while (this.pendingWrites.length > 0 && this.pendingReads.length > 0) {
      if (this.readerClosed) {
        this.resolvePendingWrites(this.readerErr ?? ErrClosedPipe)
        return
      }
      const pending = this.pendingReads.shift()!
      pending.resolve(this.consumeNextWrite(pending.data))
    }
  }

  private consumeNextWrite(p: $.Bytes): [number, $.GoError] {
    const pending = this.pendingWrites[0]
    const n = Math.min($.len(p), pending.data.length - pending.offset)
    $.copy(p, pending.data.subarray(pending.offset, pending.offset + n))
    pending.offset += n
    if (pending.offset === pending.data.length) {
      this.pendingWrites.shift()
      pending.resolve([pending.data.length, null])
      if (this.writerClosed && this.pendingWrites.length === 0) {
        this.resolvePendingReads(this.writerErr ?? EOF)
      }
    }
    return [n, null]
  }

  private resolvePendingReads(err: $.GoError): void {
    while (this.pendingReads.length > 0) {
      this.pendingReads.shift()!.resolve([0, err])
    }
  }

  private resolvePendingWrites(err: $.GoError): void {
    while (this.pendingWrites.length > 0) {
      this.pendingWrites.shift()!.resolve([0, err])
    }
  }
}

// PipeReader is the read half of a pipe.
export class PipeReader implements Reader, Closer {
  constructor(private pipe: pipeState) {}

  Read(data: $.Bytes): [number, $.GoError] {
    return this.pipe.Read(data) as any
  }

  Close(): $.GoError {
    return this.CloseWithError(null)
  }

  CloseWithError(err: $.GoError): $.GoError {
    return this.pipe.CloseReader(err ?? ErrClosedPipe)
  }
}

// PipeWriter is the write half of a pipe.
export class PipeWriter implements Writer, Closer {
  constructor(private pipe: pipeState) {}

  Write(data: $.Bytes): [number, $.GoError] {
    return this.pipe.Write(data) as any
  }

  Close(): $.GoError {
    return this.CloseWithError(null)
  }

  CloseWithError(err: $.GoError): $.GoError {
    return this.pipe.CloseWriter(err ?? EOF)
  }
}

// Pipe creates a synchronous in-memory pipe.
export function Pipe(): [PipeReader, PipeWriter] {
  const pipe = new pipeState()
  return [new PipeReader(pipe), new PipeWriter(pipe)]
}

// ReaderAt is the interface that wraps the basic ReadAt method
export interface ReaderAt {
  ReadAt(p: $.Bytes, off: bigint): [number, $.GoError]
}

// WriterAt is the interface that wraps the basic WriteAt method
export interface WriterAt {
  WriteAt(p: $.Bytes, off: bigint): [number, $.GoError]
}

// ByteReader is the interface that wraps the ReadByte method
export interface ByteReader {
  ReadByte(): [number, $.GoError]
}

// ByteWriter is the interface that wraps the WriteByte method
export interface ByteWriter {
  WriteByte(c: number): $.GoError
}

// ByteScanner is the interface that adds the UnreadByte method to the basic ReadByte method
export interface ByteScanner extends ByteReader {
  UnreadByte(): $.GoError
}

// RuneReader is the interface that wraps the ReadRune method
export interface RuneReader {
  ReadRune(): [number, number, $.GoError]
}

// RuneScanner is the interface that adds the UnreadRune method to the basic ReadRune method
export interface RuneScanner extends RuneReader {
  UnreadRune(): $.GoError
}

// StringWriter is the interface that wraps the WriteString method
export interface StringWriter {
  WriteString(s: string): [number, $.GoError]
}

// WriterTo is the interface that wraps the WriteTo method
export interface WriterTo {
  WriteTo(w: Writer): [bigint, $.GoError]
}

// ReaderFrom is the interface that wraps the ReadFrom method
export interface ReaderFrom {
  ReadFrom(r: Reader): [bigint, $.GoError]
}

// Discard is a Writer on which all Write calls succeed without doing anything
class DiscardWriter implements Writer {
  Write(p: $.Bytes): [number, $.GoError] {
    return [$.len(p), null]
  }
}

export const Discard: Writer | null = new DiscardWriter()

// WriteString writes the contents of the string s to w, which accepts a slice of bytes
export async function WriteString(
  w: Writer,
  s: string,
): Promise<[number, $.GoError]> {
  // Check if w implements StringWriter interface
  if ('WriteString' in w && typeof (w as any).WriteString === 'function') {
    return await ((w as StringWriter).WriteString(s) as any)
  }

  // Convert string to bytes and write
  const bytes = new TextEncoder().encode(s)
  return await (w.Write(bytes) as any)
}

// LimitedReader reads from R but limits the amount of data returned to just N bytes
export class LimitedReader implements Reader {
  public R: Reader | null
  public N: bigint

  constructor(
    r?: Reader | { R?: Reader | null; N?: bigint } | null,
    n?: bigint,
  ) {
    if (r != null && typeof (r as { Read?: unknown }).Read !== 'function') {
      const init = r as { R?: Reader | null; N?: bigint }
      this.R = init.R ?? null
      this.N = init.N ?? 0n
      return
    }
    this.R = (r as Reader | null | undefined) ?? null
    this.N = n ?? 0n
  }

  Read(p: $.Bytes): [number, $.GoError] {
    return (async (): Promise<[number, $.GoError]> => {
      if (this.N <= 0n) {
        return [0, EOF]
      }
      if (this.R == null) {
        throw new Error('io.LimitedReader: nil reader')
      }

      let readBuf = p
      if ($.len(p) > Number(this.N)) {
        readBuf = $.goSlice(p, 0, Number(this.N))
      }

      const [n, err] = await (this.R.Read(readBuf) as any)
      this.N -= BigInt(n)
      return [n, err]
    })() as any
  }
}

// LimitReader returns a Reader that reads from r but stops with EOF after n bytes
export function LimitReader(r: Reader, n: bigint): Reader {
  return new LimitedReader(r, n)
}

// SectionReader implements Read, Seek, and ReadAt on a section of an underlying ReaderAt
export class SectionReader implements Reader, Seeker, ReaderAt {
  private r: ReaderAt
  private base: number
  private off: number
  private limit: number

  constructor(r: ReaderAt, off: bigint, n: bigint) {
    this.r = r
    this.base = Number(off)
    this.off = Number(off)
    this.limit = Number(off) + Number(n)
  }

  Read(p: $.Bytes): [number, $.GoError] {
    if (this.off >= this.limit) {
      return [0, EOF]
    }

    let max = this.limit - this.off
    if ($.len(p) > max) {
      p = $.goSlice(p, 0, max)
    }

    const res = this.r.ReadAt(p, BigInt(this.off)) as any
    if (res instanceof Promise) {
      return res.then(([n, err]: [number, $.GoError]) => {
        this.off += n
        return [n, err]
      }) as any
    }

    const [n, err] = res
    this.off += n
    return [n, err]
  }

  Seek(offset: bigint, whence: number): [bigint, $.GoError] {
    const offNum = Number(offset)
    let abs: number
    switch (whence) {
      case SeekStart:
        abs = this.base + offNum
        break
      case SeekCurrent:
        abs = this.off + offNum
        break
      case SeekEnd:
        abs = this.limit + offNum
        break
      default:
        return [0n, newError('io.SectionReader.Seek: invalid whence')]
    }

    if (abs < this.base) {
      return [0n, newError('io.SectionReader.Seek: negative position')]
    }

    this.off = abs
    return [BigInt(abs - this.base), null]
  }

  ReadAt(p: $.Bytes, off: bigint): [number, $.GoError] {
    let offNum = Number(off)
    if (offNum < 0 || offNum >= this.limit - this.base) {
      return [0, EOF]
    }

    offNum += this.base
    if (offNum + $.len(p) > this.limit) {
      p = $.goSlice(p, 0, this.limit - offNum)
      const res = this.r.ReadAt(p, BigInt(offNum)) as any
      if (res instanceof Promise) {
        return res.then(([n, err]: [number, $.GoError]) => {
          if (err === null) {
            return [n, EOF]
          }
          return [n, err]
        }) as any
      }
      const [n, err] = res
      if (err === null) {
        return [n, EOF]
      }
      return [n, err]
    }

    return this.r.ReadAt(p, BigInt(offNum))
  }

  Size(): bigint {
    return BigInt(this.limit - this.base)
  }
}

// NewSectionReader returns a SectionReader that reads from r starting at offset off and stops with EOF after n bytes
export function NewSectionReader(
  r: ReaderAt,
  off: bigint,
  n: bigint,
): SectionReader {
  return new SectionReader(r, off, n)
}

// OffsetWriter maps writes at offset base to offset base+off in the underlying writer
export class OffsetWriter implements Writer, WriterAt {
  private w: WriterAt
  private base: number
  private off: number

  constructor(w: WriterAt, off: bigint) {
    this.w = w
    this.base = Number(off)
    this.off = 0
  }

  Write(p: $.Bytes): [number, $.GoError] {
    const [n, err] = this.w.WriteAt(p, BigInt(this.base + this.off))
    this.off += n
    return [n, err]
  }

  WriteAt(p: $.Bytes, off: bigint): [number, $.GoError] {
    const offNum = Number(off)
    if (offNum < 0) {
      return [0, newError('io.OffsetWriter.WriteAt: negative offset')]
    }
    return this.w.WriteAt(p, BigInt(this.base + offNum))
  }

  Seek(offset: bigint, whence: number): [bigint, $.GoError] {
    const offNum = Number(offset)
    let abs: number
    switch (whence) {
      case SeekStart:
        abs = offNum
        break
      case SeekCurrent:
        abs = this.off + offNum
        break
      default:
        return [0n, newError('io.OffsetWriter.Seek: invalid whence')]
    }

    if (abs < 0) {
      return [0n, newError('io.OffsetWriter.Seek: negative position')]
    }

    this.off = abs
    return [BigInt(abs), null]
  }
}

// NewOffsetWriter returns an OffsetWriter that writes to w starting at offset off
export function NewOffsetWriter(w: WriterAt, off: bigint): OffsetWriter {
  return new OffsetWriter(w, off)
}

// Copy copies from src to dst until either EOF is reached on src or an error occurs
export async function Copy(
  dst: WriterLike,
  src: ReaderLike,
): Promise<[bigint, $.GoError]> {
  return await CopyBuffer(dst, src, null)
}

// CopyBuffer is identical to Copy except that it stages through the provided buffer
export async function CopyBuffer(
  dst: WriterLike,
  src: ReaderLike,
  buf: $.Bytes | null,
): Promise<[bigint, $.GoError]> {
  dst = unwrapWriter(dst)
  src = unwrapReader(src)
  if (dst === null || src === null) {
    return [0n, newError('io: copy with nil reader or writer')]
  }

  // If src implements WriterTo, use it
  if ('WriteTo' in src && typeof (src as any).WriteTo === 'function') {
    return await ((src as WriterTo).WriteTo(dst) as any)
  }

  // If dst implements ReaderFrom, use it
  if ('ReadFrom' in dst && typeof (dst as any).ReadFrom === 'function') {
    return await ((dst as ReaderFrom).ReadFrom(src) as any)
  }

  if (buf === null) {
    buf = $.makeSlice<number>(32 * 1024, undefined, 'byte') // 32KB default buffer
  }

  let written = 0n
  while (true) {
    const [nr, er] = await (src.Read(buf) as any)
    if (nr > 0) {
      const [nw, ew] = await (dst.Write($.goSlice(buf, 0, nr)) as any)
      if (nw < 0 || nr < nw) {
        if (ew === null) {
          return [written, ErrShortWrite]
        }
        return [written, ew]
      }
      written += BigInt(nw)
      if (ew !== null) {
        return [written, ew]
      }
      if (nr !== nw) {
        return [written, ErrShortWrite]
      }
    }
    if (er !== null) {
      if (er === EOF) {
        break
      }
      return [written, er]
    }
  }
  return [written, null]
}

function unwrapReader(src: ReaderLike): Reader | null {
  if (src == null) {
    return null
  }
  if ('Read' in src && typeof (src as any).Read === 'function') {
    return src as Reader
  }
  return (src as { Reader: Reader | null }).Reader
}

function unwrapWriter(dst: WriterLike): Writer | null {
  if (dst == null) {
    return null
  }
  if ('Write' in dst && typeof (dst as any).Write === 'function') {
    return dst as Writer
  }
  return (dst as { Writer: Writer | null }).Writer
}

// CopyN copies n bytes (or until an error) from src to dst
export async function CopyN(
  dst: Writer,
  src: Reader,
  n: bigint,
): Promise<[bigint, $.GoError]> {
  const [written, err] = await Copy(dst, LimitReader(src, n))
  if (written === n) {
    return [written, null]
  }
  if (written < n && err === null) {
    // src stopped early; must have been EOF
    return [written, EOF]
  }
  return [written, err]
}

// ReadAtLeast reads from r into buf until it has read at least min bytes
export async function ReadAtLeast(
  r: Reader,
  buf: $.Bytes,
  min: number,
): Promise<[number, $.GoError]> {
  if ($.len(buf) < min) {
    return [0, ErrShortBuffer]
  }

  let n = 0
  while (n < min) {
    const [nn, err] = await (r.Read($.goSlice(buf, n)) as any)
    n += nn
    if (err !== null) {
      if (err === EOF && n >= min) {
        return [n, null]
      }
      if (err === EOF && n === 0) {
        return [n, EOF]
      }
      if (err === EOF && n < min) {
        return [n, ErrUnexpectedEOF]
      }
      return [n, err]
    }
  }
  return [n, null]
}

// ReadFull reads exactly len(buf) bytes from r into buf
export async function ReadFull(
  r: Reader,
  buf: $.Bytes,
): Promise<[number, $.GoError]> {
  return await ReadAtLeast(r, buf, $.len(buf))
}

// ReadAll reads from r until an error or EOF and returns the data it read
export async function ReadAll(r: Reader): Promise<[$.Bytes, $.GoError]> {
  const chunks: $.Bytes[] = []
  let totalLength = 0
  const buf = $.makeSlice<number>(512, undefined, 'byte')

  while (true) {
    const [n, err] = await (r.Read(buf) as any)
    if (n > 0) {
      const chunk = $.makeSlice<number>(n, undefined, 'byte')
      $.copy(chunk, $.goSlice(buf, 0, n))
      chunks.push(chunk)
      totalLength += n
    }
    if (err !== null) {
      if (err === EOF) {
        break
      }
      return [$.makeSlice<number>(0, undefined, 'byte'), err]
    }
  }

  // Combine all chunks
  const result = $.makeSlice<number>(totalLength, undefined, 'byte')
  let offset = 0
  for (const chunk of chunks) {
    if (chunk instanceof Uint8Array) {
      // Handle Uint8Array chunks
      const resultSlice = $.goSlice(result, offset, offset + chunk.length)
      $.copy(resultSlice, chunk)
    } else {
      // Handle Slice<number> chunks
      const resultSlice = $.goSlice(result, offset, offset + $.len(chunk))
      $.copy(resultSlice, chunk)
    }
    offset += $.len(chunk)
  }

  return [result, null]
}

// NopCloser returns a ReadCloser with a no-op Close method wrapping the provided Reader r
export function NopCloser(r: Reader | null): ReadCloser {
  if (r == null) {
    return {
      Read: () => {
        throw new Error('nil Reader')
      },
      Close: () => null,
    }
  }
  return {
    Read: r.Read.bind(r),
    Close: () => null,
  }
}

// MultiReader returns a Reader that's the logical concatenation of the provided input readers
export function MultiReader(...readers: Reader[]): Reader {
  return new multiReader(readers.slice())
}

class multiReader implements Reader {
  private readers: Reader[]

  constructor(readers: Reader[]) {
    this.readers = readers
  }

  Read(p: $.Bytes): [number, $.GoError] {
    while (this.readers.length > 0) {
      if (this.readers.length === 1) {
        // Optimization for single reader
        const r = this.readers[0]
        const [n, err] = r.Read(p)
        if (err === EOF) {
          this.readers = []
        }
        return [n, err]
      }

      const [n, err] = this.readers[0].Read(p)
      if (err === EOF) {
        this.readers.shift() // Remove first reader
        continue
      }
      if (n > 0 || err !== EOF) {
        if (err === EOF && this.readers.length > 1) {
          // Don't return EOF if there are more readers
          return [n, null]
        }
        return [n, err]
      }
    }
    return [0, EOF]
  }
}

// MultiWriter creates a writer that duplicates its writes to all the provided writers
export function MultiWriter(...writers: (Writer | null)[]): Writer {
  return new multiWriter(writers.slice()) as any
}

class multiWriter {
  private writers: (Writer | null)[]

  constructor(writers: (Writer | null)[]) {
    this.writers = writers
  }

  async Write(p: $.Bytes): Promise<[number, $.GoError]> {
    for (const w of this.writers) {
      if (w == null) {
        throw new Error('io.MultiWriter: nil writer')
      }
      const [n, err] = await w.Write(p)
      if (err !== null) {
        return [n, err]
      }
      if (n !== $.len(p)) {
        return [n, ErrShortWrite]
      }
    }
    return [$.len(p), null]
  }
}

// TeeReader returns a Reader that writes to w what it reads from r
export function TeeReader(r: Reader | null, w: Writer | null): Reader {
  return new teeReader(r, w)
}

class teeReader implements Reader {
  private r: Reader | null
  private w: Writer | null

  constructor(r: Reader | null, w: Writer | null) {
    this.r = r
    this.w = w
  }

  Read(p: $.Bytes): [number, $.GoError] {
    return this.read(p) as any
  }

  private async read(p: $.Bytes): Promise<[number, $.GoError]> {
    if (this.r == null) {
      throw new Error('io.TeeReader: nil reader')
    }
    const [n, err] = await this.r.Read(p)
    if (n > 0) {
      if (this.w == null) {
        throw new Error('io.TeeReader: nil writer')
      }
      const [nw, ew] = await this.w.Write($.goSlice(p, 0, n))
      if (ew !== null) {
        return [n, ew]
      }
      if (nw !== n) {
        return [n, ErrShortWrite]
      }
    }
    return [n, err]
  }
}
