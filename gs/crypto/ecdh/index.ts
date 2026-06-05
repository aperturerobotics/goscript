import * as $ from '@goscript/builtin/index.js'
import * as io from '@goscript/io/index.js'

export type Curve = x25519Curve | unsupportedCurve
export type KeyExchanger = PrivateKey

const x25519PublicKeySize = 32
const x25519PrivateKeySize = 32
const x25519SharedSecretSize = 32
const p = (1n << 255n) - 19n
const a24 = 121665n

export class PublicKey {
  public curve: Curve
  public publicKey: $.Bytes

  constructor(init?: Partial<{ curve: Curve; publicKey: $.Bytes }>) {
    this.curve = init?.curve ?? x25519
    this.publicKey = copyBytes(init?.publicKey ?? null)
  }

  public Bytes(): $.Bytes {
    return copyBytes(this.publicKey)
  }

  public Curve(): Curve {
    return this.curve
  }

  public Equal(x: PublicKey | $.VarRef<PublicKey> | null): boolean {
    const other = $.pointerValueOrNil(x)
    return (
      other instanceof PublicKey && bytesEqual(this.publicKey, other.publicKey)
    )
  }
}

export class PrivateKey {
  public curve: Curve
  public privateKey: $.Bytes
  public publicKey: PublicKey

  constructor(
    init?: Partial<{ curve: Curve; privateKey: $.Bytes; publicKey: PublicKey }>,
  ) {
    this.curve = init?.curve ?? x25519
    this.privateKey = copyBytes(init?.privateKey ?? null)
    this.publicKey = init?.publicKey ?? new PublicKey({ curve: this.curve })
  }

  public Bytes(): $.Bytes {
    return copyBytes(this.privateKey)
  }

  public Curve(): Curve {
    return this.curve
  }

  public ECDH(
    remote: PublicKey | $.VarRef<PublicKey> | null,
  ): [$.Bytes, $.GoError] {
    const remoteKey = $.pointerValueOrNil(remote)
    if (remoteKey == null || remoteKey.curve !== this.curve) {
      return [
        null,
        $.newError(
          'crypto/ecdh: private key and public key curves do not match',
        ),
      ]
    }
    return this.curve.ecdh(this, remoteKey)
  }

  public Equal(x: PrivateKey | $.VarRef<PrivateKey> | null): boolean {
    const other = $.pointerValueOrNil(x)
    return (
      other instanceof PrivateKey &&
      bytesEqual(this.privateKey, other.privateKey)
    )
  }

  public Public(): PublicKey {
    return this.publicKey
  }

  public PublicKey(): PublicKey {
    return this.publicKey
  }
}

export class x25519Curve {
  public GenerateKey(r: io.Reader | null): [PrivateKey | null, $.GoError] {
    const key = new Uint8Array(x25519PrivateKeySize)
    if (r != null) {
      throw new Error(
        'crypto/ecdh: custom random readers are not implemented in GoScript',
      )
    }
    globalThis.crypto.getRandomValues(key)
    return this.NewPrivateKey(key)
  }

  public NewPrivateKey(key: $.Bytes): [PrivateKey | null, $.GoError] {
    if ($.len(key) !== x25519PrivateKeySize) {
      return [null, $.newError('crypto/ecdh: invalid private key size')]
    }
    const privateKey = copyBytes(key)
    const publicKey = scalarMult(privateKey, basepoint())
    return [
      new PrivateKey({
        curve: this,
        privateKey,
        publicKey: new PublicKey({ curve: this, publicKey }),
      }),
      null,
    ]
  }

  public NewPublicKey(key: $.Bytes): [PublicKey | null, $.GoError] {
    if ($.len(key) !== x25519PublicKeySize) {
      return [null, $.newError('crypto/ecdh: invalid public key')]
    }
    return [new PublicKey({ curve: this, publicKey: key }), null]
  }

  public String(): string {
    return 'X25519'
  }

  public ecdh(
    local: PrivateKey | null,
    remote: PublicKey | null,
  ): [$.Bytes, $.GoError] {
    const out = scalarMult(local?.privateKey ?? null, remote?.publicKey ?? null)
    if (isZero(out)) {
      return [
        null,
        $.newError(
          'crypto/ecdh: bad X25519 remote ECDH input: low order point',
        ),
      ]
    }
    return [out, null]
  }
}

export function X25519(): Curve {
  return x25519
}

export const x25519 = new x25519Curve()

export class unsupportedCurve {
  constructor(private readonly name: string) {}

  public GenerateKey(_r: io.Reader | null): [PrivateKey | null, $.GoError] {
    return [
      null,
      $.newError(`crypto/ecdh: ${this.name} is not implemented in GoScript`),
    ]
  }

  public NewPrivateKey(_key: $.Bytes): [PrivateKey | null, $.GoError] {
    return [
      null,
      $.newError(`crypto/ecdh: ${this.name} is not implemented in GoScript`),
    ]
  }

  public NewPublicKey(_key: $.Bytes): [PublicKey | null, $.GoError] {
    return [
      null,
      $.newError(`crypto/ecdh: ${this.name} is not implemented in GoScript`),
    ]
  }

  public String(): string {
    return this.name
  }

  public ecdh(
    _local: PrivateKey | null,
    _remote: PublicKey | null,
  ): [$.Bytes, $.GoError] {
    return [
      null,
      $.newError(`crypto/ecdh: ${this.name} is not implemented in GoScript`),
    ]
  }
}

export function P256(): Curve {
  return p256
}

export function P384(): Curve {
  return p384
}

export function P521(): Curve {
  return p521
}

const p256 = new unsupportedCurve('P-256')
const p384 = new unsupportedCurve('P-384')
const p521 = new unsupportedCurve('P-521')

function scalarMult(scalar: $.Bytes, point: $.Bytes): Uint8Array {
  const e = copyBytes(scalar)
  const uBytes = copyBytes(point)
  e[0] &= 248
  e[31] &= 127
  e[31] |= 64
  uBytes[31] &= 127

  const x1 = decodeLittleEndian(uBytes)
  let x2 = 1n
  let z2 = 0n
  let x3 = x1
  let z3 = 1n
  let swap = 0n

  for (let t = 254; t >= 0; t--) {
    const k = (BigInt(e[Math.floor(t / 8)]) >> BigInt(t & 7)) & 1n
    swap ^= k
    ;[x2, x3] = cswap(swap, x2, x3)
    ;[z2, z3] = cswap(swap, z2, z3)
    swap = k

    const a = mod(x2 + z2)
    const aa = mod(a * a)
    const b = mod(x2 - z2)
    const bb = mod(b * b)
    const eDiff = mod(aa - bb)
    const c = mod(x3 + z3)
    const d = mod(x3 - z3)
    const da = mod(d * a)
    const cb = mod(c * b)
    x3 = mod((da + cb) ** 2n)
    z3 = mod(x1 * mod((da - cb) ** 2n))
    x2 = mod(aa * bb)
    z2 = mod(eDiff * mod(aa + a24 * eDiff))
  }

  x2 = cswap(swap, x2, x3)[0]
  z2 = cswap(swap, z2, z3)[0]

  return encodeLittleEndian(mod(x2 * modInverse(z2)))
}

function cswap(swap: bigint, x: bigint, y: bigint): [bigint, bigint] {
  const mask = -swap
  const t = mask & (x ^ y)
  return [x ^ t, y ^ t]
}

function mod(value: bigint): bigint {
  const result = value % p
  return result >= 0n ? result : result + p
}

function modInverse(value: bigint): bigint {
  let lm = 1n
  let hm = 0n
  let low = mod(value)
  let high = p
  while (low > 1n) {
    const r = high / low
    ;[lm, hm] = [hm - lm * r, lm]
    ;[low, high] = [high - low * r, low]
  }
  return mod(lm)
}

function decodeLittleEndian(bytes: Uint8Array): bigint {
  let out = 0n
  for (let i = bytes.length - 1; i >= 0; i--) {
    out = (out << 8n) | BigInt(bytes[i])
  }
  return out
}

function encodeLittleEndian(value: bigint): Uint8Array {
  const out = new Uint8Array(x25519SharedSecretSize)
  let v = mod(value)
  for (let i = 0; i < out.length; i++) {
    out[i] = Number(v & 0xffn)
    v >>= 8n
  }
  return out
}

function basepoint(): Uint8Array {
  const out = new Uint8Array(x25519PublicKeySize)
  out[0] = 9
  return out
}

function copyBytes(bytes: $.Bytes | null): Uint8Array {
  return new Uint8Array($.bytesToUint8Array(bytes ?? null))
}

function bytesEqual(a: $.Bytes, b: $.Bytes): boolean {
  const aa = $.bytesToUint8Array(a)
  const bb = $.bytesToUint8Array(b)
  return aa.length === bb.length && aa.every((v, i) => v === bb[i])
}

function isZero(bytes: Uint8Array): boolean {
  return bytes.every((b) => b === 0)
}
