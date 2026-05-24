import * as $ from '@goscript/builtin/index.js'
import * as errors from '@goscript/errors/index.js'
import * as io from '@goscript/io/index.js'

type WriterArg = io.Writer | $.VarRef<io.Writer> | null | undefined

let activeCPUWriter: io.Writer | null = null

export class Profile {
  public name: string

  constructor(name = '') {
    this.name = name
  }

  public Name(): string {
    return this.name
  }

  public Count(): number {
    return this.name === '' ? 0 : 1
  }

  public WriteTo(w: WriterArg, debug: number): $.GoError {
    return writeProfile(w, `goscript pprof ${this.name} debug=${debug}\n`)
  }
}

export function Lookup(name: string): Profile | null {
  switch (name) {
    case 'heap':
    case 'allocs':
    case 'goroutine':
    case 'threadcreate':
    case 'block':
    case 'mutex':
      return new Profile(name)
    default:
      return null
  }
}

export function Profiles(): $.Slice<Profile | null> {
  return $.arrayToSlice([
    new Profile('allocs'),
    new Profile('block'),
    new Profile('goroutine'),
    new Profile('heap'),
    new Profile('mutex'),
    new Profile('threadcreate'),
  ])
}

export function StartCPUProfile(w: WriterArg): $.GoError {
  const writer = writerFromArg(w)
  if (writer == null) {
    return errors.New('runtime/pprof: nil profile writer')
  }
  if (activeCPUWriter != null) {
    return errors.New('runtime/pprof: CPU profiling already active')
  }
  activeCPUWriter = writer
  return writeProfile(writer, 'goscript cpu profile start\n')
}

export function StopCPUProfile(): void {
  if (activeCPUWriter != null) {
    writeProfile(activeCPUWriter, 'goscript cpu profile stop\n')
    activeCPUWriter = null
  }
}

export function SetGoroutineLabels(_ctx: unknown): void {}

export function Do(_ctx: unknown, _labels: unknown, fn: (() => void) | null): void {
  fn?.()
}

export function ForLabels(_ctx: unknown, _f: unknown): void {}

export function WithLabels(ctx: unknown, _labels: unknown): unknown {
  return ctx
}

export function Labels(...args: string[]): Map<string, string> {
  const labels = new Map<string, string>()
  for (let i = 0; i + 1 < args.length; i += 2) {
    labels.set(args[i], args[i + 1])
  }
  return labels
}

function writerFromArg(w: WriterArg): io.Writer | null {
  return $.pointerValueOrNil(w)
}

function writeProfile(w: WriterArg, text: string): $.GoError {
  const writer = writerFromArg(w)
  if (writer == null) {
    return errors.New('runtime/pprof: nil profile writer')
  }
  const [, err] = writer.Write($.stringToBytes(text))
  return err
}
