import { describe, expect, it } from 'vitest'

import {
  Lookup,
  NewProfile,
  Profiles,
  StartCPUProfile,
  StopCPUProfile,
  WriteHeapProfile,
} from './index.js'

describe('runtime/pprof override', () => {
  it('reports CPU profiles as unsupported', () => {
    const chunks: Uint8Array[] = []
    const writer = {
      Write(p: Uint8Array): [number, null] {
        chunks.push(new Uint8Array(p))
        return [p.length, null]
      },
    }

    expect(StartCPUProfile(writer)?.Error()).toBe(
      'runtime/pprof: profiles are unsupported in GoScript',
    )
    StopCPUProfile()

    expect(chunks).toHaveLength(0)
  })

  it('reports memory profiles as unsupported', () => {
    const chunks: Uint8Array[] = []
    const writer = {
      Write(p: Uint8Array): [number, null] {
        chunks.push(new Uint8Array(p))
        return [p.length, null]
      },
    }

    const profile = Lookup('allocs')

    expect(profile).not.toBeNull()
    expect(profile!.WriteTo(writer, 0)?.Error()).toBe(
      'runtime/pprof: profiles are unsupported in GoScript',
    )
    expect(WriteHeapProfile(writer)?.Error()).toBe(
      'runtime/pprof: profiles are unsupported in GoScript',
    )
    expect(chunks).toHaveLength(0)
  })

  it('tracks custom profile values', () => {
    const profile = NewProfile('goscript.test')
    const value = { key: 'value' }

    expect(Lookup('goscript.test')).toBe(profile)
    expect(profile.Count()).toBe(0)
    profile.Add(value, 0)
    expect(profile.Count()).toBe(1)
    profile.Remove(value)
    expect(profile.Count()).toBe(0)
    expect(() => NewProfile('goscript.test')).toThrow(
      'pprof: NewProfile name already in use: goscript.test',
    )
  })

  it('lists built-in and custom profiles', () => {
    const custom =
      Lookup('goscript.profiles') ?? NewProfile('goscript.profiles')
    const profiles = Array.from(Profiles() ?? [])
    const names = profiles.map((profile) => profile?.Name())

    expect(names).toEqual(
      expect.arrayContaining([
        'allocs',
        'block',
        'goroutine',
        'heap',
        'mutex',
        'threadcreate',
        custom.Name(),
      ]),
    )
  })
})
