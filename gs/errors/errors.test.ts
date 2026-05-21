import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import { AsType, Join } from './errors.js'

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
    const wrapped = $.interfaceValue<$.GoError>(new Wrapper(dns), '*main.Wrapper')

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
