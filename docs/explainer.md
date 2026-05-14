# GoScript: A Comprehensive Architecture Explainer

GoScript is an experimental Go-to-TypeScript transpiler that converts Go source code into maintainable, idiomatic TypeScript while preserving Go's semantics. This document provides a deep dive into how GoScript works.

## Table of Contents

1. [Overview](#overview)
2. [High-Level Architecture](#high-level-architecture)
3. [Compilation Pipeline](#compilation-pipeline)
4. [Compiler Components](#compiler-components)
5. [Analysis Phase](#analysis-phase)
6. [Code Generation Phase](#code-generation-phase)
7. [Type System Translation](#type-system-translation)
8. [Runtime System](#runtime-system)
9. [Concurrency Model](#concurrency-model)
10. [Value Semantics](#value-semantics)

---

## Overview

GoScript translates Go code at the AST (Abstract Syntax Tree) level, producing readable TypeScript that preserves Go's type safety and semantics. The primary use case is sharing business logic between Go backends and TypeScript frontends.

### Design Philosophy

1. **AST Mapping**: Close mapping between Go AST and TypeScript output
2. **Type Preservation**: Maintain Go's static typing in TypeScript
3. **Value Semantics**: Emulate Go's value copying behavior for structs
4. **Idiomatic Output**: Generate TypeScript that feels natural to TS developers
5. **Readability**: Prioritize clear, understandable generated code

---

## High-Level Architecture

```
┌───────────────────────────────────────────────────────────────────────┐
│                       GoScript Compile Service                        │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐             │
│  │ Public       │───▶│ Compile      │───▶│ Package      │             │
│  │ Adapters     │    │ Request      │    │ Graph        │             │
│  └──────────────┘    └──────────────┘    └──────────────┘             │
│                                                  │                    │
│                                                  ▼                    │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐             │
│  │ TypeScript   │◀───│ TypeScript   │◀───│ Lowered      │             │
│  │ Output       │    │ Emitter      │    │ Program      │             │
│  └──────────────┘    └──────────────┘    └──────────────┘             │
│         ▲                 ▲                    ▲                      │
│         │                 │                    │                      │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐             │
│  │ Override     │    │ Runtime      │    │ Semantic     │             │
│  │ Registry     │    │ Contract     │    │ Model        │             │
│  └──────────────┘    └──────────────┘    └──────────────┘             │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌───────────────────────────────────────────────────────────────────────┐
│                        @goscript/builtin Runtime                      │
├───────────────────────────────────────────────────────────────────────┤
│  varRef.ts │ slice.ts │ channel.ts │ map.ts │ type.ts │ defer.ts      │
└───────────────────────────────────────────────────────────────────────┘
```

The public CLI uses `github.com/aperturerobotics/cli` and constructs
`compiler.Config` from command-local flag state. The public Go API is
`compiler.Compiler`, which forwards package patterns into `CompileService`.
The WASM/browser adapter parses and type-checks import-free single-file source
strings, builds the same semantic model used by package compilation, and then
reuses the v2 lowering and TypeScript emitter. Browser source imports still
return a structured diagnostic; use the package workflow for imported code.

---

## Compilation Pipeline

### State Machine: Overall Compilation Flow

```
┌───────────────────────────────────────────────────────────────┐
│                   COMPILATION STATE MACHINE                   │
└───────────────────────────────────────────────────────────────┘

    ┌─────────┐
    │  START  │
    └────┬────┘
         │
         ▼
┌───────────────────┐
│ VALIDATE REQUEST  │
│                   │
│ - package patterns│
│ - output path     │
│ - module root     │
│ - build flags     │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ LOAD PACKAGE GRAPH│ Uses golang.org/x/tools/go/packages
│                   │ Env: GOOS=js, GOARCH=wasm
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ SEMANTIC MODEL    │
│                   │
│ - package facts   │
│ - addressability  │
│ - methods/types   │
│ - async facts     │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ OVERRIDE COPY PLAN│ Discover handwritten gs/ packages
│                   │ and validate dependencies before output
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ LOWER PROGRAM     │ Convert Go AST + semantic facts into
│                   │ compiler-owned IR
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ EMIT TYPESCRIPT   │ Render only from lowered IR
│                   │ and generate indexes
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ COPY OVERRIDES    │ Copy @goscript/builtin and required
│                   │ handwritten packages
└─────────┬─────────┘
          │
          ▼
    ┌─────────┐
    │   END   │
    └─────────┘
```

---

## Compiler Components

GoScript v2 uses owner-level components instead of a package/file compiler
hierarchy. Each owner hides one durable rule boundary:

```
┌───────────────────────────────────────────────────────────────────┐
│                         PUBLIC ADAPTERS                           │
│  cmd/goscript: github.com/aperturerobotics/cli flag surface       │
│  compiler.Compiler: Go API adapter over CompileService            │
│  compiler/wasm: browser diagnostic adapter                        │
└───────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────┐
│                         CompileService                            │
│  - Coordinates request, graph, semantic, lowering, emit, copy      │
│  - Accumulates structured diagnostics                             │
│  - Stops before writing output when owner diagnostics are errors   │
└───────────────────────────────────────────────────────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              ▼                     ▼                     ▼
┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│ CompileRequestOwner  │ │ PackageGraphOwner    │ │ SemanticModelOwner   │
│ Normalizes adapters  │ │ Loads packages       │ │ Computes package,    │
│ and validates module │ │ with go/packages     │ │ type, method, async, │
│ package requests     │ │ and build flags      │ │ and address facts    │
└──────────────────────┘ └──────────────────────┘ └──────────────────────┘
              ▼                     ▼                     ▼
┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│ OverrideRegistryOwner│ │ LoweringOwner        │ │ TypeScriptEmitOwner  │
│ Discovers/copies gs/ │ │ Converts semantic    │ │ Renders deterministic│
│ packages and async   │ │ model + AST to IR    │ │ TypeScript from IR   │
│ override metadata    │ │                      │ │ only                 │
└──────────────────────┘ └──────────────────────┘ └──────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────┐
│                       RuntimeContractOwner                        │
│  Owns generated helper names and @goscript/builtin import policy  │
└───────────────────────────────────────────────────────────────────┘
```

The main design constraint is that text emission is the last step. Earlier
owners decide package identity, imports, async coloring, pointer/value shape,
interface descriptors, generic dictionaries, override dependencies, and runtime
helper names before `TypeScriptEmitOwner` writes files.

---

## Analysis Phase

The analysis phase pre-computes all information needed for code generation. This happens **before** any TypeScript is written.

### Analysis State Machine

```
┌───────────────────────────────────────────────────────────────┐
│                    ANALYSIS STATE MACHINE                     │
└───────────────────────────────────────────────────────────────┘

    ┌─────────┐
    │  START  │
    └────┬────┘
         │
         ▼
┌─────────────────────┐
│ PROCESS IMPORTS     │
│                     │
│ Collect import      │
│ statements and      │
│ their usage         │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ ANALYZE FUNCTIONS   │
│                     │
│ For each function:  │
│ • Track receivers   │
│ • Named returns     │
│ • Closure captures  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐     ┌─────────────────────────────────────┐
│ VARIABLE USAGE      │     │ Rules for NeedsVarRef:              │
│ ANALYSIS            │────▶│ • Address taken (&var)              │
│                     │     │ • Assigned to pointer               │
│ Determine which     │     │ • Passed to function taking pointer │
│ vars need VarRef    │     └─────────────────────────────────────┘
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐     ┌─────────────────────────────────────┐
│ ASYNC ANALYSIS      │     │ Async Roots (Inherently Async):     │
│ (Function Coloring) │────▶│ • Channel receive: <-ch             │
│                     │     │ • Channel send: ch <- val           │
│ Propagate async     │     │ • select statements                 │
│ status through      │     │ • go statements (goroutines)        │
│ call graph          │     │                                     │
└─────────┬───────────┘     │ Propagation:                        │
          │                 │ • Calls async func → becomes async  │
          │                 └─────────────────────────────────────┘
          ▼
┌─────────────────────┐
│ DEFER ANALYSIS      │
│                     │
│ Mark blocks with    │
│ defer statements    │
│ (sync vs async)     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ INTERFACE IMPL      │
│ TRACKING            │
│                     │
│ Map structs to      │
│ interfaces they     │
│ implement           │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ BUILD ANALYSIS      │
│ RESULT              │
│                     │
│ Package into        │
│ read-only struct    │
└─────────┬───────────┘
          │
          ▼
     ┌────────┐
     │  END   │
     └────────┘
```

### Analysis Data Structure

```go
type Analysis struct {
    // Variable reference tracking
    VariableUsage           map[types.Object]*VariableUsage

    // Function metadata
    FunctionData            map[types.Object]*FunctionInfo
    MethodAsyncStatus       map[string]bool

    // Per-node metadata
    NodeData                map[ast.Node]*NodeInfo

    // Interface implementations
    InterfaceImplementations map[InterfaceMethodKey][]ImplementationInfo

    // Import management
    SyntheticImportsPerFile map[string]map[string]*ImportInfo
    ReferencedTypesPerFile  map[string]map[types.Type]bool

    // Comment preservation
    Cmap                    ast.CommentMap
}
```

---

## Code Generation Phase

After analysis, the compiler traverses the AST and generates TypeScript.

### Code Generation State Machine

```
┌───────────────────────────────────────────────────────────────┐
│                 CODE GENERATION STATE MACHINE                 │
└───────────────────────────────────────────────────────────────┘

    ┌─────────┐
    │  START  │
    └────┬────┘
         │
         ▼
┌─────────────────────┐
│ WRITE IMPORTS       │
│                     │
│ import * as $ from  │
│ "@goscript/builtin" │
│                     │
│ Auto-imports from   │
│ same package        │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ FOR EACH DECL       │◀──────────────────────────────────┐
│                     │                                   │
│ • GenDecl (type,    │                                   │
│   const, var)       │                                   │
│ • FuncDecl          │                                   │
└─────────┬───────────┘                                   │
          │                                               │
          ├─────▶ TYPE SPEC ──────▶ WriteTypeSpec         │
          │       (struct, interface, alias)              │
          │                                               │
          ├─────▶ VALUE SPEC ─────▶ WriteValueSpec        │
          │       (const, var)                            │
          │                                               │
          ├─────▶ FUNC DECL ──────▶ WriteFuncDecl         │
          │       (function, method)                      │
          │                                               │
          └───────────────────────────────────────────────┘
                      │
                      │ more decls?
                      │
                      ▼
                 ┌────────┐
                 │  END   │
                 └────────┘
```

### Expression Translation Flow

```
┌───────────────────────────────────────────────────────────────┐
│                  EXPRESSION TRANSLATION FLOW                  │
└───────────────────────────────────────────────────────────────┘

                    WriteValueExpr(expr)
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │ BasicLit   │  │ Ident      │  │ CallExpr   │
    │            │  │            │  │            │
    │ "hello"    │  │ varName    │  │ func()     │
    │ 42         │  │            │  │            │
    │ true       │  │ Check if   │  │ Check if   │
    └─────┬──────┘  │ needs      │  │ async,     │
          │         │ .value     │  │ builtin,   │
          │         │ access     │  │ type conv  │
          ▼         └─────┬──────┘  └─────┬──────┘
    ┌────────────┐        │               │
    │ Write      │        ▼               ▼
    │ literal    │  ┌────────────┐  ┌────────────┐
    └────────────┘  │ WriteIdent │  │ WriteCall  │
                    │            │  │ Expr       │
                    │ Add .value │  │            │
                    │ if VarRef  │  │ Add await  │
                    └────────────┘  │ if async   │
                                    └────────────┘

           │               │               │
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │ BinaryExpr │  │ UnaryExpr  │  │ IndexExpr  │
    │            │  │            │  │            │
    │ a + b      │  │ &x, *p     │  │ arr[i]     │
    │ x == y     │  │ -n, !b     │  │ map[key]   │
    └─────┬──────┘  └─────┬──────┘  └─────┬──────┘
          │               │               │
          ▼               ▼               ▼
    Write left    Handle addr/  Write collection
    op right      deref with    with index
                  VarRef logic
```

---

## Type System Translation

### Type Mapping Table

| Go Type                 | TypeScript Type                      | Notes                    |
|-------------------------|--------------------------------------|--------------------------|
| `int`, `int32`, `int64` | `number`                             | JavaScript number        |
| `float64`, `float32`    | `number`                             | IEEE 754 64-bit          |
| `string`                | `string`                             | Direct mapping           |
| `bool`                  | `boolean`                            | Direct mapping           |
| `rune`                  | `number`                             | Unicode code point       |
| `byte`                  | `number`                             | Byte value               |
| `error`                 | `$.error \| null`                    | Runtime interface        |
| `[]T`                   | `T[] \| null`                        | With `__capacity`        |
| `map[K]V`               | `Map<K, V> \| null`                  | Standard Map             |
| `chan T`                | `$.Channel<T>`                       | Runtime class            |
| `*T`                    | `T \| null` or `$.VarRef<T> \| null` | Depends on addressability|
| `interface{}`           | `any`                                | Or specific interface    |

### Struct Translation

```
┌───────────────────────────────────────────────────────────────────────┐
│                          STRUCT TRANSLATION                           │
└───────────────────────────────────────────────────────────────────────┘

Go Source:
┌─────────────────────────────────────┐
│ type Person struct {                │
│     Name string                     │
│     Age  int                        │
│     addr *Address                   │
│ }                                   │
└─────────────────────────────────────┘

                    │
                    │  Translation
                    ▼

TypeScript Output:
┌───────────────────────────────────────────────────────────────────────┐
│ export class Person {                                                 │
│     // Getters/setters for clean API                                  │
│     public get Name(): string {                                       │
│         return this._fields.Name.value                                │
│     }                                                                 │
│     public set Name(value: string) {                                  │
│         this._fields.Name.value = value                               │
│     }                                                                 │
│     public get Age(): number {                                        │
│         return this._fields.Age.value                                 │
│     }                                                                 │
│     public set Age(value: number) {                                   │
│         this._fields.Age.value = value                                │
│     }                                                                 │
│     public get addr(): Address | null {                               │
│         return this._fields.addr.value                                │
│     }                                                                 │
│     public set addr(value: Address | null) {                          │
│         this._fields.addr.value = value                               │
│     }                                                                 │
│                                                                       │
│     // Internal storage with VarRefs for addressability               │
│     public _fields: {                                                 │
│         Name: $.VarRef<string>                                        │
│         Age: $.VarRef<number>                                         │
│         addr: $.VarRef<Address | null>                                │
│     }                                                                 │
│                                                                       │
│     constructor(init?: Partial<{Name?: string, Age?: number, ...}>) { │
│         this._fields = {                                              │
│             Name: $.varRef(init?.Name ?? ""),                         │
│             Age: $.varRef(init?.Age ?? 0),                            │
│             addr: $.varRef(init?.addr ?? null)                        │
│         }                                                             │
│     }                                                                 │
│                                                                       │
│     // Clone for value semantics                                      │
│     public clone(): Person {                                          │
│         const cloned = new Person()                                   │
│         cloned._fields = {                                            │
│             Name: $.varRef(this._fields.Name.value),                  │
│             Age: $.varRef(this._fields.Age.value),                    │
│             addr: $.varRef(this._fields.addr.value)                   │
│         }                                                             │
│         return cloned                                                 │
│     }                                                                 │
│ }                                                                     │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Runtime System

The `@goscript/builtin` runtime provides essential helpers:

### Runtime Components

```
┌───────────────────────────────────────────────────────────────────────┐
│                           @goscript/builtin                           │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ varRef.ts   │  │ slice.ts    │  │ channel.ts  │  │ map.ts      │  │
│  │             │  │             │  │             │  │             │  │
│  │ VarRef<T>   │  │ makeSlice   │  │ Channel<T>  │  │ makeMap     │  │
│  │ varRef()    │  │ slice()     │  │ makeChannel │  │ mapSet      │  │
│  │ unref()     │  │ append()    │  │ selectStmt  │  │ mapGet      │  │
│  └─────────────┘  │ copy()      │  │ chanSend    │  │ deleteMap   │  │
│                   │ len()       │  │ chanRecv    │  │ Entry       │  │
│                   │ cap()       │  └─────────────┘  └─────────────┘  │
│                   └─────────────┘                                    │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ type.ts     │  │ defer.ts    │  │ errors.ts   │  │ builtin.ts  │  │
│  │             │  │             │  │             │  │             │  │
│  │ registerType│  │ Disposable  │  │ error type  │  │ println     │  │
│  │ typeAssert  │  │ Stack       │  │ panic       │  │ print       │  │
│  │ TypeInfo    │  │ AsyncDisp.  │  │ recover     │  │ bitwise ops │  │
│  │ TypeKind    │  │ Stack       │  │             │  │ int(), byte │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

### VarRef (Variable Reference) System

The VarRef system enables Go's pointer semantics in TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              VARREF SYSTEM                              │
└─────────────────────────────────────────────────────────────────────────┘

Go Code:
┌──────────────────────────┐
│ var x int = 10           │
│ p := &x                  │
│ *p = 20                  │
│ println(x) // 20         │
└──────────────────────────┘

         │ Analysis determines x needs VarRef (address taken)
         ▼

TypeScript Output:
┌──────────────────────────────────────────────────────────────────────┐
│ let x: $.VarRef<number> = $.varRef(10)  // x is wrapped in VarRef    │
│ let p: $.VarRef<number> | null = x       // p points to same VarRef  │
│ p!.value = 20                            // modify through pointer   │
│ $.println(x.value)                       // access value: 20         │
└──────────────────────────────────────────────────────────────────────┘


Memory Model Visualization:
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   x ─────────────────┐                                                  │
│                      │                                                  │
│                      ▼                                                  │
│              ┌─────────────────┐                                        │
│              │   VarRef<number>│                                        │
│              │   ┌───────────┐ │                                        │
│              │   │ value: 20 │ │                                        │
│              │   └───────────┘ │                                        │
│              └─────────────────┘                                        │
│                      ▲                                                  │
│                      │                                                  │
│   p ─────────────────┘                                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Concurrency Model

GoScript translates Go's concurrency to TypeScript async/await:

### Function Coloring Algorithm

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       FUNCTION COLORING ALGORITHM                       │
└─────────────────────────────────────────────────────────────────────────┘

Phase 1: Identify Async Roots
─────────────────────────────
  ┌────────────────┐
  │ Scan all funcs │
  └───────┬────────┘
          │
          ▼
  ┌────────────────────────────────────────────────────────────────┐
  │ Contains any of these? ────▶ Mark as ASYNC                     │
  │                                                                │
  │   • <-ch       (channel receive)                               │
  │   • ch <- val  (channel send)                                  │
  │   • select {}  (select statement)                              │
  │   • go func()  (goroutine creation)                            │
  └────────────────────────────────────────────────────────────────┘


Phase 2: Propagate Async Status
───────────────────────────────
  ┌────────────────────────────────────────────────────────────────┐
  │                                                                │
  │   func A() {           func B() {         func C() {          │
  │     <-ch  ◀── ASYNC      A()  ◀── ASYNC     B()  ◀── ASYNC   │
  │   }                    }                   }                   │
  │                                                                │
  │   Async propagates through call graph                          │
  └────────────────────────────────────────────────────────────────┘


Phase 3: Code Generation
────────────────────────
  ┌────────────────────────────────────────────────────────────────┐
  │                                                                │
  │   // SYNC function                // ASYNC function            │
  │   function add(a, b) {            async function recv(ch) {   │
  │     return a + b                    return await ch.receive() │
  │   }                               }                            │
  │                                                                │
  │   // Call site                    // Call site                 │
  │   let sum = add(1, 2)             let val = await recv(ch)    │
  │                                                                │
  └────────────────────────────────────────────────────────────────┘
```

### Channel Operations

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CHANNEL TRANSLATION                           │
└─────────────────────────────────────────────────────────────────────────┘

Go Code:                              TypeScript Output:
┌────────────────────────────┐       ┌─────────────────────────────────────┐
│ ch := make(chan int, 1)    │  ───▶ │ let ch = $.makeChannel<number>(1, 0)│
│                            │       │                                     │
│ ch <- 42                   │  ───▶ │ await $.chanSend(ch, 42)            │
│                            │       │                                     │
│ val := <-ch                │  ───▶ │ let val = await $.chanRecv(ch)      │
│                            │       │                                     │
│ val, ok := <-ch            │  ───▶ │ let {value: val, ok} =              │
│                            │       │     await $.chanRecvWithOk(ch)      │
│                            │       │                                     │
│ close(ch)                  │  ───▶ │ ch.close()                          │
└────────────────────────────┘       └─────────────────────────────────────┘


Select Statement:
┌────────────────────────────┐       ┌─────────────────────────────────────┐
│ select {                   │       │ await $.selectStatement([           │
│ case val := <-ch1:         │  ───▶ │   {                                 │
│   process(val)             │       │     id: 0, isSend: false,           │
│ case ch2 <- data:          │       │     channel: ch1,                   │
│   sent()                   │       │     onSelected: async (r) => {      │
│ default:                   │       │       let val = r.value             │
│   nothing()                │       │       process(val)                  │
│ }                          │       │     }                               │
│                            │       │   },                                │
│                            │       │   {                                 │
│                            │       │     id: 1, isSend: true,            │
│                            │       │     channel: ch2, value: data,      │
│                            │       │     onSelected: async () => sent()  │
│                            │       │   }                                 │
│                            │       │ ], true)                            │
└────────────────────────────┘       └─────────────────────────────────────┘
```

### Goroutine Translation

```
Go Code:                              TypeScript Output:
┌────────────────────────────┐       ┌─────────────────────────────────────┐
│ go func() {                │       │ queueMicrotask(async () => {        │
│   doWork()                 │  ───▶ │   {                                 │
│ }()                        │       │     doWork()                        │
│                            │       │   }                                 │
│                            │       │ })                                  │
└────────────────────────────┘       └─────────────────────────────────────┘
```

---

## Value Semantics

GoScript preserves Go's value semantics for structs:

### Clone on Assignment

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       VALUE SEMANTICS TRANSLATION                       │
└─────────────────────────────────────────────────────────────────────────┘

Go Code:
┌────────────────────────────────────┐
│ original := Point{X: 10, Y: 20}    │
│ copy := original                   │  // Creates independent copy
│ copy.X = 100                       │
│ println(original.X)                │  // Still 10
└────────────────────────────────────┘

                    │
                    ▼

TypeScript Output:
┌────────────────────────────────────────────────────────────────────────┐
│ let original = new Point({X: 10, Y: 20})                               │
│ let copy = original.clone()         // .clone() creates deep copy      │
│ copy.X = 100                                                           │
│ $.println(original.X)               // Still 10                        │
└────────────────────────────────────────────────────────────────────────┘


Clone Implementation:
┌────────────────────────────────────────────────────────────────────────┐
│ public clone(): Point {                                                │
│     const cloned = new Point()                                         │
│     cloned._fields = {                                                 │
│         X: $.varRef(this._fields.X.value),   // Copy value             │
│         Y: $.varRef(this._fields.Y.value)    // Copy value             │
│     }                                                                  │
│     return cloned                                                      │
│ }                                                                      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Control Flow Translation

### For Loop Variants

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          FOR LOOP TRANSLATION                           │
└─────────────────────────────────────────────────────────────────────────┘

Standard For:
  Go:    for i := 0; i < 10; i++ { }
  TS:    for (let i = 0; i < 10; i++) { }

While Loop:
  Go:    for condition { }
  TS:    while (condition) { }

Infinite Loop:
  Go:    for { }
  TS:    for (;;) { }

For-Range (Slice):
  Go:    for i, v := range slice { }
  TS:    for (const [i, v] of $.rangeSlice(slice)) { }
         // rangeSlice captures slice state before iteration

For-Range (Map):
  Go:    for k, v := range m { }
  TS:    for (const [k, v] of m.entries()) { }

For-Range (String):
  Go:    for i, r := range str { }
  TS:    for (const [i, r] of $.rangeString(str)) { }
         // Iterates over runes, not bytes
```

### Defer Translation

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           DEFER TRANSLATION                             │
└─────────────────────────────────────────────────────────────────────────┘

Sync Defer:
┌────────────────────────────┐       ┌─────────────────────────────────────┐
│ func process() {           │       │ function process() {                │
│   f := open("file")        │       │   const $defer = new $.DisposableStack()
│   defer f.Close()          │  ───▶ │   try {                             │
│   // work with f           │       │     let f = open("file")            │
│ }                          │       │     $defer.defer(() => f.Close())   │
│                            │       │     // work with f                  │
│                            │       │   } finally {                       │
│                            │       │     $defer.dispose()                │
│                            │       │   }                                 │
│                            │       │ }                                   │
└────────────────────────────┘       └─────────────────────────────────────┘

Async Defer:
┌────────────────────────────┐       ┌─────────────────────────────────────┐
│ func process() {           │       │ async function process() {          │
│   ch := make(chan int)     │       │   await using $defer =              │
│   defer close(ch)          │  ───▶ │     new $.AsyncDisposableStack()    │
│   // use channel           │       │   let ch = $.makeChannel(...)       │
│ }                          │       │   $defer.defer(() => ch.close())    │
│                            │       │   // use channel                    │
│                            │       │ }                                   │
└────────────────────────────┘       └─────────────────────────────────────┘
```

---

## File Organization

```
goscript/
├── cmd/goscript/          # CLI entry point
├── compiler/              # Core v2 compiler owners
│   ├── compiler.go        # Public Go adapter over CompileService
│   ├── service.go         # Pipeline coordinator
│   ├── compile-request.go # Adapter normalization and request validation
│   ├── package-graph.go   # go/packages loading and package graph facts
│   ├── semantic-model.go  # Semantic/package/type/method/async facts
│   ├── lowering.go        # Go AST + semantic facts to compiler IR
│   ├── lowered-model.go   # Lowered IR structs
│   ├── typescript-emitter.go # Deterministic TypeScript rendering
│   ├── runtime-contract.go   # Generated helper/import contract
│   ├── override-registry.go  # Handwritten gs/ package metadata/copy plans
│   └── wasm_api.go       # Browser source-compilation adapter
├── gs/                    # Runtime & handwritten packages
│   ├── builtin/           # @goscript/builtin runtime
│   │   ├── index.ts       # Main exports
│   │   ├── varRef.ts      # VarRef type
│   │   ├── slice.ts       # Slice helpers
│   │   ├── channel.ts     # Channel implementation
│   │   ├── map.ts         # Map helpers
│   │   ├── type.ts        # Runtime type info
│   │   ├── defer.ts       # Defer support
│   │   └── errors.ts      # Error handling
│   └── [std packages]/    # Handwritten std library
├── design/                # Design documentation
│   ├── DESIGN.md          # Main design doc
│   ├── ASYNC.md           # Async design
│   ├── VAR_REFS.md        # VarRef design
│   └── ...
├── tests/                 # Compliance test suite
│   └── tests/             # 260+ test cases
└── docs/
    └── explainer.md       # This file
```

---

## Summary

GoScript achieves Go-to-TypeScript translation through:

1. **Owner-Separated Pipeline**: Request, graph, semantic, lowering, runtime, override, and emit owners keep durable rules in one place
2. **VarRef System**: Enables pointer semantics in TypeScript
3. **Function Coloring**: Automatically determines async/sync boundaries
4. **Runtime Helpers**: Provide Go-like semantics for slices, channels, maps
5. **Value Semantics**: Clone methods preserve Go's copy behavior
6. **Structured Diagnostics**: Unsupported requests or syntax fail before output is written
7. **Comprehensive Type Mapping**: Go types become idiomatic TypeScript

The result is maintainable TypeScript that preserves Go's behavior while feeling natural to TypeScript developers.
