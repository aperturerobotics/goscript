import * as $ from '@goscript/builtin/index.js'

export const Size = 32
export const Size224 = 28
export const BlockSize = 64

class Sha256Error {
  constructor(private readonly message: string) {}

  Error(): string {
    return this.message
  }
}

class Digest {
  private data = new Uint8Array(0)

  Write(p: $.Bytes): [number, $.GoError] {
    const bytes = $.bytesToUint8Array(p)
    const next = new Uint8Array(this.data.length + bytes.length)
    next.set(this.data)
    next.set(bytes, this.data.length)
    this.data = next
    return [bytes.length, null]
  }

  async Sum(b: $.Bytes): Promise<$.Bytes> {
    return $.append($.bytesToUint8Array(b), ...(await Sum256(this.data)))
  }

  Reset(): void {
    this.data = new Uint8Array(0)
  }

  Size(): number {
    return Size
  }

  BlockSize(): number {
    return BlockSize
  }
}

export function New(): any {
  return new Digest()
}

export function New224(): any {
  throw new Error('crypto/sha256: SHA-224 is not supported by WebCrypto')
}

export async function Sum224(_data: $.Bytes): Promise<Uint8Array> {
  throw new Error('crypto/sha256: SHA-224 is not supported by WebCrypto')
}

export async function Sum256(data: $.Bytes): Promise<Uint8Array> {
  const subtle = subtleCrypto()
  if (subtle == null) {
    throw new Error(
      new Sha256Error('crypto/sha256: WebCrypto digest is unavailable').Error(),
    )
  }

  const digest = await subtle.digest(
    'SHA-256',
    $.bytesToUint8Array(data) as unknown as BufferSource,
  )
  return new Uint8Array(digest)
}

function subtleCrypto(): SubtleCrypto | null {
  const crypto = globalThis.crypto
  if (crypto?.subtle && typeof crypto.subtle.digest === 'function') {
    return crypto.subtle
  }
  return null
}
