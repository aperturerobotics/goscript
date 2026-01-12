// GoScript Test Browser - JavaScript
// This displays pre-generated compliance test data and runs them using esbuild-wasm

import * as goscriptRuntime from '@goscript/builtin'
import {
  ready as wasmReady,
  compileGoToTypeScript,
} from './goscript-wasm.js'

// Make runtime available globally for executed code
window.$ = goscriptRuntime

let tests = []
let filteredTests = []
let currentTest = null
let testResults = new Map() // name -> 'passed' | 'failed' | 'skipped' | 'running'
let isRunning = false
let shouldStop = false
let esbuildReady = false
let goscriptReady = false

// DOM Elements
const testSearch = document.getElementById('test-search')
const testList = document.getElementById('test-list')
const testCount = document.getElementById('test-count')
const testName = document.getElementById('test-name')
const goEditorContainer = document.getElementById('go-editor')
const tsEditorContainer = document.getElementById('ts-editor')
const expectedOutput = document.getElementById('expected-output')
const actualOutput = document.getElementById('actual-output')
const compileBtn = document.getElementById('compile-btn')
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

// Initialize GoScript WASM compiler
async function initGoscript() {
  try {
    await wasmReady
    goscriptReady = true
    updateCompilerStatus()
  } catch (err) {
    console.error('Failed to initialize GoScript WASM compiler:', err)
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
    updateCompilerStatus()
  } catch (err) {
    console.error('Failed to initialize esbuild-wasm:', err)
    if (compilerStatusText) {
      compilerStatusText.textContent = 'Failed to load compiler: ' + err.message
      compilerStatusText.style.color = '#ff5f56'
    }
  }
}

function updateCompilerStatus() {
  if (goscriptReady && esbuildReady) {
    if (compilerStatus) {
      compilerStatus.style.display = 'none'
    }
    if (compileBtn) {
      compileBtn.disabled = !currentTest?.goCode
    }
    if (runBtn) {
      runBtn.disabled = !currentTest?.tsCode
    }
    if (runAllBtn) {
      runAllBtn.disabled = false
    }
  } else if (goscriptReady) {
    if (compilerStatusText) {
      compilerStatusText.textContent = 'Loading TypeScript runner...'
    }
  } else if (esbuildReady) {
    if (compilerStatusText) {
      compilerStatusText.textContent = 'Loading GoScript compiler...'
    }
  } else {
    if (compilerStatusText) {
      compilerStatusText.textContent = 'Loading compilers...'
    }
  }
}

// Initialize
async function init() {
  // Start loading compilers in parallel
  const goscriptPromise = initGoscript()
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

  // Wait for compilers to be ready
  await Promise.all([goscriptPromise, esbuildPromise])
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

  compileBtn.disabled = !test.goCode || !goscriptReady
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

compileBtn.addEventListener('click', async () => {
  if (!currentTest || !currentTest.goCode || !goscriptReady) return

  actualOutput.textContent = 'Compiling...'
  actualOutput.style.color = ''

  try {
    const tsCode = await compileGoToTypeScript(currentTest.goCode, 'main')
    if (tsEditor) {
      tsEditor.setValue(tsCode)
    }
    // Update the test's tsCode in memory so Run works
    currentTest.tsCode = tsCode
    runBtn.disabled = false
    actualOutput.textContent = 'Compiled successfully!'
    actualOutput.style.color = '#27c93f'
  } catch (err) {
    actualOutput.textContent = `Compile Error: ${err.message}`
    actualOutput.style.color = '#ff5f56'
  }
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
