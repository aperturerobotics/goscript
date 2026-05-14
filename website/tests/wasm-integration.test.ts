import { expect, test, describe, beforeAll } from 'vitest'

type WasmModule = typeof import('../assets/js/goscript-wasm.js')

const shouldRunWasm =
  typeof window !== 'undefined' &&
  typeof document !== 'undefined' &&
  import.meta.env.VITE_GOSCRIPT_WASM_INTEGRATION === '1'
const describeWasm = shouldRunWasm ? describe : describe.skip
let wasmModule: WasmModule

// This test loads the WASM adapter and verifies the browser source compile path.
describeWasm('WASM Integration', () => {
  beforeAll(async () => {
    wasmModule = await import('../assets/js/goscript-wasm.js')
    await wasmModule.ready
  }, 30000) // 30 second timeout for WASM loading

  test('WASM compiler is ready after loading', () => {
    expect(wasmModule.isCompilerReady()).toBe(true)
  })

  test('goscriptCompile is available on window', () => {
    expect(typeof window.goscriptCompile).toBe('function')
  })

  test('compiles browser source to TypeScript', async () => {
    const goCode = `package main

func main() {
    println("Hello, World!")
}`
    const output = await wasmModule.compileGoToTypeScript(goCode, 'main')
    expect(output).toContain('export async function main')
    expect(output).toContain('$.println("Hello, World!")')
  })
})
