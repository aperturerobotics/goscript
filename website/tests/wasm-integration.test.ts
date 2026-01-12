import { expect, test, describe, beforeAll } from 'vitest'
import { ready, compileGoToTypeScript, isCompilerReady } from '../assets/js/goscript-wasm.js'

// This test actually loads the WASM compiler and tests compilation
describe('WASM Integration', () => {
  beforeAll(async () => {
    // Wait for WASM to be ready with a longer timeout
    await ready
  }, 30000) // 30 second timeout for WASM loading

  test('WASM compiler is ready after loading', () => {
    expect(isCompilerReady()).toBe(true)
  })

  test('goscriptCompile is available on window', () => {
    expect(typeof window.goscriptCompile).toBe('function')
  })

  test('can compile Hello World', async () => {
    const goCode = `package main

func main() {
    println("Hello, World!")
}`
    const tsCode = await compileGoToTypeScript(goCode, 'main')
    expect(tsCode).toContain('$.println')
    expect(tsCode).toContain('Hello, World!')
  })

  test('compiled code has correct import format', async () => {
    const goCode = `package main

func main() {
    println("test")
}`
    const tsCode = await compileGoToTypeScript(goCode, 'main')
    // The compiler should produce this exact import format
    expect(tsCode).toContain('import * as $ from "@goscript/builtin/index.js"')
  })

  test('can compile struct with methods', async () => {
    const goCode = `package main

type Point struct {
    X int
    Y int
}

func (p *Point) Move(dx, dy int) {
    p.X += dx
    p.Y += dy
}

func main() {
    p := &Point{X: 10, Y: 20}
    p.Move(5, 5)
    println(p.X, p.Y)
}`
    const tsCode = await compileGoToTypeScript(goCode, 'main')
    expect(tsCode).toContain('class Point')
    expect(tsCode).toContain('Move')
  })

  test('import stripping removes @goscript/builtin import', async () => {
    const goCode = `package main

func main() {
    println("test")
}`
    const tsCode = await compileGoToTypeScript(goCode, 'main')

    // Simulate the import stripping logic from playground.js
    const stripped = tsCode
      .replace(/^\s*import\s+.*from\s+["'][^"']*["'];?\s*$/gm, '')
      .replace(/import\s+\*\s+as\s+\w+\s+from\s+["'][^"']*["'];?/g, '')
      .replace(/import\s+{[^}]*}\s+from\s+["'][^"']*["'];?/g, '')

    // After stripping, there should be no import statement
    expect(stripped).not.toContain('import')
    // But the code should still reference $
    expect(stripped).toContain('$.println')
  })
})
