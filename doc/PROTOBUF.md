# Protobuf TypeScript Binding

GoScript v2 does not try to fully translate generated protobuf Go into
TypeScript when a native TypeScript protobuf file already exists. The protobuf
path is an opt-in binding mode: GoScript loads and type-checks the generated
`.pb.go` file so Go code sees the normal Go API, then lowers that Go shape into
a TypeScript adapter that delegates protobuf operations to the sibling
generated `.pb.ts` file.

The short version is:

```text
foo.pb.go  +  foo.pb.ts
    |           |
    |           +-- native TypeScript protobuf implementation
    |
    +-- Go API, struct tags, methods, package references
            |
            v
      goscript --protobuf-ts-binding
            |
            v
      output/@goscript/<pkg>/foo.pb.ts
```

The emitted `foo.pb.ts` remains a GoScript package file, but it imports the
sibling protobuf TypeScript implementation and attaches enough metadata for the
GoScript protobuf runtime helpers to clone, compare, marshal, unmarshal, and
reset bound messages.

## Why this exists

Generated protobuf Go is large, repetitive, and tied to runtime APIs that do
not map cleanly to readable TypeScript. At the same time, protobuf TypeScript
generators already produce better TypeScript for the wire format. The binding
mode avoids treating generated Go as ordinary application logic.

The compiler still needs the `.pb.go` file because the rest of the Go package
imports those Go types, calls their methods, relies on their struct field names,
and may satisfy protobuf-go-lite interfaces. The `.pb.ts` file is used for the
actual TypeScript protobuf implementation.

That makes the ownership split:

- `.pb.go` owns the Go-facing API shape.
- `.pb.ts` owns the TypeScript protobuf message implementation.
- GoScript owns the adapter between those two surfaces.
- `@goscript/github.com/aperturerobotics/protobuf-go-lite` owns the runtime
  helpers used by lowered protobuf methods.

## Enabling it

The CLI flag is:

```bash
goscript compile \
  --package . \
  --output ./output \
  --protobuf-ts-binding
```

The matching environment variable is:

```bash
GOSCRIPT_PROTOBUF_TS_BINDING=1
```

The Go API uses `compiler.Config.ProtobufTypeScriptBinding`:

```go
comp, err := compiler.NewCompiler(&compiler.Config{
	Dir:                       ".",
	OutputPath:                "./output",
	ProtobufTypeScriptBinding: true,
}, nil, nil)
```

Without this flag, `.pb.go` files are lowered like ordinary Go source and emit
the normal `.pb.gs.ts` output.

## Source layout

Binding mode expects generated Go and generated TypeScript protobuf files to be
siblings:

```text
example/
  go.mod
  api/
    thing.pb.go
    thing.pb.ts
    use.go
```

`thing.pb.go` is discovered by package loading. `thing.pb.ts` is found by
replacing the `.go` suffix with `.ts`.

If binding mode is enabled and a `.pb.go` file under the module root has no
sibling `.pb.ts`, compilation fails with:

```text
goscript/protobuf-ts-binding:missing
protobuf TypeScript binding is missing sibling .pb.ts
```

The binding search is intentionally limited to the Go module root found from
the compiler request directory. Files outside that source root are ignored, so
temporary build directories or external package cache paths do not accidentally
require local `.pb.ts` siblings.

## Where it hooks into the compiler

The public config is normalized into `CompileRequest.ProtobufTypeScriptBinding`.
The compile service then passes that setting into lowering:

```go
loweredProgram, loweringDiagnostics := s.loweringOwner.Build(ctx, semanticModel, LoweringOptions{
	SourceRoot:                protobufTypeScriptBindingRoot(req.Dir),
	DisplayRoot:               req.Dir,
	OutputPath:                req.OutputPath,
	ProtobufTypeScriptBinding: req.ProtobufTypeScriptBinding,
})
```

The binding work happens during lowering, after package loading and semantic
analysis. That ordering matters: GoScript already has the package graph, AST,
types, method sets, struct tags, imports, and source paths before it decides
whether a file should become a protobuf TypeScript binding.

## Discovery

For each semantic package, lowering scans package syntax files and builds a map
of protobuf bindings. A file becomes a binding candidate when all of these are
true:

- the source path ends with `.pb.go`
- the basename does not end with `_srpc.pb.go`
- the file is inside the request source root
- sibling `.pb.ts` exists
- a relative import path can be computed from the emitted `@goscript/<pkg>/`
  output directory to the sibling `.pb.ts`

The binding record stores:

- the `.pb.go` source path
- the output file name, such as `thing.pb.ts`
- the import source for the sibling generated TypeScript module, such as
  `./thing.pb.js`
- the message names found in the Go AST
- whether the Go file contains protobuf `oneof` fields

The output-name rewrite is important. Normally `thing.pb.go` would emit
`thing.pb.gs.ts`. In binding mode it emits `thing.pb.ts`, and package-local
imports plus package indexes point at that bound file.

## Message name matching

The binding code walks Go struct declarations in the `.pb.go` file and maps
each struct name to the matching TypeScript message export. It also scans the
sibling `.pb.ts` for `export const Name` declarations. If the TypeScript file
contains exported const messages, GoScript only attaches metadata for names
that actually exist there.

Some Go protobuf names can collide with JavaScript or TypeScript reserved
names. Those are made safe by appending `$`. For example, a Go struct named
`Object` binds to a TypeScript export named `Object$`.

This mirrors protobuf-es-lite style output and prevents generated code from
trying to import or assign through reserved globals.

## Lowering a bound file

Once discovery has a binding for a source path, the lowerer still lowers the Go
file through the normal GoScript IR path. The difference is that it passes a
protobuf adapter flag and then rewrites the lowered file.

The rewrite does three main things.

First, it changes the output file name:

```text
thing.pb.go -> thing.pb.ts
```

Second, it imports the sibling TypeScript protobuf implementation:

```ts
import * as __protobuf_ts from "./thing.pb.js"
```

Third, it appends metadata assignments for each bound struct:

```ts
(Thing as any).__protobufTypeScriptMessage = __protobuf_ts.Thing;
(Thing as any).__protobufTypeScriptFields = {"child": Child};
```

`__protobufTypeScriptMessage` points at the real TypeScript protobuf message
object. `__protobufTypeScriptFields` records constructors for nested message
fields so the runtime can turn plain TypeScript protobuf values back into
GoScript class instances when unmarshalling or cloning.

Synthetic map-entry structs are skipped. They are compiler-generated protobuf
implementation details, not public message constructors that should be bound to
TypeScript exports.

## Method replacement

For normal protobuf message files, GoScript replaces known generated protobuf
method bodies with calls into the handwritten TypeScript
`protobuf-go-lite` runtime package. The lowered method signatures remain the
Go-facing API, but the body delegates to the TypeScript protobuf binding.

The replaced methods are:

```text
CloneMessageVT
CloneVT
EqualVT
MarshalJSON
MarshalProtoJSON
MarshalProtoText
MarshalToSizedBufferVT
MarshalVT
ProtoMessage
Reset
SizeVT
String
UnmarshalJSON
UnmarshalProtoJSON
UnmarshalVT
```

For example, a generated `MarshalVT` method becomes a small adapter:

```ts
MarshalVT(): [$.Slice<number>, $.GoError] {
  return protobuf_go_lite.MarshalBoundMessageVT(Thing, this)
}
```

An `EqualVT` method delegates the comparison to the runtime:

```ts
EqualVT(other: Thing | null): boolean {
  return protobuf_go_lite.EqualBoundMessage(Thing, this, other)
}
```

A `Reset` method preserves GoScript value semantics by assigning a fresh struct
value through the builtin pointer helpers:

```ts
Reset(): void {
  $.assignStruct($.pointerValue<Thing>(this), $.markAsStructValue(new Thing()))
}
```

Only methods whose source path is the bound `.pb.go` file are replaced. That
guard prevents the binding rewrite from overwriting methods supplied by another
file in the same package.

## Runtime helpers

The generated method bodies call helpers from the handwritten override package:

```text
gs/github.com/aperturerobotics/protobuf-go-lite/index.ts
```

At output time that package is emitted under:

```text
@goscript/github.com/aperturerobotics/protobuf-go-lite/
```

The runtime helpers understand the metadata attached during lowering:

- `__protobufTypeScriptMessage` gives the runtime the native TypeScript
  protobuf message descriptor/constructor.
- `__protobufTypeScriptFields` tells the runtime which nested fields should be
  wrapped with GoScript constructors.

That is how the lowered Go API can call methods such as `MarshalVT`,
`UnmarshalVT`, `CloneVT`, `EqualVT`, and `MarshalJSON` while the actual wire and
JSON work goes through the native TypeScript protobuf implementation.

## Oneof files

Files containing protobuf `oneof` fields are handled more conservatively. The
binding still emits a `thing.pb.ts` adapter file, imports the sibling
TypeScript protobuf module, and attaches metadata for message structs that
exist in the `.pb.ts` exports.

What changes is method/body rewriting. For oneof files, GoScript does not run
the aggressive struct method replacement pass. Oneof wrappers and generated
helper structs can exist in the Go file without corresponding TypeScript
message exports, so blindly binding every generated method would risk
referencing TypeScript names that do not exist.

The practical rule is: oneof files still get metadata, but preserve more of the
lowered GoScript shape.

## Custom JSON methods

JSON is another conservative path. If a protobuf message or its nested message
graph has custom JSON methods, GoScript preserves JSON method bodies instead of
replacing them with generic bound-message JSON helpers.

The JSON methods protected by this rule are:

```text
MarshalJSON
MarshalProtoJSON
UnmarshalJSON
UnmarshalProtoJSON
```

The check walks the message's fields and follows pointers, slices, arrays,
maps, aliases, structs, and named types. It also handles imported nested
message types. If a nested message has custom JSON behavior, the outer
generated JSON method can be preserved too, because replacing only the outer
method would skip the nested custom semantics.

This is why a package can have:

```go
func (x *Item) UnmarshalJSON(b []byte) error {
	x.Config = b
	return nil
}
```

and an outer protobuf message that contains `*Item` will keep the relevant JSON
lowering instead of delegating to `UnmarshalBoundMessageJSON`.

## SRPC generated files

`*_srpc.pb.go` files are skipped by normal protobuf binding discovery. They
have a separate replacement rule.

If the source file is named like this:

```text
service_srpc.pb.go
```

and the same directory contains:

```text
service-srpc-goscript.go
```

then GoScript treats the SRPC generated Go file as replaced. If a sibling
`service_srpc.pb.ts` exists, GoScript emits a small export-all stub instead of
lowering the generated SRPC Go:

```ts
export * from "./service_srpc.pb.js"
```

This keeps SRPC TypeScript bindings owned by their generated TypeScript module
while still letting the package graph and package index expose the expected
module file.

## Diagnostics

Binding diagnostics are emitted during lowering. The important codes are:

```text
goscript/protobuf-ts-binding:missing
goscript/protobuf-ts-binding:stat
goscript/protobuf-ts-binding:import-source
goscript/protobuf-ts-binding:srpc-stat
goscript/protobuf-ts-binding:srpc-import-source
```

`missing` is the common user-facing failure: a `.pb.go` file inside the source
root needs a sibling `.pb.ts` when binding mode is enabled.

`stat` and `srpc-stat` mean the compiler could not inspect an expected sibling
file.

`import-source` and `srpc-import-source` mean the compiler could not compute
the relative import from the output package directory to the sibling `.pb.ts`.

## Example output shape

Given:

```text
module example.com/app

api/thing.pb.go
api/thing.pb.ts
api/use.go
```

and:

```bash
goscript compile --package ./api --output ./output --protobuf-ts-binding
```

the relevant output shape is:

```text
output/
  @goscript/
    example.com/app/api/
      index.ts
      thing.pb.ts
      use.gs.ts
    github.com/aperturerobotics/protobuf-go-lite/
      index.ts
```

`thing.pb.gs.ts` is not emitted. `index.ts` re-exports the bound protobuf file,
and `use.gs.ts` imports from `./thing.pb.ts` when it references protobuf
declarations.

## Verification

Run the focused compiler tests for the binding owner:

```bash
go test -timeout 60s -run '^TestProtobufTypeScriptBinding' ./compiler
```

Run the protobuf compliance fixture:

```bash
go test -timeout 60s -run '^TestCompliance/protobuf_lite_ts$' ./compiler
```

Run the protobuf runtime helper tests:

```bash
bun test gs/github.com/aperturerobotics/protobuf-go-lite/index.test.ts
```

For a broader compiler check:

```bash
mkdir -p .tmp
go test -timeout 10m ./compiler > .tmp/compiler-test.txt 2>&1
echo "Exit code: $?"
```

If the exit code is non-zero, inspect failing tests from the captured file:

```bash
grep -E '^--- FAIL:' .tmp/compiler-test.txt
```
