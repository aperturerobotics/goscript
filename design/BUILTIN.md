# GoScript Builtin Packages System

## Purpose

The GoScript builtin packages system provides hand-written TypeScript implementations of Go standard library packages that replace the default transpiled Go code.

This is usually used when a package is either too complex to transpile with goscript, has too many dependencies, uses unsafe or other unsupported apis, or when a platform-specific JavaScript API would be better used than the original Go code.

## Architecture Overview

The builtin packages system consists of three main components:

1. **Package Implementations** (`gs/{package}/`): Hand-written TypeScript code implementing Go standard library functionality
2. **Metadata System** (`gs/{package}/meta.json`): JSON files defining function async/sync behavior, dependencies, and other compiler hints
3. **Compiler Integration** (`compiler/analysis.go`): Analysis passes that load metadata and apply it during compilation

## Directory Structure

```
gs/
├── {package}/
│   ├── {package}.ts      # Main TypeScript implementation
│   ├── meta.json         # Metadata file with async methods and dependencies
│   └── index.ts          # Export file (re-exports from {package}.ts)
├── builtin/
│   ├── builtin.ts        # Core runtime functions (varRef, makeSlice, etc.)
│   └── index.ts          # Export file
└── runtime/
    ├── runtime.ts        # Runtime utilities and Go version info
    └── index.ts          # Export file
```

### Example: sync package
```
gs/sync/
├── sync.ts               # TypeScript implementation of sync primitives
├── meta.json             # Metadata defining which functions are async
└── index.ts              # Exports everything from sync.ts
```

## Metadata System

### Purpose

The metadata system allows defining compiler hints for builtin packages without modifying the main compiler code. The primary use case is specifying which functions/methods should be treated as asynchronous and declaring package dependencies.

### Metadata File Structure

Each builtin package contains a `meta.json` file with the following structure:

```json
{
  "dependencies": ["package1", "package2"],
  "asyncMethods": {
    "TypeName.MethodName": true,
    "OtherType.Method": false
  }
}
```

### Fields

- **dependencies**: Array of package paths that this package depends on (relative to `gs/` directory)
- **asyncMethods**: Object mapping method names to boolean values indicating if they're async
  - Method names use the format `TypeName.MethodName` (e.g., `Mutex.Lock`)

### Example: sync package metadata

```json
{
  "dependencies": [
    "unsafe"
  ],
  "asyncMethods": {
    "Mutex.Lock": true,
    "RWMutex.Lock": true,
    "RWMutex.RLock": true,
    "WaitGroup.Wait": true,
    "Once.Do": true,
    "Cond.Wait": true,
    "Map.Delete": true,
    "Map.Load": true,
    "Map.LoadAndDelete": true,
    "Map.LoadOrStore": true,
    "Map.Range": true,
    "Map.Store": true
  }
}
```

## Compiler Integration

### Analysis Phase

The compiler loads metadata during the analysis phase in `compiler/analysis.go`:

1. **Package Detection**: Checks if a package has a `meta.json` file in the `gs/` directory
2. **Metadata Loading**: Parses the JSON file to extract async methods and dependencies
3. **Storage**: Metadata is stored for later use during compilation

### Compilation Phase

During compilation, the metadata is used to determine async behavior:

1. **Method Calls**: Checks if a method should be async based on the `asyncMethods` map
2. **Code Generation**: Async calls get `await` keywords, sync calls don't
3. **Dependency Resolution**: Dependencies are automatically copied when the package is used

## TypeScript Implementation Guidelines

### Class Structure

Builtin packages should implement Go types as TypeScript classes with:

```typescript
export class GoType {
    // Private fields for internal state
    private _field: Type

    // Constructor matching Go struct initialization
    constructor(init?: Partial<{field?: Type}>) {
        this._field = init?.field ?? defaultValue
    }

    // Methods matching Go methods
    public async AsyncMethod(): Promise<void> {
        // Implementation
    }

    public SyncMethod(): ReturnType {
        // Implementation  
    }

    // Clone method for Go value semantics (if needed)
    public clone(): GoType {
        return new GoType({field: this._field})
    }
}
```

### Async Method Implementation

Async methods should use JavaScript's Promise-based concurrency:

```typescript
export class Mutex {
    private _locked: boolean = false
    private _waitQueue: Array<() => void> = []

    public async Lock(): Promise<void> {
        if (!this._locked) {
            this._locked = true
            return
        }

        // Wait for unlock
        return new Promise<void>((resolve) => {
            this._waitQueue.push(resolve)
        })
    }

    public Unlock(): void {
        if (!this._locked) return
        
        if (this._waitQueue.length > 0) {
            const next = this._waitQueue.shift()!
            next() // Wake up next waiter
        } else {
            this._locked = false
        }
    }
}
```

### Function Implementation

Package-level functions should be exported directly:

```typescript
// Sync function
export function OnceFunc(f: () => void): () => void {
    let called = false
    return () => {
        if (!called) {
            called = true
            f()
        }
    }
}

// Async function  
export async function NewCond(l: Locker): Promise<Cond> {
    return new Cond(l)
}
```

### Export Structure

Each package should have an `index.ts` that re-exports everything:

```typescript
// gs/sync/index.ts
export * from './sync.js'
```

## Import Resolution

### Compiler Mapping

The compiler maps Go import paths to builtin packages:

```go
// Go code
import "sync"

// Maps to TypeScript import
import * as sync from "@goscript/gs/sync"
```

### Package Resolution Priority

1. **Builtin Override**: Check if `gs/{package}/` exists
2. **Standard Library**: Use transpiled Go standard library
3. **User Package**: Transpile user's Go code

### Import Path Handling

The compiler handles various import scenarios:

```go
// Direct package import
import "sync"
var mu sync.Mutex

// Aliased import  
import mysync "sync"
var mu mysync.Mutex

// Selective import (not supported in Go, but conceptually)
// Translates to: import { Mutex } from "@goscript/gs/sync"
```

## Package Examples

### sync Package

**Key Features:**
- Mutex with async Lock() and sync Unlock()
- WaitGroup with async Wait() and sync Add()/Done()
- Once with async Do() but sync OnceFunc()/OnceValue()
- Map with async operations for thread safety
- Pool with sync Get()/Put() operations

**Async Rationale:**
- `Lock()` and `Wait()` can block, so they're async
- `Unlock()`, `Add()`, `Done()` are immediate operations, so they're sync
- `OnceFunc()`/`OnceValue()` return sync functions (not async functions)

### unicode Package

**Key Features:**
- Character classification functions (IsLetter, IsDigit, etc.)
- Case conversion functions (ToUpper, ToLower, ToTitle)
- Range table operations (Is, In)
- All functions are synchronous

**Implementation Notes:**
- Uses JavaScript's built-in Unicode support where possible
- Implements Go-specific Unicode categories and ranges
- All operations are CPU-bound and don't require async

### time Package (Example)

**Key Features:**
- Duration arithmetic and formatting
- Time parsing and formatting
- Sleep function (async)
- Timer and Ticker (async operations)

**Async Rationale:**
- `Sleep()` blocks execution, so it's async
- Timer/Ticker operations involve waiting, so they're async
- Parsing/formatting are CPU-bound, so they're sync

## Testing Strategy

### Compliance Tests

Each builtin package should have compliance tests in `tests/tests/package_import_{package}/`:

```
tests/tests/package_import_sync/
├── package_import_sync.go    # Go test code
├── expected.log              # Expected output
└── package_import_sync.gs.ts # Generated TypeScript (auto-generated)
```

### Test Structure

```go
// package_import_sync.go
package main

import "sync"

func main() {
    // Test various sync operations
    var mu sync.Mutex
    mu.Lock()
    println("Mutex locked")
    mu.Unlock()
    println("Mutex unlocked")
    
    // Test async operations
    var wg sync.WaitGroup
    wg.Add(1)
    go func() {
        defer wg.Done()
        println("Goroutine executed")
    }()
    wg.Wait()
    println("WaitGroup completed")
}
```

### Running Tests

```bash
# Run specific package test
go test -timeout 30s -run ^TestCompliance/package_import_sync$ ./compiler

# Run all compliance tests
go test -v ./compiler
```

## Error Handling

### Common Issues

1. **Missing Metadata**: Functions default to sync if no metadata is provided
2. **Incorrect Async Marking**: Can cause runtime errors or poor performance
3. **Import Resolution**: Ensure package names match exactly

### Debugging

1. **Check Metadata Loading**: Verify `LoadPackageMetadata()` finds the metadata file
2. **Verify Naming Convention**: Ensure `*Info` variables follow the exact naming pattern
3. **Test Compilation**: Check generated TypeScript for correct `await` placement

## Best Practices

### Implementation

1. **Follow Go Semantics**: Maintain Go's behavior and API contracts
2. **Use TypeScript Features**: Leverage TypeScript's type system and modern JavaScript features
3. **Handle Errors Properly**: Use appropriate error handling for async operations
4. **Document Async Behavior**: Clearly document which operations are async and why
5. **Follow Goscript Semantics**: Follow the goscript semantics for varrefed variables, async/await, etc.

### Metadata

1. **Minimal Metadata**: Define metadata only for things that need to be overridden from the defaults (async for example).
2. **Consider Blocking**: Mark operations that can block as async
