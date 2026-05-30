import * as $ from '@goscript/builtin/index.js'
import { Struct, Type, visibleStructFields } from './type.js'
import { StructField } from './types.js'

// VisibleFields returns all fields visible through ordinary struct field lookup.
export function VisibleFields(t: Type): $.Slice<StructField> {
  if (t == null) {
    $.panic('reflect: VisibleFields(nil)')
  }
  if (t.Kind() !== Struct) {
    $.panic('reflect.VisibleFields of non-struct type ' + t.String())
  }
  return $.arrayToSlice(visibleStructFields(t).map((field) => field.clone()))
}
