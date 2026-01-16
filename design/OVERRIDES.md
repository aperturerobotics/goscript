# GoScript Package Override System

## Overview

GoScript provides a package override system that allows hand-written TypeScript implementations to replace Go standard library packages. This system is used for packages like `sync`, `unicode`, `time`, `errors`, etc., where native TypeScript implementations can provide better performance or more appropriate semantics than transpiled Go code.

## Directory Structure

Override packages are located in the `gs/` directory with the following structure:

```
gs/
├── {package}/
│   ├── {package}.ts      # Main TypeScript implementation
│   ├── meta.json         # Metadata file with async methods and dependencies
│   └── index.ts          # Export file
```

### Example: sync package
```
gs/sync/
├── sync.ts               # TypeScript implementation of sync primitives
├── meta.json             # Metadata defining which functions are async
└── index.ts              # Exports from ./sync.js
```

## Metadata System

### Purpose
The metadata system allows defining which functions/methods are asynchronous, package dependencies, and other compiler-relevant information without modifying the main compiler logic.

### Metadata File Format

Each override package includes a `meta.json` file that defines metadata:

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

- **dependencies**: Array of package paths this package depends on (relative to `gs/` directory)
- **asyncMethods**: Object mapping `TypeName.MethodName` to boolean indicating if async

### Example: sync package metadata

```json
{
  "dependencies": ["unsafe"],
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

The override system integrates with the compiler's analysis phase:

1. **Metadata Loading**: Reads `meta.json` files from gs packages
2. **IsMethodAsync()**: Checks if a method call should be async based on metadata
3. **Function Coloring**: Propagates async status through the call chain
4. **Dependency Resolution**: Automatically resolves and copies package dependencies

### Method Call Detection

When the compiler encounters a method call like `mu.Lock()`, it:

1. Determines the receiver type and package
2. Looks up the method in the `asyncMethods` map from `meta.json`
3. Generates appropriate `await` if the method is marked async

Example:
```go
mu.Lock()  // Generates: await mu.Lock()
mu.Unlock() // Generates: mu.Unlock() (no await)
```

## TypeScript Implementation Guidelines

### Class Structure

Override packages should follow Go's API closely while using idiomatic TypeScript:

```typescript
export class Mutex implements Locker {
  private _locked: boolean = false
  private _waitQueue: Array<() => void> = []

  constructor(init?: Partial<{}>) {
    // Mutex has no public fields to initialize
  }

  // Async method (marked in metadata)
  public async Lock(): Promise<void> {
    // Implementation using Promises for blocking behavior
  }

  // Sync method (marked in metadata)
  public Unlock(): void {
    // Synchronous implementation
  }

  // Required for Go value semantics
  public clone(): Mutex {
    return new Mutex()
  }
}
```

### Key Requirements

1. **Constructor**: Accept optional `init` parameter for field initialization
2. **Clone Method**: Implement `clone()` for value semantics
3. **Async Methods**: Use `Promise<T>` return types for async methods
4. **Go API Compatibility**: Match Go's method signatures and behavior

### Async Implementation Patterns

For blocking operations, use Promises with queues:

```typescript
public async Lock(): Promise<void> {
  if (!this._locked) {
    this._locked = true
    return
  }

  // Block using Promise
  return new Promise<void>((resolve) => {
    this._waitQueue.push(resolve)
  })
}

public Unlock(): void {
  this._locked = false
  
  // Wake up next waiter
  if (this._waitQueue.length > 0) {
    const next = this._waitQueue.shift()!
    this._locked = true
    queueMicrotask(() => next())
  }
}
```

## Import Resolution

### Compiler Behavior

When the compiler encounters an import of an overridden package:

1. **Skip Compilation**: The compiler skips transpiling the Go package
2. **Import Mapping**: TypeScript imports resolve to `@goscript/{package}`
3. **Runtime Resolution**: The runtime maps to the actual `gs/{package}/` files

### Generated Import Statements

```typescript
// Go code:
import "sync"

// Generated TypeScript:
import * as sync from "@goscript/sync"
```

### Package Export Structure

Each override package must have an `index.ts` file:

```typescript
// gs/sync/index.ts
export * from "./sync.js"
```

This allows the import system to resolve `@goscript/sync` to the TypeScript implementation.

## Adding New Override Packages

### Step 1: Create Package Directory

```bash
mkdir gs/{package}
```

### Step 2: Implement TypeScript

Create `gs/{package}/{package}.ts` with the TypeScript implementation following the guidelines above.

### Step 3: Create Metadata File

Create `gs/{package}/meta.json`:

```json
{
  "dependencies": ["other-package-if-needed"],
  "asyncMethods": {
    "SomeType.AsyncMethod": true,
    "SomeType.SyncMethod": false
  }
}
```

### Step 4: Create Export File

Create `gs/{package}/index.ts`:

```typescript
export * from "./{package}.js"
```

The compiler will automatically detect and use the package when it encounters imports of that package.

## Testing Override Packages

### Compliance Tests

Create compliance tests in `tests/tests/package_import_{package}/`:

```
tests/tests/package_import_{package}/
├── package_import_{package}.go    # Go test code
├── expected.log                   # Expected output
├── index.ts                       # Empty file
└── tsconfig.json                  # TypeScript config
```

### Test Structure

```go
package main

import "{package}"

func main() {
    // Test package functionality
    // Use only println() for output
    // Avoid importing other packages
    
    println("test finished")
}
```

### Running Tests

```bash
go test -timeout 30s -run ^TestCompliance/package_import_{package}$ ./compiler
```

## Current Override Packages

| Package   | Status         | Description                                          |
|-----------|----------------|------------------------------------------------------|
| `sync`    | ✅ Implemented | Synchronization primitives (Mutex, WaitGroup, etc.) |
| `unicode` | ✅ Implemented | Unicode character classification and conversion      |
| `time`    | ✅ Implemented | Time and duration handling                           |
| `errors`  | ✅ Implemented | Error creation and handling                          |
| `context` | ✅ Implemented | Context for cancellation and timeouts                |
| `slices`  | ✅ Implemented | Slice utility functions                              |

## Benefits of Override System

1. **Performance**: Native TypeScript implementations can be more efficient
2. **Semantics**: Better alignment with JavaScript/TypeScript idioms
3. **Async Support**: Proper async/await integration for blocking operations
4. **Maintainability**: Cleaner, more readable generated code
5. **Extensibility**: Easy to add new packages without modifying core compiler