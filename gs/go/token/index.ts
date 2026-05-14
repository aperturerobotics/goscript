import * as $ from '@goscript/builtin/index.js'

export type Pos = number

export const NoPos: Pos = 0

export class Position {
  public get Filename(): string {
    return this._fields.Filename.value
  }

  public set Filename(value: string) {
    this._fields.Filename.value = value
  }

  public get Offset(): number {
    return this._fields.Offset.value
  }

  public set Offset(value: number) {
    this._fields.Offset.value = value
  }

  public get Line(): number {
    return this._fields.Line.value
  }

  public set Line(value: number) {
    this._fields.Line.value = value
  }

  public get Column(): number {
    return this._fields.Column.value
  }

  public set Column(value: number) {
    this._fields.Column.value = value
  }

  public _fields: {
    Filename: $.VarRef<string>
    Offset: $.VarRef<number>
    Line: $.VarRef<number>
    Column: $.VarRef<number>
  }

  constructor(
    init?: Partial<{
      Filename: string
      Offset: number
      Line: number
      Column: number
    }>,
  ) {
    this._fields = {
      Filename: $.varRef(init?.Filename ?? ''),
      Offset: $.varRef(init?.Offset ?? 0),
      Line: $.varRef(init?.Line ?? 0),
      Column: $.varRef(init?.Column ?? 0),
    }
  }

  public clone(): Position {
    return $.markAsStructValue(
      new Position({
        Filename: this.Filename,
        Offset: this.Offset,
        Line: this.Line,
        Column: this.Column,
      }),
    )
  }

  public IsValid(): boolean {
    return Position_IsValid(this)
  }

  public String(): string {
    return Position_String(this)
  }

  static __typeInfo = $.registerStructType(
    'go/token.Position',
    new Position(),
    [
      {
        name: 'IsValid',
        args: [],
        returns: [{ type: { kind: $.TypeKind.Basic, name: 'bool' } }],
      },
      {
        name: 'String',
        args: [],
        returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }],
      },
    ],
    Position,
    {
      Filename: { kind: $.TypeKind.Basic, name: 'string' },
      Offset: { kind: $.TypeKind.Basic, name: 'int' },
      Line: { kind: $.TypeKind.Basic, name: 'int' },
      Column: { kind: $.TypeKind.Basic, name: 'int' },
    },
  )
}

export function Position_IsValid(pos: Position): boolean {
  return pos.Line > 0
}

export function Position_String(pos: Position): string {
  if (!Position_IsValid(pos)) {
    return '-'
  }
  const filename = pos.Filename === '' ? '<input>' : pos.Filename
  if (pos.Column > 0) {
    return `${filename}:${pos.Line}:${pos.Column}`
  }
  return `${filename}:${pos.Line}`
}
