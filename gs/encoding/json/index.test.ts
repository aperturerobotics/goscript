import { describe, expect, it } from 'vitest'

import * as $ from '@goscript/builtin/index.js'

import { Marshal, MarshalIndent, Unmarshal } from './index.js'

class Person {
  public _fields = {
    Name: $.varRef(''),
    Age: $.varRef(0),
    Active: $.varRef(false),
  }

  static __typeInfo = $.registerStructType(
    'test.Person',
    new Person(),
    [],
    Person,
    {
      Name: { type: { kind: $.TypeKind.Basic, name: 'string' }, tag: 'json:"name"' },
      Age: { type: { kind: $.TypeKind.Basic, name: 'int' }, tag: 'json:"age"' },
      Active: { type: { kind: $.TypeKind.Basic, name: 'bool' }, tag: 'json:"active"' },
    },
  )
}

describe('encoding/json override', () => {
  it('marshals struct fields through json tags', () => {
    const person = new Person()
    person._fields.Name.value = 'Alice'
    person._fields.Age.value = 30
    person._fields.Active.value = true

    const [data, err] = Marshal(person)

    expect(err).toBeNull()
    expect($.bytesToString(data)).toBe(
      '{"name":"Alice","age":30,"active":true}',
    )
  })

  it('marshals indented JSON with a line prefix', () => {
    const person = new Person()
    person._fields.Name.value = 'Alice'
    person._fields.Age.value = 30
    person._fields.Active.value = true

    const [data, err] = MarshalIndent(person, '> ', '  ')

    expect(err).toBeNull()
    expect($.bytesToString(data)).toBe(
      '{\n>   "name": "Alice",\n>   "age": 30,\n>   "active": true\n> }',
    )
  })

  it('unmarshals into struct and map pointers', () => {
    const person = $.varRef(new Person())
    const personErr = Unmarshal(
      $.stringToBytes('{"name":"Bob","age":25,"active":false}'),
      person,
    )

    expect(personErr).toBeNull()
    expect(person.value._fields.Name.value).toBe('Bob')
    expect(person.value._fields.Age.value).toBe(25)
    expect(person.value._fields.Active.value).toBe(false)

    const mapRef: $.VarRef<Map<string, unknown> | null> = $.varRef(null)
    const mapErr = Unmarshal(
      $.stringToBytes('{"name":"Carol","age":22,"active":true}'),
      mapRef,
    )

    expect(mapErr).toBeNull()
    expect(mapRef.value?.get('name')).toBe('Carol')
    expect(mapRef.value?.get('age')).toBe(22)
    expect(mapRef.value?.get('active')).toBe(true)
  })
})
