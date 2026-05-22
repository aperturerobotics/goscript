import * as $ from '@goscript/builtin/index.js'
import { ErrInvalid, FileInfo, FS, PathError } from './fs.js'
import { Stat } from './stat.js'

export type ReadLinkFS =
  | null
  | ({
      ReadLink(name: string): [string, $.GoError]
      Lstat(name: string): [FileInfo, $.GoError]
    } & FS)

$.registerInterfaceType('ReadLinkFS', null, [
  {
    name: 'ReadLink',
    args: [{ name: 'name', type: { kind: $.TypeKind.Basic, name: 'string' } }],
    returns: [
      { type: { kind: $.TypeKind.Basic, name: 'string' } },
      {
        type: {
          kind: $.TypeKind.Interface,
          name: 'GoError',
          methods: [
            {
              name: 'Error',
              args: [],
              returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }],
            },
          ],
        },
      },
    ],
  },
  {
    name: 'Lstat',
    args: [{ name: 'name', type: { kind: $.TypeKind.Basic, name: 'string' } }],
    returns: [
      { type: 'FileInfo' },
      {
        type: {
          kind: $.TypeKind.Interface,
          name: 'GoError',
          methods: [
            {
              name: 'Error',
              args: [],
              returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }],
            },
          ],
        },
      },
    ],
  },
])

export function ReadLink(fsys: FS, name: string): [string, $.GoError] {
  const { value: sym, ok } = $.typeAssert<ReadLinkFS>(fsys, 'ReadLinkFS')
  if (!ok) {
    return ['', new PathError({ Err: ErrInvalid, Op: 'readlink', Path: name })]
  }
  return sym!.ReadLink(name)
}

export function Lstat(fsys: FS, name: string): [FileInfo, $.GoError] {
  const { value: sym, ok } = $.typeAssert<ReadLinkFS>(fsys, 'ReadLinkFS')
  if (!ok) {
    return Stat(fsys, name)
  }
  return sym!.Lstat(name)
}
