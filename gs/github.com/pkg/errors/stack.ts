import * as $ from '@goscript/builtin/index.js'

// Type definitions
export type uintptr = number
export type Frame = uintptr
export type StackTrace = $.Slice<Frame>

export function Frame_pc(receiver: Frame): uintptr {
  return receiver - 1
}

export function Frame_file(_receiver: Frame): string {
  return 'unknown'
}

export function Frame_line(_receiver: Frame): number {
  return 0
}

export function Frame_name(_receiver: Frame): string {
  return 'unknown'
}

export function Frame_MarshalText(receiver: Frame): [$.Bytes, $.GoError] {
  const name = Frame_name(receiver)
  if (name == 'unknown') {
    return [new TextEncoder().encode(name), null]
  }
  return [
    new TextEncoder().encode(
      `${name} ${Frame_file(receiver)}:${Frame_line(receiver)}`,
    ),
    null,
  ]
}

export function StackTrace_Format(
  _receiver: StackTrace,
  _state: any,
  _verb: number,
): void {
  // Stack frame formatting is informational in the JavaScript target.
}

class stack {
  constructor(private _value: uintptr[]) {}

  valueOf(): uintptr[] {
    return this._value
  }

  toString(): string {
    return String(this._value)
  }

  static from(value: uintptr[]): stack {
    return new stack(value)
  }

  public StackTrace(): StackTrace {
    const s = this._value
    if (!s || s.length === 0) {
      return null
    }

    const frames: Frame[] = []
    for (let i = 0; i < s.length; i++) {
      frames.push(s[i])
    }
    return $.arrayToSlice(frames)
  }
}

// callers returns a simplified stack trace using JavaScript's native stack
export function callers(): $.VarRef<stack> | null {
  try {
    // Get JavaScript stack trace
    throw new Error()
  } catch (e: any) {
    // Parse the stack trace to get some basic frame information
    const stackLines = e.stack ? e.stack.split('\n') : []

    // Create simplified frame data - just use line numbers as uintptr values
    const pcs: uintptr[] = []
    for (let i = 0; i < Math.min(stackLines.length, 8); i++) {
      pcs.push(i + 1) // Simple frame counter
    }

    const st = new stack(pcs)
    return $.varRef(st)
  }
}

// funcname extracts the function name from a full function path
export function funcname(name: string): string {
  const lastDot = name.lastIndexOf('.')
  if (lastDot >= 0) {
    return name.substring(lastDot + 1)
  }
  return name
}
