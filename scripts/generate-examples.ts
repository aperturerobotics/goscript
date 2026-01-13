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

const COMPLIANCE_DIR = path.join(
  import.meta.dirname,
  '..',
  'tests',
  'tests',
)
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
  ['basic_arithmetic', 'Arithmetic', 'Basic arithmetic operations'],
  ['boolean_logic', 'Boolean Logic', 'Boolean operators and comparisons'],
  ['if_statement', 'If Statement', 'Conditional statements'],
  ['for_loop_basic', 'For Loop', 'Loop constructs'],
  ['for_range', 'Range Loop', 'Iterating with range'],
  ['switch_statement', 'Switch', 'Switch statement patterns'],
  ['comments_struct', 'Structs', 'Struct definitions and usage'],
  ['struct_field_access', 'Struct Fields', 'Accessing struct fields'],
  ['simple_interface', 'Interfaces', 'Interface type assertions'],
  ['slice', 'Slices', 'Slice creation and manipulation'],
  ['map_support', 'Maps', 'Map operations'],
  ['pointers', 'Pointers', 'Pointer semantics in GoScript'],
  ['channel_basic', 'Channels', 'Channel operations'],
  ['goroutines', 'Goroutines', 'Concurrent execution with goroutines'],
  ['defer_statement', 'Defer', 'Defer statements'],
  ['func_literal', 'Function Literals', 'Anonymous functions and closures'],
  ['interface_type_assertion', 'Type Assertion', 'Type assertions'],
  ['generics_basic', 'Generics', 'Generic types and functions'],
  ['async_basic', 'Async/Await', 'Async function translation'],
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

function generateExamples(): void {
  const examples: Example[] = []
  const allPackages = new Set<string>()

  for (const [testName, title, description] of CURATED_EXAMPLES) {
    const testDir = path.join(COMPLIANCE_DIR, testName)
    const goFile = path.join(testDir, `${testName}.go`)
    const tsFile = path.join(testDir, `${testName}.gs.ts`)
    const expectedFile = path.join(testDir, 'expected.log')

    // Skip if files don't exist
    if (!fs.existsSync(goFile) || !fs.existsSync(tsFile)) {
      console.warn(`Skipping example ${testName}: missing files`)
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
