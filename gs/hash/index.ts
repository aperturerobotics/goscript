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

const bytesType: $.SliceTypeInfo = {
  kind: $.TypeKind.Slice,
  elemType: { kind: $.TypeKind.Basic, name: 'uint8' },
}
const intType: $.BasicTypeInfo = { kind: $.TypeKind.Basic, name: 'int' }
const uint32Type: $.BasicTypeInfo = {
  kind: $.TypeKind.Basic,
  name: 'uint32',
}
const uint64Type: $.BasicTypeInfo = {
  kind: $.TypeKind.Basic,
  name: 'uint64',
}
const errorType: $.InterfaceTypeInfo = {
  kind: $.TypeKind.Interface,
  name: 'error',
  methods: [],
}

$.registerInterfaceType('hash.Hash', null, [
  {
    name: 'Write',
    args: [{ name: 'p', type: bytesType }],
    returns: [
      { name: 'n', type: intType },
      { name: 'err', type: errorType },
    ],
  },
  {
    name: 'Sum',
    args: [{ name: 'b', type: bytesType }],
    returns: [{ name: '_r0', type: bytesType }],
  },
  { name: 'Reset', args: [], returns: [] },
  { name: 'Size', args: [], returns: [{ name: '_r0', type: intType }] },
  { name: 'BlockSize', args: [], returns: [{ name: '_r0', type: intType }] },
])

$.registerInterfaceType('hash.Hash32', null, [
  {
    name: 'Write',
    args: [{ name: 'p', type: bytesType }],
    returns: [
      { name: 'n', type: intType },
      { name: 'err', type: errorType },
    ],
  },
  {
    name: 'Sum',
    args: [{ name: 'b', type: bytesType }],
    returns: [{ name: '_r0', type: bytesType }],
  },
  { name: 'Reset', args: [], returns: [] },
  { name: 'Size', args: [], returns: [{ name: '_r0', type: intType }] },
  { name: 'BlockSize', args: [], returns: [{ name: '_r0', type: intType }] },
  {
    name: 'Sum32',
    args: [],
    returns: [{ name: '_r0', type: uint32Type }],
  },
])

$.registerInterfaceType('hash.Hash64', null, [
  {
    name: 'Write',
    args: [{ name: 'p', type: bytesType }],
    returns: [
      { name: 'n', type: intType },
      { name: 'err', type: errorType },
    ],
  },
  {
    name: 'Sum',
    args: [{ name: 'b', type: bytesType }],
    returns: [{ name: '_r0', type: bytesType }],
  },
  { name: 'Reset', args: [], returns: [] },
  { name: 'Size', args: [], returns: [{ name: '_r0', type: intType }] },
  { name: 'BlockSize', args: [], returns: [{ name: '_r0', type: intType }] },
  {
    name: 'Sum64',
    args: [],
    returns: [{ name: '_r0', type: uint64Type }],
  },
])

$.registerInterfaceType('hash.Cloner', null, [
  {
    name: 'Clone',
    args: [],
    returns: [
      { name: '_r0', type: 'hash.Hash' },
      { name: 'err', type: errorType },
    ],
  },
])
