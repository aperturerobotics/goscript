<div align="center">
  <h3>GoScript: Go packages as TypeScript</h3>

  <p>
    Compile real Go packages into readable TypeScript for apps that need one
    implementation across Go, Bun, browsers, and modern bundlers.
  </p>

  <p>
    <a href="https://godoc.org/github.com/s4wave/goscript">
      <img src="https://godoc.org/github.com/s4wave/goscript?status.svg" alt="GoDoc" />
    </a>
    <a href="https://goreportcard.com/report/github.com/s4wave/goscript">
      <img src="https://goreportcard.com/badge/github.com/s4wave/goscript" alt="Go Report Card" />
    </a>
    <a href="https://deepwiki.com/s4wave/goscript">
      <img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki" />
    </a>
  </p>
</div>

<div align="center">
  <img src="./docs/assets/readme-transpile-demo.svg?cachebuster=4" alt="GoScript side-by-side Go source and generated TypeScript output showing a channel send, goroutine scheduling, and awaited channel receive." />
</div>

## Overview

**GoScript** is an experimental Go-to-TypeScript compiler for sharing real Go
code with TypeScript projects. It loads packages from a Go module, type-checks
them with the Go toolchain, and emits deterministic TypeScript packages under
`@goscript/<go-package>/`.

GoScript handles package graphs, generics, interfaces, pointer and value
semantics, goroutines, channels, `select`, `defer`, async call propagation,
package tests, and a practical standard-library override surface. The generated
TypeScript stays readable enough to inspect, bundle, and debug like normal
application code.

GoScript is performance-tuned against
[Spacewave](https://github.com/s4wave/spacewave), a large Go and TypeScript app
framework with database, sync, plugin, and browser-runtime workloads. That
dogfooding keeps build speed and runtime compatibility tied to complex
application code instead of toy examples.

> "Right now goscript looks pretty cool if [your] problem is 'I want this
> self-sufficient algorithm [to] be available in Go and JS runtimes.'"
>
> - [nevkontakte](https://gophers.slack.com/archives/C039C0R2T/p1745870396945719),
>   developer of [GopherJS](https://github.com/gopherjs/gopherjs)

GoScript shares GopherJS's long-term browser goal: make ordinary Go programs
run in JavaScript environments. The difference is the runtime strategy.
GopherJS models a Go runtime with its own goroutine scheduler. GoScript emits
readable TypeScript modules and maps concurrency onto JavaScript async work and
runtime channel helpers instead of implementing a full goroutine scheduler.

### Why GoScript?

Use GoScript when your Go code is the source of truth, but part of your product
needs to run in a TypeScript runtime. The current target is a useful,
well-defined Go subset that produces readable TypeScript and avoids unsafe-heavy
runtime behavior. The long-term goal is to expand that subset until ordinary Go
programs can run through GoScript, but the first compatibility bar is product
code that can be tested, bundled, and shipped today.

Good fits today include:

- Sharing validation, formatting, parsing, and business rules between Go services and TypeScript applications
- Publishing TypeScript packages from Go data structures and algorithms
- Running selected Go runtime code in Bun, browser demos, and modern bundlers
- Moving Go framework code into browser/plugin paths without rewriting it in TypeScript
- Building package-level test workflows that exercise generated TypeScript instead of handwritten ports

GoScript is not currently a drop-in browser runtime for every valid Go program.
The project prioritizes clear generated TypeScript, explicit runtime contracts,
and focused support for Go language features that can be modeled cleanly in
TypeScript.

Useful docs:

- [Architecture explainer](./docs/explainer.md)
- [Compiler design](./design/DESIGN.md)
- [Compliance tests](./tests/README.md)
- [Runtime packages](./gs/README.md)

## Current Surface

### Works Today

The package compiler currently supports enough Go to run complex package graphs:

- Go package loading through `go/packages` with `GOOS=js` and `GOARCH=wasm`
- Go build tags through CLI build flags, including `goscript`-selected code paths
- Structs, methods, interfaces, type assertions, typed nils, and value copying
- Pointers and address-taken variables through the `VarRef` runtime model
- Arrays, slices, maps, strings, named types, complex values, and selected builtins
- Generics through generated type-argument dictionaries for supported call,
  method, and descriptor shapes
- Goroutines, channels, `select`, `defer`, async calls, async function values,
  async callbacks, async interfaces, and async package tests
- Package initialization, cross-file imports, package indexes, dependency
  output, and package-scoped test graph variants
- Handwritten `gs/` runtime and standard-library override packages for the
  browser/WASM-oriented subset
- `goscript test`, which compiles selected Go package tests to TypeScript,
  typechecks the generated workspace, runs it with Bun, and reports package
  failures with compiler-stage classifications
- Browser/WASM compilation for import-free single-file demos

### Intentional Limits

- CLI, Go API, and Node API inputs are package patterns, not direct `main.go` files.
- Browser source compilation is import-free only. Imported code should use the package workflow.
- `unsafe`, pointer arithmetic, cgo, and arbitrary Go runtime behavior are not
  part of the first supported target.
- JavaScript `number` is used for numeric output, so it does not preserve every Go integer edge case.
- Standard-library coverage is practical and override-driven, not complete.
- Package-test execution intentionally supports a growing GoScript-compatible
  subset of `testing`, not the complete `go test` flag surface.

## Getting Started

Install Bun for TypeScript tests, examples, and website builds:

```bash
curl -fsSL https://bun.sh/install | bash
```

Install the CLI:

```bash
go install github.com/s4wave/goscript/cmd/goscript@latest
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

Run Go package tests through GoScript:

```bash
goscript test --tags goscript ./...
```

`goscript test` loads package test variants, compiles each selected package
through the normal GoScript pipeline, writes a TypeScript test runner, typechecks
the generated workspace, and runs it with Bun. Useful options:

- `--tags <tags>`: comma-separated Go build tags.
- `--run <regexp>`: run only matching Go test names.
- `--count <n>`: run selected tests multiple times.
- `--timeout <duration>`: maximum package-test runtime.
- `--workdir <dir>`: generated test workspace directory.
- `--output <dir>`: generated TypeScript output root.

The output is shaped like `go test` where possible and classifies failures that
occur before the generated tests run.

## APIs

Go API:

```go
package main

import (
	"context"

	"github.com/s4wave/goscript/compiler"
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

import "github.com/s4wave/goscript/compiler/wasm"

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

GoScript uses a linear compiler pipeline:

```text
public adapter
  -> compile request
  -> package graph
  -> semantic model
  -> lowered program
  -> TypeScript emitter
  -> runtime/override package copy
```

Each stage has a small, testable job:

- Request validation normalizes CLI, Go API, Node/Bun API, and WASM inputs.
- Package loading records Go package identities, dependency edges, build tags, and diagnostics.
- Semantic modeling computes type, value, import, addressability, interface, and async facts.
- Lowering turns Go syntax plus semantic facts into a compiler IR.
- TypeScript emission renders deterministic, semicolon-free TypeScript from that IR.
- Runtime contracts keep generated helper names and `@goscript/builtin` imports stable.
- Override discovery copies handwritten runtime and standard-library packages when direct transpilation is not the right runtime shape.

This separation keeps type and runtime decisions out of string rendering, so
generated output changes are easier to explain, test, and debug.

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
prefer adding focused compiler or compliance tests that name the missing Go
behavior, then implement the behavior in the compiler or runtime stage that
actually owns it.

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
