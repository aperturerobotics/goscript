import * as $ from '@goscript/builtin/index.js'
import * as errors from '@goscript/errors/index.js'
import { scryptAsync } from '@noble/hashes/scrypt.js'

const maxInt = Number.MAX_SAFE_INTEGER

export async function Key(
  password: $.Bytes,
  salt: $.Bytes,
  N: number,
  r: number,
  p: number,
  keyLen: number,
): Promise<[$.Bytes, $.GoError]> {
  if (N <= 1 || (N & (N - 1)) !== 0) {
    return [null, errors.New('scrypt: N must be > 1 and a power of 2')]
  }
  if (r <= 0 || p <= 0) {
    return [null, errors.New('scrypt: parameters must be > 0')]
  }
  if (
    r * p >= 1 << 30 ||
    r > maxInt / 128 / p ||
    r > maxInt / 256 ||
    N > maxInt / 128 / r
  ) {
    return [null, errors.New('scrypt: parameters are too large')]
  }

  try {
    const derived = await scryptAsync(
      $.bytesToUint8Array(password),
      $.bytesToUint8Array(salt),
      {
        N,
        r,
        p,
        dkLen: keyLen,
        asyncTick: 8,
        maxmem: maxInt,
      },
    )
    return [new Uint8Array(derived), null]
  } catch (err) {
    return [null, errors.New(`scrypt: ${errorMessage(err)}`)]
  }
}

function errorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message
  }
  return String(err)
}
