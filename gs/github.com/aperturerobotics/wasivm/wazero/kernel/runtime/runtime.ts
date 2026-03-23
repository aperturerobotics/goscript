// Package vmruntime defines abstract interfaces for WASM execution engines.

// VmRuntime abstracts the WASM execution engine.
export interface VmRuntime {
  Compile(ctx: any, wasm: Uint8Array | number[]): Promise<VmModule>
  Close(ctx: any): Promise<any>
}

// VmModule represents a compiled WASM module.
export interface VmModule {
  Instantiate(ctx: any, config: VmModuleConfig): Promise<VmInstance>
  Close(ctx: any): Promise<any>
}

// VmModuleConfig contains configuration for module instantiation.
export interface VmModuleConfig {
  Name: string
  Args: string[] | null
  Env: string[] | null
  Stdin: any
  Stdout: any
  Stderr: any
  HostFunctions: Map<string, HostFunction> | null
}

// HostFunction is a host-provided function callable from WASM.
export type HostFunction = (
  ctx: any,
  inst: VmInstance | null,
  stack: number[],
) => any

// VmInstance represents a running WASM module instance.
export interface VmInstance {
  Call(ctx: any, name: string, ...args: number[]): Promise<number[] | null>
  Memory(): VmMemory | null
  ExportedFunction(name: string): VmFunction | null
  ExportedGlobal(name: string): VmGlobal | null
  Close(ctx: any): Promise<any>
}

// VmFunction represents an exported WASM function.
export interface VmFunction {
  Call(ctx: any, ...args: number[]): Promise<number[] | null>
}

// VmGlobal represents an exported WASM global variable.
export interface VmGlobal {
  Get(): number
  Set(val: number): void
}

// VmMemory abstracts access to WASM linear memory.
export interface VmMemory {
  Read(offset: number, length: number): [Uint8Array | number[], boolean]
  ReadByteAt(offset: number): [number, boolean]
  ReadUint32Le(offset: number): [number, boolean]
  ReadUint64Le(offset: number): [bigint | number, boolean]
  Write(offset: number, data: Uint8Array | number[]): boolean
  WriteByteAt(offset: number, val: number): boolean
  WriteUint32Le(offset: number, val: number): boolean
  WriteUint64Le(offset: number, val: bigint | number): boolean
  Size(): number
  Grow(pages: number): [number, boolean]
}

// ExitError represents a clean process exit with a status code.
export class ExitError extends Error {
  public Code: number

  constructor(code: number) {
    super('exit: ' + code)
    this.Code = code
  }

  ExitCode(): number {
    return this.Code
  }
}

// NewExitError creates an ExitError with the given code.
export function NewExitError(code: number): ExitError {
  return new ExitError(code)
}

// Snapshotable is an optional extension for VmInstance.
export interface Snapshotable {
  Snapshot(): Snapshot
}

// Snapshot represents a captured execution state.
export interface Snapshot {
  Restore(returnValues: number[]): void
}
