import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import {
  AsType,
  ErrUnsupported,
  Errorf,
  Is,
  Join,
  New,
  Wrap,
  Wrapf,
} from './errors.js'

class DNSError {
  public readonly IsNotFound = true

  public Error(): string {
    return 'dns'
  }
}

class Wrapper {
  constructor(private readonly err: $.GoError) {}

  public Error(): string {
    return 'wrapped'
  }

  public Unwrap(): $.GoError {
    return this.err
  }
}

const dnsTypeArgs: $.GenericTypeArgs = {
  E: {
    type: { kind: $.TypeKind.Pointer, elemType: 'net.DNSError' },
    zero: () => null,
  },
}

describe('errors.AsType', () => {
  it('returns a directly matching error', () => {
    const dns = $.interfaceValue<$.GoError>(new DNSError(), '*net.DNSError')

    const [matched, ok] = AsType(dnsTypeArgs, dns)

    expect(ok).toBe(true)
    expect(matched).toBe(dns)
  })

  it('walks wrapped errors depth first', () => {
    const dns = $.interfaceValue<$.GoError>(new DNSError(), '*net.DNSError')
    const wrapped = $.interfaceValue<$.GoError>(
      new Wrapper(dns),
      '*main.Wrapper',
    )

    const [matched, ok] = AsType(dnsTypeArgs, Join(null, wrapped))

    expect(ok).toBe(true)
    expect(matched).toBe(dns)
  })

  it('returns zero when no error matches', () => {
    const [matched, ok] = AsType(dnsTypeArgs, $.newError('plain'))

    expect(ok).toBe(false)
    expect(matched).toBe(null)
  })
})

describe('errors github.com/pkg/errors compatibility helpers', () => {
  it('formats new errors', () => {
    expect(Errorf('bad %s: %d', 'value', 42)?.Error()).toBe('bad value: 42')
  })

  it('wraps and unwraps errors', () => {
    const base = $.newError('root')
    const wrapped = Wrap(base, 'context')

    expect(wrapped?.Error()).toBe('context: root')
    expect(Is(wrapped, base)).toBe(true)
  })

  it('wraps formatted context and preserves nil', () => {
    const base = $.newError('root')

    expect(Wrapf(base, 'context %d', 7)?.Error()).toBe('context 7: root')
    expect(Wrap(null, 'context')).toBe(null)
    expect(Wrapf(null, 'context %d', 7)).toBe(null)
  })
})

describe('errors.Is identity semantics', () => {
  it('does not match distinct errors with equal text', () => {
    expect(Is(New('boom'), New('boom'))).toBe(false)
  })

  it('does not match ErrUnsupported by message text', () => {
    expect(Is(New('unsupported operation'), ErrUnsupported)).toBe(false)
  })

  it('matches the same error value', () => {
    const e = New('boom')
    expect(Is(e, e)).toBe(true)
  })

  it('finds a target in any Join position depth-first', () => {
    const a = New('a')
    const b = New('b')
    expect(Is(Join(a, b), b)).toBe(true)
    expect(Is(Join(a, b), a)).toBe(true)
    expect(Is(Join(a, b), New('b'))).toBe(false)
  })

  it('matches a wrapped sentinel through Wrap', () => {
    expect(Is(Wrap(ErrUnsupported, 'ctx'), ErrUnsupported)).toBe(true)
  })

  it('finds a typed error in a later Join position via AsType', () => {
    const dns = $.interfaceValue<$.GoError>(new DNSError(), '*net.DNSError')
    const [matched, ok] = AsType(dnsTypeArgs, Join(New('first'), dns))
    expect(ok).toBe(true)
    expect(matched).toBe(dns)
  })
})
