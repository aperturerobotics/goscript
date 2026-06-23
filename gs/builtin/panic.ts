// GoPanic carries a Go panic value as it unwinds the JavaScript call stack. A
// deferred recover() reads its value; an unrecovered GoPanic surfaces as a
// thrown error whose message is "panic: <value>", matching Go's crash output.
export class GoPanic extends Error {
  constructor(public readonly value: unknown) {
    super(`panic: ${formatPanicValue(value)}`)
  }
}

// RuntimeError is the value carried by a panic from a Go runtime fault: index
// out of range, slice bounds out of range, integer divide by zero, or nil
// pointer dereference. It implements the Go error interface (Error()), so a
// recovered runtime panic exposes the same shape as Go's runtime.Error.
export class RuntimeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RuntimeError'
  }

  Error(): string {
    return this.message
  }
}

/**
 * Implementation of Go's built-in panic function.
 * @param args Arguments passed to panic
 */
export function panic(...args: unknown[]): never {
  const value = args.length === 1 ? args[0] : args
  throw new GoPanic(value)
}

// runtimePanic raises a Go runtime panic carrying a RuntimeError with the given
// Go-formatted message (for example "runtime error: index out of range [5] with
// length 3"). Every runtime fault routes through here so recover() observes a
// GoPanic whose value is a runtime.Error, matching Go.
export function runtimePanic(message: string): never {
  throw new GoPanic(new RuntimeError(message))
}

export function panicValue(value: unknown): unknown {
  if (value instanceof GoPanic) {
    return value.value
  }
  return value
}

function formatPanicValue(value: unknown): string {
  if (value instanceof Error) {
    return value.message
  }
  if (
    value !== null &&
    typeof value === 'object' &&
    'Error' in value &&
    typeof (value as { Error?: unknown }).Error === 'function'
  ) {
    return String((value as { Error(): string }).Error())
  }
  return String(value)
}

// Panic recovery function (simplified implementation)
export function recover(): any {
  // In a real implementation, this would interact with Go's panic/recover mechanism
  // For now, return null to indicate no panic was recovered
  return null
}
