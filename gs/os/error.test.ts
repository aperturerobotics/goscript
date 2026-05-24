import { describe, expect, it } from 'vitest'

import {
  ErrExist,
  ErrNotExist,
  ErrPermission,
  IsExist,
  IsNotExist,
  IsPermission,
  PathError,
} from './error.gs.js'
import { newHostError } from './types_js.gs.js'

function hostError(code: string): Error {
  return Object.assign(new Error(code), { code })
}

describe('os error classification', () => {
  it('unwraps path errors before comparing sentinel errors', () => {
    const err = new PathError({
      Err: ErrNotExist,
      Op: 'open',
      Path: 'missing',
    })

    expect(IsNotExist(err)).toBe(true)
    expect(IsExist(err)).toBe(false)
  })

  it('recognizes host filesystem error codes', () => {
    expect(IsNotExist(newHostError(hostError('ENOENT')))).toBe(true)
    expect(IsNotExist(newHostError(hostError('ENOTDIR')))).toBe(true)
    expect(IsExist(newHostError(hostError('EEXIST')))).toBe(true)
    expect(IsPermission(newHostError(hostError('EACCES')))).toBe(true)
    expect(IsPermission(newHostError(hostError('EPERM')))).toBe(true)
  })

  it('does not treat unrelated host errors as filesystem sentinels', () => {
    expect(IsNotExist(newHostError(hostError('EIO')))).toBe(false)
    expect(IsExist(newHostError(hostError('EIO')))).toBe(false)
    expect(IsPermission(newHostError(hostError('EIO')))).toBe(false)
  })
})
