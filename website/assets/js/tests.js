// GoScript Test Browser - JavaScript
// This displays pre-generated compliance test data and runs them using esbuild-wasm

let tests = []
let filteredTests = []
let currentTest = null
let testResults = new Map() // name -> 'passed' | 'failed' | 'skipped' | 'running'
let isRunning = false
let shouldStop = false
let esbuildReady = false

// DOM Elements
const testSearch = document.getElementById('test-search')
const testList = document.getElementById('test-list')
const testCount = document.getElementById('test-count')
const testName = document.getElementById('test-name')
const goEditorContainer = document.getElementById('go-editor')
const tsEditorContainer = document.getElementById('ts-editor')
const expectedOutput = document.getElementById('expected-output')
const actualOutput = document.getElementById('actual-output')
const runBtn = document.getElementById('run-btn')
const runAllBtn = document.getElementById('run-all-btn')
const stopBtn = document.getElementById('stop-btn')
const statsBar = document.getElementById('stats-bar')
const statsPassed = document.getElementById('stats-passed')
const statsFailed = document.getElementById('stats-failed')
const statsSkipped = document.getElementById('stats-skipped')
const progressBar = document.getElementById('progress-bar')
const progressFill = document.getElementById('progress-fill')
const compilerStatus = document.getElementById('compiler-status')
const compilerStatusText = document.getElementById('compiler-status-text')

// Monaco editors
let goEditor = null
let tsEditor = null

// Initialize Monaco editors
function initMonaco() {
  if (!window.monaco) return

  const editorOptions = {
    readOnly: true,
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

  goEditor = monaco.editor.create(goEditorContainer, {
    ...editorOptions,
    language: 'go',
    theme: 'goscript-dark',
    value: '// Select a test to view code',
  })

  tsEditor = monaco.editor.create(tsEditorContainer, {
    ...editorOptions,
    language: 'typescript',
    theme: 'goscript-dark',
    value: '// Select a test to view code',
  })
}

// Wait for Monaco to be ready
if (window.monacoReady) {
  initMonaco()
} else {
  window.addEventListener('monaco-ready', initMonaco)
}

// Initialize esbuild-wasm (loaded via script tag)
async function initEsbuild() {
  // Show loading status
  if (compilerStatusText) {
    compilerStatusText.textContent = 'Loading TypeScript compiler...'
  }
  if (runBtn) {
    runBtn.disabled = true
  }
  if (runAllBtn) {
    runAllBtn.disabled = true
  }

  try {
    // esbuild is loaded globally via script tag
    if (!window.esbuild) {
      throw new Error('esbuild not loaded')
    }
    if (compilerStatusText) {
      compilerStatusText.textContent = 'Initializing WebAssembly...'
    }
    await window.esbuild.initialize({
      wasmURL: 'https://cdn.jsdelivr.net/npm/esbuild-wasm@0.27.2/esbuild.wasm',
    })
    esbuildReady = true
    console.log('esbuild-wasm initialized')

    // Hide status bar and enable buttons
    if (compilerStatus) {
      compilerStatus.style.display = 'none'
    }
    if (runBtn) {
      runBtn.disabled = !currentTest?.tsCode
    }
    if (runAllBtn) {
      runAllBtn.disabled = false
    }
  } catch (err) {
    console.error('Failed to initialize esbuild-wasm:', err)
    if (compilerStatusText) {
      compilerStatusText.textContent = 'Failed to load compiler: ' + err.message
      compilerStatusText.style.color = '#ff5f56'
    }
  }
}

// Initialize
async function init() {
  // Start loading esbuild in parallel
  const esbuildPromise = initEsbuild()

  try {
    const response = await fetch('../data/tests.json')
    if (response.ok) {
      tests = await response.json()
      filteredTests = tests
      renderTestList()
      updateTestCount()

      // Select first test by default
      if (tests.length > 0 && !currentTest) {
        selectTest(tests[0])
      }
    } else {
      testList.innerHTML =
        '<div class="empty-state">Failed to load tests. Run the build script first.</div>'
      testCount.textContent = 'No tests loaded'
    }
  } catch (err) {
    console.error('Failed to load tests:', err)
    testList.innerHTML =
      '<div class="empty-state">Failed to load tests: ' + err.message + '</div>'
    testCount.textContent = 'Error loading tests'
  }

  // Wait for esbuild to be ready
  await esbuildPromise
}

function getStatusIcon(status) {
  switch (status) {
    case 'passed':
      return '<span style="color: #27c93f; margin-right: 0.5rem;">✓</span>'
    case 'failed':
      return '<span style="color: #ff5f56; margin-right: 0.5rem;">✗</span>'
    case 'skipped':
      return '<span style="color: var(--color-text-muted); margin-right: 0.5rem;">○</span>'
    case 'running':
      return '<span style="color: var(--color-go); margin-right: 0.5rem;">⋯</span>'
    default:
      return '<span style="margin-right: 0.5rem; opacity: 0.3;">·</span>'
  }
}

function renderTestList() {
  testList.innerHTML = ''

  for (const test of filteredTests) {
    const item = document.createElement('div')
    item.className = 'test-item'
    item.dataset.testName = test.name

    const status = testResults.get(test.name)
    item.innerHTML = getStatusIcon(status) + test.name

    item.addEventListener('click', () => selectTest(test))

    if (currentTest && currentTest.name === test.name) {
      item.classList.add('active')
    }

    testList.appendChild(item)
  }
}

function updateTestItem(testName) {
  const item = testList.querySelector(`[data-test-name="${testName}"]`)
  if (item) {
    const status = testResults.get(testName)
    const isActive = currentTest && currentTest.name === testName
    item.innerHTML = getStatusIcon(status) + testName
    item.className = 'test-item' + (isActive ? ' active' : '')
  }
}

function updateStats() {
  let passed = 0
  let failed = 0
  let skipped = 0

  for (const status of testResults.values()) {
    if (status === 'passed') passed++
    else if (status === 'failed') failed++
    else if (status === 'skipped') skipped++
  }

  statsPassed.textContent = `${passed} passed`
  statsFailed.textContent = `${failed} failed`
  statsSkipped.textContent = `${skipped} skipped`

  // Show stats bar if we have any results
  if (passed + failed + skipped > 0) {
    statsBar.style.display = 'block'
  }
}

function updateTestCount() {
  if (filteredTests.length === tests.length) {
    testCount.textContent = `${tests.length} tests`
  } else {
    testCount.textContent = `${filteredTests.length} of ${tests.length} tests`
  }
}

function selectTest(test) {
  currentTest = test

  // Update active state in list
  const items = testList.querySelectorAll('.test-item')
  items.forEach((item) => {
    item.classList.toggle('active', item.dataset.testName === test.name)
  })

  // Update detail panel
  testName.textContent = test.name
  expectedOutput.textContent = test.expectedOutput || '(no output)'
  actualOutput.textContent = 'Click "Run" to execute'
  actualOutput.style.color = ''

  // Update Monaco editors
  if (goEditor) {
    goEditor.setValue(test.goCode || '// No Go source')
  }
  if (tsEditor) {
    tsEditor.setValue(test.tsCode || '// No TypeScript output')
  }

  runBtn.disabled = !test.tsCode || !esbuildReady
}

// Event Handlers
testSearch.addEventListener('input', () => {
  const query = testSearch.value.toLowerCase()

  if (!query) {
    filteredTests = tests
  } else {
    filteredTests = tests.filter((test) =>
      test.name.toLowerCase().includes(query),
    )
  }

  renderTestList()
  updateTestCount()
})

runBtn.addEventListener('click', async () => {
  if (!currentTest || !currentTest.tsCode) return

  actualOutput.textContent = 'Running...'
  actualOutput.style.color = ''

  try {
    const output = await runTypeScript(currentTest.tsCode)
    actualOutput.textContent = output || '(no output)'

    // Compare with expected
    const expected = (currentTest.expectedOutput || '').trim()
    const actual = (output || '').trim()

    if (expected === actual) {
      actualOutput.style.color = '#27c93f'
      testResults.set(currentTest.name, 'passed')
    } else {
      actualOutput.style.color = '#ff5f56'
      testResults.set(currentTest.name, 'failed')
    }
    updateTestItem(currentTest.name)
    updateStats()
  } catch (err) {
    actualOutput.textContent = `Error: ${err.message}`
    actualOutput.style.color = '#ff5f56'
    testResults.set(currentTest.name, 'failed')
    updateTestItem(currentTest.name)
    updateStats()
  }
})

runAllBtn.addEventListener('click', async () => {
  if (isRunning) return

  isRunning = true
  shouldStop = false

  // UI updates
  runAllBtn.style.display = 'none'
  stopBtn.style.display = 'block'
  progressBar.style.display = 'block'
  statsBar.style.display = 'block'

  // Clear previous results
  testResults.clear()
  renderTestList()

  const testsToRun = filteredTests
  let completed = 0

  for (const test of testsToRun) {
    if (shouldStop) break

    // Mark as running
    testResults.set(test.name, 'running')
    updateTestItem(test.name)

    // Check if test can run (has TS code and no external imports)
    if (!test.tsCode) {
      testResults.set(test.name, 'skipped')
      updateTestItem(test.name)
      completed++
      progressFill.style.width = `${(completed / testsToRun.length) * 100}%`
      updateStats()
      continue
    }

    // Check for external imports that would break running
    if (hasExternalImports(test.tsCode)) {
      testResults.set(test.name, 'skipped')
      updateTestItem(test.name)
      completed++
      progressFill.style.width = `${(completed / testsToRun.length) * 100}%`
      updateStats()
      continue
    }

    try {
      const output = await runTypeScript(test.tsCode)
      const expected = (test.expectedOutput || '').trim()
      const actual = (output || '').trim()

      if (expected === actual) {
        testResults.set(test.name, 'passed')
      } else {
        testResults.set(test.name, 'failed')
      }
    } catch {
      testResults.set(test.name, 'failed')
    }

    updateTestItem(test.name)
    completed++
    progressFill.style.width = `${(completed / testsToRun.length) * 100}%`
    updateStats()

    // Small delay to allow UI to update and prevent blocking
    await new Promise((r) => setTimeout(r, 1))
  }

  isRunning = false
  shouldStop = false
  runAllBtn.style.display = 'block'
  stopBtn.style.display = 'none'
})

stopBtn.addEventListener('click', () => {
  shouldStop = true
})

function hasExternalImports(code) {
  // Check for imports that aren't @goscript/builtin
  const importRegex = /import .* from ["']([^"']+)["']/g
  let match
  while ((match = importRegex.exec(code)) !== null) {
    const importPath = match[1]
    if (
      importPath !== '@goscript/builtin' &&
      importPath !== '@goscript/builtin/index.js'
    ) {
      return true
    }
  }
  return false
}

async function runTypeScript(code) {
  if (!esbuildReady) {
    throw new Error('esbuild-wasm not ready')
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
    // Remove other imports for now
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

  try {
    const fn = new AsyncFunction('$', jsCode)
    await fn(mockRuntime)
  } catch (err) {
    throw new Error(`Runtime error: ${err.message}`)
  }

  return outputLines.join('\n')
}

// Create a mock runtime (same as playground)
function createMockRuntime(onPrint) {
  return {
    println: (...args) => {
      onPrint(args.map(formatValue).join(' '))
    },
    print: (...args) => {
      onPrint(args.map(formatValue).join(''))
    },
    makeSlice: (len = 0, cap) => {
      const arr = new Array(len).fill(null)
      arr._cap = cap || len
      return arr
    },
    sliceCopy: (dst, src) => {
      const len = Math.min(dst.length, src.length)
      for (let i = 0; i < len; i++) dst[i] = src[i]
      return len
    },
    append: (slice, ...items) => [...(slice || []), ...items],
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
    makeMap: () => new Map(),
    mapGet: (m, k, defaultVal) => {
      if (!m) return [defaultVal, false]
      const has = m.has(k)
      return [has ? m.get(k) : defaultVal, has]
    },
    deleteMapEntry: (m, k) => {
      if (m) m.delete(k)
    },
    makeChan: (cap = 0) => ({ _buffer: [], _cap: cap, _closed: false }),
    chanSend: async (ch, val) => {
      if (ch._closed) throw new Error('send on closed channel')
      ch._buffer.push(val)
    },
    chanRecv: async (ch) => (ch._buffer.length > 0 ? ch._buffer.shift() : null),
    chanRecvWithOk: async (ch) => {
      if (ch._buffer.length > 0) return { value: ch._buffer.shift(), ok: true }
      if (ch._closed) return { value: null, ok: false }
      return { value: null, ok: true }
    },
    closeChan: (ch) => {
      ch._closed = true
    },
    range: function* (v) {
      if (Array.isArray(v)) {
        for (let i = 0; i < v.length; i++) yield [i, v[i]]
      } else if (v instanceof Map) {
        for (const [k, val] of v) yield [k, val]
      } else if (typeof v === 'string') {
        for (let i = 0; i < v.length; i++) yield [i, v.charCodeAt(i)]
      }
    },
    varRef: (val) => ({ value: val }),
    typeAssert: (val) => val,
    typeAssertOk: (val) => [val, val !== null && val !== undefined],
    error: null,
    newError: (msg) => new Error(msg),
    panic: (msg) => {
      throw new Error(String(msg))
    },
    recover: () => null,
    stringToBytes: (s) => [...s].map((c) => c.charCodeAt(0)),
    bytesToString: (b) => String.fromCharCode(...b),
    stringToRunes: (s) => [...s].map((c) => c.codePointAt(0)),
    runesToString: (r) => String.fromCodePoint(...r),
    intDiv: (a, b) => Math.trunc(a / b),
    intMod: (a, b) => a % b,
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
    go: (fn) => {
      setTimeout(() => fn().catch(console.error), 0)
    },
    select: async (cases) => {
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
  if (v === null || v === undefined) return '<nil>'
  if (typeof v === 'object') {
    if (Array.isArray(v)) return '[' + v.map(formatValue).join(' ') + ']'
    if (v instanceof Map) {
      const entries = [...v.entries()].map(
        ([k, val]) => `${formatValue(k)}:${formatValue(val)}`,
      )
      return 'map[' + entries.join(' ') + ']'
    }
    if (v.constructor && v.constructor.name !== 'Object') {
      return JSON.stringify(v)
    }
    return JSON.stringify(v)
  }
  return String(v)
}

// Start initialization
init()
