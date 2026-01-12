// GoScript WASM Compiler Wrapper
// Loads and manages the goscript compiler compiled to WebAssembly

let wasmReady = false
let wasmError = null

// Initialize the Go WASM runtime
async function initGoWasm() {
  // Load wasm_exec.js if not already loaded
  if (!window.Go) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = '/wasm_exec.js'
      script.onload = resolve
      script.onerror = () => reject(new Error('Failed to load wasm_exec.js'))
      document.head.appendChild(script)
    })
  }

  if (!window.Go) {
    throw new Error('Go class not available after loading wasm_exec.js')
  }

  const go = new Go()

  // Fetch and instantiate the WASM module
  const wasmResponse = await fetch('/goscript.wasm')
  if (!wasmResponse.ok) {
    throw new Error(`Failed to fetch goscript.wasm: ${wasmResponse.status} ${wasmResponse.statusText}`)
  }

  const result = await WebAssembly.instantiateStreaming(
    wasmResponse,
    go.importObject,
  )

  // Run the Go program (this sets up the global goscriptCompile function)
  go.run(result.instance)

  // Wait for the compile function to be available
  await new Promise((resolve, reject) => {
    let attempts = 0
    const maxAttempts = 500 // 5 seconds max
    const check = () => {
      if (window.goscriptCompile) {
        resolve()
      } else if (attempts++ > maxAttempts) {
        reject(new Error('Timeout waiting for goscriptCompile to be available'))
      } else {
        setTimeout(check, 10)
      }
    }
    check()
  })

  wasmReady = true
}

// Compile Go source code to TypeScript
export async function compileGoToTypeScript(goSource, packageName = 'main') {
  if (!wasmReady) {
    if (wasmError) {
      throw wasmError
    }
    throw new Error('GoScript WASM compiler not initialized')
  }

  const result = window.goscriptCompile(goSource, packageName)

  if (result.error) {
    throw new Error(result.error)
  }

  return result.output
}

// Check if the WASM compiler is ready
export function isCompilerReady() {
  return wasmReady
}

// Get any initialization error
export function getCompilerError() {
  return wasmError
}

// Initialize and export a promise that resolves when ready
export const ready = initGoWasm().catch((err) => {
  wasmError = err
  console.error('Failed to initialize GoScript WASM compiler:', err)
  throw err
})
