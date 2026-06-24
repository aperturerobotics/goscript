import { describe, expect, it } from 'vitest'

import * as $ from '../../../../builtin/index.js'
import * as time from '../../../../time/index.js'
import {
  DefaultMarshalerConfig,
  DefaultUnmarshalerConfig,
  JsonStream,
  MarshalMap,
  MarshalSlice,
  MarshalState,
  NewUnmarshalState,
  UnmarshalState,
} from './index.js'

function jsonBytes(value: string): $.Slice<number> {
  return $.arrayToSlice(Array.from(new TextEncoder().encode(value)))
}

class TestMessage {
  constructor(
    public name = '',
    public count = 0,
  ) {}

  MarshalProtoJSON(s: MarshalState | null): void {
    s?.WriteObjectStart()
    s?.WriteObjectField('name')
    s?.WriteString(this.name)
    s?.WriteMore()
    s?.WriteObjectField('count')
    s?.WriteInt64(this.count)
    s?.WriteObjectEnd()
  }

  UnmarshalProtoJSON(s: UnmarshalState | null): void {
    s?.ReadObject((key) => {
      switch (key) {
        case 'name':
          this.name = s.ReadString()
          return
        case 'count':
          this.count = s.ReadInt64()
          return
        default:
          s.Skip()
      }
    })
  }
}

describe('protobuf-go-lite/json override', () => {
  it('marshals scalar values with protobuf JSON semantics', () => {
    const [data, err] = DefaultMarshalerConfig.Marshal({
      MarshalProtoJSON(s) {
        s?.WriteObjectStart()
        s?.WriteObjectField('bytes')
        s?.WriteBytes(new Uint8Array([102, 111, 111, 98]))
        s?.WriteMore()
        s?.WriteObjectField('int64')
        s?.WriteInt64(-12)
        s?.WriteMore()
        s?.WriteObjectField('uint64')
        s?.WriteUint64(12)
        s?.WriteObjectEnd()
      },
    })

    expect(err).toBeNull()
    expect(new TextDecoder().decode(new Uint8Array(data ?? []))).toBe(
      '{"bytes":"Zm9vYg==","int64":"-12","uint64":"12"}',
    )
  })

  it('marshals bigint int64 and uint64 values', () => {
    const [data, err] = DefaultMarshalerConfig.Marshal({
      MarshalProtoJSON(s) {
        s?.WriteObjectStart()
        s?.WriteObjectField('int64')
        s?.WriteInt64(-9223372036854775808n)
        s?.WriteMore()
        s?.WriteObjectField('uint64')
        s?.WriteUint64(18446744073709551615n)
        s?.WriteMore()
        s?.WriteObjectInt64Field(-1n)
        s?.WriteString('negative')
        s?.WriteMore()
        s?.WriteObjectUint64Field(2n)
        s?.WriteString('positive')
        s?.WriteObjectEnd()
      },
    })

    expect(err).toBeNull()
    expect(new TextDecoder().decode(new Uint8Array(data ?? []))).toBe(
      '{"int64":"-9223372036854775808","uint64":"18446744073709551615","-1":"negative","2":"positive"}',
    )
  })

  it('marshals map and slice containers', () => {
    const [mapData, mapErr] = MarshalMap(undefined, DefaultMarshalerConfig, {
      c: new TestMessage('three', 3),
      a: new TestMessage('one', 1),
      b: new TestMessage('two', 2),
    })
    const [sliceData, sliceErr] = MarshalSlice(
      undefined,
      DefaultMarshalerConfig,
      [new TestMessage('one', 1), new TestMessage('two', 2)],
    )

    expect(mapErr).toBeNull()
    expect(sliceErr).toBeNull()
    expect(new TextDecoder().decode(new Uint8Array(mapData ?? []))).toBe(
      '{"a":{"name":"one","count":"1"},"b":{"name":"two","count":"2"},"c":{"name":"three","count":"3"}}',
    )
    expect(new TextDecoder().decode(new Uint8Array(sliceData ?? []))).toBe(
      '[{"name":"one","count":"1"},{"name":"two","count":"2"}]',
    )
  })

  it('unmarshals object fields and repeated scalar arrays', () => {
    const msg = new TestMessage()
    const err = DefaultUnmarshalerConfig.Unmarshal(
      jsonBytes('{"name":"ok","count":"42"}'),
      msg,
    )
    const state = NewUnmarshalState(
      jsonBytes('["Zm9vYg==","YXI="]'),
      DefaultUnmarshalerConfig,
    )

    expect(err).toBeNull()
    expect(msg).toEqual(new TestMessage('ok', 42))
    expect(state?.ReadBytesArray()).toEqual([
      [102, 111, 111, 98],
      [97, 114],
    ])
  })

  it('matches jsoniter value types while reading object fields', () => {
    const state = NewUnmarshalState(
      jsonBytes('{"id":"step","config":{"kind":"inline"}}'),
      DefaultUnmarshalerConfig,
    )

    expect(state?.ReadObjectField()).toBe('id')
    expect(state?.WhatIsNext()).toBe(1)
    expect(state?.ReadString()).toBe('step')
    expect(state?.ReadObjectField()).toBe('config')
    expect(state?.WhatIsNext()).toBe(6)
    expect(
      new TextDecoder().decode(new Uint8Array(state?.SkipAndReturnBytes())),
    ).toBe('{"kind":"inline"}')
    expect(state?.ReadObjectField()).toBe('')
    expect(state?.Err()).toBeNull()
  })

  it('tracks unmarshaled field masks through nested fields', () => {
    const state = NewUnmarshalState(jsonBytes('{}'), DefaultUnmarshalerConfig)
    state?.AddField('top')
    state?.WithField('nested')?.AddField('leaf')
    state?.WithField('ignored', false)?.AddField('leaf')

    expect(state?.FieldMask()?.GetPaths()).toEqual(['top', 'nested.leaf'])
  })

  it('accepts raw wrapped values and object wrapped values', () => {
    const raw = NewUnmarshalState(jsonBytes('"abc"'), DefaultUnmarshalerConfig)
    const object = NewUnmarshalState(
      jsonBytes('{"value": "def"}'),
      DefaultUnmarshalerConfig,
    )

    expect(raw?.ReadWrappedString()).toBe('abc')
    expect(raw?.Err()).toBeNull()
    expect(object?.ReadWrappedString()).toBe('def')
    expect(object?.Err()).toBeNull()
  })

  it('reads and writes protobuf timestamp values as time.Time pointers', () => {
    const state = NewUnmarshalState(
      jsonBytes('"2025-05-15T01:10:42Z"'),
      DefaultUnmarshalerConfig,
    )
    const parsed = state?.ReadTime()
    const jsonStream = new JsonStream()
    const stream = new MarshalState({ stream: jsonStream })

    expect(state?.Err()).toBeNull()
    expect($.pointerValue(parsed)?.Format(time.RFC3339)).toBe(
      '2025-05-15T01:10:42Z',
    )

    stream.WriteTime(parsed ?? null)

    expect(stream.Err()).toBeNull()
    expect(jsonStream.String()).toBe('"2025-05-15T01:10:42Z"')
  })

  it('rejects invalid bool and numeric map keys', () => {
    const boolState = NewUnmarshalState(
      jsonBytes('{"yes": 1}'),
      DefaultUnmarshalerConfig,
    )
    const intState = NewUnmarshalState(
      jsonBytes('{"1.5": 1}'),
      DefaultUnmarshalerConfig,
    )
    const uintState = NewUnmarshalState(
      jsonBytes('{"-1": 1}'),
      DefaultUnmarshalerConfig,
    )

    boolState?.ReadBoolMap(() => {})
    intState?.ReadInt32Map(() => {})
    uintState?.ReadUint32Map(() => {})

    expect(boolState?.Err()?.Error()).toContain('invalid map key')
    expect(intState?.Err()?.Error()).toContain('invalid map key')
    expect(uintState?.Err()?.Error()).toContain('invalid map key')
  })
})
