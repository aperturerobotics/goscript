import * as $ from '@goscript/builtin/index.js'
import {
  getHostRuntime,
  type NodeCryptoHash,
} from '@goscript/builtin/hostio.js'

export const Size = 20
export const BlockSize = 64

class Sha1Error {
  constructor(private readonly message: string) {}

  Error(): string {
    return this.message
  }
}

class Digest {
  private chunks: Uint8Array[] = []
  private dataLength = 0
  private hash: NodeCryptoHash | null
  private canCopyHash: boolean

  constructor() {
    this.hash = createNodeHash()
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
      : await sum(this.snapshotBytes())
    return appendDigest(b, digest)
  }

  Reset(): void {
    this.chunks = []
    this.dataLength = 0
    this.hash = createNodeHash()
    this.canCopyHash = typeof this.hash?.copy === 'function'
  }

  Size(): number {
    return Size
  }

  BlockSize(): number {
    return BlockSize
  }

  private snapshotBytes(): Uint8Array {
    return concatChunks(this.chunks, this.dataLength)
  }
}

export function New(): any {
  return new Digest()
}

export async function Sum(data: $.Bytes): Promise<Uint8Array> {
  return sum(data)
}

async function sum(data: $.Bytes): Promise<Uint8Array> {
  const hash = createNodeHash()
  if (hash != null) {
    return new Uint8Array(hash.update($.bytesToUint8Array(data)).digest())
  }

  const subtle = subtleCrypto()
  if (subtle == null) {
    throw new Error(
      new Sha1Error('crypto/sha1: WebCrypto digest is unavailable').Error(),
    )
  }

  const digest = await subtle.digest(
    'SHA-1',
    $.bytesToUint8Array(data) as unknown as BufferSource,
  )
  return new Uint8Array(digest)
}

function appendDigest(prefix: $.Bytes, digest: Uint8Array): $.Bytes {
  return $.append(prefix as any, ...digest) as $.Bytes
}

function createNodeHash(): NodeCryptoHash | null {
  const nodeCrypto = getHostRuntime().nodeCrypto
  if (!nodeCrypto?.createHash) {
    return null
  }
  try {
    return nodeCrypto.createHash('sha1')
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
