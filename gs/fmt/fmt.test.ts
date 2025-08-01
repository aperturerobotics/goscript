import { describe, it, expect } from 'vitest'
import * as fmt from './fmt.js'

// Helper to capture stdout via internal stdout.write
// We will monkey-patch global process.stdout.write if available
function captureStdout(run: () => void): string {
  let buf = ''
  const hasProcess =
    typeof process !== 'undefined' &&
    (process as any).stdout &&
    typeof (process as any).stdout.write === 'function'

  if (hasProcess) {
    const orig = (process as any).stdout.write
    ;(process as any).stdout.write = (chunk: any) => {
      buf += typeof chunk === 'string' ? chunk : String(chunk)
      return true
    }
    try {
      run()
    } finally {
      ;(process as any).stdout.write = orig
    }
  } else {
    // Fallback: spy on console.log for environments without process
    const origLog = console.log
    ;(console as any).log = (msg: any) => {
      buf += String(msg) + '\n'
    }
    try {
      run()
    } finally {
      console.log = origLog
    }
  }

  return buf
}

describe('fmt basic value formatting', () => {
  it('%T approximations for primitives', () => {
    // routed through Sprintf which uses format parsing
    expect(fmt.Sprintf('Type: %T', 123)).toBe('Type: int')
    expect(fmt.Sprintf('Type: %T', 3.14)).toBe('Type: float64')
    expect(fmt.Sprintf('Type: %T', 'hello')).toBe('Type: string')
    expect(fmt.Sprintf('Type: %T', true)).toBe('Type: bool')
  })

  it('%d truncation behavior including negatives', () => {
    expect(fmt.Sprintf('%d', 42.9)).toBe('42')
    expect(fmt.Sprintf('%d', -42.9)).toBe('-42')
  })

  it('%q quoted string and rune', () => {
    expect(fmt.Sprintf('%q', 'hello')).toBe(JSON.stringify('hello'))
    // rune-like number
    expect(fmt.Sprintf('%q', 97)).toBe(JSON.stringify('a'))
  })

  it('%p pointer-ish formatting fallback', () => {
    expect(fmt.Sprintf('%p', {})).toBe('0x0')
    expect(fmt.Sprintf('%p', { __address: 255 })).toBe('0xff')
  })

  it('%v default formats for arrays/maps/sets', () => {
    expect(fmt.Sprintf('%v', [1, 2, 3])).toBe('[1 2 3]')
    const m = new Map<any, any>()
    m.set('a', 1)
    m.set('b', 2)
    const out = fmt.Sprintf('%v', m)
    // Order in Map iteration is insertion order; verify shape
    expect(out.startsWith('{')).toBe(true)
    expect(out.includes('a:1')).toBe(true)
    expect(out.includes('b:2')).toBe(true)
    expect(out.endsWith('}')).toBe(true)

    const s = new Set<any>([1, 2, 3])
    expect(fmt.Sprintf('%v', s)).toBe('[1 2 3]')
  })

  it('error and stringer precedence', () => {
    const err = {
      Error() {
        return 'some error'
      },
    }
    expect(fmt.Sprintf('%v', err)).toBe('some error')

    const stringer = {
      String() {
        return 'I am stringer'
      },
    }
    expect(fmt.Sprintf('%v', stringer)).toBe('I am stringer')

    const goStringer = {
      GoString() {
        return '<go stringer>'
      },
    }
    // We prefer GoString() first
    expect(fmt.Sprintf('%v', goStringer)).toBe('<go stringer>')
  })
})

describe('fmt spacing rules', () => {
  it('Sprint: space only between non-strings', () => {
    // Two non-strings => one space
    expect(fmt.Sprint(1, 2)).toBe('1 2')
    // If either is string => no automatic space
    expect(fmt.Sprint('a', 'b')).toBe('ab')
    expect(fmt.Sprint('a', 1)).toBe('a1')
    expect(fmt.Sprint(1, 'b')).toBe('1b')
    // Mixed 3 args
    expect(fmt.Sprint('a', 1, 'b')).toBe('a1b')
    // Go's Sprint inserts a space only when both adjacent operands are non-strings.
    // Between 'b' (string) and 2 (number) there is no automatic space.
    expect(fmt.Sprint(1, 'b', 2)).toBe('1b2')
  })

  it('Print: same spacing as Sprint, outputs to stdout', () => {
    const output = captureStdout(() => {
      fmt.Print(1, 2, 'x', 3)
    })
    expect(output).toBe('1 2x3')
  })

  it('Println: always separates by spaces and appends newline', () => {
    const output = captureStdout(() => {
      fmt.Println('hi', 'there', 1, 2)
    })
    expect(output).toBe('hi there 1 2\n')
  })

  it('Fprint/Fprintln behave like Print/Println with writers', () => {
    const chunks: Uint8Array[] = []
    const writer = {
      Write(b: Uint8Array): [number, any] {
        chunks.push(b)
        return [b.length, null]
      },
    }

    let [n, err] = fmt.Fprint(writer, 1, 2, 'x', 3)
    expect(err).toBeNull()
    expect(n).toBe(5) // "1 2x3".length
    expect(new TextDecoder().decode(chunks[0])).toBe('1 2x3')
    ;[n, err] = fmt.Fprintln(writer, 'hi', 'there', 1, 2)
    expect(err).toBeNull()
    expect(new TextDecoder().decode(chunks[1])).toBe('hi there 1 2\n')
  })
})

describe('fmt parseFormat basic cases', () => {
  it('Printf with %d, %s, %f, width and precision', () => {
    expect(fmt.Sprintf('n=%d s=%s f=%f', 42, 'ok', 3.5)).toBe('n=42 s=ok f=3.5')
    expect(fmt.Sprintf("'%5s'", 'hi')).toBe("'   hi'")
    expect(fmt.Sprintf("'%-.3f'", 3.14159)).toBe("'3.142'") // JS rounds
    expect(fmt.Sprintf("'%6.2f'", 3.14159)).toBe("'  3.14'")
  })

  it('Printf with %% and missing args', () => {
    expect(fmt.Sprintf('100%% done')).toBe('100% done')
    // When the first argument is present but the second is missing,
    // Go prints the formatted first arg followed by the missing marker for the second.
    expect(fmt.Sprintf('%d %s', 1)).toBe('1 %!s(MISSING)')
  })

  it('Printf hex/octal/bin', () => {
    expect(fmt.Sprintf('%x %X %o %b', 255, 255, 8, 5)).toBe('ff FF 10 101')
  })

  it('Printf %c for code points', () => {
    expect(fmt.Sprintf('%c', 65)).toBe('A')
  })
})
