import { describe, it, expect } from 'vitest'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  Base,
  Dir,
  Ext,
  Clean,
  Join,
  Split,
  IsAbs,
  ToSlash,
  FromSlash,
  VolumeName,
  IsLocal,
  SplitList,
  HasPrefix,
  Abs,
  Rel,
  Localize,
  EvalSymlinks,
  Walk,
  WalkDir,
  SkipDir,
  Separator,
  ListSeparator,
} from './path.js'

describe('path/filepath - Path manipulation functions', () => {
  describe('Base', () => {
    it('should return the last element of path', () => {
      expect(Base('dir/subdir/file.txt')).toBe('file.txt')
      expect(Base('/usr/bin/ls')).toBe('ls')
      expect(Base('file.txt')).toBe('file.txt')
      expect(Base('/')).toBe('/')
      expect(Base('')).toBe('.')
      expect(Base('//')).toBe('/')
      expect(Base('dir/')).toBe('dir')
      expect(Base('dir//')).toBe('dir')
    })
  })

  describe('Dir', () => {
    it('should return directory portion of path', () => {
      expect(Dir('dir/subdir/file.txt')).toBe('dir/subdir')
      expect(Dir('/usr/bin/ls')).toBe('/usr/bin')
      expect(Dir('file.txt')).toBe('.')
      expect(Dir('/')).toBe('/')
      expect(Dir('')).toBe('.')
      expect(Dir('/file')).toBe('/')
      expect(Dir('dir/')).toBe('.')
    })
  })

  describe('Ext', () => {
    it('should return file extension', () => {
      expect(Ext('file.txt')).toBe('.txt')
      expect(Ext('file.tar.gz')).toBe('.gz')
      expect(Ext('file')).toBe('')
      expect(Ext('.hidden')).toBe('')
      expect(Ext('dir/file.txt')).toBe('.txt')
      expect(Ext('')).toBe('')
    })
  })

  describe('Clean', () => {
    it('should clean up path by resolving . and .. elements', () => {
      expect(Clean('dir//subdir/../subdir/./file.txt')).toBe(
        'dir/subdir/file.txt',
      )
      expect(Clean('/dir/../file')).toBe('/file')
      expect(Clean('./file')).toBe('file')
      expect(Clean('../file')).toBe('../file')
      expect(Clean('dir/..')).toBe('.')
      expect(Clean('/dir/..')).toBe('/')
      expect(Clean('')).toBe('.')
      expect(Clean('/')).toBe('/')
      expect(Clean('///')).toBe('/')
    })
  })

  describe('Join', () => {
    it('should join path elements with separator', () => {
      expect(Join('dir', 'subdir', 'file.txt')).toBe('dir/subdir/file.txt')
      expect(Join('/usr', 'bin', 'ls')).toBe('/usr/bin/ls')
      expect(Join('', 'file')).toBe('file')
      expect(Join('dir', '', 'file')).toBe('dir/file')
      expect(Join()).toBe('')
      expect(Join('', '', '')).toBe('')
    })
  })

  describe('Split', () => {
    it('should split path into directory and file', () => {
      expect(Split('dir/subdir/file.txt')).toEqual(['dir/subdir/', 'file.txt'])
      expect(Split('/usr/bin/ls')).toEqual(['/usr/bin/', 'ls'])
      expect(Split('file.txt')).toEqual(['', 'file.txt'])
      expect(Split('/')).toEqual(['/', ''])
      expect(Split('')).toEqual(['', ''])
    })
  })

  describe('IsAbs', () => {
    it('should check if path is absolute', () => {
      expect(IsAbs('/absolute/path')).toBe(true)
      expect(IsAbs('relative/path')).toBe(false)
      expect(IsAbs('/')).toBe(true)
      expect(IsAbs('')).toBe(false)
      expect(IsAbs('./relative')).toBe(false)
    })
  })

  describe('ToSlash', () => {
    it('should preserve path on Unix systems (backslashes are regular chars)', () => {
      // On Unix systems, ToSlash doesn't convert backslashes because they're not separators
      expect(ToSlash('dir\\subdir\\file.txt')).toBe('dir\\subdir\\file.txt')
      expect(ToSlash('dir/subdir/file.txt')).toBe('dir/subdir/file.txt')
      expect(ToSlash('')).toBe('')
    })
  })

  describe('FromSlash', () => {
    it('should preserve path on Unix systems', () => {
      // On Unix systems, FromSlash doesn't change anything because separator is already '/'
      expect(FromSlash('dir/subdir/file.txt')).toBe('dir/subdir/file.txt')
      expect(FromSlash('')).toBe('')
    })
  })

  describe('VolumeName', () => {
    it('should return empty string on Unix systems', () => {
      expect(VolumeName('C:\\Windows\\System32')).toBe('')
      expect(VolumeName('/usr/local')).toBe('')
      expect(VolumeName('')).toBe('')
    })
  })

  describe('IsLocal', () => {
    it('should check if path is local (not escaping)', () => {
      expect(IsLocal('file.txt')).toBe(true)
      expect(IsLocal('dir/file.txt')).toBe(true)
      expect(IsLocal('../file.txt')).toBe(false)
      expect(IsLocal('/absolute/path')).toBe(false)
      expect(IsLocal('')).toBe(false)
      expect(IsLocal('dir/../file')).toBe(true)
      expect(IsLocal('dir/../../file')).toBe(false)
    })
  })

  describe('SplitList', () => {
    it('should split PATH-style lists', () => {
      expect(SplitList('/usr/bin:/usr/local/bin:/bin')).toEqual([
        '/usr/bin',
        '/usr/local/bin',
        '/bin',
      ])
      expect(SplitList('')).toEqual([])
      expect(SplitList('/single/path')).toEqual(['/single/path'])
      expect(SplitList('a:b:c')).toEqual(['a', 'b', 'c'])
    })
  })

  describe('HasPrefix', () => {
    it('should check if path has prefix', () => {
      expect(HasPrefix('/usr/local/bin', '/usr/local')).toBe(true)
      expect(HasPrefix('/usr/local', '/usr/local')).toBe(true)
      expect(HasPrefix('/usr/local/bin', '/usr/bin')).toBe(false)
      expect(HasPrefix('relative/path', 'relative')).toBe(true)
      expect(HasPrefix('file.txt', '')).toBe(true)
      expect(HasPrefix('', 'prefix')).toBe(false)
    })
  })

  describe('Abs', () => {
    it('should handle absolute paths', () => {
      const [result1, err1] = Abs('/absolute/path')
      expect(err1).toBeNull()
      expect(result1).toBe('/absolute/path')

      const [result2, err2] = Abs('relative/path')
      expect(err2).toBeNull()
      expect(result2).toBe('/relative/path')
    })
  })

  describe('Rel', () => {
    it('should calculate relative path', () => {
      const [result1, err1] = Rel('/usr/local', '/usr/local')
      expect(err1).toBeNull()
      expect(result1).toBe('.')

      const [result2, err2] = Rel('/usr/local', '/usr/local/bin')
      expect(err2).toBeNull()
      expect(result2).toBe('bin')

      // Go emits ".." components to climb out of base before descending into
      // the divergent target tail.
      const [result3, err3] = Rel('/usr/local', '/other/path')
      expect(err3).toBeNull()
      expect(result3).toBe('../../other/path')

      const [result4, err4] = Rel('/a/b', '/a/c')
      expect(err4).toBeNull()
      expect(result4).toBe('../c')

      const [result5, err5] = Rel('a/b', 'a/c')
      expect(err5).toBeNull()
      expect(result5).toBe('../c')

      // A relative base cannot be made relative to an absolute target.
      const [, err6] = Rel('a/b', '/a/c')
      expect(err6).not.toBeNull()
    })
  })

  describe('Localize', () => {
    it('should accept io/fs.ValidPath inputs and reject the rest', () => {
      const [ok, okErr] = Localize('a/b')
      expect(okErr).toBeNull()
      expect(ok).toBe('a/b')

      const [dot, dotErr] = Localize('.')
      expect(dotErr).toBeNull()
      expect(dot).toBe('.')

      for (const bad of ['', '/a', '../a', 'a/../b', 'a/']) {
        const [, err] = Localize(bad)
        expect(err).not.toBeNull()
      }
    })
  })

  describe('EvalSymlinks', () => {
    it('should return cleaned path (stubbed)', () => {
      const [result, err] = EvalSymlinks('/path/with/../dots')
      expect(err).toBeNull()
      expect(result).toBe('/path/dots')
    })
  })

  describe('Walk', () => {
    it('should visit host filesystem paths in lexical order', async () => {
      const root = mkdtempSync(join(tmpdir(), 'goscript-filepath-walk-'))
      try {
        mkdirSync(join(root, 'a', 'b'), { recursive: true })
        writeFileSync(join(root, 'a', 'b', 'file.txt'), 'ok')

        const visited: string[] = []
        const err = await Walk(root, (path) => {
          visited.push(path.slice(root.length).replace(/^\/?/, '') || '.')
          return null
        })

        expect(err).toBeNull()
        expect(visited).toEqual(['.', 'a', 'a/b', 'a/b/file.txt'])
      } finally {
        rmSync(root, { force: true, recursive: true })
      }
    })
  })

  describe('WalkDir', () => {
    it('should visit host filesystem dir entries in lexical order', async () => {
      const root = mkdtempSync(join(tmpdir(), 'goscript-filepath-walkdir-'))
      try {
        mkdirSync(join(root, 'b'), { recursive: true })
        mkdirSync(join(root, 'a'), { recursive: true })
        writeFileSync(join(root, 'a', 'skipped.txt'), 'skip')
        writeFileSync(join(root, 'b', 'file.txt'), 'ok')

        const visited: string[] = []
        const err = await WalkDir(root, (path, d, walkErr) => {
          expect(walkErr).toBeNull()
          visited.push(
            `${path.slice(root.length).replace(/^\/?/, '') || '.'}:${d.Name()}:${d.IsDir()}`,
          )
          if (d.Name() === 'a') {
            return SkipDir
          }
          return null
        })

        expect(err).toBeNull()
        expect(visited).toEqual([
          `.:${root.split('/').pop()}:true`,
          'a:a:true',
          'b:b:true',
          'b/file.txt:file.txt:false',
        ])
      } finally {
        rmSync(root, { force: true, recursive: true })
      }
    })

    it('should await async host filesystem dir callbacks', async () => {
      const root = mkdtempSync(join(tmpdir(), 'goscript-filepath-walkdir-'))
      try {
        writeFileSync(join(root, 'file.txt'), 'ok')

        const visited: string[] = []
        const err = await WalkDir(root, async (path) => {
          await Promise.resolve()
          visited.push(path.slice(root.length).replace(/^\/?/, '') || '.')
          return null
        })

        expect(err).toBeNull()
        expect(visited).toEqual(['.', 'file.txt'])
      } finally {
        rmSync(root, { force: true, recursive: true })
      }
    })
  })

  describe('Constants', () => {
    it('should have correct separator constants', () => {
      expect(Separator).toBe(47)
      expect(ListSeparator).toBe(58)
    })
  })
})

describe('Complex path operations', () => {
  it('should handle edge cases correctly', () => {
    // Test Clean with complex paths
    expect(Clean('/a/b/../c/./d/')).toBe('/a/c/d')
    expect(Clean('a/b/../../c')).toBe('c')
    expect(Clean('../../a/b')).toBe('../../a/b')

    // Test Join with various inputs. A later absolute element does not discard
    // earlier elements; Go joins the suffix and Clean collapses double slashes.
    expect(Join('/a', '../b', 'c')).toBe('/b/c')
    expect(Join('a', '/b', 'c')).toBe('a/b/c')

    // Test Split edge cases
    expect(Split('/a/')).toEqual(['/a/', ''])
    expect(Split('//a')).toEqual(['//', 'a'])
  })

  it('should maintain path consistency', () => {
    const testPaths = [
      'simple/path',
      '/absolute/path',
      'path/with/../dots',
      './relative/path',
      '../../parent/path',
    ]

    for (const path of testPaths) {
      const cleaned = Clean(path)
      const [dir, file] = Split(cleaned)
      const rejoined = dir + file

      // Split and rejoin should preserve the cleaned path
      expect(rejoined).toBe(cleaned)
    }
  })
})
