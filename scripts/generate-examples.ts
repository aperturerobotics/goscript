#!/usr/bin/env npx tsx
/**
 * Generates a JSON manifest of curated examples for the website playground.
 * Selects compliance tests that demonstrate key GoScript features.
 * Output: website/data/examples.json
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
  ['interface_embedding', 'Interfaces', 'Interface definitions and embedding'],
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
  ['json_marshal_basic', 'JSON', 'JSON encoding with encoding/json'],
]

function generateExamples(): void {
  const examples: Example[] = []

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

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(examples, null, 2))
  console.log(`Generated ${examples.length} examples to ${OUTPUT_FILE}`)
}

generateExamples()
