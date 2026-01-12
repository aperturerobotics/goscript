import { expect, test, describe } from 'vitest'

// Simulate the import stripping from playground.js
const stripImports = (code: string): string => {
  return code
    // Remove full line imports (with optional leading whitespace)
    .replace(/^\s*import\s+.*from\s+["'][^"']*["'];?\s*$/gm, '')
    // Remove any remaining import statements
    .replace(/import\s+\*\s+as\s+\w+\s+from\s+["'][^"']*["'];?/g, '')
    .replace(/import\s+{[^}]*}\s+from\s+["'][^"']*["'];?/g, '')
}

describe('Import stripping', () => {
  test('strips @goscript/builtin/index.js import', () => {
    const code = `import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
    $.println("Hello")
}`
    const result = stripImports(code)
    expect(result).not.toContain('import')
    expect(result).toContain('$.println')
  })

  test('strips @goscript/builtin import (no /index.js)', () => {
    const code = `import * as $ from "@goscript/builtin"

export function main() {
    $.println("Hello")
}`
    const result = stripImports(code)
    expect(result).not.toContain('import')
    expect(result).toContain('$.println')
  })

  test('handles Windows-style line endings', () => {
    const code = `import * as $ from "@goscript/builtin/index.js"\r\n\r\nexport function main() {\r\n    $.println("Hello")\r\n}`
    const result = stripImports(code)
    expect(result).not.toContain('import')
  })

  test('handles tabs and spaces around import', () => {
    const code = `  import * as $ from "@goscript/builtin/index.js"

export function main() {
    $.println("Hello")
}`
    const result = stripImports(code)
    // Should either remove the import completely or at least the import keyword
    expect(result).not.toMatch(/import\s+\*/)
  })

  test('strips multiple imports', () => {
    const code = `import * as $ from "@goscript/builtin/index.js"
import { Something } from "./other"
import type { Foo } from "bar"

export function main() {
    $.println("Hello")
}`
    const result = stripImports(code)
    expect(result).not.toContain('import *')
    expect(result).not.toContain('import {')
    expect(result).toContain('$.println')
  })

  test('preserves code after imports', () => {
    const code = `import * as $ from "@goscript/builtin/index.js"

class Point {
  X = 0
  Y = 0
}

function main() {
    const p = new Point()
    $.println(p.X, p.Y)
}`
    const result = stripImports(code)
    expect(result).not.toContain('import')
    expect(result).toContain('class Point')
    expect(result).toContain('function main')
    expect(result).toContain('$.println')
  })
})

describe('JavaScript execution simulation', () => {
  test('stripped JS code can be executed', async () => {
    // This is JavaScript (not TypeScript) so it can be executed directly
    const jsCode = `
function main() {
    $.println("Hello, World!")
}
`
    const logs: string[] = []
    const mockRuntime = {
      println: (...args: unknown[]) => logs.push(args.join(' '))
    }

    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
    const fn = new AsyncFunction('$', jsCode + '\nmain();')
    await fn(mockRuntime)

    expect(logs).toContain('Hello, World!')
  })

  test('class-based JS code can be executed', async () => {
    const jsCode = `
class Point {
  constructor(x, y) {
    this.X = x || 0
    this.Y = y || 0
  }
}

function main() {
    const p = new Point(10, 20)
    $.println("Point:", p.X, p.Y)
}
`
    const logs: string[] = []
    const mockRuntime = {
      println: (...args: unknown[]) => logs.push(args.join(' '))
    }

    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
    const fn = new AsyncFunction('$', jsCode + '\nmain();')
    await fn(mockRuntime)

    expect(logs).toContain('Point: 10 20')
  })
})
