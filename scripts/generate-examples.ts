#!/usr/bin/env npx tsx
/**
 * Generates a JSON manifest of curated examples for the website playground.
 * Selects compliance tests that demonstrate key GoScript features.
 * Output: website/public/data/examples.json
 * Also generates: website/public/data/required-packages.json
 */

import * as fs from 'fs'
import * as path from 'path'

interface Example {
  name: string
  title: string
  description: string
  goCode: string
  tsCode: string
  expectedOutput: string
}

interface RequiredPackages {
  packages: string[] // e.g., ["@goscript/io", "@goscript/fmt"]
}

const COMPLIANCE_DIR = path.join(import.meta.dirname, '..', 'tests', 'tests')
const OUTPUT_FILE = path.join(
  import.meta.dirname,
  '..',
  'website',
  'public',
  'data',
  'examples.json',
)
const PACKAGES_FILE = path.join(
  import.meta.dirname,
  '..',
  'website',
  'public',
  'data',
  'required-packages.json',
)
const GS_DIR = path.join(import.meta.dirname, '..', 'gs')

// Curated list of compliance tests that make good examples
// Format: [testDirName, displayTitle, description]
const CURATED_EXAMPLES: [string, string, string][] = [
  [
    'basic_arithmetic',
    'Arithmetic',
    'Arithmetic, precedence, and numeric operators',
  ],
  ['boolean_logic', 'Boolean Logic', 'Boolean operators and comparisons'],
  [
    'constants_iota',
    'Constants and iota',
    'Constant blocks, iota, and typed constants',
  ],
  ['if_statement', 'If Statement', 'Conditional statements'],
  [
    'switch_multi_case',
    'Switch Cases',
    'Multiple cases, defaults, and fallthrough-free control flow',
  ],
  [
    'type_switch_statement',
    'Type Switch',
    'Interface type switches over concrete values',
  ],
  ['for_loop_basic', 'For Loop', 'Classic loops and integer range loops'],
  ['for_range_index_use', 'Range Indexes', 'Using range indexes and values'],
  [
    'comments_struct',
    'Structs',
    'Struct definitions and comments in generated output',
  ],
  [
    'struct_field_access',
    'Struct Fields',
    'Struct literals, field reads, and field writes',
  ],
  ['receiver_method', 'Methods', 'Value and pointer receiver method calls'],
  [
    'method_call_on_pointer_receiver',
    'Pointer Receivers',
    'Calling pointer receiver methods from values and pointers',
  ],
  [
    'simple_interface',
    'Interfaces',
    'Interface values and dynamic method dispatch',
  ],
  [
    'interface_type_assertion',
    'Type Assertion',
    'Checked type assertions on interface values',
  ],
  [
    'slice',
    'Slices',
    'Slice literals, slicing, append, capacity, nil, and nested slices',
  ],
  ['map_support', 'Maps', 'Map creation, assignment, lookup, and deletion'],
  ['map_struct_key', 'Struct Map Keys', 'Comparable structs used as map keys'],
  ['pointers', 'Pointers', 'Pointer creation, dereference, and mutation'],
  [
    'varref_pointers_deref',
    'Addressed Values',
    'Address-taken locals and pointer dereference writes',
  ],
  ['func_literal', 'Function Literals', 'Anonymous functions and closures'],
  [
    'function_returns_function',
    'Function Values',
    'Functions that return callable functions',
  ],
  [
    'defer_statement',
    'Defer',
    'Deferred calls and last-in-first-out execution',
  ],
  ['channel_basic', 'Channels', 'Buffered and unbuffered channel operations'],
  ['goroutines', 'Goroutines', 'Concurrent execution with goroutines'],
  ['select_statement', 'Select', 'Channel select cases and defaults'],
  ['async_basic', 'Async/Await', 'Async function translation'],
  [
    'async_function_type_assertion',
    'Async Function Assertions',
    'Async function values behind interfaces',
  ],
  [
    'generics_basic',
    'Generics Tour',
    'Constraints, generic structs, methods, map aliases, and function instantiation',
  ],
  [
    'make_generic_type',
    'Generic make',
    'make with instantiated generic map types',
  ],
  [
    'generic_function_instantiation_value',
    'Generic Function Values',
    'Explicit generic function instantiation',
  ],
  [
    'generic_cache_pointer_callbacks',
    'Generic Callbacks',
    'Generic structs with pointer callback fields',
  ],
  [
    'generic_async_wrapper',
    'Generic Channels',
    'Generic functions wrapping channel receive paths',
  ],
  // TODO: Enable once playground supports compiling dependencies
  // ['json_marshal_basic', 'JSON', 'JSON encoding with encoding/json'],
]

// Extract @goscript/* package imports from TypeScript code
// Returns normalized package names like "@goscript/io" (without /index.js)
function extractPackages(tsCode: string): string[] {
  const packages: string[] = []
  // Match: import * as X from "@goscript/..."
  // or: import { X } from "@goscript/..."
  const importRegex = /from\s+["'](@goscript\/[^"']+)["']/g
  let match
  while ((match = importRegex.exec(tsCode)) !== null) {
    let pkg = match[1]
    // Normalize: remove /index.js suffix
    pkg = pkg.replace(/\/index\.js$/, '')
    // Skip builtin - it's always included
    if (pkg !== '@goscript/builtin') {
      packages.push(pkg)
    }
  }
  return packages
}

// Check if a package path can be resolved to a local gs/ directory
function resolvePackagePath(pkg: string): string | null {
  // @goscript/io -> gs/io
  // @goscript/github.com/foo/bar -> gs/github.com/foo/bar
  const relativePath = pkg.replace('@goscript/', '')
  const fullPath = path.join(GS_DIR, relativePath)
  const indexPath = path.join(fullPath, 'index.ts')
  if (fs.existsSync(indexPath)) {
    return indexPath
  }
  return null
}

function singleFileWithSuffix(testDir: string, suffix: string): string | null {
  const files = fs
    .readdirSync(testDir)
    .filter((file) => file.endsWith(suffix))
    .sort()
  if (files.length !== 1) {
    return null
  }
  return path.join(testDir, files[0])
}

function generateExamples(): void {
  const examples: Example[] = []
  const allPackages = new Set<string>()

  for (const [testName, title, description] of CURATED_EXAMPLES) {
    const testDir = path.join(COMPLIANCE_DIR, testName)
    const goFile = singleFileWithSuffix(testDir, '.go')
    const tsFile = singleFileWithSuffix(testDir, '.gs.ts')
    const expectedFile = path.join(testDir, 'expected.log')

    // Skip if files don't exist
    if (
      !goFile ||
      !tsFile ||
      !fs.existsSync(goFile) ||
      !fs.existsSync(tsFile)
    ) {
      console.warn(
        `Skipping example ${testName}: expected exactly one Go file and one generated TypeScript file`,
      )
      continue
    }

    const goCode = fs.readFileSync(goFile, 'utf-8')
    const tsCode = fs.readFileSync(tsFile, 'utf-8')
    const expectedOutput =
      fs.existsSync(expectedFile) ? fs.readFileSync(expectedFile, 'utf-8') : ''

    // Extract required packages from this example
    const packages = extractPackages(tsCode)
    for (const pkg of packages) {
      // Only include packages we can actually resolve
      if (resolvePackagePath(pkg)) {
        allPackages.add(pkg)
      } else {
        console.warn(`  Package ${pkg} not found in gs/, skipping`)
      }
    }

    examples.push({
      name: testName,
      title,
      description,
      goCode,
      tsCode,
      expectedOutput,
    })
  }

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Write examples
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(examples, null, 2))
  console.log(`Generated ${examples.length} examples to ${OUTPUT_FILE}`)

  // Write required packages manifest
  const packagesData: RequiredPackages = {
    packages: Array.from(allPackages).sort(),
  }
  fs.writeFileSync(PACKAGES_FILE, JSON.stringify(packagesData, null, 2))
  console.log(
    `Found ${packagesData.packages.length} required packages: ${packagesData.packages.join(', ') || '(none)'}`,
  )
}

generateExamples()
