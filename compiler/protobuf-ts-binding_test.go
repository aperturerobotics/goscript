package compiler

import (
	"context"
	"errors"
	"go/ast"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"golang.org/x/tools/go/packages"
)

func TestProtobufTypeScriptBindingSkipsPbGoEmission(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, dir, "go.mod", "module example.test/protobufbinding\n\ngo 1.25\n")
	writeTestFile(t, dir, "foo.pb.go", `package protobufbinding

type Foo struct {
	Name string
}

type Object struct {
	Name string
}
`)
	writeTestFile(t, dir, "foo.pb.ts", `export interface Foo {
  name?: string
}
export const Foo = {} as any
export interface Object$ {
  name?: string
}
export const Object$ = {} as any
`)
	writeTestFile(t, dir, "use.go", `package protobufbinding

func NewFoo() Foo {
	return Foo{Name: "bound"}
}
`)

	out := filepath.Join(dir, "out")
	comp, err := NewCompiler(&Config{
		Dir:                       dir,
		OutputPath:                out,
		ProtobufTypeScriptBinding: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatalf("compile with protobuf TypeScript binding: %v", err)
	}

	pkgDir := filepath.Join(out, "@goscript", "example.test", "protobufbinding")
	if _, err := os.Stat(filepath.Join(pkgDir, "foo.pb.gs.ts")); !errors.Is(err, os.ErrNotExist) {
		t.Fatalf("bound protobuf file should not emit foo.pb.gs.ts, stat err=%v", err)
	}
	binding := readTestFile(t, filepath.Join(pkgDir, "foo.pb.ts"))
	if !strings.Contains(binding, `import * as __protobuf_ts`) || !strings.Contains(binding, `foo.pb.js`) ||
		!strings.Contains(binding, `class Foo`) || !strings.Contains(binding, `__protobufTypeScriptMessage = __protobuf_ts.Foo`) {
		t.Fatalf("binding file should adapt sibling foo.pb.js, got:\n%s", binding)
	}
	if !strings.Contains(binding, `class Object`) || !strings.Contains(binding, `__protobufTypeScriptMessage = __protobuf_ts.Object$`) {
		t.Fatalf("binding file should use protobuf-es-lite safe identifier for Object, got:\n%s", binding)
	}
	if !strings.Contains(binding, `__protobufTypeScriptMessage = __protobuf_ts.Foo;`) ||
		!strings.Contains(binding, `__protobufTypeScriptFields = {};`) {
		t.Fatalf("binding metadata assignments should be semicolon-terminated to avoid ASI calls, got:\n%s", binding)
	}
	index := readTestFile(t, filepath.Join(pkgDir, "index.ts"))
	if !strings.Contains(index, `export { Foo, Object } from "./foo.pb.ts"`) {
		t.Fatalf("package index should re-export binding file, got:\n%s", index)
	}
	use := readTestFile(t, filepath.Join(pkgDir, "use.gs.ts"))
	if !strings.Contains(use, `from "./foo.pb.ts"`) {
		t.Fatalf("non-protobuf file should import bound protobuf declarations, got:\n%s", use)
	}
}

func TestProtobufTypeScriptBindingEmitsMetadataForPreservedOneofFiles(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, dir, "go.mod", "module example.test/oneofpb\n\ngo 1.25\n")
	writeTestFile(t, dir, "foo.pb.go", "package oneofpb\n\n"+
		"type Inner struct {\n"+
		"\tName string `protobuf:\"bytes,1,opt,name=name,proto3\" json:\"name,omitempty\"`\n"+
		"}\n\n"+
		"type Wrapper struct {\n"+
		"\tInner *Inner `protobuf:\"bytes,1,opt,name=inner,proto3\" json:\"inner,omitempty\"`\n"+
		"\tChoice isWrapper_Choice `protobuf_oneof:\"choice\"`\n"+
		"}\n\n"+
		"type isWrapper_Choice interface { isWrapper_Choice() }\n\n"+
		"type Wrapper_StringValue struct {\n"+
		"\tStringValue string `protobuf:\"bytes,2,opt,name=string_value,json=stringValue,proto3,oneof\"`\n"+
		"}\n\n"+
		"func (*Wrapper_StringValue) isWrapper_Choice() {}\n")
	writeTestFile(t, dir, "foo.pb.ts", `export interface Inner {
  name?: string
}
export const Inner = {} as any
export interface Wrapper {
  inner?: Inner
}
export const Wrapper = {} as any
`)

	out := filepath.Join(dir, "out")
	comp, err := NewCompiler(&Config{
		Dir:                       dir,
		OutputPath:                out,
		ProtobufTypeScriptBinding: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatalf("compile with protobuf TypeScript binding: %v", err)
	}

	binding := readTestFile(t, filepath.Join(out, "@goscript", "example.test", "oneofpb", "foo.pb.ts"))
	if !strings.Contains(binding, `import * as __protobuf_ts`) ||
		!strings.Contains(binding, `(Wrapper as any).__protobufTypeScriptMessage = __protobuf_ts.Wrapper;`) ||
		!strings.Contains(binding, `(Wrapper as any).__protobufTypeScriptFields = {"inner": Inner};`) {
		t.Fatalf("oneof-preserved protobuf file should still expose TypeScript metadata, got:\n%s", binding)
	}
	if strings.Contains(binding, `__protobuf_ts.Wrapper_StringValue`) {
		t.Fatalf("oneof wrapper structs should not reference missing TypeScript exports, got:\n%s", binding)
	}
}

func TestProtobufTypeScriptBindingPreservesCustomJSONMethods(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, dir, "go.mod", "module example.test/custompbjson\n\ngo 1.25\n")
	writeTestFile(t, dir, "foo.pb.go", `package custompbjson

type Foo struct {
	Config []byte
}
`)
	writeTestFile(t, dir, "foo.pb.ts", `export interface Foo {
  config?: Uint8Array
}
export const Foo = {} as any
`)
	writeTestFile(t, dir, "foo-json.go", `package custompbjson

func (x *Foo) UnmarshalJSON(b []byte) error {
	x.Config = b
	return nil
}
`)

	out := filepath.Join(dir, "out")
	comp, err := NewCompiler(&Config{
		Dir:                       dir,
		OutputPath:                out,
		ProtobufTypeScriptBinding: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatalf("compile with protobuf TypeScript binding: %v", err)
	}

	binding := readTestFile(t, filepath.Join(out, "@goscript", "example.test", "custompbjson", "foo.pb.ts"))
	if strings.Contains(binding, `UnmarshalBoundMessageJSON(Foo`) {
		t.Fatalf("custom JSON method should not be replaced by generic protobuf helper, got:\n%s", binding)
	}
	if !strings.Contains(binding, `.Config = b`) {
		t.Fatalf("custom JSON method body should be preserved, got:\n%s", binding)
	}
}

func TestProtobufTypeScriptBindingPreservesJSONGraphWithCustomNestedMessage(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, dir, "go.mod", "module example.test/nestedcustompbjson\n\ngo 1.25\n")
	writeTestFile(t, dir, "foo.pb.go", `package nestedcustompbjson

type Foo struct {
	Items []*Item
}

type Item struct {
	Config []byte
}

func generatedFooJSONMarker(x *Foo) error {
	return nil
}

func (x *Foo) UnmarshalJSON(b []byte) error {
	return generatedFooJSONMarker(x)
}

func (x *Foo) UnmarshalProtoJSON(s any) {
}
`)
	writeTestFile(t, dir, "foo.pb.ts", `export interface Foo {
  items?: Item[]
}
export const Foo = {} as any
export interface Item {
  config?: Uint8Array
}
export const Item = {} as any
`)
	writeTestFile(t, dir, "item-json.go", `package nestedcustompbjson

func (x *Item) UnmarshalJSON(b []byte) error {
	x.Config = b
	return nil
}
`)

	out := filepath.Join(dir, "out")
	comp, err := NewCompiler(&Config{
		Dir:                       dir,
		OutputPath:                out,
		ProtobufTypeScriptBinding: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatalf("compile with protobuf TypeScript binding: %v", err)
	}

	binding := readTestFile(t, filepath.Join(out, "@goscript", "example.test", "nestedcustompbjson", "foo.pb.ts"))
	if strings.Contains(binding, `UnmarshalBoundMessageJSON(Foo`) {
		t.Fatalf("outer message with nested custom JSON should keep generated JSON body, got:\n%s", binding)
	}
	if !strings.Contains(binding, `generatedFooJSONMarker`) {
		t.Fatalf("outer generated JSON body should be preserved, got:\n%s", binding)
	}
	if strings.Contains(binding, `UnmarshalBoundMessageJSON(Item`) {
		t.Fatalf("nested custom JSON method should not be replaced, got:\n%s", binding)
	}
	if !strings.Contains(binding, `.Config = b`) {
		t.Fatalf("nested custom JSON method body should be preserved, got:\n%s", binding)
	}
}

func TestProtobufTypeScriptBindingPreservesJSONGraphWithImportedCustomNestedMessage(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, dir, "go.mod", "module example.test/importedcustompbjson\n\ngo 1.25\n")
	writeTestFile(t, dir, "inner/inner.pb.go", `package inner

type Inner struct {
	Config []byte
}
`)
	writeTestFile(t, dir, "inner/inner.pb.ts", `export interface Inner {
  config?: Uint8Array
}
export const Inner = {} as any
`)
	writeTestFile(t, dir, "inner/inner-json.go", `package inner

func (x *Inner) UnmarshalJSON(b []byte) error {
	x.Config = b
	return nil
}
`)
	writeTestFile(t, dir, "outer.pb.go", `package importedcustompbjson

import "example.test/importedcustompbjson/inner"

type Outer struct {
	Inner *inner.Inner
}

func generatedOuterJSONMarker(x *Outer) error {
	return nil
}

func (x *Outer) UnmarshalJSON(b []byte) error {
	return generatedOuterJSONMarker(x)
}
`)
	writeTestFile(t, dir, "outer.pb.ts", `import type { Inner } from './inner/inner.pb.js'

export interface Outer {
  inner?: Inner
}
export const Outer = {} as any
`)

	out := filepath.Join(dir, "out")
	comp, err := NewCompiler(&Config{
		Dir:                       dir,
		OutputPath:                out,
		ProtobufTypeScriptBinding: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatalf("compile with protobuf TypeScript binding: %v", err)
	}

	binding := readTestFile(t, filepath.Join(out, "@goscript", "example.test", "importedcustompbjson", "outer.pb.ts"))
	if strings.Contains(binding, `UnmarshalBoundMessageJSON(Outer`) {
		t.Fatalf("outer message with imported nested custom JSON should keep generated JSON body, got:\n%s", binding)
	}
	if !strings.Contains(binding, `generatedOuterJSONMarker`) {
		t.Fatalf("outer generated JSON body should be preserved, got:\n%s", binding)
	}
}

func TestProtobufTypeScriptBindingReportsMissingSibling(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, dir, "go.mod", "module example.test/missingpbts\n\ngo 1.25\n")
	writeTestFile(t, dir, "foo.pb.go", `package missingpbts

type Foo struct{}
`)

	comp, err := NewCompiler(&Config{
		Dir:                       dir,
		OutputPath:                filepath.Join(dir, "out"),
		ProtobufTypeScriptBinding: true,
	}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	result, err := comp.CompilePackages(context.Background(), ".")
	if err == nil {
		t.Fatal("expected missing sibling .pb.ts to fail")
	}
	if result == nil {
		t.Fatal("expected diagnostics result")
	}
	for _, diag := range result.Diagnostics {
		if diag.Code == "goscript/protobuf-ts-binding:missing" {
			return
		}
	}
	t.Fatalf("missing protobuf binding diagnostic not found: %#v", result.Diagnostics)
}

func TestProtobufTypeScriptBindingSkipsFilesOutsideSourceRoot(t *testing.T) {
	dir := t.TempDir()
	outside := filepath.Join(t.TempDir(), "outside.pb.go")
	writeTestFile(t, dir, "go.mod", "module example.test/outsidepb\n\ngo 1.25\n")
	writeTestFile(t, dir, "use.go", `package outsidepb
`)

	semPkg := &semanticPackage{
		pkgPath: "example.test/outsidepb",
		source: &packages.Package{
			CompiledGoFiles: []string{outside},
			GoFiles:         []string{outside},
			Syntax:          make([]*ast.File, 1),
		},
	}
	bindings, diagnostics := protobufTypeScriptBindings(semPkg, LoweringOptions{
		SourceRoot:                dir,
		OutputPath:                filepath.Join(dir, "out"),
		ProtobufTypeScriptBinding: true,
	})
	if len(diagnostics) != 0 {
		t.Fatalf("outside source root diagnostics = %#v", diagnostics)
	}
	if len(bindings) != 0 {
		t.Fatalf("outside source root bindings = %#v", bindings)
	}
}

func TestProtobufTypeScriptBindingRootFindsParentModule(t *testing.T) {
	dir := t.TempDir()
	writeTestFile(t, dir, "go.mod", "module example.test/root\n\ngo 1.25\n")
	nested := filepath.Join(dir, ".bldr", "build", "plugin")
	if err := os.MkdirAll(nested, 0o755); err != nil {
		t.Fatal(err)
	}
	if got := protobufTypeScriptBindingRoot(nested); got != dir {
		t.Fatalf("binding root = %q, want %q", got, dir)
	}
}

func writeTestFile(t *testing.T, root, rel, data string) {
	t.Helper()
	path := filepath.Join(root, rel)
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(path, []byte(data), 0o644); err != nil {
		t.Fatal(err)
	}
}

func readTestFile(t *testing.T, path string) string {
	t.Helper()
	data, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	return string(data)
}
