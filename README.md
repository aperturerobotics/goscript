<div align="center">
  <h1>GoScript</h1>

  <h3>Readable TypeScript output for Go packages</h3>

  <p>
    Compile Go packages into TypeScript modules for shared application logic.<br/>
    Built for Bun, modern bundlers, browser demos, and package-level workflows.<br/>
  </p>

  <p>
    <a href="https://godoc.org/github.com/aperturerobotics/goscript">
      <img src="https://godoc.org/github.com/aperturerobotics/goscript?status.svg" alt="GoDoc" />
    </a>
    <a href="https://goreportcard.com/report/github.com/aperturerobotics/goscript">
      <img src="https://goreportcard.com/badge/github.com/aperturerobotics/goscript" alt="Go Report Card" />
    </a>
    <a href="https://deepwiki.com/aperturerobotics/goscript">
      <img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki" />
    </a>
  </p>
</div>

## Overview

**GoScript** is an experimental Go-to-TypeScript compiler.

The main workflow compiles Go packages from inside a Go module and writes
deterministic TypeScript packages under `@goscript/<go-package>/`. The v2
compiler pipeline is organized around explicit owners for request validation,
package loading, semantic modeling, lowering, TypeScript emission, runtime
helpers, and handwritten override packages.

Use GoScript when you want to share Go algorithms, data structures, validation
logic, or selected runtime code with TypeScript and browser environments without
maintaining a second implementation by hand.

GoScript is not trying to be a drop-in browser runtime for every valid Go
program. The project prioritizes clear generated TypeScript and owner-level
semantic support over backwards compatibility with older compiler internals.

Useful docs:

- [Architecture explainer](./docs/explainer.md)
- [Compiler design](./design/DESIGN.md)
- [Compliance tests](./tests/README.md)
- [Runtime packages](./gs/README.md)

## Current Surface

The package compiler supports:

- Go package loading through `go/packages` with `GOOS=js` and `GOARCH=wasm`
- Structs, methods, interfaces, type assertions, typed nils, and value copying
- Pointers and address-taken variables through the `VarRef` runtime model
- Arrays, slices, maps, strings, named types, and selected builtins
- Generics through generated type-argument dictionaries for supported shapes
- Goroutines, channels, `select`, `defer`, async calls, and async interfaces
- Package initialization, cross-file imports, package indexes, and dependency output
- Handwritten `gs/` runtime and standard-library override packages
- Browser/WASM compilation for import-free single-file demos

Known limits:

- CLI, Go API, and Node API inputs are package patterns, not direct `main.go` files.
- Browser source compilation is import-free only. Imported code should use the package workflow.
- `unsafe`, pointer arithmetic, complex numbers, and arbitrary Go runtime behavior are not supported.
- JavaScript `number` is used for numeric output, so it does not preserve every Go integer edge case.
- Standard-library coverage is practical and override-driven, not complete.

## Getting Started

Install Bun for TypeScript tests, examples, and website builds:

```bash
curl -fsSL https://bun.sh/install | bash
```

Install the CLI:

```bash
go install github.com/aperturerobotics/goscript/cmd/goscript@latest
```

Compile a Go package from a module directory:

```bash
goscript compile --package . --output ./output
```

The output tree looks like this:

```text
output/
└── @goscript/
    ├── builtin/
    └── example.com/my/module/
        ├── index.ts
        └── main.gs.ts
```

For a generated `package main`, GoScript emits a main-script guard so the module
can run directly in Bun or a bundler that resolves `@goscript/*` imports. See
[example/simple](./example/simple) for the smallest compile-and-run workflow.

## TypeScript Projects

Generated package indexes re-export generated files such as `./main.gs.ts`, and
some package-local imports also use explicit `.ts` specifiers. Your TypeScript
project needs to allow those imports and map `@goscript/*` to the generated
output root.

Use this shape as the starting point:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "esnext.disposable", "DOM"],
    "baseUrl": ".",
    "paths": {
      "@goscript/*": ["./output/@goscript/*"]
    },
    "allowImportingTsExtensions": true,
    "rewriteRelativeImportExtensions": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true
  }
}
```

The important settings are:

- `moduleResolution: "bundler"` so `@goscript/*` package imports resolve like a modern app build.
- `allowImportingTsExtensions: true` because generated indexes and same-package imports can reference `.ts` files directly.
- `rewriteRelativeImportExtensions: true` if TypeScript is emitting JavaScript instead of only typechecking.
- `paths` pointing at the generated `@goscript/` tree.

If your bundler owns JavaScript emission and TypeScript only typechecks, adding
`"noEmit": true` is also a good fit.

## Command Line

```bash
goscript compile \
  --package ./my-go-package \
  --output ./output
```

Common options:

- `--package <pattern>`: Go package pattern to compile. Repeat for multiple packages.
- `--output <dir>`: output directory for the generated TypeScript tree.
- `--dir <dir>`: working directory for module/package loading.
- `--build-flags <flag>`: Go build flag, repeatable.
- `--all-dependencies`: compile dependency packages instead of only requested packages.
- `--disable-emit-builtin`: skip copying handwritten `gs/` runtime packages.

## APIs

Go API:

```go
package main

import (
	"context"

	"github.com/aperturerobotics/goscript/compiler"
)

func main() {
	comp, err := compiler.NewCompiler(&compiler.Config{
		Dir:        ".",
		OutputPath: "./output",
	}, nil, nil)
	if err != nil {
		panic(err)
	}
	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		panic(err)
	}
}
```

Node/Bun API:

```ts
import { compile } from 'goscript'

await compile({
  pkg: '.',
  output: './output',
  dir: process.cwd(),
})
```

WASM adapter package:

```go
package main

import "github.com/aperturerobotics/goscript/compiler/wasm"

func main() {
	ts, err := wasm.CompileSource(`
package main

func main() {
	println("hello from GoScript")
}
`, "main")
	if err != nil {
		panic(err)
	}
	_ = ts
}
```

The website compiles this package into the browser build. Browser source
compilation accepts import-free single-file demos. Package imports return a
structured diagnostic; compile imported code with the package workflow.

## Architecture

GoScript v2 uses a linear compiler pipeline:

```text
public adapter
  -> compile request
  -> package graph
  -> semantic model
  -> lowered program
  -> TypeScript emitter
  -> runtime/override package copy
```

Each step owns one durable rule boundary:

- `CompileRequestOwner` validates adapter input, module roots, output paths, and build flags.
- `PackageGraphOwner` loads Go packages and records dependency edges.
- `SemanticModelOwner` computes type, value, import, addressability, interface, and async facts.
- `LoweringOwner` turns Go syntax plus semantic facts into compiler-owned IR.
- `TypeScriptEmitOwner` renders deterministic, semicolon-free TypeScript from IR only.
- `RuntimeContractOwner` owns generated helper names and `@goscript/builtin` import policy.
- `OverrideRegistryOwner` discovers and copies handwritten runtime and standard-library packages.

This keeps semantic decisions out of the text emitter and makes generated output
changes easier to trace back to the owner that made the decision.

## Running from Source

Install dependencies:

```bash
bun install
```

Run the core checks:

```bash
bun run test
bun run lint
bun run build
```

Run the simple package example:

```bash
bun run example
```

Build the static website and browser demo assets:

```bash
bun run website:build
```

The website playground can compile and run import-free single-file demos in the
browser. Compliance examples and imported-package examples are precompiled by the
website build.

## Examples

- [example/simple](./example/simple): smallest package compile-and-run workflow.
- [example/app](./example/app): full-stack application example using generated TypeScript.
- [tests/tests](./tests/tests): inherited compliance fixtures and generated output snapshots.

## Contributing

GoScript is experimental. Small compatibility shims are usually the wrong fix;
prefer adding focused compiler or compliance tests that name the missing semantic
owner, then implement the owner-level behavior.

Use the repo scripts rather than direct package-manager commands:

```bash
bun run test
bun run lint
bun run build
```

Please open issues for unsupported Go shapes, runtime gaps, and standard-library
override gaps.

## License

MIT
