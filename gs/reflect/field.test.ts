import { describe, expect, it } from 'vitest'

import {
  TypeKind,
  arrayToSlice,
  asArray,
  registerStructType,
} from '../builtin/index.js'
import { NewAt, TypeOf, ValueOf } from './index.js'

class Person {
  public Name = 'Ada'
  public Count = 3

  public String(): string {
    return this.Name
  }
}
;(Person as any).__typeInfo = { name: 'main.Person' }

describe('reflect struct field access', () => {
  it('finds struct fields by name and index', async () => {
    registerStructType(
      'main.Person',
      new Person(),
      [
        {
          name: 'String',
          args: [],
          returns: [{ type: { kind: TypeKind.Basic, name: 'string' } }],
        },
      ],
      Person,
      {
        Name: 'string',
        Count: { kind: TypeKind.Basic, name: 'int' },
      },
    )

    const person = new Person()
    const typ = TypeOf(person)
    const [field, ok] = typ.FieldByName('Name')

    expect(ok).toBe(true)
    expect(field.Name).toBe('Name')
    expect(field.Index).toEqual([0])
    expect(typ.FieldByNameFunc((name) => name === 'Count')[0].Name).toBe(
      'Count',
    )
    expect(typ.AssignableTo(typ)).toBe(true)
    const [method, methodOK] = typ.MethodByName('String')
    expect(methodOK).toBe(true)
    expect(method.Type.NumIn()).toBe(1)
    expect(method.Type.In(0).String()).toBe('main.Person')
    expect(method.Type.NumOut()).toBe(1)
    expect(method.Type.Out(0).String()).toBe('string')
    expect(ValueOf(person).FieldByName('Name').String()).toBe('Ada')
    expect(
      ValueOf(person)
        .FieldByIndex(arrayToSlice([1]))
        .Int(),
    ).toBe(3)
    expect(ValueOf(person).FieldByName('Missing').IsValid()).toBe(false)

    const stringMethod = ValueOf(person).MethodByName('String')
    expect(stringMethod.IsValid()).toBe(true)
    expect(stringMethod.Type().NumIn()).toBe(0)
    expect(stringMethod.Type().NumOut()).toBe(1)
    expect(stringMethod.Type().Out(0).String()).toBe('string')
    expect(asArray(await stringMethod.Call(arrayToSlice([])))[0].String()).toBe(
      'Ada',
    )

    const nameField = ValueOf(person).FieldByName('Name')
    const namePtr = NewAt(nameField.Type(), nameField.UnsafeAddr() as any)
    namePtr.Elem().SetString('Grace')
    expect(person.Name).toBe('Grace')
  })
})
