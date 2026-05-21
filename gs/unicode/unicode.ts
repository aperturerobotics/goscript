import type { Slice } from '@goscript/builtin/index.js'

// Package unicode provides data and functions to test some properties of Unicode code points.

// Constants
export const MaxRune = 0x10ffff
export const ReplacementChar = 0xfffd
export const MaxASCII = 0x7f
export const MaxLatin1 = 0xff
export const Version = '15.0.0'

// Case constants
export const UpperCase = 0
export const LowerCase = 1
export const TitleCase = 2
export const MaxCase = 3

export const UpperLower = MaxRune + 1

// Range16 represents a range of 16-bit Unicode code points
type Range16Init = {
  Lo?: number
  Hi?: number
  Stride?: number
}

export class Range16 {
  public Lo: number
  public Hi: number
  public Stride: number

  constructor(init?: Range16Init)
  constructor(lo: number, hi: number, stride: number)
  constructor(loOrInit: number | Range16Init = 0, hi = 0, stride = 0) {
    if (typeof loOrInit === 'object') {
      this.Lo = loOrInit.Lo ?? 0
      this.Hi = loOrInit.Hi ?? 0
      this.Stride = loOrInit.Stride ?? 0
      return
    }
    this.Lo = loOrInit
    this.Hi = hi
    this.Stride = stride
  }

  public clone(): Range16 {
    return new Range16(this.Lo, this.Hi, this.Stride)
  }
}

// Range32 represents a range of 32-bit Unicode code points
type Range32Init = {
  Lo?: number
  Hi?: number
  Stride?: number
}

export class Range32 {
  public Lo: number
  public Hi: number
  public Stride: number

  constructor(init?: Range32Init)
  constructor(lo: number, hi: number, stride: number)
  constructor(loOrInit: number | Range32Init = 0, hi = 0, stride = 0) {
    if (typeof loOrInit === 'object') {
      this.Lo = loOrInit.Lo ?? 0
      this.Hi = loOrInit.Hi ?? 0
      this.Stride = loOrInit.Stride ?? 0
      return
    }
    this.Lo = loOrInit
    this.Hi = hi
    this.Stride = stride
  }

  public clone(): Range32 {
    return new Range32(this.Lo, this.Hi, this.Stride)
  }
}

// RangeTable defines a set of Unicode code points by listing the ranges of code points within the set
type RangeTableInit = {
  R16?: Slice<Range16>
  R32?: Slice<Range32>
  LatinOffset?: number
}

export class RangeTable {
  public R16: Range16[]
  public R32: Range32[]
  public LatinOffset: number

  constructor(init?: RangeTableInit)
  constructor(
    r16?: Slice<Range16>,
    r32?: Slice<Range32>,
    latinOffset?: number,
  )
  constructor(
    r16OrInit: Slice<Range16> | RangeTableInit = [],
    r32: Slice<Range32> = [],
    latinOffset = 0,
  ) {
    if (isRangeTableInit(r16OrInit)) {
      this.R16 = sliceToArray(r16OrInit.R16)
      this.R32 = sliceToArray(r16OrInit.R32)
      this.LatinOffset = r16OrInit.LatinOffset ?? 0
      return
    }
    this.R16 = sliceToArray(r16OrInit)
    this.R32 = sliceToArray(r32)
    this.LatinOffset = latinOffset
  }

  public clone(): RangeTable {
    return new RangeTable(
      this.R16.map((r) => r.clone()),
      this.R32.map((r) => r.clone()),
      this.LatinOffset,
    )
  }
}

function isRangeTableInit(
  value: Slice<Range16> | RangeTableInit,
): value is RangeTableInit {
  return (
    value !== null &&
    typeof value === 'object' &&
    ('R16' in value || 'R32' in value || 'LatinOffset' in value)
  )
}

function sliceToArray<T>(value: Slice<T> | undefined): T[] {
  if (value == null) {
    return []
  }
  return Array.from(value as ArrayLike<T>)
}

// CaseRange represents a range of Unicode code points for case mapping
export class CaseRange {
  public Lo: number
  public Hi: number
  public Delta: [number, number, number]

  constructor(lo: number, hi: number, delta: [number, number, number]) {
    this.Lo = lo
    this.Hi = hi
    this.Delta = delta
  }

  public clone(): CaseRange {
    return new CaseRange(this.Lo, this.Hi, [...this.Delta] as [
      number,
      number,
      number,
    ])
  }
}

// SpecialCase represents language-specific case mappings
export type SpecialCase = CaseRange[]

// Basic character classification functions using JavaScript's built-in Unicode support

// IsControl reports whether the rune is a control character
export function IsControl(r: number): boolean {
  // Control characters are in categories Cc, Cf, Co, Cs
  if (r < 0 || r > MaxRune) return false
  const char = String.fromCodePoint(r)
  // Use regex to match control characters
  return /[\p{Cc}\p{Cf}\p{Co}\p{Cs}]/u.test(char)
}

// IsDigit reports whether the rune is a decimal digit
export function IsDigit(r: number): boolean {
  if (r < 0 || r > MaxRune) return false
  const char = String.fromCodePoint(r)
  return /\p{Nd}/u.test(char)
}

// IsGraphic reports whether the rune is defined as a Graphic by Unicode
export function IsGraphic(r: number): boolean {
  if (r < 0 || r > MaxRune) return false
  return IsLetter(r) || IsMark(r) || IsNumber(r) || IsPunct(r) || IsSymbol(r)
}

// IsLetter reports whether the rune is a letter (category L)
export function IsLetter(r: number): boolean {
  if (r < 0 || r > MaxRune) return false
  const char = String.fromCodePoint(r)
  return /\p{L}/u.test(char)
}

// IsLower reports whether the rune is a lower case letter
export function IsLower(r: number): boolean {
  if (r < 0 || r > MaxRune) return false
  const char = String.fromCodePoint(r)
  return /\p{Ll}/u.test(char)
}

// IsMark reports whether the rune is a mark character (category M)
export function IsMark(r: number): boolean {
  if (r < 0 || r > MaxRune) return false
  const char = String.fromCodePoint(r)
  return /\p{M}/u.test(char)
}

// IsNumber reports whether the rune is a number (category N)
export function IsNumber(r: number): boolean {
  if (r < 0 || r > MaxRune) return false
  const char = String.fromCodePoint(r)
  return /\p{N}/u.test(char)
}

// IsPrint reports whether the rune is defined as printable by Go
export function IsPrint(r: number): boolean {
  if (r < 0 || r > MaxRune) return false
  if (IsGraphic(r)) return true
  return r === 0x20 // space character
}

// IsPunct reports whether the rune is a punctuation character (category P)
export function IsPunct(r: number): boolean {
  if (r < 0 || r > MaxRune) return false
  const char = String.fromCodePoint(r)
  return /\p{P}/u.test(char)
}

// IsSpace reports whether the rune is a space character
export function IsSpace(r: number): boolean {
  if (r < 0 || r > MaxRune) return false
  const char = String.fromCodePoint(r)
  return /\s/u.test(char) || /\p{Z}/u.test(char)
}

// IsSymbol reports whether the rune is a symbol character (category S)
export function IsSymbol(r: number): boolean {
  if (r < 0 || r > MaxRune) return false
  const char = String.fromCodePoint(r)
  return /\p{S}/u.test(char)
}

// IsTitle reports whether the rune is a title case letter
export function IsTitle(r: number): boolean {
  if (r < 0 || r > MaxRune) return false
  const char = String.fromCodePoint(r)
  return /\p{Lt}/u.test(char)
}

// IsUpper reports whether the rune is an upper case letter
export function IsUpper(r: number): boolean {
  if (r < 0 || r > MaxRune) return false
  const char = String.fromCodePoint(r)
  return /\p{Lu}/u.test(char)
}

// Case conversion functions

// ToLower returns the lowercase mapping of the rune
export function ToLower(r: number): number {
  if (r < 0 || r > MaxRune) return r
  const char = String.fromCodePoint(r)
  const lower = char.toLowerCase()
  return lower.codePointAt(0) || r
}

// ToUpper returns the uppercase mapping of the rune
export function ToUpper(r: number): number {
  if (r < 0 || r > MaxRune) return r
  const char = String.fromCodePoint(r)
  const upper = char.toUpperCase()
  return upper.codePointAt(0) || r
}

// ToTitle returns the title case mapping of the rune
export function ToTitle(r: number): number {
  // For most characters, title case is the same as uppercase
  return ToUpper(r)
}

// To returns the case mapping of the rune
export function To(_case: number, r: number): number {
  switch (_case) {
    case UpperCase:
      return ToUpper(r)
    case LowerCase:
      return ToLower(r)
    case TitleCase:
      return ToTitle(r)
    default:
      return r
  }
}

// SimpleFold returns the next rune in the simple case folding sequence
export function SimpleFold(r: number): number {
  if (r < 0 || r > MaxRune) return r

  // Simple implementation - just toggle between upper and lower case
  if (IsUpper(r)) {
    return ToLower(r)
  } else if (IsLower(r)) {
    return ToUpper(r)
  }
  return r
}

// Is reports whether the rune is in the specified table of ranges
export function Is(rangeTab: RangeTable, r: number): boolean {
  if (r < 0 || r > MaxRune) return false

  // Check 16-bit ranges
  for (const range of rangeTab.R16) {
    if (r < range.Lo) break
    if (r <= range.Hi) {
      return range.Stride === 1 || (r - range.Lo) % range.Stride === 0
    }
  }

  // Check 32-bit ranges
  for (const range of rangeTab.R32) {
    if (r < range.Lo) break
    if (r <= range.Hi) {
      return range.Stride === 1 || (r - range.Lo) % range.Stride === 0
    }
  }

  return false
}

// In reports whether the rune is a member of one of the ranges
export function In(r: number, ...ranges: RangeTable[]): boolean {
  for (const rangeTab of ranges) {
    if (Is(rangeTab, r)) {
      return true
    }
  }
  return false
}

// IsOneOf reports whether the rune is a member of one of the ranges
export function IsOneOf(ranges: RangeTable[], r: number): boolean {
  return In(r, ...ranges)
}

// Predefined range tables for common character categories
// These are simplified versions - in a full implementation, these would contain
// the complete Unicode range data

export const Letter = new RangeTable(
  [new Range16(0x0041, 0x005a, 1), new Range16(0x0061, 0x007a, 1)], // Basic Latin letters
  [],
)

export const Digit = new RangeTable(
  [new Range16(0x0030, 0x0039, 1)], // ASCII digits
  [],
)

export const Space = new RangeTable(
  [new Range16(0x0009, 0x000d, 1), new Range16(0x0020, 0x0020, 1)], // Basic whitespace
  [],
)

export const Upper = new RangeTable(
  [new Range16(0x0041, 0x005a, 1)], // ASCII uppercase
  [],
)

export const Lower = new RangeTable(
  [new Range16(0x0061, 0x007a, 1)], // ASCII lowercase
  [],
)

export const Title = new RangeTable([], [])

export const Punct = new RangeTable(
  [
    new Range16(0x0021, 0x002f, 1), // !"#$%&'()*+,-./
    new Range16(0x003a, 0x0040, 1), // :;<=>?@
    new Range16(0x005b, 0x0060, 1), // [\]^_`
    new Range16(0x007b, 0x007e, 1), // {|}~
  ],
  [],
)

export const Symbol = new RangeTable([], [])

export const Mark = new RangeTable([], [])

export const Number = new RangeTable(
  [new Range16(0x0030, 0x0039, 1)], // ASCII digits
  [],
)

// Categories map
export const Categories = new Map<string, RangeTable>([
  ['L', Letter],
  ['Ll', Lower],
  ['Lu', Upper],
  ['Lt', Title],
  ['M', Mark],
  ['N', Number],
  ['Nd', Digit],
  ['P', Punct],
  ['S', Symbol],
  ['Z', Space],
])

export const CategoryAliases = new Map<string, string>([
  ['C', 'C'],
  ['Cc', 'Cc'],
  ['cntrl', 'Cc'],
  ['Cf', 'Cf'],
  ['Co', 'Co'],
  ['Cs', 'Cs'],
  ['L', 'L'],
  ['LC', 'LC'],
  ['Ll', 'Ll'],
  ['Lm', 'Lm'],
  ['Lo', 'Lo'],
  ['Lt', 'Lt'],
  ['Lu', 'Lu'],
  ['M', 'M'],
  ['Mc', 'Mc'],
  ['Me', 'Me'],
  ['Mn', 'Mn'],
  ['N', 'N'],
  ['Nd', 'Nd'],
  ['digit', 'Nd'],
  ['Nl', 'Nl'],
  ['No', 'No'],
  ['P', 'P'],
  ['Pc', 'Pc'],
  ['Pd', 'Pd'],
  ['Pe', 'Pe'],
  ['Pf', 'Pf'],
  ['Pi', 'Pi'],
  ['Po', 'Po'],
  ['Ps', 'Ps'],
  ['S', 'S'],
  ['Sc', 'Sc'],
  ['Sk', 'Sk'],
  ['Sm', 'Sm'],
  ['So', 'So'],
  ['Z', 'Z'],
  ['Zl', 'Zl'],
  ['Zp', 'Zp'],
  ['Zs', 'Zs'],
])

// Scripts and Properties maps (simplified)
export const Scripts = new Map<string, RangeTable>()
export const Properties = new Map<string, RangeTable>()
export const FoldCategory = new Map<string, RangeTable>()
export const FoldScript = new Map<string, RangeTable>()

// Graphic ranges
export const GraphicRanges = [Letter, Mark, Number, Punct, Symbol]

// Print ranges
export const PrintRanges = [Letter, Mark, Number, Punct, Symbol, Space]

// Case ranges (simplified)
export const CaseRanges: CaseRange[] = []

// Special cases
export const TurkishCase: SpecialCase = []
export const AzeriCase: SpecialCase = TurkishCase

// Predefined character categories (simplified implementations)
export const Cc = new RangeTable(
  [new Range16(0x0000, 0x001f, 1), new Range16(0x007f, 0x009f, 1)],
  [],
)
export const Cf = new RangeTable([], [])
export const Cn = new RangeTable([], [])
export const Co = new RangeTable([], [])
export const Cs = new RangeTable([new Range16(0xd800, 0xdfff, 1)], [])
export const Lm = new RangeTable([], [])
export const Lo = new RangeTable([], [])
export const Mc = new RangeTable([], [])
export const Me = new RangeTable([], [])
export const Mn = new RangeTable([], [])
export const Nl = new RangeTable([], [])
export const No = new RangeTable([], [])
export const Pc = new RangeTable([new Range16(0x005f, 0x005f, 1)], []) // underscore
export const Pd = new RangeTable([new Range16(0x002d, 0x002d, 1)], []) // hyphen
export const Pe = new RangeTable(
  [
    new Range16(0x0029, 0x0029, 1),
    new Range16(0x005d, 0x005d, 1),
    new Range16(0x007d, 0x007d, 1),
  ],
  [],
)
export const Pf = new RangeTable([], [])
export const Pi = new RangeTable([], [])
export const Po = new RangeTable(
  [new Range16(0x0021, 0x0023, 1), new Range16(0x0025, 0x0027, 1)],
  [],
)
export const Ps = new RangeTable(
  [
    new Range16(0x0028, 0x0028, 1),
    new Range16(0x005b, 0x005b, 1),
    new Range16(0x007b, 0x007b, 1),
  ],
  [],
)
export const Sc = new RangeTable([new Range16(0x0024, 0x0024, 1)], []) // dollar sign
export const Sk = new RangeTable(
  [new Range16(0x005e, 0x005e, 1), new Range16(0x0060, 0x0060, 1)],
  [],
)
export const Sm = new RangeTable(
  [new Range16(0x002b, 0x002b, 1), new Range16(0x003c, 0x003e, 1)],
  [],
)
export const So = new RangeTable([], [])
export const Zl = new RangeTable([], [])
export const Zp = new RangeTable([], [])
export const Zs = new RangeTable([new Range16(0x0020, 0x0020, 1)], []) // space

Categories.set('Cn', Cn)
