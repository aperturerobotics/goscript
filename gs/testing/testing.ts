import { mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export type TestFunc = (t: T) => void | Promise<void>
export type TB = T | B | F

export type TestCase = {
  name: string
  fn: TestFunc
}

export type RunOptions = {
  verbose?: boolean
  count?: number
  short?: boolean
}

export type RunResult = {
  ok: boolean
  failed: number
  skipped: number
}

class TestControl extends Error {
  public readonly kind: 'fatal' | 'skip'

  constructor(kind: 'fatal' | 'skip', message: string) {
    super(message)
    this.kind = kind
  }
}

let shortMode = false

export class T {
  private readonly testName: string
  private failed = false
  private skipped = false
  private logs: string[] = []
  private cleanups: (() => void | Promise<void>)[] = []
  private tempDirs: string[] = []

  constructor(name: string) {
    this.testName = name
  }

  public Name(): string {
    return this.testName
  }

  public Fail(): void {
    this.failed = true
  }

  public FailNow(): never {
    this.failed = true
    throw new TestControl('fatal', 'test failed')
  }

  public Failed(): boolean {
    return this.failed
  }

  public Error(...args: unknown[]): void {
    this.Log(...args)
    this.Fail()
  }

  public Errorf(format: string, ...args: unknown[]): void {
    this.Log(formatMessage(format, args))
    this.Fail()
  }

  public Fatal(...args: unknown[]): never {
    this.Log(...args)
    this.FailNow()
  }

  public Fatalf(format: string, ...args: unknown[]): never {
    this.Log(formatMessage(format, args))
    this.FailNow()
  }

  public Log(...args: unknown[]): void {
    this.logs.push(args.map(formatValue).join(' '))
  }

  public Logf(format: string, ...args: unknown[]): void {
    this.logs.push(formatMessage(format, args))
  }

  public Skip(...args: unknown[]): never {
    this.Log(...args)
    this.SkipNow()
  }

  public Skipf(format: string, ...args: unknown[]): never {
    this.Log(formatMessage(format, args))
    this.SkipNow()
  }

  public SkipNow(): never {
    this.skipped = true
    throw new TestControl('skip', 'test skipped')
  }

  public Skipped(): boolean {
    return this.skipped
  }

  public Helper(): void {}

  public Cleanup(fn: () => void | Promise<void>): void {
    this.cleanups.push(fn)
  }

  public async Run(name: string, fn: TestFunc): Promise<boolean> {
    const child = new T(this.testName + '/' + name)
    try {
      await fn(child)
    } catch (err) {
      if (err instanceof TestControl && err.kind === 'skip') {
        // A skipped subtest is still a successful Run result.
      } else {
        child.Fail()
        if (!(err instanceof TestControl)) {
          child.Log(formatValue(err))
        }
      }
    }
    try {
      await child.runCleanups()
    } catch (err) {
      child.Fail()
      if (!(err instanceof TestControl)) {
        child.Log(formatValue(err))
      }
    }
    if (child.Failed()) {
      this.Fail()
      child.flushLogs()
      return false
    }
    return true
  }

  public TempDir(): string {
    const path = join(
      tmpdir(),
      'goscript-test-' +
        this.testName.replace(/[^A-Za-z0-9_.-]/g, '_') +
        '-' +
        String(this.tempDirs.length),
    )
    mkdirSync(path, { recursive: true })
    this.tempDirs.push(path)
    return path
  }

  public Parallel(): void {
  }

  public Setenv(key: string, value: string): void {
    const proc = (globalThis as any).process as
      | { env?: Record<string, string | undefined> }
      | undefined
    const env = proc?.env
    if (env === undefined) {
      return
    }
    const oldValue = env[key]
    env[key] = value
    this.Cleanup(() => {
      if (oldValue === undefined) {
        delete env[key]
        return
      }
      env[key] = oldValue
    })
  }

  public Chdir(dir: string): void {
    const proc = (globalThis as any).process as
      | { cwd?: () => string; chdir?: (dir: string) => void }
      | undefined
    if (proc?.cwd === undefined || proc.chdir === undefined) {
      return
    }
    const oldDir = proc.cwd()
    proc.chdir(dir)
    this.Cleanup(() => {
      proc.chdir!(oldDir)
    })
  }

  public ArtifactDir(): string {
    return this.TempDir()
  }

  public Attr(_key: string, _value: string): void {}

  public Context(): null {
    return null
  }

  public Output(): null {
    return null
  }

  public private(): void {}

  public async runCleanups(): Promise<void> {
    for (let i = this.cleanups.length - 1; i >= 0; i--) {
      await this.cleanups[i]()
    }
  }

  public flushLogs(): void {
    for (const line of this.logs) {
      console.log('    ' + line)
    }
  }
}

export class B extends T {
  public N = 1

  constructor(name = 'Benchmark') {
    super(name)
  }

  public async Run(
    name: string,
    fn: (b: B) => void | Promise<void>,
  ): Promise<boolean> {
    const child = new B(this.Name() + '/' + name)
    child.N = this.N
    try {
      await fn(child)
    } catch (err) {
      child.Error(err)
    }
    if (child.Failed()) {
      this.Fail()
      return false
    }
    return true
  }

  public StartTimer(): void {}

  public StopTimer(): void {}

  public ResetTimer(): void {}

  public ReportAllocs(): void {}

  public SetBytes(_bytes: number): void {}

  public ReportMetric(_n: number, _unit: string): void {}

  public RunParallel(_fn: (pb: PB) => void): void {}

  public Loop(): boolean {
    if (this.N > 0) {
      this.N--
      return true
    }
    return false
  }
}

export class F extends T {
  constructor(name = 'Fuzz') {
    super(name)
  }

  public Add(..._args: unknown[]): void {}

  public Fuzz(_fn: unknown): void {}
}

export class PB {
  private remaining = 1

  public Next(): boolean {
    if (this.remaining > 0) {
      this.remaining--
      return true
    }
    return false
  }
}

export function Short(): boolean {
  return shortMode
}

export async function runTests(
  packagePath: string,
  tests: TestCase[],
  options: RunOptions = {},
): Promise<RunResult> {
  const previousShortMode = shortMode
  shortMode = options.short ?? false
  const count = options.count ?? 1
  let failed = 0
  let skipped = 0
  try {
    for (let run = 0; run < count; run++) {
      for (const test of tests) {
        if (options.verbose) {
          console.log('=== RUN   ' + test.name)
        }
        const t = new T(test.name)
        const start = Date.now()
        try {
          await test.fn(t)
        } catch (err) {
          if (err instanceof TestControl && err.kind === 'skip') {
            skipped++
          } else {
            t.Fail()
            if (!(err instanceof TestControl)) {
              t.Log(formatValue(err))
            }
          }
        } finally {
          await t.runCleanups()
        }
        const elapsed = ((Date.now() - start) / 1000).toFixed(2)
        if (t.Skipped()) {
          if (options.verbose) {
            t.flushLogs()
          }
          console.log('--- SKIP: ' + test.name + ' (' + elapsed + 's)')
          continue
        }
        if (t.Failed()) {
          failed++
          t.flushLogs()
          console.log('--- FAIL: ' + test.name + ' (' + elapsed + 's)')
          continue
        }
        if (options.verbose) {
          t.flushLogs()
          console.log('--- PASS: ' + test.name + ' (' + elapsed + 's)')
        }
      }
    }
    if (failed === 0) {
      if (options.verbose) {
        console.log('PASS')
      }
      return { ok: true, failed, skipped }
    }
    console.log('FAIL\t' + packagePath)
    return { ok: false, failed, skipped }
  } finally {
    shortMode = previousShortMode
  }
}

function formatMessage(format: string, args: unknown[]): string {
  let index = 0
  return format.replace(/%#v|%q|%[vds]/g, (verb) => {
    const value = args[index++]
    if (verb === '%q') {
      return JSON.stringify(String(value))
    }
    return formatValue(value)
  })
}

function formatValue(value: unknown): string {
  if (value instanceof Error) {
    return value.message
  }
  if (
    value !== null &&
    typeof value === 'object' &&
    'Error' in value &&
    typeof value.Error === 'function'
  ) {
    return String(value.Error())
  }
  if (value === null) {
    return '<nil>'
  }
  return String(value)
}
