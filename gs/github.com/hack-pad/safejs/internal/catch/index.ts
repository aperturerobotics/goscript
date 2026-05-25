import * as $ from '@goscript/builtin/index.js'
import * as js from '@goscript/syscall/js/index.js'

class CatchError {
  constructor(private readonly message: string) {}

  Error(): string {
    return this.message
  }
}

export async function Try(
  fn: (() => unknown | Promise<unknown>) | null,
): Promise<[unknown, $.GoError]> {
  try {
    return [await fn!(), null]
  } catch (caught) {
    return [null, recoverValueToError($.panicValue(caught))]
  }
}

export async function TrySideEffect(
  fn: (() => void | Promise<void>) | null,
): Promise<$.GoError> {
  try {
    await fn!()
    return null
  } catch (caught) {
    return recoverValueToError($.panicValue(caught))
  }
}

function recoverValueToError(value: unknown): $.GoError {
  if (value == null) {
    return null
  }
  if (isGoError(value)) {
    return value
  }
  if (value instanceof js.Value) {
    return $.interfaceValue<$.GoError>(
      $.markAsStructValue(new js.Error({ Value: value })),
      'js.Error',
    )
  }
  if (value instanceof Error) {
    return $.interfaceValue<$.GoError>(
      $.markAsStructValue(new js.Error({ Value: js.ValueOf(value) })),
      'js.Error',
    )
  }
  return $.interfaceValue<$.GoError>(
    new CatchError(String(value)),
    'catch.catchError',
  )
}

function isGoError(value: unknown): value is Exclude<$.GoError, null> {
  return (
    value !== null &&
    typeof value === 'object' &&
    'Error' in value &&
    typeof (value as { Error?: unknown }).Error === 'function'
  )
}
