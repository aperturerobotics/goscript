import * as $ from '@goscript/builtin/index.js'

export interface Hash {
  Write(p: $.Bytes): [number, $.GoError]
  Sum(b: $.Bytes): Promise<$.Bytes>
  Reset(): void
  Size(): number
  BlockSize(): number
}

export interface Hash32 extends Hash {
  Sum32(): number
}

export interface Hash64 extends Hash {
  Sum64(): bigint
}

export interface Cloner {
  Clone(): [Hash, $.GoError]
}
