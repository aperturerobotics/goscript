import { readFileSync, writeFileSync } from 'node:fs'

const bump = process.argv[2]
if (bump !== 'patch' && bump !== 'minor') {
  throw new Error('usage: bun run scripts/bump-version.ts patch|minor')
}

const packagePath = 'package.json'
const pkg = JSON.parse(readFileSync(packagePath, 'utf8'))
const parts = pkg.version.split('.').map(Number)
if (parts.length !== 3 || parts.some(Number.isNaN)) {
  throw new Error(`invalid package version: ${pkg.version}`)
}

if (bump === 'minor') {
  parts[1] += 1
  parts[2] = 0
} else {
  parts[2] += 1
}

pkg.version = parts.join('.')
writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`)
