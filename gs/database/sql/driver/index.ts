import * as $ from '@goscript/builtin/index.js'
import * as context from '@goscript/context/index.js'
import * as time from '@goscript/time/index.js'

export type Value = any

export class NamedValue {
  public Name: string
  public Ordinal: number
  public Value: Value

  constructor(init?: Partial<{ Name: string; Ordinal: number; Value: Value }>) {
    this.Name = init?.Name ?? ''
    this.Ordinal = init?.Ordinal ?? 0
    this.Value = init?.Value ?? null
  }

  public clone(): NamedValue {
    return new NamedValue({
      Name: this.Name,
      Ordinal: this.Ordinal,
      Value: this.Value,
    })
  }
}

export interface Driver {
  Open(name: string): [Conn | null, $.GoError]
}

export interface DriverContext {
  OpenConnector(name: string): [Connector | null, $.GoError]
}

export interface Connector {
  Connect(ctx: context.Context | null): [Conn | null, $.GoError]
  Driver(): Driver | null
}

export const ErrSkip = $.newError(
  'driver: skip fast-path; continue as if unimplemented',
)
export const ErrBadConn = $.newError('driver: bad connection')

export interface Pinger {
  Ping(ctx: context.Context | null): $.GoError
}

export interface Execer {
  Exec(query: string, args: $.Slice<Value>): [Result | null, $.GoError]
}

export interface ExecerContext {
  ExecContext(
    ctx: context.Context | null,
    query: string,
    args: $.Slice<NamedValue>,
  ): [Result | null, $.GoError]
}

export interface Queryer {
  Query(query: string, args: $.Slice<Value>): [Rows | null, $.GoError]
}

export interface QueryerContext {
  QueryContext(
    ctx: context.Context | null,
    query: string,
    args: $.Slice<NamedValue>,
  ): [Rows | null, $.GoError]
}

export interface Conn {
  Prepare(query: string): [Stmt | null, $.GoError]
  Close(): $.GoError
  Begin(): [Tx | null, $.GoError]
}

export interface ConnPrepareContext {
  PrepareContext(
    ctx: context.Context | null,
    query: string,
  ): [Stmt | null, $.GoError]
}

export type IsolationLevel = number

export class TxOptions {
  public Isolation: IsolationLevel
  public ReadOnly: boolean

  constructor(
    init?: Partial<{ Isolation: IsolationLevel; ReadOnly: boolean }>,
  ) {
    this.Isolation = init?.Isolation ?? 0
    this.ReadOnly = init?.ReadOnly ?? false
  }

  public clone(): TxOptions {
    return new TxOptions({
      Isolation: this.Isolation,
      ReadOnly: this.ReadOnly,
    })
  }
}

export interface ConnBeginTx {
  BeginTx(ctx: context.Context | null, opts: TxOptions): [Tx | null, $.GoError]
}

export interface SessionResetter {
  ResetSession(ctx: context.Context | null): $.GoError
}

export interface Validator {
  IsValid(): boolean
}

export interface Result {
  LastInsertId(): [bigint, $.GoError]
  RowsAffected(): [bigint, $.GoError]
}

export interface Stmt {
  Close(): $.GoError
  NumInput(): number
  Exec(args: $.Slice<Value>): [Result | null, $.GoError]
  Query(args: $.Slice<Value>): [Rows | null, $.GoError]
}

export interface StmtExecContext {
  ExecContext(
    ctx: context.Context | null,
    args: $.Slice<NamedValue>,
  ): [Result | null, $.GoError]
}

export interface StmtQueryContext {
  QueryContext(
    ctx: context.Context | null,
    args: $.Slice<NamedValue>,
  ): [Rows | null, $.GoError]
}

export const ErrRemoveArgument = $.newError(
  'driver: remove argument from query',
)

export interface NamedValueChecker {
  CheckNamedValue(value: NamedValue | $.VarRef<NamedValue> | null): $.GoError
}

export interface ColumnConverter {
  ColumnConverter(idx: number): ValueConverter | null
}

export interface Rows {
  Columns(): $.Slice<string>
  Close(): $.GoError
  Next(dest: $.Slice<Value>): $.GoError
}

export interface RowsNextResultSet extends Rows {
  HasNextResultSet(): boolean
  NextResultSet(): $.GoError
}

export interface RowsColumnTypeScanType extends Rows {
  ColumnTypeScanType(index: number): unknown
}

export interface RowsColumnTypeDatabaseTypeName extends Rows {
  ColumnTypeDatabaseTypeName(index: number): string
}

export interface RowsColumnTypeLength extends Rows {
  ColumnTypeLength(index: number): [number, boolean]
}

export interface RowsColumnTypeNullable extends Rows {
  ColumnTypeNullable(index: number): [boolean, boolean]
}

export interface RowsColumnTypePrecisionScale extends Rows {
  ColumnTypePrecisionScale(index: number): [number, number, boolean]
}

export interface Tx {
  Commit(): $.GoError
  Rollback(): $.GoError
}

export type RowsAffected = bigint

export function RowsAffected_LastInsertId(
  _v: RowsAffected,
): [bigint, $.GoError] {
  return [0n, $.newError('LastInsertId is not supported by this driver')]
}

export function RowsAffected_RowsAffected(
  v: RowsAffected,
): [bigint, $.GoError] {
  return [v, null]
}

class noRows implements Result {
  public LastInsertId(): [bigint, $.GoError] {
    return [0n, $.newError('no LastInsertId available after DDL statement')]
  }

  public RowsAffected(): [bigint, $.GoError] {
    return [0n, $.newError('no RowsAffected available after DDL statement')]
  }
}

export const ResultNoRows: Result = new noRows()

export interface ValueConverter {
  ConvertValue(v: any): [Value, $.GoError]
}

export interface Valuer {
  Value(): [Value, $.GoError]
}

class boolType implements ValueConverter {
  public String(): string {
    return 'Bool'
  }

  public ConvertValue(src: any): [Value, $.GoError] {
    guardReflectValue('Bool.ConvertValue', src)
    if (typeof src === 'boolean') {
      return [src, null]
    }
    if (typeof src === 'string') {
      return parseBoolValue(src, JSON.stringify(src))
    }
    if (isBytes(src)) {
      const text = $.bytesToString(src)
      return parseBoolValue(text, JSON.stringify(text))
    }
    if (isIntegerLike(src)) {
      const value = toBigInt(src)
      if (value === 0n || value === 1n) {
        return [value === 1n, null]
      }
      return [
        null,
        $.newError(`sql/driver: couldn't convert ${value} into type bool`),
      ]
    }
    return [
      null,
      $.newError(
        `sql/driver: couldn't convert ${globalThis.String(src)} (${typeName(src)}) into type bool`,
      ),
    ]
  }
}

export const Bool = new boolType()

class int32Type implements ValueConverter {
  public ConvertValue(v: any): [Value, $.GoError] {
    guardReflectValue('Int32.ConvertValue', v)
    const [value, parseErr] = int32InputValue(v)
    if (parseErr !== null) {
      return [null, parseErr]
    }
    if (value == null) {
      return [
        null,
        $.newError(
          `sql/driver: unsupported value ${globalThis.String(v)} (${typeName(v)}) converting to int32`,
        ),
      ]
    }
    if (value > 2147483647n || value < -2147483648n) {
      return [
        null,
        $.newError(`sql/driver: value ${globalThis.String(v)} overflows int32`),
      ]
    }
    return [Number(value), null]
  }
}

export const Int32 = new int32Type()

class stringType implements ValueConverter {
  public ConvertValue(v: any): [Value, $.GoError] {
    guardReflectValue('String.ConvertValue', v)
    if (typeof v === 'string' || isBytes(v)) {
      return [v, null]
    }
    if (
      typeof v === 'number' ||
      typeof v === 'bigint' ||
      typeof v === 'boolean'
    ) {
      return [globalThis.String(v), null]
    }
    return [
      null,
      $.newError(
        `database/sql/driver: String.ConvertValue of ${typeName(v)} is not supported in the GoScript browser build`,
      ),
    ]
  }
}

export const String = new stringType()

export class Null implements ValueConverter {
  public Converter: ValueConverter | null

  constructor(init?: Partial<{ Converter: ValueConverter | null }>) {
    this.Converter = init?.Converter ?? null
  }

  public clone(): Null {
    return new Null({ Converter: this.Converter })
  }

  public ConvertValue(v: any): [Value, $.GoError] {
    if (v === null || v === undefined) {
      return [null, null]
    }
    return converterValue(this.Converter).ConvertValue(v)
  }
}

export class NotNull implements ValueConverter {
  public Converter: ValueConverter | null

  constructor(init?: Partial<{ Converter: ValueConverter | null }>) {
    this.Converter = init?.Converter ?? null
  }

  public clone(): NotNull {
    return new NotNull({ Converter: this.Converter })
  }

  public ConvertValue(v: any): [Value, $.GoError] {
    if (v === null || v === undefined) {
      return [null, $.newError('nil value not allowed')]
    }
    return converterValue(this.Converter).ConvertValue(v)
  }
}

class defaultConverter implements ValueConverter {
  public ConvertValue(v: any): [Value, $.GoError] {
    if (IsValue(v)) {
      return [v ?? null, null]
    }
    if (isValuer(v)) {
      const [sv, err] = callValuerValue(v)
      if (err !== null) {
        return [null, err]
      }
      if (!IsValue(sv)) {
        return [
          null,
          $.newError(`non-Value type ${typeName(sv)} returned from Value`),
        ]
      }
      return [sv, null]
    }
    if (isReflectPointer(v)) {
      unsupportedReflect('DefaultParameterConverter.ConvertValue', 'pointer')
    }
    if (isNamedValue(v)) {
      unsupportedReflect('DefaultParameterConverter.ConvertValue', 'named type')
    }
    return [
      null,
      $.newError(
        `database/sql/driver: DefaultParameterConverter.ConvertValue of ${typeName(v)} is not supported in the GoScript browser build`,
      ),
    ]
  }
}

export const DefaultParameterConverter = new defaultConverter()

function callValuerValue(vr: Valuer | null): [Value, $.GoError] {
  if (vr === null) {
    return [null, null]
  }
  return vr.Value()
}

export function IsValue(v: any): boolean {
  if (v === null || v === undefined) {
    return true
  }
  return (
    isBytes(v) ||
    typeof v === 'string' ||
    typeof v === 'boolean' ||
    typeof v === 'number' ||
    typeof v === 'bigint' ||
    v instanceof time.Time ||
    isDecimalDecompose(v)
  )
}

export function IsScanValue(v: any): boolean {
  return IsValue(v)
}

function converterValue(converter: ValueConverter | null): ValueConverter {
  if (converter === null) {
    throw new Error(
      'runtime error: invalid memory address or nil pointer dereference',
    )
  }
  return converter
}

function parseBoolValue(value: string, quoted: string): [Value, $.GoError] {
  switch (value) {
    case '1':
    case 't':
    case 'T':
    case 'TRUE':
    case 'true':
    case 'True':
      return [true, null]
    case '0':
    case 'f':
    case 'F':
    case 'FALSE':
    case 'false':
    case 'False':
      return [false, null]
    default:
      return [
        null,
        $.newError(`sql/driver: couldn't convert ${quoted} into type bool`),
      ]
  }
}

function isBytes(v: any): v is $.Bytes {
  return v instanceof Uint8Array
}

function isIntegerLike(v: any): boolean {
  return (
    typeof v === 'bigint' ||
    (typeof v === 'number' && Number.isFinite(v) && Number.isInteger(v))
  )
}

function toBigInt(v: number | bigint): bigint {
  if (typeof v === 'bigint') {
    return v
  }
  return BigInt(Math.trunc(v))
}

function int32InputValue(v: any): [bigint | null, $.GoError] {
  if (isIntegerLike(v)) {
    return [toBigInt(v), null]
  }
  if (typeof v !== 'string') {
    return [null, null]
  }
  if (!/^[+-]?\d+$/.test(v)) {
    return [
      null,
      $.newError(
        `sql/driver: value ${JSON.stringify(v)} can't be converted to int32`,
      ),
    ]
  }
  return [BigInt(v), null]
}

function isValuer(v: any): v is Valuer {
  return v !== null && typeof v === 'object' && typeof v.Value === 'function'
}

function isDecimalDecompose(v: any): boolean {
  return (
    v !== null && typeof v === 'object' && typeof v.Decompose === 'function'
  )
}

function isNamedValue(v: any): boolean {
  return v !== null && typeof v === 'object' && typeof v.__goType === 'string'
}

function isReflectPointer(v: any): boolean {
  return $.isVarRef(v) || (isNamedValue(v) && v.__goType.startsWith('*'))
}

function guardReflectValue(fn: string, v: any): void {
  if (isReflectPointer(v)) {
    unsupportedReflect(fn, 'pointer')
  }
  if (isNamedValue(v)) {
    unsupportedReflect(fn, 'named type')
  }
}

function unsupportedReflect(fn: string, kind: string): never {
  throw $.newError(
    `database/sql/driver: ${fn} of ${kind} is not supported in the GoScript browser build`,
  )
}

function typeName(v: any): string {
  if (v === null || v === undefined) {
    return '<nil>'
  }
  if (isNamedValue(v)) {
    return v.__goType
  }
  if ($.isVarRef(v)) {
    return 'pointer'
  }
  if (isBytes(v)) {
    return '[]uint8'
  }
  if (v instanceof time.Time) {
    return 'time.Time'
  }
  return typeof v
}

const anyType: $.InterfaceTypeInfo = {
  kind: $.TypeKind.Interface,
  methods: [],
}
const boolTypeInfo: $.BasicTypeInfo = { kind: $.TypeKind.Basic, name: 'bool' }
const intTypeInfo: $.BasicTypeInfo = { kind: $.TypeKind.Basic, name: 'int' }
const int64TypeInfo: $.BasicTypeInfo = { kind: $.TypeKind.Basic, name: 'int64' }
const stringTypeInfo: $.BasicTypeInfo = {
  kind: $.TypeKind.Basic,
  name: 'string',
}
const errorType = 'error'
const valueType = anyType
const valueSliceType: $.SliceTypeInfo = {
  kind: $.TypeKind.Slice,
  elemType: valueType,
}
const namedValueType = 'driver.NamedValue'
const namedValueSliceType: $.SliceTypeInfo = {
  kind: $.TypeKind.Slice,
  elemType: namedValueType,
}
const namedValuePointerType: $.PointerTypeInfo = {
  kind: $.TypeKind.Pointer,
  elemType: namedValueType,
}

function arg(name: string, type: $.TypeInfo | string): $.MethodArg {
  return { name, type }
}

function ret(name: string, type: $.TypeInfo | string): $.MethodArg {
  return { name, type }
}

const rowsMethods: $.MethodSignature[] = [
  { name: 'Close', args: [], returns: [ret('_r0', errorType)] },
  {
    name: 'Columns',
    args: [],
    returns: [ret('_r0', { kind: $.TypeKind.Slice, elemType: stringTypeInfo })],
  },
  {
    name: 'Next',
    args: [arg('dest', valueSliceType)],
    returns: [ret('_r0', errorType)],
  },
]

$.registerInterfaceType('driver.Driver', null, [
  {
    name: 'Open',
    args: [arg('name', stringTypeInfo)],
    returns: [ret('_r0', 'driver.Conn'), ret('_r1', errorType)],
  },
])

$.registerInterfaceType('driver.DriverContext', null, [
  {
    name: 'OpenConnector',
    args: [arg('name', stringTypeInfo)],
    returns: [ret('_r0', 'driver.Connector'), ret('_r1', errorType)],
  },
])

$.registerInterfaceType('driver.Connector', null, [
  {
    name: 'Connect',
    args: [arg('ctx', 'context.Context')],
    returns: [ret('_r0', 'driver.Conn'), ret('_r1', errorType)],
  },
  { name: 'Driver', args: [], returns: [ret('_r0', 'driver.Driver')] },
])

$.registerInterfaceType('driver.Pinger', null, [
  {
    name: 'Ping',
    args: [arg('ctx', 'context.Context')],
    returns: [ret('_r0', errorType)],
  },
])

$.registerInterfaceType('driver.Execer', null, [
  {
    name: 'Exec',
    args: [arg('query', stringTypeInfo), arg('args', valueSliceType)],
    returns: [ret('_r0', 'driver.Result'), ret('_r1', errorType)],
  },
])

$.registerInterfaceType('driver.ExecerContext', null, [
  {
    name: 'ExecContext',
    args: [
      arg('ctx', 'context.Context'),
      arg('query', stringTypeInfo),
      arg('args', namedValueSliceType),
    ],
    returns: [ret('_r0', 'driver.Result'), ret('_r1', errorType)],
  },
])

$.registerInterfaceType('driver.Queryer', null, [
  {
    name: 'Query',
    args: [arg('query', stringTypeInfo), arg('args', valueSliceType)],
    returns: [ret('_r0', 'driver.Rows'), ret('_r1', errorType)],
  },
])

$.registerInterfaceType('driver.QueryerContext', null, [
  {
    name: 'QueryContext',
    args: [
      arg('ctx', 'context.Context'),
      arg('query', stringTypeInfo),
      arg('args', namedValueSliceType),
    ],
    returns: [ret('_r0', 'driver.Rows'), ret('_r1', errorType)],
  },
])

$.registerInterfaceType('driver.Conn', null, [
  {
    name: 'Begin',
    args: [],
    returns: [ret('_r0', 'driver.Tx'), ret('_r1', errorType)],
  },
  { name: 'Close', args: [], returns: [ret('_r0', errorType)] },
  {
    name: 'Prepare',
    args: [arg('query', stringTypeInfo)],
    returns: [ret('_r0', 'driver.Stmt'), ret('_r1', errorType)],
  },
])

$.registerInterfaceType('driver.ConnPrepareContext', null, [
  {
    name: 'PrepareContext',
    args: [arg('ctx', 'context.Context'), arg('query', stringTypeInfo)],
    returns: [ret('_r0', 'driver.Stmt'), ret('_r1', errorType)],
  },
])

$.registerInterfaceType('driver.ConnBeginTx', null, [
  {
    name: 'BeginTx',
    args: [arg('ctx', 'context.Context'), arg('opts', 'driver.TxOptions')],
    returns: [ret('_r0', 'driver.Tx'), ret('_r1', errorType)],
  },
])

$.registerInterfaceType('driver.SessionResetter', null, [
  {
    name: 'ResetSession',
    args: [arg('ctx', 'context.Context')],
    returns: [ret('_r0', errorType)],
  },
])

$.registerInterfaceType('driver.Validator', null, [
  { name: 'IsValid', args: [], returns: [ret('_r0', boolTypeInfo)] },
])

$.registerInterfaceType('driver.Result', null, [
  {
    name: 'LastInsertId',
    args: [],
    returns: [ret('_r0', int64TypeInfo), ret('_r1', errorType)],
  },
  {
    name: 'RowsAffected',
    args: [],
    returns: [ret('_r0', int64TypeInfo), ret('_r1', errorType)],
  },
])

$.registerInterfaceType('driver.Stmt', null, [
  { name: 'Close', args: [], returns: [ret('_r0', errorType)] },
  {
    name: 'Exec',
    args: [arg('args', valueSliceType)],
    returns: [ret('_r0', 'driver.Result'), ret('_r1', errorType)],
  },
  { name: 'NumInput', args: [], returns: [ret('_r0', intTypeInfo)] },
  {
    name: 'Query',
    args: [arg('args', valueSliceType)],
    returns: [ret('_r0', 'driver.Rows'), ret('_r1', errorType)],
  },
])

$.registerInterfaceType('driver.StmtExecContext', null, [
  {
    name: 'ExecContext',
    args: [arg('ctx', 'context.Context'), arg('args', namedValueSliceType)],
    returns: [ret('_r0', 'driver.Result'), ret('_r1', errorType)],
  },
])

$.registerInterfaceType('driver.StmtQueryContext', null, [
  {
    name: 'QueryContext',
    args: [arg('ctx', 'context.Context'), arg('args', namedValueSliceType)],
    returns: [ret('_r0', 'driver.Rows'), ret('_r1', errorType)],
  },
])

$.registerInterfaceType('driver.NamedValueChecker', null, [
  {
    name: 'CheckNamedValue',
    args: [arg('_p0', namedValuePointerType)],
    returns: [ret('_r0', errorType)],
  },
])

$.registerInterfaceType('driver.ColumnConverter', null, [
  {
    name: 'ColumnConverter',
    args: [arg('idx', intTypeInfo)],
    returns: [ret('_r0', 'driver.ValueConverter')],
  },
])

$.registerInterfaceType('driver.Rows', null, rowsMethods)

$.registerInterfaceType('driver.RowsNextResultSet', null, [
  ...rowsMethods,
  { name: 'HasNextResultSet', args: [], returns: [ret('_r0', boolTypeInfo)] },
  { name: 'NextResultSet', args: [], returns: [ret('_r0', errorType)] },
])

$.registerInterfaceType('driver.RowsColumnTypeScanType', null, [
  ...rowsMethods,
  {
    name: 'ColumnTypeScanType',
    args: [arg('index', intTypeInfo)],
    returns: [ret('_r0', 'reflect.Type')],
  },
])

$.registerInterfaceType('driver.RowsColumnTypeDatabaseTypeName', null, [
  ...rowsMethods,
  {
    name: 'ColumnTypeDatabaseTypeName',
    args: [arg('index', intTypeInfo)],
    returns: [ret('_r0', stringTypeInfo)],
  },
])

$.registerInterfaceType('driver.RowsColumnTypeLength', null, [
  ...rowsMethods,
  {
    name: 'ColumnTypeLength',
    args: [arg('index', intTypeInfo)],
    returns: [ret('length', int64TypeInfo), ret('ok', boolTypeInfo)],
  },
])

$.registerInterfaceType('driver.RowsColumnTypeNullable', null, [
  ...rowsMethods,
  {
    name: 'ColumnTypeNullable',
    args: [arg('index', intTypeInfo)],
    returns: [ret('nullable', boolTypeInfo), ret('ok', boolTypeInfo)],
  },
])

$.registerInterfaceType('driver.RowsColumnTypePrecisionScale', null, [
  ...rowsMethods,
  {
    name: 'ColumnTypePrecisionScale',
    args: [arg('index', intTypeInfo)],
    returns: [
      ret('precision', int64TypeInfo),
      ret('scale', int64TypeInfo),
      ret('ok', boolTypeInfo),
    ],
  },
])

$.registerInterfaceType('driver.Tx', null, [
  { name: 'Commit', args: [], returns: [ret('_r0', errorType)] },
  { name: 'Rollback', args: [], returns: [ret('_r0', errorType)] },
])

$.registerInterfaceType('driver.ValueConverter', null, [
  {
    name: 'ConvertValue',
    args: [arg('v', anyType)],
    returns: [ret('_r0', valueType), ret('_r1', errorType)],
  },
])

$.registerInterfaceType('driver.Valuer', null, [
  {
    name: 'Value',
    args: [],
    returns: [ret('_r0', valueType), ret('_r1', errorType)],
  },
])
