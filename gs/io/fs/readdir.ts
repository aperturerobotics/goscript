import * as $ from '@goscript/builtin/index.js'
import { FormatDirEntry } from './format.js'
import {
  FS,
  DirEntry,
  ReadDirFile,
  PathError,
  FileInfo,
  FileMode,
  fileModeType,
} from './fs.js'

import * as errors from '@goscript/errors/index.js'

export type ReadDirFS =
  | null
  | ({
      // ReadDir reads the named directory
      // and returns a list of directory entries sorted by filename.
      ReadDir(
        name: string,
      ):
        | [$.Slice<DirEntry>, $.GoError]
        | Promise<[$.Slice<DirEntry>, $.GoError]>
    } & FS)

$.registerInterfaceType(
  'ReadDirFS',
  null, // Zero value for interface is null
  [
    {
      name: 'ReadDir',
      args: [
        { name: 'name', type: { kind: $.TypeKind.Basic, name: 'string' } },
      ],
      returns: [
        { type: { kind: $.TypeKind.Slice, elemType: 'DirEntry' } },
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
  ],
)

// ReadDir reads the named directory
// and returns a list of directory entries sorted by filename.
//
// If fs implements [ReadDirFS], ReadDir calls fs.ReadDir.
// Otherwise ReadDir calls fs.Open and uses ReadDir and Close
// on the returned file.
export async function ReadDir(
  fsys: FS,
  name: string,
): Promise<[$.Slice<DirEntry>, $.GoError]> {
  {
    let { value: fsysTyped, ok: ok } = $.typeAssert<ReadDirFS>(
      fsys,
      'ReadDirFS',
    )
    if (ok) {
      return await fsysTyped!.ReadDir(name)
    }
  }

  let [file, err] = await fsys!.Open(name)
  if (err != null) {
    return [null, err]
  }
  try {
    let { value: dir, ok: ok } = $.typeAssert<ReadDirFile>(file, 'ReadDirFile')
    if (!ok) {
      return [
        null,
        new PathError({
          Err: errors.New('not implemented'),
          Op: 'readdir',
          Path: name,
        }),
      ]
    }

    let list: $.Slice<DirEntry>
    ;[list, err] = await dir!.ReadDir(-1)
    if (list) {
      list.sort((a: DirEntry, b: DirEntry): number => {
        return $.pointerValue<Exclude<DirEntry, null>>(a)
          .Name()
          .localeCompare($.pointerValue<Exclude<DirEntry, null>>(b).Name())
      })
    }
    return [list, err]
  } finally {
    await file!.Close()
  }
}

class dirInfo {
  public get fileInfo(): FileInfo {
    return this._fields.fileInfo.value
  }
  public set fileInfo(value: FileInfo) {
    this._fields.fileInfo.value = value
  }

  public _fields: {
    fileInfo: $.VarRef<FileInfo>
  }

  constructor(init?: Partial<{ fileInfo?: FileInfo }>) {
    this._fields = {
      fileInfo: $.varRef(init?.fileInfo ?? null),
    }
  }

  public clone(): dirInfo {
    const cloned = new dirInfo()
    cloned._fields = {
      fileInfo: $.varRef(this._fields.fileInfo.value),
    }
    return cloned
  }

  public IsDir(): boolean {
    const di = this
    return di.fileInfo!.IsDir()
  }

  public Type(): FileMode {
    const di = this
    return fileModeType(di.fileInfo!.Mode())
  }

  public Info(): [FileInfo, $.GoError] {
    const di = this
    return [di.fileInfo, null]
  }

  public Name(): string {
    const di = this
    return di.fileInfo!.Name()
  }

  public String(): string {
    const di = this
    return FormatDirEntry(di)
  }

  // Register this type with the runtime type system
  static __typeInfo = $.registerStructType(
    'dirInfo',
    new dirInfo(),
    [
      {
        name: 'IsDir',
        args: [],
        returns: [{ type: { kind: $.TypeKind.Basic, name: 'boolean' } }],
      },
      { name: 'Type', args: [], returns: [{ type: 'FileMode' }] },
      {
        name: 'Info',
        args: [],
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
                  returns: [
                    { type: { kind: $.TypeKind.Basic, name: 'string' } },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        name: 'Name',
        args: [],
        returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }],
      },
      {
        name: 'String',
        args: [],
        returns: [{ type: { kind: $.TypeKind.Basic, name: 'string' } }],
      },
    ],
    dirInfo,
    [{ name: 'fileInfo', key: 'fileInfo', type: 'FileInfo' }],
  )
}

// FileInfoToDirEntry returns a [DirEntry] that returns information from info.
// If info is nil, FileInfoToDirEntry returns nil.
export function FileInfoToDirEntry(info: FileInfo): DirEntry {
  if (info == null) {
    return null
  }
  return new dirInfo({ fileInfo: info })
}
