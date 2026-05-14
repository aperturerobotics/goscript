import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'

const goMod = execFileSync('go', ['mod', 'edit', '-json'], {
  encoding: 'utf8',
})
const version = JSON.parse(goMod).Go
const runtimePath = 'gs/runtime/runtime.ts'
const content = readFileSync(runtimePath, 'utf8')
const updatedContent = content.replace(
  /export const GOVERSION = 'go[^']*'/,
  `export const GOVERSION = 'go${version}'`,
)

writeFileSync(runtimePath, updatedContent)
