// GoPanic carries a Go panic value as it unwinds the JavaScript call stack. A
// deferred recover() reads its value and sets recovered; an unrecovered GoPanic
// surfaces as a thrown error whose message is "panic: <value>", matching Go's
// crash output.
export class GoPanic extends Error {
  recovered = false

  constructor(public readonly value: unknown) {
    super(`panic: ${formatPanicValue(value)}`)
  }
}

// panicStack holds GoPanics that have been thrown but not yet cleared by a
// recover-aware catch. activeRecoverPanic is set only while a defer stack is
// disposing the exact GoPanic caught by that frame; recover() outside that
// dynamic scope returns nil, so unrelated async panics cannot be recovered by
// another task.
const panicStack: GoPanic[] = []
let activeRecoverPanic: GoPanic | null = null

export function withRecoveringPanic<T>(err: unknown, fn: () => T): T {
  const previous = activeRecoverPanic
  activeRecoverPanic = err instanceof GoPanic ? err : null
  try {
    return fn()
  } finally {
    activeRecoverPanic = previous
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
  const goPanic = new GoPanic(value)
  panicStack.push(goPanic)
  throw goPanic
}

// runtimePanic raises a Go runtime panic carrying a RuntimeError with the given
// Go-formatted message (for example "runtime error: index out of range [5] with
// length 3"). Every runtime fault routes through here so recover() observes a
// GoPanic whose value is a runtime.Error, matching Go.
export function runtimePanic(message: string): never {
  const goPanic = new GoPanic(new RuntimeError(message))
  panicStack.push(goPanic)
  throw goPanic
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

// recover stops the panic currently unwinding this defer stack and returns its
// value. It returns nil when no defer stack is unwinding a panic, so unrelated
// async panics cannot be recovered by a normal-return defer in another task.
export function recover(): any {
  const goPanic = activeRecoverPanic
  if (goPanic === null || goPanic.recovered) {
    return null
  }
  goPanic.recovered = true
  const idx = panicStack.indexOf(goPanic)
  if (idx !== -1) {
    panicStack.splice(idx, 1)
  }
  return goPanic.value
}

// recovered reports whether err is a GoPanic that a deferred recover() consumed,
// and removes it from the in-flight stack. The catch block generated for a
// defer+recover function calls this: true means swallow the panic and return the
// function's named results; false means rethrow so an outer frame can recover or
// the program crashes with the Go panic message.
export function recovered(err: unknown): boolean {
  if (err instanceof GoPanic && err.recovered) {
    const idx = panicStack.indexOf(err)
    if (idx !== -1) {
      panicStack.splice(idx, 1)
    }
    return true
  }
  return false
}
