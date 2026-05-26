import * as $ from '@goscript/builtin/index.js'
import {
  getHostRuntime,
  type NodeCryptoHash,
} from '@goscript/builtin/hostio.js'

export const Size = 64
export const Size224 = 28
export const Size256 = 32
export const Size384 = 48
export const BlockSize = 128

type ShaAlgorithm = 'sha384' | 'sha512' | 'sha512-224' | 'sha512-256'

class Digest {
  private chunks: Uint8Array[] = []
  private dataLength = 0
  private hash: NodeCryptoHash | null
  private canCopyHash: boolean

  constructor(private readonly algorithm: ShaAlgorithm) {
    this.hash = createNodeHash(algorithm)
    this.canCopyHash = typeof this.hash?.copy === 'function'
  }

  Write(p: $.Bytes): [number, $.GoError] {
    const bytes = $.bytesToUint8Array(p)
    this.hash?.update(bytes)
    if (!this.canCopyHash) {
      this.chunks.push(bytes.slice())
      this.dataLength += bytes.length
    }
    return [bytes.length, null]
  }

  async Sum(b: $.Bytes): Promise<$.Bytes> {
    const digest =
      this.canCopyHash ?
        new Uint8Array(this.hash!.copy!().digest())
      : await sum(this.algorithm, this.snapshotBytes())
    return appendDigest($.bytesToUint8Array(b), digest)
  }

  Reset(): void {
    this.chunks = []
    this.dataLength = 0
    this.hash = createNodeHash(this.algorithm)
    this.canCopyHash = typeof this.hash?.copy === 'function'
  }

  Size(): number {
    switch (this.algorithm) {
      case 'sha384':
        return Size384
      case 'sha512-224':
        return Size224
      case 'sha512-256':
        return Size256
      default:
        return Size
    }
  }

  BlockSize(): number {
    return BlockSize
  }

  private snapshotBytes(): Uint8Array {
    return concatChunks(this.chunks, this.dataLength)
  }
}

export function New(): any {
  return new Digest('sha512')
}

export function New384(): any {
  return new Digest('sha384')
}

export function New512_224(): any {
  return new Digest('sha512-224')
}

export function New512_256(): any {
  return new Digest('sha512-256')
}

export async function Sum384(data: $.Bytes): Promise<Uint8Array> {
  return sum('sha384', data)
}

export async function Sum512(data: $.Bytes): Promise<Uint8Array> {
  return sum('sha512', data)
}

export async function Sum512_224(data: $.Bytes): Promise<Uint8Array> {
  return sum('sha512-224', data)
}

export async function Sum512_256(data: $.Bytes): Promise<Uint8Array> {
  return sum('sha512-256', data)
}

async function sum(
  algorithm: ShaAlgorithm,
  data: $.Bytes,
): Promise<Uint8Array> {
  const hash = createNodeHash(algorithm)
  if (hash != null) {
    return new Uint8Array(hash.update($.bytesToUint8Array(data)).digest())
  }

  const subtle = subtleCrypto()
  if (subtle == null || (algorithm !== 'sha384' && algorithm !== 'sha512')) {
    throw new Error(`crypto/sha512: ${algorithm} digest is unavailable`)
  }

  const digest = await subtle.digest(
    algorithm === 'sha384' ? 'SHA-384' : 'SHA-512',
    $.bytesToUint8Array(data) as unknown as BufferSource,
  )
  return new Uint8Array(digest)
}

function appendDigest(prefix: Uint8Array, digest: Uint8Array): Uint8Array {
  const out = new Uint8Array(prefix.length + digest.length)
  out.set(prefix)
  out.set(digest, prefix.length)
  return out
}

function createNodeHash(algorithm: ShaAlgorithm): NodeCryptoHash | null {
  const nodeCrypto = getHostRuntime().nodeCrypto
  if (!nodeCrypto?.createHash) {
    return null
  }
  try {
    return nodeCrypto.createHash(algorithm)
  } catch {
    return null
  }
}

function concatChunks(chunks: Uint8Array[], length: number): Uint8Array {
  const out = new Uint8Array(length)
  let offset = 0
  for (const chunk of chunks) {
    out.set(chunk, offset)
    offset += chunk.length
  }
  return out
}

function subtleCrypto(): SubtleCrypto | null {
  const crypto = globalThis.crypto
  if (crypto?.subtle && typeof crypto.subtle.digest === 'function') {
    return crypto.subtle
  }
  return null
}
