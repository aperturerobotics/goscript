// Package browser_runtime implements VmRuntime backed by the browser
// WebAssembly API. Pure TypeScript -- no syscall/js indirection.

import type * as vmruntime from '../runtime.js'

// Runtime implements VmRuntime using the browser WebAssembly API.
export class Runtime implements vmruntime.VmRuntime {
  constructor() {}

  // Compile calls WebAssembly.compile and returns a Module.
  async Compile(
    _ctx: any,
    wasm: Uint8Array | number[],
  ): Promise<Module> {
    const bytes = wasm instanceof Uint8Array ? wasm : new Uint8Array(wasm)
    const compiled = await WebAssembly.compile(bytes.buffer as ArrayBuffer)
    return new Module(compiled)
  }

  // Close is a no-op for the browser runtime.
  async Close(_ctx: any): Promise<null> {
    return null
  }
}

// New creates a new browser-backed VmRuntime.
export function New(): Runtime {
  return new Runtime()
}

// Module wraps a WebAssembly.Module.
export class Module implements vmruntime.VmModule {
  constructor(private readonly wasmModule: WebAssembly.Module) {}

  // Instantiate creates an instance with host functions wired as imports.
  async Instantiate(
    ctx: any,
    config: vmruntime.VmModuleConfig,
  ): Promise<Instance> {
    const imports = this.buildImports(ctx, config.HostFunctions)
    const wasmInst = await WebAssembly.instantiate(this.wasmModule, imports)
    const inst = new Instance(wasmInst)
    // Patch the captured instance reference in host function closures.
    if ((imports as any).__instRef) {
      ;(imports as any).__instRef.current = inst
    }
    return inst
  }

  // Close is a no-op.
  async Close(_ctx: any): Promise<null> {
    return null
  }

  // buildImports constructs the WebAssembly imports object.
  private buildImports(
    ctx: any,
    hostFns: Map<string, vmruntime.HostFunction> | null,
  ): WebAssembly.Imports {
    const imports: Record<string, Record<string, WebAssembly.ImportValue>> = {}
    if (!hostFns) return imports

    // Shared mutable ref -- patched after instantiation.
    const instRef: { current: Instance | null } = { current: null }

    hostFns.forEach((fn, key) => {
      let modName = 'env'
      let funcName = key
      const dot = key.indexOf('.')
      if (dot !== -1) {
        modName = key.substring(0, dot)
        funcName = key.substring(dot + 1)
      }
      if (!imports[modName]) imports[modName] = {}

      imports[modName][funcName] = (...args: number[]) => {
        const stack = new BigInt64Array(args.length)
        for (let i = 0; i < args.length; i++) {
          stack[i] = BigInt(args[i])
        }
        const u64Stack: number[] = args.map((a) => a >>> 0)
        const err = fn(ctx, instRef.current, u64Stack)
        if (err) throw err
        // WASM i32 return: first stack element.
        if (u64Stack.length > 0) return u64Stack[0]
      }
    })

    // Stash the ref so Instantiate can patch it.
    ;(imports as any).__instRef = instRef
    return imports
  }
}

// Instance wraps a WebAssembly.Instance.
export class Instance implements vmruntime.VmInstance {
  private readonly exports: WebAssembly.Exports

  constructor(private readonly wasmInstance: WebAssembly.Instance) {
    this.exports = wasmInstance.exports
  }

  // Call invokes an exported function by name.
  async Call(
    _ctx: any,
    name: string,
    ...args: number[]
  ): Promise<number[] | null> {
    const fn = this.exports[name]
    if (typeof fn !== 'function') return null
    const result = (fn as (...args: number[]) => unknown)(...args)
    if (result === undefined) return null
    return [result as number]
  }

  // Memory returns the instance's linear memory.
  Memory(): BrowserMemory | null {
    const mem = this.exports.memory
    if (!(mem instanceof WebAssembly.Memory)) return null
    return new BrowserMemory(mem)
  }

  // ExportedFunction returns a callable reference.
  ExportedFunction(name: string): BrowserFunction | null {
    const fn = this.exports[name]
    if (typeof fn !== 'function') return null
    return new BrowserFunction(fn as (...args: number[]) => unknown)
  }

  // ExportedGlobal returns a reference to an exported global.
  ExportedGlobal(name: string): BrowserGlobal | null {
    const g = this.exports[name]
    if (!(g instanceof WebAssembly.Global)) return null
    return new BrowserGlobal(g)
  }

  // Close is a no-op.
  async Close(_ctx: any): Promise<null> {
    return null
  }
}

// BrowserFunction wraps a WebAssembly exported function.
export class BrowserFunction implements vmruntime.VmFunction {
  constructor(private readonly fn: (...args: number[]) => unknown) {}

  async Call(_ctx: any, ...args: number[]): Promise<number[] | null> {
    const result = this.fn(...args)
    if (result === undefined) return null
    return [result as number]
  }
}

// BrowserGlobal wraps a WebAssembly.Global.
export class BrowserGlobal implements vmruntime.VmGlobal {
  constructor(private readonly global: WebAssembly.Global) {}

  Get(): number {
    return this.global.value as number
  }

  Set(val: number): void {
    this.global.value = val
  }
}

// BrowserMemory wraps WebAssembly.Memory with typed DataView access.
export class BrowserMemory implements vmruntime.VmMemory {
  constructor(private readonly mem: WebAssembly.Memory) {}

  private get buf(): ArrayBuffer {
    return this.mem.buffer
  }

  Read(offset: number, length: number): [Uint8Array, boolean] {
    if (offset + length > this.buf.byteLength) return [new Uint8Array(0), false]
    return [new Uint8Array(this.buf, offset, length), true]
  }

  ReadByteAt(offset: number): [number, boolean] {
    if (offset >= this.buf.byteLength) return [0, false]
    return [new Uint8Array(this.buf, offset, 1)[0], true]
  }

  ReadUint32Le(offset: number): [number, boolean] {
    if (offset + 4 > this.buf.byteLength) return [0, false]
    return [new DataView(this.buf).getUint32(offset, true), true]
  }

  ReadUint64Le(offset: number): [bigint, boolean] {
    if (offset + 8 > this.buf.byteLength) return [0n, false]
    const dv = new DataView(this.buf)
    const lo = BigInt(dv.getUint32(offset, true))
    const hi = BigInt(dv.getUint32(offset + 4, true))
    return [lo | (hi << 32n), true]
  }

  Write(offset: number, data: Uint8Array | number[]): boolean {
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data)
    if (offset + bytes.length > this.buf.byteLength) return false
    new Uint8Array(this.buf, offset, bytes.length).set(bytes)
    return true
  }

  WriteByteAt(offset: number, val: number): boolean {
    if (offset >= this.buf.byteLength) return false
    new Uint8Array(this.buf, offset, 1)[0] = val
    return true
  }

  WriteUint32Le(offset: number, val: number): boolean {
    if (offset + 4 > this.buf.byteLength) return false
    new DataView(this.buf).setUint32(offset, val, true)
    return true
  }

  WriteUint64Le(offset: number, val: bigint | number): boolean {
    if (offset + 8 > this.buf.byteLength) return false
    const v = typeof val === 'bigint' ? val : BigInt(val)
    const dv = new DataView(this.buf)
    dv.setUint32(offset, Number(v & 0xffffffffn), true)
    dv.setUint32(offset + 4, Number((v >> 32n) & 0xffffffffn), true)
    return true
  }

  Size(): number {
    return this.buf.byteLength
  }

  Grow(pages: number): [number, boolean] {
    try {
      const prev = this.mem.grow(pages)
      return [prev, true]
    } catch {
      return [0, false]
    }
  }
}
