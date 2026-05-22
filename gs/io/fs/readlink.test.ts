import { describe, expect, it } from 'vitest'

import type { File, FileInfo } from './fs.js'
import { ErrInvalid } from './fs.js'
import { Lstat, ReadLink } from './readlink.js'

class linkFS {
  Open(_name: string): [File, Error | null] {
    return [null, ErrInvalid]
  }

  ReadLink(_name: string): [string, Error | null] {
    return ['target.txt', null]
  }

  Lstat(_name: string): [FileInfo, Error | null] {
    return [null, ErrInvalid]
  }
}

class basicFS {
  Open(_name: string): [File, Error | null] {
    return [null, ErrInvalid]
  }
}

describe('io/fs ReadLink', () => {
  it('delegates to ReadLinkFS implementations', () => {
    expect(ReadLink(new linkFS(), 'link')).toEqual(['target.txt', null])
  })

  it('returns readlink PathError when unsupported', () => {
    const [, err] = ReadLink(new basicFS(), 'link')

    expect(err?.Error()).toBe('readlink link: invalid argument')
  })

  it('uses Lstat from ReadLinkFS implementations', () => {
    const [, err] = Lstat(new linkFS(), 'link')

    expect(err).toBe(ErrInvalid)
  })
})
