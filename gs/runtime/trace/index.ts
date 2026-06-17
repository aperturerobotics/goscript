import * as $ from '@goscript/builtin/index.js'
import * as context from '@goscript/context/index.js'
import * as errors from '@goscript/errors/index.js'
import * as fmt from '@goscript/fmt/index.js'
import * as io from '@goscript/io/index.js'

// traceContextKey keys the active *Task stored in a context by NewTask.
class traceContextKey {}

// Go execution trace v2 event type codes (iota order from the runtime spec).
// GoScript emits only the user-task subset plus the minimal proc/goroutine
// status needed for the upstream trace reader to bind a running context.
const evEventBatch = 1
const evStrings = 4
const evString = 5
const evFrequency = 8
const evProcStatus = 13
const evGoStatus = 25
const evUserTaskBegin = 40
const evUserTaskEnd = 41
const evUserRegionBegin = 42
const evUserRegionEnd = 43
const evUserLog = 44

// procRunning and goRunning are the running status codes for the synthetic P
// and G that own every GoScript user event (GoScript has no real scheduler).
const procRunning = 1
const goRunning = 2

// traceGen, traceProc, and traceGoroutine are the fixed generation, P, and G
// identities for the single synthetic GoScript execution context.
const traceGen = 1
const traceMID = 0
const traceProc = 0
const traceGoroutine = 1

// traceFreqHz is the timestamp frequency reported to the reader. GoScript
// records nanosecond timestamps, so the frequency is one billion ticks/sec
// and the reader's tick->nanosecond conversion is the identity.
const traceFreqHz = 1_000_000_000

// maxBatchData bounds the post-header data block of every per-M batch. The
// trace v2 reader rejects any batch whose declared size exceeds 64 KiB
// (tracev2.MaxBatchSize = 64<<10), so a realistic capture must split its string
// and event records across multiple batches. The cap sits below the hard limit
// to leave margin for the next record, which is written in full before the size
// is rechecked.
const maxBatchData = 60 * 1024

// maxEventBytes is a safe upper bound on the encoded size of one user event
// (kind byte plus a handful of base-128 varints; strings are interned, so no
// inline payload). The event loop flushes the current batch before its data
// block can grow within this margin of maxBatchData.
const maxEventBytes = 128

// recEvent kinds.
const kindTaskBegin = 0
const kindTaskEnd = 1
const kindRegionBegin = 2
const kindRegionEnd = 3
const kindLog = 4

// recEvent is one buffered user trace event with its monotonic timestamp.
interface recEvent {
  kind: number
  ts: number
  task: number
  parent: number
  s0: string
  s1: string
}

// recorder buffers user trace events between Start and Stop. GoScript has no
// streaming runtime, so events accumulate in memory and the full trace v2 byte
// stream is written to the output writer on Stop.
interface recorder {
  enabled: boolean
  writer: io.Writer | null
  startTs: number
  events: recEvent[]
}

function newRecorder(): recorder {
  return { enabled: false, writer: null, startTs: 0, events: [] }
}

// rec is the active capture. nextTaskID is process-global and monotonic like
// the Go runtime task counter, so it persists across Start/Stop cycles.
let rec = newRecorder()
let nextTaskID = 0

// nowNs reads the high-resolution monotonic clock in nanoseconds, the same
// source that backs time.Time monotonic readings.
function nowNs(): number {
  if (typeof performance !== 'undefined' && performance.now) {
    return performance.now() * 1_000_000
  }
  return globalThis.Date.now() * 1_000_000
}

function contextKey(): any {
  return $.interfaceValue(
    $.markAsStructValue(new traceContextKey()),
    'trace.traceContextKey',
  )
}

// taskIDFromContext returns the active task ID carried by ctx, or 0 when ctx
// carries no task (the background task).
function taskIDFromContext(ctx: context.Context | null): number {
  if (ctx == null) {
    return 0
  }
  const value = ctx.Value(contextKey())
  if (value instanceof Task) {
    return value.id
  }
  return 0
}

function record(
  kind: number,
  task: number,
  parent: number,
  s0: string,
  s1: string,
): void {
  rec.events.push({ kind, ts: nowNs(), task, parent, s0, s1 })
}

export class Task {
  public id: number

  constructor(id = 0) {
    this.id = id
  }

  public End(): void {
    if (rec.enabled) {
      record(kindTaskEnd, this.id, 0, '', '')
    }
  }
}

export class Region {
  private task: number
  private name: string

  constructor(task = 0, name = '') {
    this.task = task
    this.name = name
  }

  public End(): void {
    if (rec.enabled) {
      record(kindRegionEnd, this.task, 0, this.name, '')
    }
  }
}

export function NewTask(
  pctx: context.Context | null,
  taskType: string,
): [context.Context | null, Task] {
  const parent = pctx ?? context.Background()
  const task = new Task(++nextTaskID)
  if (rec.enabled) {
    record(kindTaskBegin, task.id, taskIDFromContext(pctx), taskType, '')
  }
  return [context.WithValue(parent, contextKey(), task), task]
}

export function Log(
  ctx: context.Context | null,
  category: string,
  message: string,
): void {
  if (rec.enabled) {
    record(kindLog, taskIDFromContext(ctx), 0, category, message)
  }
}

export function Logf(
  ctx: context.Context | null,
  category: string,
  format: string,
  ...args: unknown[]
): void {
  if (rec.enabled) {
    Log(ctx, category, fmt.Sprintf(format, ...(args as unknown[])))
  }
}

export function WithRegion(
  ctx: context.Context | null,
  regionType: string,
  fn: (() => void) | null,
): void {
  const task = taskIDFromContext(ctx)
  if (rec.enabled) {
    record(kindRegionBegin, task, 0, regionType, '')
  }
  try {
    fn?.()
  } finally {
    if (rec.enabled) {
      record(kindRegionEnd, task, 0, regionType, '')
    }
  }
}

export function StartRegion(
  ctx: context.Context | null,
  regionType: string,
): Region {
  const task = taskIDFromContext(ctx)
  if (rec.enabled) {
    record(kindRegionBegin, task, 0, regionType, '')
  }
  return new Region(task, regionType)
}

export function IsEnabled(): boolean {
  return rec.enabled
}

export function Start(w: io.Writer | $.VarRef<io.Writer> | null): $.GoError {
  const writer = $.pointerValueOrNil(w)
  if (writer == null) {
    return errors.New('runtime/trace: nil trace writer')
  }
  if (rec.enabled) {
    return errors.New('runtime/trace: tracing already enabled')
  }
  rec = newRecorder()
  rec.enabled = true
  rec.writer = writer
  rec.startTs = nowNs()
  return null
}

export function Stop(): void {
  if (!rec.enabled) {
    return
  }
  const writer = rec.writer
  const buffered = rec
  rec = newRecorder()
  const payload = encodeTrace(buffered)
  if (writer != null) {
    writer.Write(payload)
  }
}

// putUvarint appends value to out as a base-128 varint. It uses arithmetic
// rather than bit operations so values above 2^32 (nanosecond timestamps)
// encode correctly.
function putUvarint(out: number[], value: number): void {
  let v = Math.floor(value)
  if (v < 0) {
    v = 0
  }
  while (v >= 0x80) {
    out.push((v % 0x80) + 0x80)
    v = Math.floor(v / 0x80)
  }
  out.push(v)
}

function utf8Bytes(s: string): Uint8Array {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(s)
  }
  const out = new Uint8Array(s.length)
  for (let i = 0; i < s.length; i++) {
    out[i] = s.charCodeAt(i) & 0xff
  }
  return out
}

// appendBatch frames data as a trace v2 per-M batch (EvEventBatch header plus
// the generation, M, base timestamp, and length prefix).
function appendBatch(out: number[], data: number[]): void {
  out.push(evEventBatch)
  putUvarint(out, traceGen)
  putUvarint(out, traceMID)
  putUvarint(out, 0)
  putUvarint(out, data.length)
  for (const b of data) {
    out.push(b)
  }
}

// encodeTrace serializes the buffered user events as a single-generation Go
// trace v2 byte stream containing only the user-task subset.
function encodeTrace(r: recorder): Uint8Array {
  const out: number[] = []

  // Header: "go 1.22 trace\x00\x00\x00". The reader selects the Go 1.22 event
  // table, whose final event is EvUserLog, covering every event GoScript emits.
  const header = 'go 1.22 trace\x00\x00\x00'
  for (let i = 0; i < header.length; i++) {
    out.push(header.charCodeAt(i) & 0xff)
  }

  // Frequency batch (required): ticks per second.
  const freq: number[] = [evFrequency]
  putUvarint(freq, traceFreqHz)
  appendBatch(out, freq)

  // Intern the strings referenced by user events.
  const stringIDs = new Map<string, number>()
  const internedStrings: string[] = []
  const intern = (s: string): number => {
    let id = stringIDs.get(s)
    if (id === undefined) {
      id = internedStrings.length + 1
      stringIDs.set(s, id)
      internedStrings.push(s)
    }
    return id
  }
  for (const ev of r.events) {
    if (
      ev.kind === kindTaskBegin ||
      ev.kind === kindRegionBegin ||
      ev.kind === kindRegionEnd
    ) {
      intern(ev.s0)
    } else if (ev.kind === kindLog) {
      intern(ev.s0)
      intern(ev.s1)
    }
  }

  // Strings batches. The reader concatenates the string dictionary across every
  // EvStrings batch in the generation, so a large table splits into multiple
  // batches whose data blocks each stay under maxBatchData. Each EvString record
  // (tag, id, length, bytes) stays whole within one batch.
  if (internedStrings.length > 0) {
    let strings: number[] = [evStrings]
    for (let i = 0; i < internedStrings.length; i++) {
      const bytes = utf8Bytes(internedStrings[i])
      const recordSize = 1 + 10 + 10 + bytes.length
      if (strings.length > 1 && strings.length + recordSize > maxBatchData) {
        appendBatch(out, strings)
        strings = [evStrings]
      }
      strings.push(evString)
      putUvarint(strings, i + 1)
      putUvarint(strings, bytes.length)
      for (const b of bytes) {
        strings.push(b)
      }
    }
    appendBatch(out, strings)
  }

  // Event batches: synthetic running P and G, then any user events in order. The
  // running context is emitted even with no user events, so every capture is a
  // complete single-generation trace the reader accepts rather than a bare
  // header plus frequency batch. User events split across multiple per-M batches
  // so no data block exceeds maxBatchData. The reader resets its delta clock to
  // each batch's base timestamp (0 here), so flushing resets lastTs to 0 and the
  // first event of every batch re-emits its absolute offset as the delta.
  let data: number[] = []
  let lastTs = 0
  const emitDelta = (ts: number): void => {
    const offset = Math.max(0, Math.floor(ts - r.startTs))
    const dt = Math.max(0, offset - lastTs)
    lastTs = offset
    putUvarint(data, dt)
  }
  const flushEventBatch = (): void => {
    appendBatch(out, data)
    data = []
    lastTs = 0
  }

  // EvProcStatus(dt, p, status): bind the running P to the context.
  data.push(evProcStatus)
  putUvarint(data, 0)
  putUvarint(data, traceProc)
  putUvarint(data, procRunning)

  // EvGoStatus(dt, g, m, status): bind the running G to the context.
  data.push(evGoStatus)
  putUvarint(data, 0)
  putUvarint(data, traceGoroutine)
  putUvarint(data, traceMID)
  putUvarint(data, goRunning)

  for (const ev of r.events) {
    if (data.length + maxEventBytes > maxBatchData) {
      flushEventBatch()
    }
    switch (ev.kind) {
      case kindTaskBegin:
        data.push(evUserTaskBegin)
        emitDelta(ev.ts)
        putUvarint(data, ev.task)
        putUvarint(data, ev.parent)
        putUvarint(data, intern(ev.s0))
        putUvarint(data, 0)
        break
      case kindTaskEnd:
        data.push(evUserTaskEnd)
        emitDelta(ev.ts)
        putUvarint(data, ev.task)
        putUvarint(data, 0)
        break
      case kindRegionBegin:
        data.push(evUserRegionBegin)
        emitDelta(ev.ts)
        putUvarint(data, ev.task)
        putUvarint(data, intern(ev.s0))
        putUvarint(data, 0)
        break
      case kindRegionEnd:
        data.push(evUserRegionEnd)
        emitDelta(ev.ts)
        putUvarint(data, ev.task)
        putUvarint(data, intern(ev.s0))
        putUvarint(data, 0)
        break
      case kindLog:
        data.push(evUserLog)
        emitDelta(ev.ts)
        putUvarint(data, ev.task)
        putUvarint(data, intern(ev.s0))
        putUvarint(data, intern(ev.s1))
        putUvarint(data, 0)
        break
    }
  }
  flushEventBatch()

  return new Uint8Array(out)
}
