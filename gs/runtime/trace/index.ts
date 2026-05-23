import * as $ from '@goscript/builtin/index.js'
import * as context from '@goscript/context/index.js'

class traceContextKey {}

const traceState = {
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

export function Log(_ctx: context.Context | null, _category: string, _message: string): void {}

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

export function Start(_w: unknown): $.GoError {
  return null
}

export function Stop(): void {}
