import * as $ from '@goscript/builtin/index.js'

export type Block = {
  BlockSize(): number
  Decrypt(dst: $.Bytes, src: $.Bytes): void
  Encrypt(dst: $.Bytes, src: $.Bytes): void
}

$.registerInterfaceType('cipher.Block', null, [
  {
    name: 'BlockSize',
    args: [],
    returns: [{ name: '_r0', type: { kind: $.TypeKind.Basic, name: 'int' } }],
  },
  {
    name: 'Decrypt',
    args: [
      {
        name: 'dst',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
      {
        name: 'src',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
    ],
    returns: [],
  },
  {
    name: 'Encrypt',
    args: [
      {
        name: 'dst',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
      {
        name: 'src',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
    ],
    returns: [],
  },
])

export type AEAD = {
  NonceSize(): number
  Open(
    dst: $.Bytes,
    nonce: $.Bytes,
    ciphertext: $.Bytes,
    additionalData: $.Bytes,
  ): [$.Bytes, $.GoError] | Promise<[$.Bytes, $.GoError]>
  Overhead(): number
  Seal(
    dst: $.Bytes,
    nonce: $.Bytes,
    plaintext: $.Bytes,
    additionalData: $.Bytes,
  ): $.Bytes | Promise<$.Bytes>
}

$.registerInterfaceType('cipher.AEAD', null, [
  {
    name: 'NonceSize',
    args: [],
    returns: [{ name: '_r0', type: { kind: $.TypeKind.Basic, name: 'int' } }],
  },
  {
    name: 'Open',
    args: [
      {
        name: 'dst',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
      {
        name: 'nonce',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
      {
        name: 'ciphertext',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
      {
        name: 'additionalData',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
    ],
    returns: [
      {
        name: '_r0',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
      { name: '_r1', type: 'error' },
    ],
  },
  {
    name: 'Overhead',
    args: [],
    returns: [{ name: '_r0', type: { kind: $.TypeKind.Basic, name: 'int' } }],
  },
  {
    name: 'Seal',
    args: [
      {
        name: 'dst',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
      {
        name: 'nonce',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
      {
        name: 'plaintext',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
      {
        name: 'additionalData',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
    ],
    returns: [
      {
        name: '_r0',
        type: {
          kind: $.TypeKind.Slice,
          elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
        },
      },
    ],
  },
])

export type Stream = {
  XORKeyStream(dst: $.Bytes, src: $.Bytes): void
}

export type BlockMode = {
  BlockSize(): number
  CryptBlocks(dst: $.Bytes, src: $.Bytes): void
}

type WebCryptoBlock = Block & {
  webCryptoKey(): Promise<CryptoKey>
}

class webCryptoGCM implements AEAD {
  constructor(
    private readonly block: WebCryptoBlock,
    private readonly nonceSize: number,
    private readonly tagSize: number,
  ) {}

  NonceSize(): number {
    return this.nonceSize
  }

  Overhead(): number {
    return this.tagSize
  }

  async Seal(
    dst: $.Bytes,
    nonce: $.Bytes,
    plaintext: $.Bytes,
    additionalData: $.Bytes,
  ): Promise<$.Bytes> {
    if ($.len(nonce) !== this.nonceSize) {
      throw new Error('crypto/cipher: incorrect nonce length given to GCM')
    }
    const encrypted = await globalThis.crypto.subtle.encrypt(
      this.algorithm(nonce, additionalData),
      await this.block.webCryptoKey(),
      $.bytesToUint8Array(plaintext) as BufferSource,
    )
    return appendBytes(dst, new Uint8Array(encrypted))
  }

  async Open(
    dst: $.Bytes,
    nonce: $.Bytes,
    ciphertext: $.Bytes,
    additionalData: $.Bytes,
  ): Promise<[$.Bytes, $.GoError]> {
    if ($.len(nonce) !== this.nonceSize) {
      throw new Error('crypto/cipher: incorrect nonce length given to GCM')
    }
    try {
      const decrypted = await globalThis.crypto.subtle.decrypt(
        this.algorithm(nonce, additionalData),
        await this.block.webCryptoKey(),
        $.bytesToUint8Array(ciphertext) as BufferSource,
      )
      return [appendBytes(dst, new Uint8Array(decrypted)), null]
    } catch {
      return [null, $.newError('cipher: message authentication failed')]
    }
  }

  private algorithm(nonce: $.Bytes, additionalData: $.Bytes): AesGcmParams {
    const params: AesGcmParams = {
      name: 'AES-GCM',
      iv: $.bytesToUint8Array(nonce) as BufferSource,
      tagLength: this.tagSize * 8,
    }
    if ($.len(additionalData) !== 0) {
      params.additionalData = $.bytesToUint8Array(
        additionalData,
      ) as BufferSource
    }
    return params
  }
}

export function NewGCM(block: Block | null): [AEAD | null, $.GoError] {
  return NewGCMWithNonceSize(block, 12)
}

export function NewGCMWithNonceSize(
  block: Block | null,
  size: number,
): [AEAD | null, $.GoError] {
  return newGCM(block, size, 16)
}

export function NewGCMWithTagSize(
  block: Block | null,
  tagSize: number,
): [AEAD | null, $.GoError] {
  if (tagSize < 12 || tagSize > 16) {
    return [null, $.newError('crypto/cipher: incorrect GCM tag size')]
  }
  return newGCM(block, 12, tagSize)
}

export function NewGCMWithRandomNonce(
  _block: Block | null,
): [AEAD | null, $.GoError] {
  return [
    null,
    $.newError(
      'crypto/cipher: NewGCMWithRandomNonce is not implemented in GoScript',
    ),
  ]
}

export function NewCBCDecrypter(_b: Block | null, _iv: $.Bytes): BlockMode {
  throw new Error('crypto/cipher: CBC is not implemented in GoScript')
}

export function NewCBCEncrypter(_b: Block | null, _iv: $.Bytes): BlockMode {
  throw new Error('crypto/cipher: CBC is not implemented in GoScript')
}

export function NewCFBDecrypter(_b: Block | null, _iv: $.Bytes): Stream {
  throw new Error('crypto/cipher: CFB is not implemented in GoScript')
}

export function NewCFBEncrypter(_b: Block | null, _iv: $.Bytes): Stream {
  throw new Error('crypto/cipher: CFB is not implemented in GoScript')
}

export function NewCTR(_b: Block | null, _iv: $.Bytes): Stream {
  throw new Error('crypto/cipher: CTR is not implemented in GoScript')
}

export function NewOFB(_b: Block | null, _iv: $.Bytes): Stream {
  throw new Error('crypto/cipher: OFB is not implemented in GoScript')
}

export class StreamReader {
  constructor(_init?: Partial<{ S: Stream; R: unknown }>) {}
}

export class StreamWriter {
  constructor(_init?: Partial<{ S: Stream; W: unknown }>) {}
}

function newGCM(
  block: Block | null,
  nonceSize: number,
  tagSize: number,
): [AEAD | null, $.GoError] {
  if (block == null || block.BlockSize() !== 16) {
    return [null, $.newError('cipher: NewGCM requires 128-bit block cipher')]
  }
  if (nonceSize <= 0) {
    return [null, $.newError('crypto/cipher: incorrect GCM nonce size')]
  }
  if (!isWebCryptoBlock(block)) {
    return [
      null,
      $.newError(
        'crypto/cipher: AES-GCM requires a WebCrypto AES block in GoScript',
      ),
    ]
  }
  return [new webCryptoGCM(block, nonceSize, tagSize), null]
}

function isWebCryptoBlock(block: Block): block is WebCryptoBlock {
  return typeof (block as Partial<WebCryptoBlock>).webCryptoKey === 'function'
}

function appendBytes(dst: $.Bytes, bytes: Uint8Array): $.Bytes {
  return $.append(dst as any, ...bytes) as $.Bytes
}
