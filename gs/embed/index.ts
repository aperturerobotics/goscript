import * as $ from '@goscript/builtin/index.js'
import * as fs from '@goscript/io/fs/index.js'

export class FS {
  Open(name: string): [fs.File, $.GoError] {
    return [null, pathError('open', name)]
  }

  ReadDir(name: string): [$.Slice<fs.DirEntry>, $.GoError] {
    return [null, pathError('read', name)]
  }

  ReadFile(name: string): [Uint8Array, $.GoError] {
    return [new Uint8Array(0), pathError('read', name)]
  }
}

function pathError(op: string, name: string): $.GoError {
  return new fs.PathError({ Op: op, Path: name, Err: fs.ErrNotExist })
}
