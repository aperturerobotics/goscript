// GoScript Playground - Main JavaScript
// This loads pre-compiled examples and allows running them in the browser using esbuild-wasm

import * as goscriptRuntime from '@goscript/builtin'

// Make runtime available globally for executed code
window.$ = goscriptRuntime

let examples = []
let currentExample = null
let esbuildReady = false

// Monaco editors
let goEditor = null
let tsEditor = null

// DOM Elements
const goEditorContainer = document.getElementById('go-editor')
const tsEditorContainer = document.getElementById('ts-editor')
const outputBody = document.getElementById('output-body')
const exampleSelect = document.getElementById('example-select')
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

// Initialize esbuild-wasm (loaded via script tag)
async function initEsbuild() {
  if (compilerStatus) {
    compilerStatus.textContent = 'Loading TypeScript compiler...'
  }
  if (runBtn) {
    runBtn.disabled = true
  }

  try {
    // esbuild is loaded globally via script tag
    if (!window.esbuild) {
      throw new Error('esbuild not loaded')
    }
    if (compilerStatus) {
      compilerStatus.textContent = 'Initializing WebAssembly...'
    }
    await window.esbuild.initialize({
      wasmURL: 'https://cdn.jsdelivr.net/npm/esbuild-wasm@0.27.2/esbuild.wasm',
    })
    esbuildReady = true
    console.log('esbuild-wasm initialized')

    // Hide status and enable button
    if (compilerStatus) {
      compilerStatus.style.display = 'none'
    }
    if (runBtn) {
      runBtn.disabled = false
    }
  } catch (err) {
    console.error('Failed to initialize esbuild-wasm:', err)
    if (compilerStatus) {
      compilerStatus.textContent = 'Compiler failed to load'
      compilerStatus.style.color = '#ff5f56'
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
  // Start loading esbuild and Monaco in parallel
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

  // Wait for esbuild to be ready
  await esbuildPromise

  // Auto-run the code on page load
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
    tsEditor.setValue(example.tsCode || example.typescript || '')
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

runBtn.addEventListener('click', runCode)
clearBtn.addEventListener('click', () => {
  outputBody.textContent = ''
  outputBody.className = 'panel-body output-panel'
})

async function runCode() {
  if (!tsEditor) {
    outputBody.textContent = 'Editor not ready yet.'
    return
  }
  const tsCode = tsEditor.getValue()
  if (!tsCode.trim()) {
    outputBody.textContent = 'No TypeScript code to run.'
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
    // Remove imports - we use the global runtime
    let processedCode = code
      .replace(/import \* as \$ from ["']@goscript\/builtin\/index\.js["']/g, '')
      .replace(/import \* as \$ from ["']@goscript\/builtin["']/g, '')
      .replace(/import .* from ["'][^"']+["']/g, '')

    // Use esbuild to compile TypeScript to JavaScript
    let jsCode
    try {
      const result = await window.esbuild.transform(processedCode, {
        loader: 'ts',
        format: 'esm',
        target: 'es2022',
      })
      jsCode = result.code
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
      typescript: `import * as $ from "@goscript/builtin/index.js"

$.println("Hello, World!")`,
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
      typescript: `import * as $ from "@goscript/builtin/index.js"

let x: number = 10
let y: number = 20
let z: number = x + y
$.println("x =", x)
$.println("y =", y)
$.println("x + y =", z)`,
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
      typescript: `import * as $ from "@goscript/builtin/index.js"

class Point {
  public X: number = 0
  public Y: number = 0

  constructor(init?: Partial<Point>) {
    if (init) Object.assign(this, init)
  }

  public Move(dx: number, dy: number): void {
    this.X += dx
    this.Y += dy
  }
}

const p = new Point({ X: 10, Y: 20 })
$.println("Before:", p.X, p.Y)
p.Move(5, 5)
$.println("After:", p.X, p.Y)`,
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
      typescript: `import * as $ from "@goscript/builtin/index.js"

let nums: number[] = [1, 2, 3]
$.println("Initial:", nums[0], nums[1], nums[2])

nums = $.append(nums, 4, 5)
$.println("After append:", $.len(nums), "elements")

for (const [i, v] of $.range(nums)) {
  $.println("  nums[", i, "] =", v)
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
      typescript: `import * as $ from "@goscript/builtin/index.js"

const ages = new Map<string, number>()
ages.set("Alice", 30)
ages.set("Bob", 25)

$.println("Alice is", ages.get("Alice"))

for (const [name, age] of ages) {
  $.println(name, "is", age, "years old")
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
      typescript: `import * as $ from "@goscript/builtin/index.js"

function add(a: number, b: number): number {
  return a + b
}

function swap(a: number, b: number): [number, number] {
  return [b, a]
}

const sum = add(3, 4)
$.println("3 + 4 =", sum)

const [x, y] = swap(1, 2)
$.println("swap(1, 2) =", x, y)`,
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
      typescript: `import * as $ from "@goscript/builtin/index.js"

interface Speaker {
  Speak(): string
}

class Dog implements Speaker {
  public Name: string = ""

  constructor(init?: Partial<Dog>) {
    if (init) Object.assign(this, init)
  }

  public Speak(): string {
    return this.Name + " says woof!"
  }
}

class Cat implements Speaker {
  public Name: string = ""

  constructor(init?: Partial<Cat>) {
    if (init) Object.assign(this, init)
  }

  public Speak(): string {
    return this.Name + " says meow!"
  }
}

const animals: Speaker[] = [
  new Dog({ Name: "Rex" }),
  new Cat({ Name: "Whiskers" })
]

for (const [_, animal] of $.range(animals)) {
  $.println(animal.Speak())
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
      typescript: `import * as $ from "@goscript/builtin/index.js"

const _defers = $.deferStack()
try {
  $.println("Start")
  _defers.defer(() => $.println("Deferred 1"))
  _defers.defer(() => $.println("Deferred 2"))
  $.println("End")
} finally {
  await _defers.runDefers()
}`,
    },
  ]
}

// Start initialization
init()
