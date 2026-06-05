import * as $ from '@goscript/builtin/index.js'
import * as context from '@goscript/context/index.js'
import * as errors from '@goscript/errors/index.js'
import * as io from '@goscript/io/index.js'

class traceContextKey {}

const traceState = {
  nextTaskID: 0,
}

const unsupportedTraceError = errors.New(
  'runtime/trace: execution tracing is unsupported in GoScript',
)

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

export function Log(
  _ctx: context.Context | null,
  category: string,
  message: string,
): void {
  void category
  void message
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
  return unsupportedTraceError
}

export function Stop(): void {}
