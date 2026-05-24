import { describe, expect, it } from 'vitest'

import { TypeKind, arrayToSlice, registerStructType } from '../builtin/index.js'
import { TypeOf, ValueOf } from './index.js'

class Person {
  public Name = 'Ada'
  public Count = 3
}
(Person as any).__typeInfo = { name: 'main.Person' }

describe('reflect struct field access', () => {
  it('finds struct fields by name and index', () => {
    registerStructType('main.Person', new Person(), [], Person, {
      Name: 'string',
      Count: { kind: TypeKind.Basic, name: 'int' },
    })

    const person = new Person()
    const typ = TypeOf(person)
    const [field, ok] = typ.FieldByName('Name')

    expect(ok).toBe(true)
    expect(field.Name).toBe('Name')
    expect(field.Index).toEqual([0])
    expect(typ.FieldByNameFunc((name) => name === 'Count')[0].Name).toBe('Count')
    expect(typ.AssignableTo(typ)).toBe(true)
    expect(ValueOf(person).FieldByName('Name').String()).toBe('Ada')
    expect(ValueOf(person).FieldByIndex(arrayToSlice([1])).Int()).toBe(3)
    expect(ValueOf(person).FieldByName('Missing').IsValid()).toBe(false)
  })
})
