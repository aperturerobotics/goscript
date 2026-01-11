/**
 * Represents the Go error type (interface).
 */
export type GoError = {
  Error(): string
} | null

// newError creates a new Go error with the given message
export function newError(text: string): GoError {
  return {
    Error: () => text,
  }
}

// toGoError converts a JavaScript Error to a Go error
// if the error is already a Go error, it returns it unchanged
export function toGoError(err: Error): GoError {
  if ('Error' in err) {
    return err as GoError
  }
  return {
    JsError: err,
    Error: () => err.message,
  } as GoError
}

// wrapPrimitiveError wraps a primitive value that implements the error interface
// by creating an object with an Error() method that calls the type's Error function.
// This is needed for types like `type MyError int` with `func (e MyError) Error() string`
export function wrapPrimitiveError<T>(
  value: T,
  errorFn: (v: T) => string,
): GoError {
  return {
    Error: () => errorFn(value),
  }
}
