#!/usr/bin/env npx tsx
/**
 * Generates a JSON manifest of all compliance tests for the website.
 * Output: website/data/tests.json
 */

import * as fs from 'fs'
import * as path from 'path'

interface TestCase {
  name: string
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
  'tests.json',
)

function generateTestManifest(): void {
  const tests: TestCase[] = []
  const testDirs = fs.readdirSync(COMPLIANCE_DIR).filter((name) => {
    const stat = fs.statSync(path.join(COMPLIANCE_DIR, name))
    return stat.isDirectory()
  })

  for (const testName of testDirs.sort()) {
    const testDir = path.join(COMPLIANCE_DIR, testName)
    const goFile = path.join(testDir, `${testName}.go`)
    const tsFile = path.join(testDir, `${testName}.gs.ts`)
    const expectedFile = path.join(testDir, 'expected.log')

    // Skip if required files don't exist
    if (!fs.existsSync(goFile) || !fs.existsSync(tsFile)) {
      console.warn(`Skipping ${testName}: missing .go or .gs.ts file`)
      continue
    }

    const goCode = fs.readFileSync(goFile, 'utf-8')
    const tsCode = fs.readFileSync(tsFile, 'utf-8')
    const expectedOutput =
      fs.existsSync(expectedFile) ? fs.readFileSync(expectedFile, 'utf-8') : ''

    tests.push({
      name: testName,
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

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tests, null, 2))
  console.log(`Generated ${tests.length} tests to ${OUTPUT_FILE}`)
}

generateTestManifest()
