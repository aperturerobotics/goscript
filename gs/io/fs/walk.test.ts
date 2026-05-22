import { describe, expect, it } from 'vitest'

import type { File, FileInfo } from './fs.js'
import { ModeDir } from './fs.js'
import { WalkDir } from './walk.js'

class info implements FileInfo {
  constructor(
    private name: string,
    private dir: boolean,
  ) {}

  IsDir(): boolean {
    return this.dir
  }

  ModTime(): any {
    return null
  }

  Mode(): number {
    return this.dir ? ModeDir : 0
  }

  Name(): string {
    return this.name
  }

  Size(): number {
    return 0
  }

  Sys(): null {
    return null
  }
}

class singleFileFS {
  Open(_name: string): [File, Error | null] {
    return [null, new Error('unused')]
  }

  Stat(name: string): [FileInfo, Error | null] {
    return [new info(name, false), null]
  }
}

describe('io/fs WalkDir', () => {
  it('awaits async walk callbacks', async () => {
    const visited: string[] = []

    const err = await WalkDir(new singleFileFS(), 'root.txt', async (name) => {
      await Promise.resolve()
      visited.push(name)
      return null
    })

    expect(err).toBeNull()
    expect(visited).toEqual(['root.txt'])
  })
})
