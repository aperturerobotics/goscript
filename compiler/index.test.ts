import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, it, expect } from 'vitest'
import { compile } from './index'

describe('GoScript Compiler API', () => {
  it('compiles a simple package through the CLI adapter', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'goscript-api-'))
    const output = join(dir, 'output')
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, 'go.mod'), 'module example.test/api\n\ngo 1.25.3\n')
    await writeFile(join(dir, 'main.go'), [
      'package main',
      'func main() {',
      '  println("api")',
      '}',
      '',
    ].join('\n'))

    await compile({
      pkg: '.',
      output,
      dir,
    })

    const generated = await readFile(join(output, '@goscript', 'example.test', 'api', 'main.gs.ts'), 'utf8')
    expect(generated).toContain('export async function main(): Promise<void>')
    expect(generated).toContain('$.println("api")')
  }, 30000)
})
