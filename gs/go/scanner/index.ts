import * as $ from '@goscript/builtin/index.js'
import * as token from '@goscript/go/token/index.js'
import type * as io from '@goscript/io/index.js'

export class Error {
  public get Pos(): token.Position {
    return this._fields.Pos.value
  }

  public set Pos(value: token.Position) {
    this._fields.Pos.value = value
  }

  public get Msg(): string {
    return this._fields.Msg.value
  }

  public set Msg(value: string) {
    this._fields.Msg.value = value
  }

  public _fields: {
    Pos: $.VarRef<token.Position>
    Msg: $.VarRef<string>
  }

  constructor(init?: Partial<{ Pos: token.Position; Msg: string }>) {
    this._fields = {
      Pos: $.varRef(init?.Pos ?? new token.Position()),
      Msg: $.varRef(init?.Msg ?? ''),
    }
  }

  public clone(): Error {
    return $.markAsStructValue(
      new Error({
        Pos: this.Pos.clone(),
        Msg: this.Msg,
      }),
    )
  }

  public Error(): string {
    return Error_Error(this)
  }

  static __typeInfo = $.registerStructType(
    'go/scanner.Error',
    new Error(),
    [
      {
        name: 'Error',
        args: [],
        returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }],
      },
    ],
    Error,
    {
      Pos: { type: 'go/token.Position' },
      Msg: { kind: $.TypeKind.Basic, name: 'string' },
    },
  )
}

export type ErrorList = $.Slice<Error | null>
export type ErrorHandler = (pos: token.Position, msg: string) => void
export type Mode = number

export const ScanComments = 1

export class Scanner {
  public ErrorCount = 0
  private file: token.File | null = null
  private src: $.Slice<number> = null
  private err: ErrorHandler | null = null
  private done = false

  public clone(): Scanner {
    const scanner = new Scanner()
    scanner.ErrorCount = this.ErrorCount
    scanner.file = this.file
    scanner.src = this.src
    scanner.err = this.err
    scanner.done = this.done
    return scanner
  }

  public Init(
    file: token.File | $.VarRef<token.File> | null,
    src: $.Slice<number>,
    err: ErrorHandler | null,
    _mode: Mode,
  ): void {
    this.file = file === null ? null : $.pointerValue<token.File>(file)
    this.src = src
    this.err = err
    this.done = false
  }

  public Scan(): [token.Pos, token.Token, string] {
    if (this.done) {
      return [this.file?.Pos($.len(this.src)) ?? token.NoPos, token.EOF, '']
    }
    this.done = true
    return [this.file?.Pos(0) ?? token.NoPos, token.EOF, '']
  }
}

export function Error_Error(err: Error): string {
  if (!err.Pos.IsValid()) {
    return err.Msg
  }
  return `${err.Pos.String()}: ${err.Msg}`
}

export function ErrorList_Add(
  list: $.VarRef<ErrorList>,
  pos: token.Position,
  msg: string,
): void {
  list.value = $.append(
    list.value,
    $.markAsStructValue(new Error({ Pos: pos, Msg: msg })),
  )
}

export function ErrorList_Len(list: ErrorList): number {
  return $.len(list)
}

export function ErrorList_Less(list: ErrorList, i: number, j: number): boolean {
  const left = list![i]!
  const right = list![j]!
  if (left.Pos.Filename !== right.Pos.Filename) {
    return left.Pos.Filename < right.Pos.Filename
  }
  if (left.Pos.Line !== right.Pos.Line) {
    return left.Pos.Line < right.Pos.Line
  }
  if (left.Pos.Column !== right.Pos.Column) {
    return left.Pos.Column < right.Pos.Column
  }
  return left.Msg < right.Msg
}

export function ErrorList_Swap(list: ErrorList, i: number, j: number): void {
  const first = list![i]
  list![i] = list![j]
  list![j] = first
}

export function ErrorList_Sort(list: ErrorList): void {
  list?.sort((left, right) => {
    if (left === null || right === null) {
      if (left === right) {
        return 0
      }
      if (left === null) {
        return -1
      }
      return 1
    }
    if (ErrorList_Less([left, right], 0, 1)) {
      return -1
    }
    if (ErrorList_Less([right, left], 0, 1)) {
      return 1
    }
    return 0
  })
}

export function ErrorList_RemoveMultiples(list: $.VarRef<ErrorList>): void {
  ErrorList_Sort(list.value)
  const seen = new Set<string>()
  list.value = $.asArray(list.value).filter((err) => {
    if (err === null) {
      return false
    }
    const key = `${err.Pos.Filename}:${err.Pos.Line}`
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

export function ErrorList_Error(list: ErrorList): string {
  const errors = $.asArray(list).filter((err) => err !== null)
  if (errors.length === 0) {
    return 'no errors'
  }
  if (errors.length === 1) {
    return errors[0]!.Error()
  }
  return `${errors[0]!.Error()} (and ${errors.length - 1} more errors)`
}

type errorListWithError = ErrorList & { Error?: () => string }

export function ErrorList_Err(list: ErrorList): $.GoError {
  if ($.len(list) === 0) {
    return null
  }
  const err = list as errorListWithError
  err.Error = () => ErrorList_Error(list)
  return err as unknown as $.GoError
}

export function PrintError(w: io.Writer, err: $.GoError): void {
  if (err === null) {
    return
  }
  if (Array.isArray(err)) {
    for (const entry of Array.from((err as ErrorList) ?? [])) {
      if (entry == null) {
        continue
      }
      w.Write($.stringToBytes(`${entry.Error()}\n`))
    }
    return
  }
  const text = err.Error()
  for (const line of text.split('\n')) {
    w.Write($.stringToBytes(line + '\n'))
  }
}
