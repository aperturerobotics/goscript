import { describe, expect, it } from 'vitest'

import { Lookup, StartCPUProfile, StopCPUProfile } from './index.js'

describe('runtime/pprof override', () => {
  it('writes deterministic CPU profile bytes', () => {
    const chunks: Uint8Array[] = []
    const writer = {
      Write(p: Uint8Array): [number, null] {
        chunks.push(new Uint8Array(p))
        return [p.length, null]
      },
    }

    expect(StartCPUProfile(writer)).toBeNull()
    StopCPUProfile()

    expect(chunks.reduce((total, chunk) => total + chunk.length, 0)).toBeGreaterThan(0)
  })

  it('writes deterministic memory profile bytes', () => {
    const chunks: Uint8Array[] = []
    const writer = {
      Write(p: Uint8Array): [number, null] {
        chunks.push(new Uint8Array(p))
        return [p.length, null]
      },
    }

    const profile = Lookup('allocs')

    expect(profile).not.toBeNull()
    expect(profile!.WriteTo(writer, 0)).toBeNull()
    expect(chunks.reduce((total, chunk) => total + chunk.length, 0)).toBeGreaterThan(0)
  })
})
