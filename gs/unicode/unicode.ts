import type { Slice } from '@goscript/builtin/index.js'

import {
  categoryData,
  scriptData,
  propertyData,
  foldCategoryData,
  foldScriptData,
  caseRangeData,
  turkishCaseData,
  asciiFold,
  caseOrbitData,
  latin1Props,
  type RangeData,
} from './tables.js'

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

// UpperLower is the delta sentinel marking an upper/lower alternating CaseRange.
export const UpperLower = MaxRune + 1

// linearMax is the maximum size table for linear search for non-Latin1 rune.
const linearMax = 18

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
  constructor(r16?: Slice<Range16>, r32?: Slice<Range32>, latinOffset?: number)
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

// SpecialCase represents language-specific case mappings such as Turkish.
// It carries the language's CaseRange overrides and falls back to the package
// case mappings when a rune is not covered, matching Go's SpecialCase methods.
export class SpecialCase {
  public ranges: CaseRange[]

  constructor(ranges: CaseRange[] = []) {
    this.ranges = ranges
  }

  public ToUpper(r: number): number {
    let [r1, hadMapping] = to(UpperCase, r, this.ranges)
    if (r1 === r && !hadMapping) {
      r1 = ToUpper(r)
    }
    return r1
  }

  public ToTitle(r: number): number {
    let [r1, hadMapping] = to(TitleCase, r, this.ranges)
    if (r1 === r && !hadMapping) {
      r1 = ToTitle(r)
    }
    return r1
  }

  public ToLower(r: number): number {
    let [r1, hadMapping] = to(LowerCase, r, this.ranges)
    if (r1 === r && !hadMapping) {
      r1 = ToLower(r)
    }
    return r1
  }
}

// Table construction from the generated pure-numeric tables.

function buildRangeTable(d: RangeData): RangeTable {
  return new RangeTable(
    d[0].map((t) => new Range16(t[0], t[1], t[2])),
    d[1].map((t) => new Range32(t[0], t[1], t[2])),
    d[2],
  )
}

function buildTableMap(data: Record<string, RangeData>): Map<string, RangeTable> {
  const out = new Map<string, RangeTable>()
  for (const key of Object.keys(data)) {
    out.set(key, buildRangeTable(data[key]))
  }
  return out
}

function buildCaseRanges(
  data: Array<[number, number, number, number, number]>,
): CaseRange[] {
  return data.map((d) => new CaseRange(d[0], d[1], [d[2], d[3], d[4]]))
}

// Categories is the set of Unicode general category tables keyed by name.
export const Categories = buildTableMap(categoryData)
export const Scripts = buildTableMap(scriptData)
export const Properties = buildTableMap(propertyData)
export const FoldCategory = buildTableMap(foldCategoryData)
export const FoldScript = buildTableMap(foldScriptData)

// CategoryAliases maps alternate category names to their canonical names.
export const CategoryAliases = new Map<string, string>([
  ['Other', 'C'],
  ['cntrl', 'Cc'],
  ['Letter', 'L'],
  ['Mark', 'M'],
  ['Number', 'N'],
  ['Punctuation', 'P'],
  ['Symbol', 'S'],
  ['Separator', 'Z'],
  ['digit', 'Nd'],
])

// Named general category tables.
export const C = Categories.get('C')!
export const Cc = Categories.get('Cc')!
export const Cf = Categories.get('Cf')!
export const Cn = Categories.get('Cn')!
export const Co = Categories.get('Co')!
export const Cs = Categories.get('Cs')!
export const L = Categories.get('L')!
export const LC = Categories.get('LC')!
export const Ll = Categories.get('Ll')!
export const Lm = Categories.get('Lm')!
export const Lo = Categories.get('Lo')!
export const Lt = Categories.get('Lt')!
export const Lu = Categories.get('Lu')!
export const M = Categories.get('M')!
export const Mc = Categories.get('Mc')!
export const Me = Categories.get('Me')!
export const Mn = Categories.get('Mn')!
export const N = Categories.get('N')!
export const Nd = Categories.get('Nd')!
export const Nl = Categories.get('Nl')!
export const No = Categories.get('No')!
export const P = Categories.get('P')!
export const Pc = Categories.get('Pc')!
export const Pd = Categories.get('Pd')!
export const Pe = Categories.get('Pe')!
export const Pf = Categories.get('Pf')!
export const Pi = Categories.get('Pi')!
export const Po = Categories.get('Po')!
export const Ps = Categories.get('Ps')!
export const S = Categories.get('S')!
export const Sc = Categories.get('Sc')!
export const Sk = Categories.get('Sk')!
export const Sm = Categories.get('Sm')!
export const So = Categories.get('So')!
export const Z = Categories.get('Z')!
export const Zl = Categories.get('Zl')!
export const Zp = Categories.get('Zp')!
export const Zs = Categories.get('Zs')!

// Friendly category aliases matching Go's exported names.
export const Letter = L
export const Mark = M
export const Number = N
export const Other = C
export const Punct = P
export const Space = Z
export const Symbol = S
export const Digit = Nd
export const Lower = Ll
export const Title = Lt
export const Upper = Lu

// White_Space is the Unicode property table used for non-Latin1 IsSpace.
export const White_Space = Properties.get('White_Space')!

// GraphicRanges defines the set of graphic characters according to Unicode.
export const GraphicRanges: RangeTable[] = [L, M, N, P, S, Zs]

// PrintRanges defines the set of printable characters according to Go.
export const PrintRanges: RangeTable[] = [L, M, N, P, S]

// CaseRanges is the table of Unicode case mappings.
export const CaseRanges: CaseRange[] = buildCaseRanges(caseRangeData)

// TurkishCase / AzeriCase are the Turkish (and Azeri) special case mappings.
export const TurkishCase = new SpecialCase(buildCaseRanges(turkishCaseData))
export const AzeriCase = TurkishCase

// caseOrbit maps a rune to the next rune in its simple-fold orbit when that next
// rune differs from the plain case toggle. SimpleFold consults it above ASCII.
const caseOrbit = new Map<number, number>(caseOrbitData)

// searchRanges reports whether r is contained in the sorted range list, using a
// linear scan for short tables or Latin1 runes and a binary search otherwise.
function searchRanges(ranges: Array<Range16 | Range32>, r: number): boolean {
  if (ranges.length <= linearMax || r <= MaxLatin1) {
    for (const range of ranges) {
      if (r < range.Lo) {
        return false
      }
      if (r <= range.Hi) {
        return range.Stride === 1 || (r - range.Lo) % range.Stride === 0
      }
    }
    return false
  }
  let lo = 0
  let hi = ranges.length
  while (lo < hi) {
    const m = lo + ((hi - lo) >> 1)
    const range = ranges[m]
    if (range.Lo <= r && r <= range.Hi) {
      return range.Stride === 1 || (r - range.Lo) % range.Stride === 0
    }
    if (r < range.Lo) {
      hi = m
    } else {
      lo = m + 1
    }
  }
  return false
}

// Is reports whether the rune is in the specified table of ranges.
export function Is(rangeTab: RangeTable, r: number): boolean {
  const r16 = rangeTab.R16
  // Compare as unsigned to correctly reject negative runes.
  if (r16.length > 0 && (r >>> 0) <= (r16[r16.length - 1].Hi >>> 0)) {
    return searchRanges(r16, r & 0xffff)
  }
  const r32 = rangeTab.R32
  if (r32.length > 0 && r >= r32[0].Lo) {
    return searchRanges(r32, r)
  }
  return false
}

// In reports whether the rune is a member of one of the ranges.
export function In(r: number, ...ranges: RangeTable[]): boolean {
  for (const rangeTab of ranges) {
    if (Is(rangeTab, r)) {
      return true
    }
  }
  return false
}

// IsOneOf reports whether the rune is a member of one of the ranges.
export function IsOneOf(ranges: RangeTable[], r: number): boolean {
  for (const rangeTab of ranges) {
    if (Is(rangeTab, r)) {
      return true
    }
  }
  return false
}

// to maps the rune using the specified case and case-range table, returning the
// mapped rune and whether a mapping was found.
function to(_case: number, r: number, caseRange: CaseRange[]): [number, boolean] {
  if (_case < 0 || _case >= MaxCase) {
    return [ReplacementChar, false]
  }
  let lo = 0
  let hi = caseRange.length
  while (lo < hi) {
    const m = lo + ((hi - lo) >> 1)
    const cr = caseRange[m]
    if (cr.Lo <= r && r <= cr.Hi) {
      const delta = cr.Delta[_case]
      if (delta > MaxRune) {
        // In an upper/lower alternating sequence the even offsets from the start
        // are upper case and the odd offsets lower; clearing or setting the low
        // bit of the offset selects the right case.
        return [cr.Lo + (((r - cr.Lo) & ~1) | (_case & 1)), true]
      }
      return [r + delta, true]
    }
    if (r < cr.Lo) {
      hi = m
    } else {
      lo = m + 1
    }
  }
  return [r, false]
}

// To maps the rune to the specified case: UpperCase, LowerCase, or TitleCase.
export function To(_case: number, r: number): number {
  return to(_case, r, CaseRanges)[0]
}

// ToUpper maps the rune to upper case.
export function ToUpper(r: number): number {
  if (r <= MaxASCII) {
    if (r >= 0x61 && r <= 0x7a) {
      r -= 0x20
    }
    return r
  }
  return To(UpperCase, r)
}

// ToLower maps the rune to lower case.
export function ToLower(r: number): number {
  if (r <= MaxASCII) {
    if (r >= 0x41 && r <= 0x5a) {
      r += 0x20
    }
    return r
  }
  return To(LowerCase, r)
}

// ToTitle maps the rune to title case.
export function ToTitle(r: number): number {
  if (r <= MaxASCII) {
    if (r >= 0x61 && r <= 0x7a) {
      r -= 0x20
    }
    return r
  }
  return To(TitleCase, r)
}

// SimpleFold iterates over the Unicode code points equivalent under simple case
// folding, returning the next rune in the fold orbit.
export function SimpleFold(r: number): number {
  if (r < 0 || r > MaxRune) {
    return r
  }
  if (r < asciiFold.length) {
    return asciiFold[r]
  }
  const orbit = caseOrbit.get(r)
  if (orbit !== undefined) {
    return orbit
  }
  const l = ToLower(r)
  if (l !== r) {
    return l
  }
  return ToUpper(r)
}

// Latin1 property bits, kept in sync with the l1* constants in gen.go. The
// latin1Props table records Go's predicate results for U+0000..U+00FF so the
// Latin1 fast paths stay byte-faithful without re-deriving Go's property masks.
const L1_CONTROL = 1 << 0
const L1_LETTER = 1 << 1
const L1_UPPER = 1 << 2
const L1_LOWER = 1 << 3
const L1_TITLE = 1 << 4
const L1_NUMBER = 1 << 5
const L1_DIGIT = 1 << 6
const L1_MARK = 1 << 7
const L1_PUNCT = 1 << 8
const L1_SYMBOL = 1 << 9
const L1_SPACE = 1 << 10
const L1_GRAPHIC = 1 << 11
const L1_PRINT = 1 << 12

function isLatin1(r: number): boolean {
  return r >= 0 && r <= MaxLatin1
}

// IsControl reports whether the rune is a control character. Such characters do
// not appear above Latin1.
export function IsControl(r: number): boolean {
  if (isLatin1(r)) {
    return (latin1Props[r] & L1_CONTROL) !== 0
  }
  return false
}

// IsDigit reports whether the rune is a decimal digit.
export function IsDigit(r: number): boolean {
  if (isLatin1(r)) {
    return (latin1Props[r] & L1_DIGIT) !== 0
  }
  return Is(Digit, r)
}

// IsLetter reports whether the rune is a letter (category L).
export function IsLetter(r: number): boolean {
  if (isLatin1(r)) {
    return (latin1Props[r] & L1_LETTER) !== 0
  }
  return Is(Letter, r)
}

// IsNumber reports whether the rune is a number (category N).
export function IsNumber(r: number): boolean {
  if (isLatin1(r)) {
    return (latin1Props[r] & L1_NUMBER) !== 0
  }
  return Is(Number, r)
}

// IsMark reports whether the rune is a mark character (category M).
export function IsMark(r: number): boolean {
  if (isLatin1(r)) {
    return (latin1Props[r] & L1_MARK) !== 0
  }
  return Is(Mark, r)
}

// IsSpace reports whether the rune is a space character as defined by Unicode.
export function IsSpace(r: number): boolean {
  if (isLatin1(r)) {
    return (latin1Props[r] & L1_SPACE) !== 0
  }
  return Is(White_Space, r)
}

// IsPunct reports whether the rune is a punctuation character (category P).
export function IsPunct(r: number): boolean {
  if (isLatin1(r)) {
    return (latin1Props[r] & L1_PUNCT) !== 0
  }
  return Is(Punct, r)
}

// IsSymbol reports whether the rune is a symbolic character (category S).
export function IsSymbol(r: number): boolean {
  if (isLatin1(r)) {
    return (latin1Props[r] & L1_SYMBOL) !== 0
  }
  return Is(Symbol, r)
}

// IsUpper reports whether the rune is an upper case letter.
export function IsUpper(r: number): boolean {
  if (isLatin1(r)) {
    return (latin1Props[r] & L1_UPPER) !== 0
  }
  return Is(Upper, r)
}

// IsLower reports whether the rune is a lower case letter.
export function IsLower(r: number): boolean {
  if (isLatin1(r)) {
    return (latin1Props[r] & L1_LOWER) !== 0
  }
  return Is(Lower, r)
}

// IsTitle reports whether the rune is a title case letter.
export function IsTitle(r: number): boolean {
  if (isLatin1(r)) {
    return (latin1Props[r] & L1_TITLE) !== 0
  }
  return Is(Title, r)
}

// IsGraphic reports whether the rune is defined as a Graphic by Unicode: letters,
// marks, numbers, punctuation, symbols, and spaces (categories L, M, N, P, S, Zs).
export function IsGraphic(r: number): boolean {
  if (isLatin1(r)) {
    return (latin1Props[r] & L1_GRAPHIC) !== 0
  }
  return In(r, ...GraphicRanges)
}

// IsPrint reports whether the rune is defined as printable by Go: the Graphic
// characters minus the non-ASCII spaces (so only ASCII space is printable).
export function IsPrint(r: number): boolean {
  if (isLatin1(r)) {
    return (latin1Props[r] & L1_PRINT) !== 0
  }
  return In(r, ...PrintRanges)
}
