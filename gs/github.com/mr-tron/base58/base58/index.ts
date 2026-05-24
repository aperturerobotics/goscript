import * as $ from '@goscript/builtin/index.js'

const btcAlphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const flickrAlphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'

export class Alphabet {
  decode: Int8Array
  encode: Uint8Array

  constructor(init?: Partial<{ decode?: Int8Array; encode?: Uint8Array }>) {
    this.decode = init?.decode?.slice() ?? new Int8Array(128)
    this.encode = init?.encode?.slice() ?? new Uint8Array(58)
  }

  clone(): Alphabet {
    return new Alphabet({ decode: this.decode, encode: this.encode })
  }
}

export function NewAlphabet(s: string): Alphabet {
  const bytes = $.stringToBytes(s)
  if (bytes.length !== 58) {
    $.panic('base58 alphabets must be 58 bytes long')
  }

  const alphabet = new Alphabet()
  alphabet.decode.fill(-1)
  for (let i = 0; i < bytes.length; i++) {
    const code = bytes[i]
    if (code > 127) {
      $.panic('base58 alphabets must be valid ASCII')
    }
    alphabet.encode[i] = code
    alphabet.decode[code] = i
  }
  return alphabet
}

export let BTCAlphabet: Alphabet | $.VarRef<Alphabet> | null =
  NewAlphabet(btcAlphabet)

export function __goscript_set_BTCAlphabet(
  value: Alphabet | $.VarRef<Alphabet> | null,
): void {
  BTCAlphabet = value
}

export let FlickrAlphabet: Alphabet | $.VarRef<Alphabet> | null =
  NewAlphabet(flickrAlphabet)

export function __goscript_set_FlickrAlphabet(
  value: Alphabet | $.VarRef<Alphabet> | null,
): void {
  FlickrAlphabet = value
}

export function Encode(bin: $.Bytes): string {
  return FastBase58Encoding(bin)
}

export function EncodeAlphabet(
  bin: $.Bytes,
  alphabet: Alphabet | $.VarRef<Alphabet> | null,
): string {
  return FastBase58EncodingAlphabet(bin, alphabet)
}

export function FastBase58Encoding(bin: $.Bytes): string {
  return FastBase58EncodingAlphabet(bin, BTCAlphabet)
}

export function FastBase58EncodingAlphabet(
  bin: $.Bytes,
  alphabet: Alphabet | $.VarRef<Alphabet> | null,
): string {
  const bytes = $.bytesToUint8Array(bin)
  const alpha = $.pointerValue(alphabet)
  if (alpha == null) {
    $.panic('base58 alphabet is nil')
  }

  const zero = alpha.encode[0]
  const binsz = bytes.length
  let zcount = 0
  while (zcount < binsz && bytes[zcount] === 0) {
    zcount++
  }

  const size = Math.trunc(((binsz - zcount) * 138) / 100) + 1
  let value = 0n
  for (let i = zcount; i < binsz; i++) {
    value = (value << 8n) + BigInt(bytes[i])
  }

  const out = new Uint8Array(size + zcount)
  let offset = out.length
  while (value > 0n) {
    const digit = Number(value % 58n)
    value /= 58n
    offset--
    out[offset] = alpha.encode[digit]
  }
  for (let i = 0; i < zcount; i++) {
    offset--
    out[offset] = zero
  }

  return $.bytesToString(out.subarray(offset))
}

export function TrivialBase58Encoding(a: $.Bytes): string {
  return FastBase58Encoding(a)
}

export function TrivialBase58EncodingAlphabet(
  a: $.Bytes,
  alphabet: Alphabet | $.VarRef<Alphabet> | null,
): string {
  return FastBase58EncodingAlphabet(a, alphabet)
}

export function Decode(str: string): [Uint8Array | null, $.GoError] {
  return FastBase58Decoding(str)
}

export function DecodeAlphabet(
  str: string,
  alphabet: Alphabet | $.VarRef<Alphabet> | null,
): [Uint8Array | null, $.GoError] {
  return FastBase58DecodingAlphabet(str, alphabet)
}

export function FastBase58Decoding(str: string): [Uint8Array | null, $.GoError] {
  return FastBase58DecodingAlphabet(str, BTCAlphabet)
}

export function FastBase58DecodingAlphabet(
  str: string,
  alphabet: Alphabet | $.VarRef<Alphabet> | null,
): [Uint8Array | null, $.GoError] {
  if (str.length === 0) {
    return [null, $.newError('zero length string')]
  }

  const alpha = $.pointerValue(alphabet)
  if (alpha == null) {
    $.panic('base58 alphabet is nil')
  }

  const b58sz = str.length
  const outisz = Math.trunc((b58sz + 3) / 4)
  const binu = new Uint8Array((b58sz + 3) * 3)
  let bytesleft = b58sz % 4
  const zero = alpha.encode[0]

  let zmask = 0
  if (bytesleft > 0) {
    zmask = (0xffffffff << (bytesleft * 8)) >>> 0
  } else {
    bytesleft = 4
  }

  const outi = new Uint32Array(outisz)
  let zcount = 0
  while (zcount < b58sz && str.charCodeAt(zcount) === zero) {
    zcount++
  }

  for (let i = 0; i < b58sz; i++) {
    const r = str.charCodeAt(i)
    if (r > 127) {
      return [null, $.newError('High-bit set on invalid digit')]
    }
    const decoded = alpha.decode[r]
    if (decoded === -1) {
      return [
        null,
        $.newError(`Invalid base58 digit ('${String.fromCodePoint(r)}')`),
      ]
    }

    let c = decoded >>> 0
    for (let j = outisz - 1; j >= 0; j--) {
      const t = outi[j] * 58 + c
      c = Math.floor(t / 0x100000000)
      outi[j] = t >>> 0
    }

    if (c > 0) {
      return [null, $.newError('Output number too big (carry to the next int32)')]
    }
    if ((outi[0] & zmask) !== 0) {
      return [
        null,
        $.newError('Output number too big (last int32 filled too far)'),
      ]
    }
  }

  let cnt = 0
  for (let j = 0; j < outisz; j++) {
    for (let mask = (bytesleft - 1) * 8; mask >= 0; mask -= 8) {
      binu[cnt] = (outi[j] >>> mask) & 0xff
      cnt++
    }
    if (j === 0) {
      bytesleft = 4
    }
  }

  for (let n = 0; n < binu.length; n++) {
    if (binu[n] > 0) {
      const start = Math.max(n - zcount, 0)
      return [binu.subarray(start, cnt), null]
    }
  }
  return [binu.subarray(0, cnt), null]
}

export function TrivialBase58Decoding(
  str: string,
): [Uint8Array | null, $.GoError] {
  return FastBase58Decoding(str)
}

export function TrivialBase58DecodingAlphabet(
  str: string,
  alphabet: Alphabet | $.VarRef<Alphabet> | null,
): [Uint8Array | null, $.GoError] {
  return FastBase58DecodingAlphabet(str, alphabet)
}
