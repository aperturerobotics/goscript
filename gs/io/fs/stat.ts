import * as $ from '@goscript/builtin/index.js'
import { FS, File, FileInfo } from './fs.js'

type maybePromise<T> = T | Promise<T>

export type StatFS =
  | null
  | ({
      // Stat returns a FileInfo describing the file.
      // If there is an error, it should be of type *PathError.
      Stat(name: string): maybePromise<[FileInfo, $.GoError]>
    } & FS)

type asyncFS = null | {
  Open(name: string): maybePromise<[File, $.GoError]>
}

type asyncFile = null | {
  Close(): maybePromise<$.GoError>
  Stat(): maybePromise<[FileInfo, $.GoError]>
}

$.registerInterfaceType(
  'StatFS',
  null, // Zero value for interface is null
  [
    {
      name: 'Stat',
      args: [
        { name: 'name', type: { kind: $.TypeKind.Basic, name: 'string' } },
      ],
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
  ],
)

// Stat returns a [FileInfo] describing the named file from the file system.
//
// If fs implements [StatFS], Stat calls fs.Stat.
// Otherwise, Stat opens the [File] to stat it.
export async function Stat(
  fsys: FS,
  name: string,
): Promise<[FileInfo, $.GoError]> {
  {
    let { value: fsysTyped, ok: ok } = $.typeAssert<StatFS>(fsys, 'StatFS')
    if (ok) {
      return await fsysTyped!.Stat(name)
    }
  }

  let [file, err] = await (fsys as asyncFS)!.Open(name)
  if (err != null) {
    return [null, err]
  }
  try {
    return await (file as asyncFile)!.Stat()
  } finally {
    await (file as asyncFile)!.Close()
  }
}
