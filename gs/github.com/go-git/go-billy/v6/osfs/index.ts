import * as $ from '@goscript/builtin/index.js'
import * as fs from '@goscript/io/fs/index.js'
import * as os from '@goscript/os/index.js'
import * as filepath from '@goscript/path/filepath/index.js'

export type Option = (o: options) => void
export type Type = number

export const BoundOSFS: Type = 0

const allCapabilities = 127
const defaultCreateMode = 0o666
const defaultDirectoryMode = 0o777
const ErrCrossedBoundary = $.newError('chroot boundary crossed')
const ErrBaseDirCannotBeRemoved = $.newError('base dir cannot be removed')
const ErrBaseDirCannotBeRenamed = $.newError('base dir cannot be renamed')

type Filesystem = {
  Chroot(path: string): [Filesystem | null, $.GoError]
  Create(filename: string): [os.File | null, $.GoError]
  Join(...elem: JoinElement[]): string
  Lstat(filename: string): [fs.FileInfo, $.GoError]
  MkdirAll(filename: string, perm: fs.FileMode): $.GoError
  Open(filename: string): [os.File | null, $.GoError]
  OpenFile(filename: string, flag: number, perm: fs.FileMode): [os.File | null, $.GoError]
  ReadDir(path: string): [$.Slice<fs.DirEntry | null>, $.GoError]
  Readlink(link: string): [string, $.GoError]
  Remove(filename: string): $.GoError
  Rename(oldpath: string, newpath: string): $.GoError
  Root(): string
  Stat(filename: string): [fs.FileInfo, $.GoError]
  Symlink(target: string, link: string): $.GoError
  TempFile(dir: string, prefix: string): [os.File | null, $.GoError]
}

type JoinElement = string | $.Slice<string>

class options {
  public Type: Type = BoundOSFS
  public mmap = false
}

export function New(
  baseDir: string,
  ...opts: Array<Option | $.Slice<Option> | undefined>
): BoundOS {
  const o = new options()
  for (const opt of normalizeOptions(opts)) {
    opt(o)
  }
  return new BoundOS({ baseDir, mmap: o.mmap })
}

function normalizeOptions(
  opts: Array<Option | $.Slice<Option> | undefined>,
): Option[] {
  if (opts.length === 0) {
    return []
  }
  if (opts.length === 1 && typeof opts[0] !== 'function') {
    const slice = opts[0] ?? null
    const out: Option[] = []
    for (let i = 0; i < $.len(slice); i++) {
      out.push(slice![i])
    }
    return out
  }
  return opts.filter((opt): opt is Option => typeof opt === 'function')
}

export function WithBoundOS(): Option {
  return (o: options): void => {
    o.Type = BoundOSFS
  }
}

export function WithMmap(): Option {
  return (o: options): void => {
    o.mmap = true
  }
}

export class BoundOS {
  public baseDir: string
  public mmap: boolean

  constructor(init?: Partial<{ baseDir?: string; mmap?: boolean }>) {
    const baseDir = init?.baseDir ?? '/'
    this.baseDir = baseDir === '' ? '/' : filepath.Clean(baseDir)
    this.mmap = init?.mmap ?? false
  }

  public clone(): BoundOS {
    return new BoundOS({ baseDir: this.baseDir, mmap: this.mmap })
  }

  public Capabilities(): number {
    return allCapabilities
  }

  public Create(name: string): [os.File | null, $.GoError] {
    return this.OpenFile(
      name,
      os.O_RDWR | os.O_CREATE | os.O_TRUNC,
      defaultCreateMode,
    )
  }

  public Open(name: string): [os.File | null, $.GoError] {
    return this.OpenFile(name, os.O_RDONLY, 0)
  }

  public OpenFile(
    name: string,
    flag: number,
    perm: fs.FileMode,
  ): [os.File | null, $.GoError] {
    const [full, err] = this.abs(name)
    if (err !== null) {
      return [null, err]
    }
    if ((flag & os.O_CREATE) !== 0) {
      const dir = filepath.Dir(full)
      if (dir !== '.' && dir !== '') {
        const mkdirErr = os.MkdirAll(dir, defaultDirectoryMode)
        if (mkdirErr !== null) {
          return [null, mkdirErr]
        }
      }
    }
    return os.OpenFile(full, flag, perm)
  }

  public Stat(name: string): [fs.FileInfo, $.GoError] {
    const [full, err] = this.abs(name)
    if (err !== null) {
      return [null, err]
    }
    return os.Stat(full)
  }

  public Lstat(name: string): [fs.FileInfo, $.GoError] {
    const [full, err] = this.abs(name)
    if (err !== null) {
      return [null, err]
    }
    return os.Lstat(full)
  }

  public ReadDir(name: string): [$.Slice<fs.DirEntry | null>, $.GoError] {
    const [full, err] = this.abs(name)
    if (err !== null) {
      return [null, err]
    }
    const [file, openErr] = os.Open(full)
    if (openErr !== null) {
      return [null, openErr]
    }
    const [entries, readErr] = file!.ReadDir(-1)
    const closeErr = file!.Close()
    return [entries, readErr ?? closeErr]
  }

  public Rename(from: string, to: string): $.GoError {
    if (this.isRoot(from)) {
      return ErrBaseDirCannotBeRenamed
    }
    const [fromFull, fromErr] = this.abs(from)
    if (fromErr !== null) {
      return fromErr
    }
    const [toFull, toErr] = this.abs(to)
    if (toErr !== null) {
      return toErr
    }
    const mkdirErr = os.MkdirAll(filepath.Dir(toFull), defaultDirectoryMode)
    if (mkdirErr !== null) {
      return mkdirErr
    }
    return os.Rename(fromFull, toFull)
  }

  public Remove(name: string): $.GoError {
    if (this.isRoot(name)) {
      return ErrBaseDirCannotBeRemoved
    }
    const [full, err] = this.abs(name)
    if (err !== null) {
      return err
    }
    return os.Remove(full)
  }

  public RemoveAll(name: string): $.GoError {
    if (this.isRoot(name)) {
      return ErrBaseDirCannotBeRemoved
    }
    const [full, err] = this.abs(name)
    if (err !== null) {
      return err
    }
    return os.RemoveAll(full)
  }

  public MkdirAll(name: string, perm: fs.FileMode): $.GoError {
    const [full, err] = this.abs(name)
    if (err !== null) {
      return err
    }
    return os.MkdirAll(full, perm)
  }

  public Symlink(target: string, link: string): $.GoError {
    const [full, err] = this.abs(link)
    if (err !== null) {
      return err
    }
    const mkdirErr = os.MkdirAll(filepath.Dir(full), defaultDirectoryMode)
    if (mkdirErr !== null) {
      return mkdirErr
    }
    return os.Symlink(target, full)
  }

  public Readlink(link: string): [string, $.GoError] {
    const [full, err] = this.abs(link)
    if (err !== null) {
      return ['', err]
    }
    return os.Readlink(full)
  }

  public TempFile(dir: string, prefix: string): [os.File | null, $.GoError] {
    const targetDir = dir === '' ? '.tmp' : dir
    const [fullDir, err] = this.abs(targetDir)
    if (err !== null) {
      return [null, err]
    }
    const mkdirErr = os.MkdirAll(fullDir, defaultDirectoryMode)
    if (mkdirErr !== null) {
      return [null, mkdirErr]
    }
    return os.CreateTemp(fullDir, prefix === '' ? 'tmp-*' : prefix + '*')
  }

  public Join(...elem: JoinElement[]): string {
    if (elem.length === 1 && typeof elem[0] !== 'string') {
      return filepath.Join(elem[0])
    }
    return filepath.Join(...(elem as string[]))
  }

  public Chroot(path: string): [Filesystem | null, $.GoError] {
    const [full, err] = this.abs(path)
    if (err !== null) {
      return [null, err]
    }
    return [new BoundOS({ baseDir: full, mmap: this.mmap }), null]
  }

  public Root(): string {
    return this.baseDir
  }

  private isRoot(name: string): boolean {
    return name === '' || name === '.'
  }

  private abs(name: string): [string, $.GoError] {
    if (this.isRoot(name)) {
      return [this.baseDir, null]
    }
    const normalized = filepath.Clean(filepath.ToSlash(name))
    if (filepath.IsAbs(normalized)) {
      const full = filepath.Clean(filepath.FromSlash(normalized))
      if (!this.insideBase(full)) {
        return ['', ErrCrossedBoundary]
      }
      return [full, null]
    }
    if (normalized === '..' || normalized.startsWith('../')) {
      return ['', ErrCrossedBoundary]
    }
    return [filepath.Join(this.baseDir, filepath.FromSlash(normalized)), null]
  }

  private insideBase(path: string): boolean {
    const full = filepath.Clean(path)
    if (full === this.baseDir) {
      return true
    }
    return full.startsWith(
      this.baseDir.endsWith('/') ? this.baseDir : this.baseDir + '/',
    )
  }
}

export const Default = New('/')
