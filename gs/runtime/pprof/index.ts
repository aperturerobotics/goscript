import * as $ from '@goscript/builtin/index.js'
import * as errors from '@goscript/errors/index.js'
import * as io from '@goscript/io/index.js'

type WriterArg = io.Writer | $.VarRef<io.Writer> | null | undefined

const unsupportedProfileError = errors.New(
  'runtime/pprof: profiles are unsupported in GoScript',
)

export class Profile {
  public name: string
  private values = new Map<unknown, true>()
  private builtIn: boolean

  constructor(name = '', builtIn = false) {
    this.name = name
    this.builtIn = builtIn
  }

  public Name(): string {
    return this.name
  }

  public Count(): number {
    return this.builtIn && this.name !== '' ? 1 : this.values.size
  }

  public Add(value: unknown, _skip: number): void {
    if (this.name === '') {
      throw new Error('pprof: use of uninitialized Profile')
    }
    if (this.builtIn) {
      throw new Error(`pprof: Add called on built-in Profile ${this.name}`)
    }
    if (this.values.has(value)) {
      throw new Error('pprof: Profile.Add of duplicate value')
    }
    this.values.set(value, true)
  }

  public Remove(value: unknown): void {
    this.values.delete(value)
  }

  public WriteTo(_w: WriterArg, _debug: number): $.GoError {
    return unsupportedProfileError
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
      return new Profile(name, true)
    default:
      return customProfiles.get(name) ?? null
  }
}

export function Profiles(): $.Slice<Profile | null> {
  return $.arrayToSlice([
    new Profile('allocs', true),
    new Profile('block', true),
    new Profile('goroutine', true),
    new Profile('heap', true),
    new Profile('mutex', true),
    new Profile('threadcreate', true),
    ...Array.from(customProfiles.values()),
  ])
}

export function NewProfile(name: string): Profile {
  if (name === '') {
    throw new Error('pprof: NewProfile with empty name')
  }
  if (Lookup(name) != null) {
    throw new Error(`pprof: NewProfile name already in use: ${name}`)
  }
  const profile = new Profile(name)
  customProfiles.set(name, profile)
  return profile
}

export function StartCPUProfile(w: WriterArg): $.GoError {
  const writer = writerFromArg(w)
  if (writer == null) {
    return errors.New('runtime/pprof: nil profile writer')
  }
  return unsupportedProfileError
}

export function StopCPUProfile(): void {}

export function WriteHeapProfile(w: WriterArg): $.GoError {
  if (writerFromArg(w) == null) {
    return errors.New('runtime/pprof: nil profile writer')
  }
  return unsupportedProfileError
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

const customProfiles = new Map<string, Profile>()
