// GoScript Playground - Main JavaScript
// This loads the GoScript WASM compiler and allows running Go code in the browser

import * as goscriptRuntime from '@goscript/builtin'
import {
  ready as wasmReady,
  compileGoToTypeScript,
} from './goscript-wasm.js'
import { packages as goscriptPackages } from 'virtual:goscript-packages'

// Make runtime available globally for executed code
window.$ = goscriptRuntime

// Store pre-bundled packages for the esbuild plugin
window.__goscriptPackages = goscriptPackages

let examples = []
let currentExample = null
let esbuildReady = false
let goscriptReady = false

// Monaco editors
let goEditor = null
let tsEditor = null

// DOM Elements
const goEditorContainer = document.getElementById('go-editor')
const tsEditorContainer = document.getElementById('ts-editor')
const outputBody = document.getElementById('output-body')
const exampleSelect = document.getElementById('example-select')
const compileBtn = document.getElementById('compile-btn')
const runBtn = document.getElementById('run-btn')
const clearBtn = document.getElementById('clear-btn')
const compilerStatus = document.getElementById('compiler-status')

// Initialize Monaco editors
function initMonaco() {
  if (!window.monaco) return

  const baseOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 13,
    lineNumbers: 'on',
    renderLineHighlight: 'none',
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    overviewRulerBorder: false,
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10,
    },
    padding: { top: 12, bottom: 12 },
    automaticLayout: true,
  }

  monaco.editor.defineTheme('goscript-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#111111',
      'editor.lineHighlightBackground': '#111111',
    },
  })

  // Go editor is editable
  goEditor = monaco.editor.create(goEditorContainer, {
    ...baseOptions,
    readOnly: false,
    language: 'go',
    theme: 'goscript-dark',
    value: '// Select an example or enter Go code',
  })

  // TypeScript editor is read-only
  tsEditor = monaco.editor.create(tsEditorContainer, {
    ...baseOptions,
    readOnly: true,
    language: 'typescript',
    theme: 'goscript-dark',
    value: '// TypeScript output will appear here',
  })
}

// Initialize GoScript WASM compiler
async function initGoscript() {
  if (compilerStatus) {
    compilerStatus.textContent = 'Loading GoScript compiler...'
  }

  try {
    await wasmReady
    goscriptReady = true
    updateButtonStates()
  } catch (err) {
    console.error('Failed to initialize GoScript WASM compiler:', err)
    if (compilerStatus) {
      compilerStatus.textContent = 'GoScript compiler failed to load'
      compilerStatus.style.color = '#ff5f56'
    }
  }
}

// Initialize esbuild-wasm (loaded via script tag)
async function initEsbuild() {
  try {
    if (!window.esbuild) {
      throw new Error('esbuild not loaded')
    }
    await window.esbuild.initialize({
      wasmURL: 'https://cdn.jsdelivr.net/npm/esbuild-wasm@0.27.2/esbuild.wasm',
    })
    esbuildReady = true
    updateButtonStates()
  } catch (err) {
    console.error('Failed to initialize esbuild-wasm:', err)
  }
}

// Update button states based on what's ready
function updateButtonStates() {
  if (compileBtn) {
    compileBtn.disabled = !goscriptReady
  }
  if (runBtn) {
    runBtn.disabled = !esbuildReady
  }
  if (compilerStatus) {
    if (goscriptReady && esbuildReady) {
      compilerStatus.style.display = 'none'
    } else if (goscriptReady) {
      compilerStatus.textContent = 'Loading TypeScript runner...'
    } else if (esbuildReady) {
      compilerStatus.textContent = 'Loading GoScript compiler...'
    }
  }
}

// Wait for Monaco to be ready
function waitForMonaco() {
  return new Promise((resolve) => {
    if (window.monacoReady) {
      resolve()
    } else {
      window.addEventListener('monaco-ready', () => resolve(), { once: true })
    }
  })
}

// Initialize
async function init() {
  // Start loading all dependencies in parallel
  const goscriptPromise = initGoscript()
  const esbuildPromise = initEsbuild()
  const monacoPromise = waitForMonaco().then(() => initMonaco())

  // Load examples
  try {
    const response = await fetch('../data/examples.json')
    if (response.ok) {
      examples = await response.json()
      populateExamples()
    } else {
      console.warn('No examples.json found, using built-in examples')
      examples = getBuiltinExamples()
      populateExamples()
    }
  } catch (err) {
    console.warn('Failed to load examples:', err)
    examples = getBuiltinExamples()
    populateExamples()
  }

  // Wait for Monaco to be ready before loading example
  await monacoPromise

  // Select first example by default
  if (examples.length > 0) {
    exampleSelect.value = examples[0].name
    loadExample(examples[0])
  }

  // Wait for both compilers to be ready
  await Promise.all([goscriptPromise, esbuildPromise])

  // Auto-compile and run the code on page load
  await compileCode()
  runCode()
}

function populateExamples() {
  // Clear existing options except the first placeholder
  while (exampleSelect.options.length > 0) {
    exampleSelect.remove(0)
  }
  // Add placeholder
  const placeholder = document.createElement('option')
  placeholder.value = ''
  placeholder.textContent = 'Select an example...'
  exampleSelect.appendChild(placeholder)
  // Add examples
  for (const example of examples) {
    const option = document.createElement('option')
    option.value = example.name
    option.textContent = example.title || example.name
    exampleSelect.appendChild(option)
  }
}

function loadExample(example) {
  currentExample = example
  if (goEditor) {
    goEditor.setValue(example.goCode || example.go || '')
  }
  if (tsEditor) {
    // Show pre-compiled TypeScript if available, otherwise show placeholder
    const tsCode = example.tsCode || example.typescript || ''
    if (tsCode) {
      tsEditor.setValue(tsCode)
    } else {
      tsEditor.setValue('// Click "Compile" to generate TypeScript')
    }
  }
  outputBody.textContent = ''
  outputBody.className = 'panel-body output-panel'
}

// Event Handlers
exampleSelect.addEventListener('change', () => {
  const name = exampleSelect.value
  const example = examples.find((e) => e.name === name)
  if (example) {
    loadExample(example)
  }
})

compileBtn.addEventListener('click', () => compileCode())
runBtn.addEventListener('click', () => runCode())
clearBtn.addEventListener('click', () => {
  outputBody.textContent = ''
  outputBody.className = 'panel-body output-panel'
})

async function compileCode() {
  if (!goEditor) {
    outputBody.textContent = 'Editor not ready yet.'
    return
  }
  if (!goscriptReady) {
    outputBody.textContent = 'GoScript compiler not ready yet.'
    return
  }

  const goCode = goEditor.getValue()
  if (!goCode.trim()) {
    outputBody.textContent = 'No Go code to compile.'
    return
  }

  outputBody.textContent = 'Compiling...'
  outputBody.className = 'panel-body output-panel'

  try {
    const tsCode = await compileGoToTypeScript(goCode, 'main')
    if (tsEditor) {
      tsEditor.setValue(tsCode)
    }
    outputBody.textContent = 'Compiled successfully!'
    outputBody.className = 'panel-body output-panel'
  } catch (err) {
    outputBody.textContent = `Compile Error: ${err.message}`
    outputBody.className = 'panel-body output-panel error'
  }
}

async function runCode() {
  if (!tsEditor || !goEditor) {
    outputBody.textContent = 'Editor not ready yet.'
    return
  }

  // Always compile first to ensure TypeScript matches the Go code
  if (goscriptReady) {
    const goCode = goEditor.getValue()
    if (goCode.trim() && !goCode.startsWith('// Select an example')) {
      outputBody.textContent = 'Compiling...'
      outputBody.className = 'panel-body output-panel'
      try {
        const tsCode = await compileGoToTypeScript(goCode, 'main')
        tsEditor.setValue(tsCode)
      } catch (err) {
        outputBody.textContent = `Compile Error: ${err.message}`
        outputBody.className = 'panel-body output-panel error'
        return
      }
    }
  }

  const tsCode = tsEditor.getValue()
  if (!tsCode.trim() || tsCode.startsWith('// Click "Compile"') || tsCode.startsWith('// TypeScript output')) {
    outputBody.textContent = 'No TypeScript code to run. Enter Go code first.'
    return
  }

  outputBody.textContent = 'Running...'
  outputBody.className = 'panel-body output-panel'

  try {
    const output = await runTypeScript(tsCode)
    outputBody.textContent = output || '(no output)'
    outputBody.className = 'panel-body output-panel'
  } catch (err) {
    outputBody.textContent = `Error: ${err.message}`
    outputBody.className = 'panel-body output-panel error'
  }
}

// Create an esbuild plugin that resolves @goscript/* imports
function createGoscriptPlugin() {
  return {
    name: 'goscript-resolver',
    setup(build) {
      // Resolve @goscript/builtin to a virtual module
      build.onResolve({ filter: /^@goscript\/builtin/ }, (args) => ({
        path: args.path,
        namespace: 'goscript-builtin',
      }))

      // Resolve other @goscript/* packages
      build.onResolve({ filter: /^@goscript\// }, (args) => {
        // Normalize: remove /index.js suffix for lookup
        let pkgName = args.path.replace(/\/index\.js$/, '')
        if (pkgName === '@goscript/builtin') {
          return { path: args.path, namespace: 'goscript-builtin' }
        }
        return { path: pkgName, namespace: 'goscript-packages' }
      })

      // Load @goscript/builtin - return a shim that uses the global
      build.onLoad({ filter: /.*/, namespace: 'goscript-builtin' }, () => ({
        contents: 'module.exports = globalThis.$',
        loader: 'js',
      }))

      // Load other @goscript/* packages from pre-bundled code
      build.onLoad({ filter: /.*/, namespace: 'goscript-packages' }, (args) => {
        const pkgCode = window.__goscriptPackages[args.path]
        if (!pkgCode) {
          return {
            contents: `throw new Error("Package not available in playground: ${args.path}")`,
            loader: 'js',
          }
        }
        // The pre-bundled code has external references to @goscript/builtin
        // We need to rewrite those to use the global
        const rewritten = pkgCode
          .replace(
            /import\s*\*\s*as\s+\$\s+from\s*["']@goscript\/builtin(?:\/index\.js)?["']/g,
            'const $ = globalThis.$',
          )
          .replace(
            /from\s*["']@goscript\/builtin(?:\/index\.js)?["']/g,
            'from "goscript-builtin-shim"',
          )
        return { contents: rewritten, loader: 'js' }
      })
    },
  }
}

async function runTypeScript(code) {
  if (!esbuildReady) {
    throw new Error('esbuild-wasm not ready yet, please wait...')
  }

  // Check for real runtime
  if (!window.$) {
    throw new Error('GoScript runtime not loaded')
  }

  // Capture output by intercepting console.log (used by runtime's println)
  const outputLines = []
  const originalConsoleLog = console.log
  console.log = (...args) => {
    outputLines.push(args.map(formatValue).join(' '))
  }

  try {
    // Use esbuild.build() with our plugin to properly resolve imports
    let jsCode
    try {
      const result = await window.esbuild.build({
        stdin: {
          contents: code,
          loader: 'ts',
          resolveDir: '/',
        },
        bundle: true,
        format: 'esm',
        target: 'es2022',
        write: false,
        plugins: [createGoscriptPlugin()],
      })
      jsCode = result.outputFiles[0].text
    } catch (err) {
      throw new Error(`TypeScript compilation error: ${err.message}`)
    }

    // Remove any remaining export keywords (esbuild preserves them)
    jsCode = jsCode.replace(/^export /gm, '')

    // Add a call to main() at the end if it exists
    if (/async function main\s*\(/.test(jsCode)) {
      jsCode += '\nawait main();'
    } else if (/function main\s*\(/.test(jsCode)) {
      jsCode += '\nmain();'
    }

    // Create an async function to run the code
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

    // Run with the global runtime
    const fn = new AsyncFunction('$', jsCode)
    await fn(window.$)

    return outputLines.join('\n')
  } finally {
    // Restore console.log
    console.log = originalConsoleLog
  }
}

// Format a value for display
function formatValue(v) {
  if (v === null || v === undefined) {
    return '<nil>'
  }
  if (typeof v === 'object') {
    if (Array.isArray(v)) {
      return '[' + v.map(formatValue).join(' ') + ']'
    }
    if (v instanceof Map) {
      const entries = [...v.entries()].map(
        ([k, val]) => `${formatValue(k)}:${formatValue(val)}`,
      )
      return 'map[' + entries.join(' ') + ']'
    }
    if (v.constructor && v.constructor.name !== 'Object') {
      // Struct-like object
      return JSON.stringify(v)
    }
    return JSON.stringify(v)
  }
  return String(v)
}

// Built-in examples for when examples.json is not available
function getBuiltinExamples() {
  return [
    {
      name: 'Hello World',
      go: `package main

func main() {
    println("Hello, World!")
}`,
    },
    {
      name: 'Variables',
      go: `package main

func main() {
    var x int = 10
    y := 20
    z := x + y
    println("x =", x)
    println("y =", y)
    println("x + y =", z)
}`,
    },
    {
      name: 'Struct',
      go: `package main

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
    println("Before:", p.X, p.Y)
    p.Move(5, 5)
    println("After:", p.X, p.Y)
}`,
    },
    {
      name: 'Slice Operations',
      go: `package main

func main() {
    nums := []int{1, 2, 3}
    println("Initial:", nums[0], nums[1], nums[2])

    nums = append(nums, 4, 5)
    println("After append:", len(nums), "elements")

    for i, v := range nums {
        println("  nums[", i, "] =", v)
    }
}`,
    },
    {
      name: 'Map',
      go: `package main

func main() {
    ages := make(map[string]int)
    ages["Alice"] = 30
    ages["Bob"] = 25

    println("Alice is", ages["Alice"])

    for name, age := range ages {
        println(name, "is", age, "years old")
    }
}`,
    },
    {
      name: 'Functions',
      go: `package main

func add(a, b int) int {
    return a + b
}

func swap(a, b int) (int, int) {
    return b, a
}

func main() {
    sum := add(3, 4)
    println("3 + 4 =", sum)

    x, y := swap(1, 2)
    println("swap(1, 2) =", x, y)
}`,
    },
    {
      name: 'Interface',
      go: `package main

type Speaker interface {
    Speak() string
}

type Dog struct {
    Name string
}

func (d Dog) Speak() string {
    return d.Name + " says woof!"
}

type Cat struct {
    Name string
}

func (c Cat) Speak() string {
    return c.Name + " says meow!"
}

func main() {
    animals := []Speaker{
        Dog{Name: "Rex"},
        Cat{Name: "Whiskers"},
    }

    for _, animal := range animals {
        println(animal.Speak())
    }
}`,
    },
    {
      name: 'Defer',
      go: `package main

func main() {
    println("Start")
    defer println("Deferred 1")
    defer println("Deferred 2")
    println("End")
}`,
    },
    // TODO: JSON example disabled until playground supports compiling dependencies
    // {
    //   name: 'JSON',
    //   go: `package main
    //
    // import "encoding/json"
    //
    // type Person struct {
    //     Name   string \`json:"name"\`
    //     Age    int    \`json:"age"\`
    //     Active bool   \`json:"active"\`
    // }
    //
    // func main() {
    //     p := Person{Name: "Alice", Age: 30, Active: true}
    //     data, err := json.Marshal(p)
    //     if err != nil {
    //         println("Marshal error:", err.Error())
    //     } else {
    //         println("Marshal:", string(data))
    //     }
    // }`,
    // },
  ]
}

// Start initialization
init()
