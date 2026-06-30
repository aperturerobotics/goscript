import { Type, Value, ValueOf } from './type.js'
import { uintptr } from './types.js'

import * as iter from '@goscript/iter/index.js'

export function rangeNum<_T extends number | uintptr, N extends number>(
  num: N,
  t: Type,
): iter.Seq<Value> {
  // cannot use range T(v) because no core type.

  // if the iteration value type is define by
  // type T built-in type.
  return async (
    _yield: ((v: Value) => iter.YieldResult) | null,
  ): Promise<void> => {
    let convert = t!.PkgPath!() != ''
    // cannot use range T(v) because no core type.

    // if the iteration value type is define by
    // type T built-in type.
    for (let i = 0; i < num; i++) {
      let tmp = ValueOf(i).clone()
      // if the iteration value type is define by
      // type T built-in type.
      if (convert) {
        tmp = tmp.Convert(t).clone()
      }
      if (!(await _yield!(tmp))) {
        return
      }
    }
  }
}
