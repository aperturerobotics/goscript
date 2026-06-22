import { mkdtemp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
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
    expect(generated).toContain('export async function main(): globalThis.Promise<void>')
    expect(generated).toContain('$.println("api")')
  }, 30000)

  it('inherits positioned compiler diagnostics on stderr', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'goscript-api-diagnostic-'))
    const output = join(dir, 'output')
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, 'go.mod'), 'module example.test/apierr\n\ngo 1.25.3\n')
    await writeFile(join(dir, 'main.go'), [
      'package apierr',
      '',
      'func Make[T ~[]int]() T {',
      '  return make(T, 1)',
      '}',
      '',
    ].join('\n'))

    await expect(compile({
      pkg: '.',
      output,
      dir,
    })).rejects.toMatchObject({
      stderr: expect.stringContaining('main.go:4:'),
    })
  }, 30000)

  it('forwards the package blocklist to closure compiles', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'goscript-api-blocklist-'))
    const output = join(dir, 'output')
    await mkdir(join(dir, 'dep'), { recursive: true })
    await writeFile(join(dir, 'go.mod'), 'module example.test/apiblock\n\ngo 1.25.3\n')
    await writeFile(join(dir, 'main.go'), [
      'package apiblock',
      'import "example.test/apiblock/dep"',
      'func Value() int { return dep.Value() }',
      '',
    ].join('\n'))
    await writeFile(join(dir, 'dep', 'dep.go'), [
      'package dep',
      'func Value() int { return 1 }',
      '',
    ].join('\n'))

    await expect(compile({
      pkg: '.',
      output,
      dir,
      allDependencies: true,
      packageBlocklist: ['example.test/apiblock/dep'],
    })).rejects.toMatchObject({
      stderr: expect.stringContaining('example.test/apiblock -> example.test/apiblock/dep'),
    })
  }, 30000)

  it('forwards the compiler cache root to the CLI adapter', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'goscript-api-cache-'))
    const output = join(dir, 'output')
    const cacheRoot = join(dir, 'cache')
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, 'go.mod'), 'module example.test/apicache\n\ngo 1.25.3\n')
    await writeFile(join(dir, 'main.go'), [
      'package apicache',
      'const Value = 1',
      '',
    ].join('\n'))

    await compile({
      pkg: '.',
      output,
      dir,
      compilerCacheRoot: cacheRoot,
    })

    const generated = await readFile(join(output, '@goscript', 'example.test', 'apicache', 'main.gs.ts'), 'utf8')
    expect(generated).toContain('Value: number = 1')
    const cacheRootEntries = await readdir(join(cacheRoot, 'goscript-package-artifact-v1', 'entries'))
    expect(cacheRootEntries.length).toBeGreaterThan(0)
  }, 30000)
})
