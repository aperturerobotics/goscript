import * as $ from '@goscript/builtin/index.js'
import * as context from '@goscript/context/index.js'
import * as errors from '@goscript/errors/index.js'
import * as io from '@goscript/io/index.js'

class traceContextKey {}

const traceState = {
  activeWriter: null as io.Writer | null,
  nextTaskID: 0,
}

export class Task {
  public id: number

  constructor(id = 0) {
    this.id = id
  }

  public End(): void {}
}

export class Region {
  public End(): void {}
}

export function NewTask(
  pctx: context.Context | null,
  _taskType: string,
): [context.Context | null, Task] {
  const parent = pctx ?? context.Background()
  const task = new Task(++traceState.nextTaskID)
  return [
    context.WithValue(
      parent,
      $.interfaceValue(new traceContextKey(), 'trace.traceContextKey'),
      $.interfaceValue(task, '*trace.Task'),
    ),
    task,
  ]
}

export function Log(_ctx: context.Context | null, category: string, message: string): void {
  writeTrace(`log ${category} ${message}\n`)
}

export function Logf(
  _ctx: context.Context | null,
  _category: string,
  _format: string,
  ..._args: unknown[]
): void {}

export function WithRegion(
  _ctx: context.Context | null,
  _regionType: string,
  fn: (() => void) | null,
): void {
  fn?.()
}

export function StartRegion(
  _ctx: context.Context | null,
  _regionType: string,
): Region {
  return new Region()
}

export function IsEnabled(): boolean {
  return false
}

export function Start(w: io.Writer | $.VarRef<io.Writer> | null): $.GoError {
  const writer = $.pointerValueOrNil(w)
  if (writer == null) {
    return errors.New('runtime/trace: nil trace writer')
  }
  if (traceState.activeWriter != null) {
    return errors.New('runtime/trace: trace already active')
  }
  traceState.activeWriter = writer
  return writeTrace('goscript trace start\n')
}

export function Stop(): void {
  writeTrace('goscript trace stop\n')
  traceState.activeWriter = null
}

function writeTrace(text: string): $.GoError {
  const writer = traceState.activeWriter
  if (writer == null) {
    return null
  }
  const [, err] = writer.Write($.stringToBytes(text))
  return err
}
