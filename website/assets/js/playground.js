// GoScript Playground - Main JavaScript
// This loads pre-compiled examples and allows running them in the browser using esbuild-wasm

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

// Initialize
async function init() {
  // Wait for Monaco to be ready
  if (window.monacoReady) {
    initMonaco()
  } else {
    window.addEventListener('monaco-ready', () => initMonaco())
  }

  // Start loading esbuild in parallel
  const esbuildPromise = initEsbuild()

  try {
    // Load examples
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

  // Capture output
  const outputLines = []

  // Create a mock runtime with println capture
  const mockRuntime = createMockRuntime((line) => {
    outputLines.push(line)
  })

  // Remove imports - we'll provide the runtime as a parameter
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

  // Wrap in try-catch and run
  try {
    const fn = new AsyncFunction('$', jsCode)
    await fn(mockRuntime)
  } catch (err) {
    throw new Error(`Runtime error: ${err.message}`)
  }

  return outputLines.join('\n')
}

// Create a mock runtime that captures println output
function createMockRuntime(onPrint) {
  return {
    // Basic output
    println: (...args) => {
      onPrint(args.map(formatValue).join(' '))
    },
    print: (...args) => {
      onPrint(args.map(formatValue).join(''))
    },

    // Type utilities
    makeSlice: (len = 0, cap) => {
      const arr = new Array(len).fill(null)
      arr._cap = cap || len
      return arr
    },
    sliceCopy: (dst, src) => {
      const len = Math.min(dst.length, src.length)
      for (let i = 0; i < len; i++) {
        dst[i] = src[i]
      }
      return len
    },
    append: (slice, ...items) => {
      return [...(slice || []), ...items]
    },
    len: (v) => {
      if (v === null || v === undefined) return 0
      if (typeof v === 'string') return v.length
      if (Array.isArray(v)) return v.length
      if (v instanceof Map) return v.size
      return 0
    },
    cap: (v) => {
      if (v === null || v === undefined) return 0
      if (Array.isArray(v)) return v._cap || v.length
      return 0
    },

    // Map utilities
    makeMap: () => new Map(),
    mapGet: (m, k, defaultVal) => {
      if (!m) return [defaultVal, false]
      const has = m.has(k)
      return [has ? m.get(k) : defaultVal, has]
    },
    deleteMapEntry: (m, k) => {
      if (m) m.delete(k)
    },

    // Channel mock (simplified)
    makeChan: (cap = 0) => ({
      _buffer: [],
      _cap: cap,
      _closed: false,
    }),
    chanSend: async (ch, val) => {
      if (ch._closed) throw new Error('send on closed channel')
      ch._buffer.push(val)
    },
    chanRecv: async (ch) => {
      if (ch._buffer.length > 0) {
        return ch._buffer.shift()
      }
      return null
    },
    chanRecvWithOk: async (ch) => {
      if (ch._buffer.length > 0) {
        return { value: ch._buffer.shift(), ok: true }
      }
      if (ch._closed) {
        return { value: null, ok: false }
      }
      return { value: null, ok: true }
    },
    closeChan: (ch) => {
      ch._closed = true
    },

    // Range utilities
    range: function* (v) {
      if (Array.isArray(v)) {
        for (let i = 0; i < v.length; i++) {
          yield [i, v[i]]
        }
      } else if (v instanceof Map) {
        for (const [k, val] of v) {
          yield [k, val]
        }
      } else if (typeof v === 'string') {
        for (let i = 0; i < v.length; i++) {
          yield [i, v.charCodeAt(i)]
        }
      }
    },

    // VarRef for pointers
    varRef: (val) => ({ value: val }),

    // Type assertions (simplified)
    typeAssert: (val, typeCheck) => {
      return val
    },
    typeAssertOk: (val, typeCheck) => {
      return [val, val !== null && val !== undefined]
    },

    // Error handling
    error: null,
    newError: (msg) => new Error(msg),

    // Panic/recover (simplified)
    panic: (msg) => {
      throw new Error(String(msg))
    },
    recover: () => null,

    // String utilities
    stringToBytes: (s) => {
      const bytes = []
      for (let i = 0; i < s.length; i++) {
        bytes.push(s.charCodeAt(i))
      }
      return bytes
    },
    bytesToString: (b) => String.fromCharCode(...b),
    stringToRunes: (s) => [...s].map((c) => c.codePointAt(0)),
    runesToString: (r) => String.fromCodePoint(...r),

    // Numeric operations
    intDiv: (a, b) => Math.trunc(a / b),
    intMod: (a, b) => a % b,

    // Defer mock
    deferStack: () => ({
      _stack: [],
      defer: function (fn) {
        this._stack.push(fn)
      },
      runDefers: async function () {
        while (this._stack.length > 0) {
          const fn = this._stack.pop()
          try {
            await fn()
          } catch (e) {
            console.error('defer error:', e)
          }
        }
      },
    }),

    // Goroutine mock (simplified - just runs async)
    go: (fn) => {
      setTimeout(() => fn().catch(console.error), 0)
    },

    // Select mock (simplified)
    select: async (cases) => {
      // Very simplified - just pick first ready case
      for (const c of cases) {
        if (c.recv && c.ch._buffer.length > 0) {
          const val = c.ch._buffer.shift()
          if (c.fn) c.fn(val)
          return
        }
        if (c.send && c.ch._buffer.length < c.ch._cap) {
          c.ch._buffer.push(c.val)
          if (c.fn) c.fn()
          return
        }
        if (c.default) {
          if (c.fn) c.fn()
          return
        }
      }
    },

    // Zero values
    zero: (type) => {
      switch (type) {
        case 'int':
        case 'int8':
        case 'int16':
        case 'int32':
        case 'int64':
        case 'uint':
        case 'uint8':
        case 'uint16':
        case 'uint32':
        case 'uint64':
        case 'float32':
        case 'float64':
        case 'byte':
        case 'rune':
          return 0
        case 'string':
          return ''
        case 'bool':
          return false
        default:
          return null
      }
    },

    // Additional runtime helpers
    arrayToSlice: (arr) => arr,
    markAsStructValue: (v) => v,
    registerStructType: () => {},
    TypeKind: {
      Basic: 'basic',
      Pointer: 'pointer',
      Struct: 'struct',
      Interface: 'interface',
      Slice: 'slice',
      Array: 'array',
      Map: 'map',
      Chan: 'chan',
      Func: 'func',
    },
    typeSwitch: (val, cases, defaultCase) => {
      for (const c of cases) {
        if (c.body) {
          c.body(val)
          return
        }
      }
      if (defaultCase) defaultCase()
    },
  }
}

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
