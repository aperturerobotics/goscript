import { withRecoveringPanic } from './panic.js'

/**
 * DisposableStack manages synchronous disposable resources, mimicking Go's defer behavior.
 * Functions added via `defer` are executed in LIFO order when the stack is disposed.
 * Implements the `Disposable` interface for use with `using` declarations.
 */
export class DisposableStack implements Disposable {
  private stack: (() => void)[] = []

  /**
   * Adds a function to be executed when the stack is disposed.
   * @param fn The function to defer.
   */
  defer(fn: () => void): void {
    this.stack.push(fn)
  }

  dispose(): void {
    while (this.stack.length) {
      const fn = this.stack.pop()!
      fn()
    }
  }

  disposePanic(err: unknown): void {
    withRecoveringPanic(err, () => this.dispose())
  }

  /**
   * Disposes during ordinary scope exit.
   */
  [Symbol.dispose](): void {
    this.dispose()
  }
}

/**
 * AsyncDisposableStack manages asynchronous disposable resources, mimicking Go's defer behavior.
 * Functions added via `defer` are executed sequentially in LIFO order when the stack is disposed.
 * Implements the `AsyncDisposable` interface for use with `await using` declarations.
 */
export class AsyncDisposableStack implements AsyncDisposable {
  private stack: (() => Promise<void> | void)[] = []

  /**
   * Adds a synchronous or asynchronous function to be executed when the stack is disposed.
   * @param fn The function to defer. Can return void or a Promise<void>.
   */
  defer(fn: () => Promise<void> | void): void {
    this.stack.push(fn)
  }

  async dispose(): Promise<void> {
    while (this.stack.length) {
      const fn = this.stack.pop()!
      await fn()
    }
  }

  async disposePanic(err: unknown): Promise<void> {
    while (this.stack.length) {
      const fn = this.stack.pop()!
      const result = withRecoveringPanic(err, () => fn())
      if (result && typeof (result as Promise<void>).then === 'function') {
        await result
      }
    }
  }

  async [Symbol.asyncDispose](): Promise<void> {
    await this.dispose()
  }

  [Symbol.dispose](): void {
    while (this.stack.length) {
      const fn = this.stack.pop()!
      const result = fn()
      if (result && typeof (result as Promise<void>).then === 'function') {
        throw new Error('async deferred function disposed synchronously')
      }
    }
  }
}
