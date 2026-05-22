import * as $ from '@goscript/builtin/index.js'

// New returns an error that formats as the given text.
// Each call to New returns a distinct error value even if the text is identical.
export function New(text: string): $.GoError {
  return $.newError(text)
}

export function Errorf(format: string, ...args: any[]): $.GoError {
  return New(formatText(format, args))
}

export function Wrap(err: $.GoError, message: string): $.GoError {
  if (err === null) {
    return null
  }
  return wrapError(err, message)
}

export function Wrapf(
  err: $.GoError,
  format: string,
  ...args: any[]
): $.GoError {
  if (err === null) {
    return null
  }
  return wrapError(err, formatText(format, args))
}

function wrapError(err: Exclude<$.GoError, null>, message: string): $.GoError {
  const wrapped = $.newError(`${message}: ${err.Error()}`)
  ;(wrapped as any).Unwrap = function (): $.GoError {
    return err
  }
  return wrapped
}

function formatText(format: string, args: any[]): string {
  let argIndex = 0
  return format.replace(/%[sdqv%]/g, (match) => {
    if (match === '%%') {
      return '%'
    }
    if (argIndex >= args.length) {
      return match
    }
    const arg = args[argIndex++]
    switch (match) {
      case '%d':
        return String(Number(arg))
      case '%q':
        return JSON.stringify(String(arg))
      default:
        return String(arg)
    }
  })
}

// ErrUnsupported indicates that a requested operation cannot be performed,
// because it is unsupported. For example, a call to os.Link when using a
// file system that does not support hard links.
//
// Functions and methods should not return this error but should instead
// return an error including appropriate context that satisfies
//
//	errors.Is(err, errors.ErrUnsupported)
//
// either by directly wrapping ErrUnsupported or by implementing an Is method.
export const ErrUnsupported = New('unsupported operation')

// Unwrap returns the result of calling the Unwrap method on err, if err's
// type contains an Unwrap method returning error.
// Otherwise, Unwrap returns nil.
export function Unwrap(err: $.GoError): $.GoError {
  if (err === null) {
    return null
  }

  // Check if the error has an Unwrap method
  if (typeof (err as any).Unwrap === 'function') {
    const result = (err as any).Unwrap()
    if (result && typeof result.Error === 'function') {
      return result
    }
    // Handle case where Unwrap returns []error
    if (
      Array.isArray(result) &&
      result.length > 0 &&
      result[0] &&
      typeof result[0].Error === 'function'
    ) {
      return result[0]
    }
  }

  return null
}

// Is reports whether any error in err's tree matches target.
//
// The tree consists of err itself, followed by the errors obtained by repeatedly
// calling Unwrap. When err wraps multiple errors, Is examines err followed by a
// depth-first traversal of its children.
//
// An error is considered to match a target if it is equal to that target or if
// it implements a method Is(error) bool such that Is(target) returns true.
//
// An error type might provide an Is method so it can be treated as equivalent
// to an existing error. For example, if MyError defines
//
//	func (m MyError) Is(target error) bool { return target == fs.ErrExist }
//
// then Is(MyError{}, fs.ErrExist) returns true. See syscall.Errno.Is for
// an example in the standard library. An Is method should only shallowly
// compare err and the target and not call Unwrap on either.
export function Is(err: $.GoError, target: $.GoError): boolean {
  if (target === null) {
    return err === null
  }

  if (err === null) {
    return false
  }

  // Check direct equality
  if (err === target) {
    return true
  }

  // Check if error messages are the same
  if (err.Error() === target.Error()) {
    return true
  }

  // Check if err has an Is method
  if (typeof (err as any).Is === 'function') {
    if ((err as any).Is(target)) {
      return true
    }
  }

  // Recursively check wrapped errors
  const unwrapped = Unwrap(err)
  if (unwrapped !== null) {
    return Is(unwrapped, target)
  }

  // Handle multiple wrapped errors
  if (typeof (err as any).Unwrap === 'function') {
    const result = (err as any).Unwrap()
    if (Array.isArray(result)) {
      for (const wrappedErr of result) {
        if (
          wrappedErr &&
          typeof wrappedErr.Error === 'function' &&
          Is(wrappedErr, target)
        ) {
          return true
        }
      }
    }
  }

  return false
}

// As finds the first error in err's tree that matches target, and if one is found,
// sets target to that error value and returns true. Otherwise, it returns false.
//
// The tree consists of err itself, followed by the errors obtained by repeatedly
// calling Unwrap. When err wraps multiple errors, As examines err followed by a
// depth-first traversal of its children.
//
// An error matches target if the error's concrete value is assignable to the value
// pointed to by target, or if the error has a method As(interface{}) bool such that
// As(target) returns true. In the latter case, the As method is responsible for
// setting target.
//
// An error type might provide an As method so it can be treated as if it were a
// different error type.
//
// As panics if target is not a non-nil pointer to either a type that implements
// error, or to any interface type.
export function As(err: $.GoError, target: any): boolean {
  if (err === null) {
    return false
  }

  if (target === null || typeof target !== 'object') {
    throw new Error('errors: target cannot be nil')
  }

  if (assignAsTarget(err, target)) {
    return true
  }

  // Check if err has an As method
  if (typeof (err as any).As === 'function') {
    if ((err as any).As(target)) {
      return true
    }
  }

  // Recursively check wrapped errors
  const unwrapped = Unwrap(err)
  if (unwrapped !== null) {
    return As(unwrapped, target)
  }

  // Handle multiple wrapped errors
  if (typeof (err as any).Unwrap === 'function') {
    const result = (err as any).Unwrap()
    if (Array.isArray(result)) {
      for (const wrappedErr of result) {
        if (
          wrappedErr &&
          typeof wrappedErr.Error === 'function' &&
          As(wrappedErr, target)
        ) {
          return true
        }
      }
    }
  }

  return false
}

function assignAsTarget(err: Exclude<$.GoError, null>, target: any): boolean {
  const targetType = asTargetType(target)
  if (targetType !== undefined) {
    const [matched, ok] = $.typeAssertTuple<any>(err, targetType)
    if (!ok) {
      return false
    }
    if ($.isVarRef(target)) {
      target.value = matched
      return true
    }
    Object.assign(target, matched)
    return true
  }

  if (err.constructor === target.constructor) {
    Object.assign(target, err)
    return true
  }
  return false
}

function asTargetType(target: any): string | undefined {
  const goType = target?.__goType
  if (typeof goType !== 'string' || !goType.startsWith('*')) {
    return undefined
  }
  return goType.slice(1)
}

// AsType finds the first error in err's tree that matches the generic error
// type E, returning the matching error and true. Otherwise it returns E's zero
// value and false.
export function AsType(
  typeArgs: $.GenericTypeArgs | undefined,
  err: $.GoError,
): [any, boolean] {
  const descriptor = typeArgs?.E
  const zero = (): any => descriptor?.zero?.() ?? null
  if (err === null || descriptor?.type === undefined) {
    return [zero(), false]
  }
  return asType(err, descriptor.type, zero)
}

function asType(
  err: $.GoError,
  typeInfo: $.TypeInfo | string,
  zero: () => any,
): [any, boolean] {
  if (err === null) {
    return [zero(), false]
  }

  const [asserted, ok] = $.typeAssertTuple<any>(err, typeInfo)
  if (ok) {
    return [asserted, true]
  }

  if (typeof (err as any).Unwrap === 'function') {
    const result = (err as any).Unwrap()
    if (Array.isArray(result)) {
      for (const wrappedErr of result) {
        if (wrappedErr && typeof wrappedErr.Error === 'function') {
          const [matched, matchedOK] = asType(wrappedErr, typeInfo, zero)
          if (matchedOK) {
            return [matched, true]
          }
        }
      }
      return [zero(), false]
    }
    if (result && typeof result.Error === 'function') {
      return asType(result, typeInfo, zero)
    }
  }

  return [zero(), false]
}

// Join returns an error that wraps the given errors.
// Any nil error values are discarded.
// Join returns nil if every value in errs is nil.
// The error formats as the concatenation of the strings obtained
// by calling the Error method of each element of errs, with a newline
// between each string.
//
// A non-nil error returned by Join implements the Unwrap() []error method.
export function Join(...errs: $.GoError[]): $.GoError {
  const nonNilErrs = errs.filter((err) => err !== null)

  if (nonNilErrs.length === 0) {
    return null
  }

  if (nonNilErrs.length === 1) {
    return nonNilErrs[0]
  }

  const message = nonNilErrs.map((err) => err!.Error()).join('\n')
  const joinedError = $.newError(message)

  // Add Unwrap method that returns the array of errors
  ;(joinedError as any).Unwrap = function (): $.GoError[] {
    return nonNilErrs
  }

  return joinedError
}
