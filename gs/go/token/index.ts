import * as $ from '@goscript/builtin/index.js'

export type Token = number
export type Pos = number

export const ILLEGAL: Token = 0
export const EOF: Token = 1
export const COMMENT: Token = 2
const literal_beg: Token = 3
export const IDENT: Token = 4
export const INT: Token = 5
export const FLOAT: Token = 6
export const IMAG: Token = 7
export const CHAR: Token = 8
export const STRING: Token = 9
const literal_end: Token = 10
const operator_beg: Token = 11
export const ADD: Token = 12
export const SUB: Token = 13
export const MUL: Token = 14
export const QUO: Token = 15
export const REM: Token = 16
export const AND: Token = 17
export const OR: Token = 18
export const XOR: Token = 19
export const SHL: Token = 20
export const SHR: Token = 21
export const AND_NOT: Token = 22
export const ADD_ASSIGN: Token = 23
export const SUB_ASSIGN: Token = 24
export const MUL_ASSIGN: Token = 25
export const QUO_ASSIGN: Token = 26
export const REM_ASSIGN: Token = 27
export const AND_ASSIGN: Token = 28
export const OR_ASSIGN: Token = 29
export const XOR_ASSIGN: Token = 30
export const SHL_ASSIGN: Token = 31
export const SHR_ASSIGN: Token = 32
export const AND_NOT_ASSIGN: Token = 33
export const LAND: Token = 34
export const LOR: Token = 35
export const ARROW: Token = 36
export const INC: Token = 37
export const DEC: Token = 38
export const EQL: Token = 39
export const LSS: Token = 40
export const GTR: Token = 41
export const ASSIGN: Token = 42
export const NOT: Token = 43
export const NEQ: Token = 44
export const LEQ: Token = 45
export const GEQ: Token = 46
export const DEFINE: Token = 47
export const ELLIPSIS: Token = 48
export const LPAREN: Token = 49
export const LBRACK: Token = 50
export const LBRACE: Token = 51
export const COMMA: Token = 52
export const PERIOD: Token = 53
export const RPAREN: Token = 54
export const RBRACK: Token = 55
export const RBRACE: Token = 56
export const SEMICOLON: Token = 57
export const COLON: Token = 58
const operator_end: Token = 59
const keyword_beg: Token = 60
export const BREAK: Token = 61
export const CASE: Token = 62
export const CHAN: Token = 63
export const CONST: Token = 64
export const CONTINUE: Token = 65
export const DEFAULT: Token = 66
export const DEFER: Token = 67
export const ELSE: Token = 68
export const FALLTHROUGH: Token = 69
export const FOR: Token = 70
export const FUNC: Token = 71
export const GO: Token = 72
export const GOTO: Token = 73
export const IF: Token = 74
export const IMPORT: Token = 75
export const INTERFACE: Token = 76
export const MAP: Token = 77
export const PACKAGE: Token = 78
export const RANGE: Token = 79
export const RETURN: Token = 80
export const SELECT: Token = 81
export const STRUCT: Token = 82
export const SWITCH: Token = 83
export const TYPE: Token = 84
export const VAR: Token = 85
const keyword_end: Token = 86
export const TILDE: Token = 88

export const LowestPrec = 0
export const UnaryPrec = 6
export const HighestPrec = 7
export const NoPos: Pos = 0

const tokenStrings = new Map<Token, string>([
  [ILLEGAL, 'ILLEGAL'],
  [EOF, 'EOF'],
  [COMMENT, 'COMMENT'],
  [IDENT, 'IDENT'],
  [INT, 'INT'],
  [FLOAT, 'FLOAT'],
  [IMAG, 'IMAG'],
  [CHAR, 'CHAR'],
  [STRING, 'STRING'],
  [ADD, '+'],
  [SUB, '-'],
  [MUL, '*'],
  [QUO, '/'],
  [REM, '%'],
  [AND, '&'],
  [OR, '|'],
  [XOR, '^'],
  [SHL, '<<'],
  [SHR, '>>'],
  [AND_NOT, '&^'],
  [ADD_ASSIGN, '+='],
  [SUB_ASSIGN, '-='],
  [MUL_ASSIGN, '*='],
  [QUO_ASSIGN, '/='],
  [REM_ASSIGN, '%='],
  [AND_ASSIGN, '&='],
  [OR_ASSIGN, '|='],
  [XOR_ASSIGN, '^='],
  [SHL_ASSIGN, '<<='],
  [SHR_ASSIGN, '>>='],
  [AND_NOT_ASSIGN, '&^='],
  [LAND, '&&'],
  [LOR, '||'],
  [ARROW, '<-'],
  [INC, '++'],
  [DEC, '--'],
  [EQL, '=='],
  [LSS, '<'],
  [GTR, '>'],
  [ASSIGN, '='],
  [NOT, '!'],
  [NEQ, '!='],
  [LEQ, '<='],
  [GEQ, '>='],
  [DEFINE, ':='],
  [ELLIPSIS, '...'],
  [LPAREN, '('],
  [LBRACK, '['],
  [LBRACE, '{'],
  [COMMA, ','],
  [PERIOD, '.'],
  [RPAREN, ')'],
  [RBRACK, ']'],
  [RBRACE, '}'],
  [SEMICOLON, ';'],
  [COLON, ':'],
  [BREAK, 'break'],
  [CASE, 'case'],
  [CHAN, 'chan'],
  [CONST, 'const'],
  [CONTINUE, 'continue'],
  [DEFAULT, 'default'],
  [DEFER, 'defer'],
  [ELSE, 'else'],
  [FALLTHROUGH, 'fallthrough'],
  [FOR, 'for'],
  [FUNC, 'func'],
  [GO, 'go'],
  [GOTO, 'goto'],
  [IF, 'if'],
  [IMPORT, 'import'],
  [INTERFACE, 'interface'],
  [MAP, 'map'],
  [PACKAGE, 'package'],
  [RANGE, 'range'],
  [RETURN, 'return'],
  [SELECT, 'select'],
  [STRUCT, 'struct'],
  [SWITCH, 'switch'],
  [TYPE, 'type'],
  [VAR, 'var'],
  [TILDE, '~'],
])

const keywords = new Map<string, Token>()
for (let tok = keyword_beg + 1; tok < keyword_end; tok++) {
  keywords.set(tokenStrings.get(tok)!, tok)
}

type lineInfo = {
  Offset: number
  Filename: string
  Line: number
  Column: number
}

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
  let text = pos.Filename
  if (!Position_IsValid(pos)) {
    return text === '' ? '-' : text
  }
  if (text !== '') {
    text += ':'
  }
  text += `${pos.Line}`
  if (pos.Column > 0) {
    text += `:${pos.Column}`
  }
  return text
}

export class File {
  private nameValue: string
  private baseValue: number
  private sizeValue: number
  private linesValue: number[]
  private infosValue: lineInfo[]

  constructor(
    init?: Partial<{
      name: string
      base: number
      size: number
      lines: number[]
      infos: lineInfo[]
    }>,
  ) {
    this.nameValue = init?.name ?? ''
    this.baseValue = init?.base ?? 0
    this.sizeValue = init?.size ?? 0
    this.linesValue = init?.lines?.slice() ?? [0]
    this.infosValue = init?.infos?.slice() ?? []
  }

  public clone(): File {
    return new File({
      name: this.nameValue,
      base: this.baseValue,
      size: this.sizeValue,
      lines: this.linesValue,
      infos: this.infosValue,
    })
  }

  public Name(): string {
    return this.nameValue
  }

  public Base(): number {
    return this.baseValue
  }

  public Size(): number {
    return this.sizeValue
  }

  public End(): Pos {
    return this.baseValue + this.sizeValue
  }

  public LineCount(): number {
    return this.linesValue.length
  }

  public AddLine(offset: number): void {
    const last = this.linesValue[this.linesValue.length - 1]
    if ((this.linesValue.length === 0 || last < offset) && offset < this.sizeValue) {
      this.linesValue.push(offset)
    }
  }

  public MergeLine(line: number): void {
    if (line < 1 || line >= this.linesValue.length) {
      $.panic(`invalid line number ${line}`)
    }
    this.linesValue.splice(line, 1)
  }

  public Lines(): $.Slice<number> {
    return $.arrayToSlice(this.linesValue.slice())
  }

  public SetLines(lines: $.Slice<number>): boolean {
    const next = $.asArray(lines)
    for (let i = 0; i < next.length; i++) {
      if ((i > 0 && next[i] <= next[i - 1]) || this.sizeValue <= next[i]) {
        return false
      }
    }
    this.linesValue = next.slice()
    return true
  }

  public SetLinesForContent(content: $.Slice<number>): void {
    const lines: number[] = []
    let line = 0
    for (let offset = 0; offset < $.len(content); offset++) {
      if (line >= 0) {
        lines.push(line)
      }
      line = -1
      if (content![offset] === 10) {
        line = offset + 1
      }
    }
    this.linesValue = lines
  }

  public LineStart(line: number): Pos {
    if (line < 1 || line > this.linesValue.length) {
      $.panic(`invalid line number ${line}`)
    }
    return this.baseValue + this.linesValue[line - 1]
  }

  public AddLineInfo(offset: number, filename: string, line: number): void {
    this.AddLineColumnInfo(offset, filename, line, 1)
  }

  public AddLineColumnInfo(
    offset: number,
    filename: string,
    line: number,
    column: number,
  ): void {
    const last = this.infosValue[this.infosValue.length - 1]
    if ((this.infosValue.length === 0 || last.Offset < offset) && offset < this.sizeValue) {
      this.infosValue.push({ Offset: offset, Filename: filename, Line: line, Column: column })
    }
  }

  public Pos(offset: number): Pos {
    return this.baseValue + this.fixOffset(offset)
  }

  public Offset(pos: Pos): number {
    return this.fixOffset(pos - this.baseValue)
  }

  public Line(pos: Pos): number {
    return this.Position(pos).Line
  }

  public PositionFor(pos: Pos, adjusted: boolean): Position {
    if (pos === NoPos) {
      return new Position()
    }
    return this.position(pos, adjusted)
  }

  public Position(pos: Pos): Position {
    return this.PositionFor(pos, true)
  }

  private fixOffset(offset: number): number {
    if (offset < 0) {
      return 0
    }
    if (offset > this.sizeValue) {
      return this.sizeValue
    }
    return offset
  }

  private position(pos: Pos, adjusted: boolean): Position {
    const offset = this.fixOffset(pos - this.baseValue)
    let filename = this.nameValue
    let line = 0
    let column = 0
    const lineIndex = searchInts(this.linesValue, offset)
    if (lineIndex >= 0) {
      line = lineIndex + 1
      column = offset - this.linesValue[lineIndex] + 1
    }
    if (adjusted && this.infosValue.length > 0) {
      const infoIndex = searchLineInfos(this.infosValue, offset)
      if (infoIndex >= 0) {
        const info = this.infosValue[infoIndex]
        filename = info.Filename
        const baseLineIndex = searchInts(this.linesValue, info.Offset)
        if (baseLineIndex >= 0) {
          const delta = line - (baseLineIndex + 1)
          line = info.Line + delta
          if (info.Column === 0) {
            column = 0
          } else if (delta === 0) {
            column = info.Column + (offset - info.Offset)
          }
        }
      }
    }
    return $.markAsStructValue(
      new Position({
        Filename: filename,
        Offset: offset,
        Line: line,
        Column: column,
      }),
    )
  }
}

export class FileSet {
  private baseValue: number
  private files: File[]

  constructor(init?: Partial<{ base: number; files: File[] }>) {
    this.baseValue = init?.base ?? 1
    this.files = init?.files?.slice() ?? []
  }

  public clone(): FileSet {
    return new FileSet({
      base: this.baseValue,
      files: this.files,
    })
  }

  public Base(): number {
    return this.baseValue
  }

  public AddFile(filename: string, base: number, size: number): File {
    if (base < 0) {
      base = this.baseValue
    }
    if (base < this.baseValue) {
      $.panic(`invalid base ${base}`)
    }
    if (size < 0) {
      $.panic(`invalid size ${size}`)
    }
    const file = new File({ name: filename, base, size })
    this.files.push(file)
    this.files.sort((left, right) => left.Base() - right.Base())
    this.baseValue = base + size + 1
    return file
  }

  public AddExistingFiles(...files: File[]): void {
    for (const file of files) {
      if (file != null && !this.files.includes(file)) {
        this.files.push(file)
        this.baseValue = Math.max(this.baseValue, file.Base() + file.Size() + 1)
      }
    }
    this.files.sort((left, right) => left.Base() - right.Base())
  }

  public RemoveFile(file: File): void {
    this.files = this.files.filter((candidate) => candidate !== file)
  }

  public Iterate(yieldFile: (file: File) => boolean): void {
    for (const file of this.files.slice()) {
      if (!yieldFile(file)) {
        return
      }
    }
  }

  public File(pos: Pos): File | null {
    if (pos === NoPos) {
      return null
    }
    return this.files.find((file) => file.Base() <= pos && pos <= file.End()) ?? null
  }

  public PositionFor(pos: Pos, adjusted: boolean): Position {
    const file = this.File(pos)
    if (file === null) {
      return new Position()
    }
    return file.PositionFor(pos, adjusted)
  }

  public Position(pos: Pos): Position {
    return this.PositionFor(pos, true)
  }
}

export function NewFileSet(): FileSet {
  return new FileSet()
}

export function Pos_IsValid(pos: Pos): boolean {
  return pos !== NoPos
}

export function Token_String(tok: Token): string {
  return tokenStrings.get(tok) ?? `token(${tok})`
}

export function Token_Precedence(tok: Token): number {
  switch (tok) {
    case LOR:
      return 1
    case LAND:
      return 2
    case EQL:
    case NEQ:
    case LSS:
    case LEQ:
    case GTR:
    case GEQ:
      return 3
    case ADD:
    case SUB:
    case OR:
    case XOR:
      return 4
    case MUL:
    case QUO:
    case REM:
    case SHL:
    case SHR:
    case AND:
    case AND_NOT:
      return 5
    default:
      return LowestPrec
  }
}

export function Token_IsLiteral(tok: Token): boolean {
  return literal_beg < tok && tok < literal_end
}

export function Token_IsOperator(tok: Token): boolean {
  return (operator_beg < tok && tok < operator_end) || tok === TILDE
}

export function Token_IsKeyword(tok: Token): boolean {
  return keyword_beg < tok && tok < keyword_end
}

export function Lookup(ident: string): Token {
  return keywords.get(ident) ?? IDENT
}

export function IsExported(name: string): boolean {
  return /^\p{Lu}/u.test(name)
}

export function IsKeyword(name: string): boolean {
  return keywords.has(name)
}

export function IsIdentifier(name: string): boolean {
  if (name === '' || IsKeyword(name)) {
    return false
  }
  return /^[$_\p{L}][$_\p{L}\p{N}]*$/u.test(name)
}

function searchInts(values: number[], offset: number): number {
  let low = 0
  let high = values.length
  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    if (values[mid] > offset) {
      high = mid
    } else {
      low = mid + 1
    }
  }
  return low - 1
}

function searchLineInfos(values: lineInfo[], offset: number): number {
  let low = 0
  let high = values.length
  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    if (values[mid].Offset > offset) {
      high = mid
    } else {
      low = mid + 1
    }
  }
  return low - 1
}
