package compiler

import (
	"context"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"
)

func TestCompileRequestCarriesCacheRoot(t *testing.T) {
	req := NewCompileRequestOwner().NewRequest(Config{
		Dir:        ".",
		OutputPath: "out",
		CacheRoot:  "cache-root",
	}, []string{"."})
	if req.CacheRoot != "cache-root" {
		t.Fatalf("CacheRoot = %q, want cache-root", req.CacheRoot)
	}
}

func TestCompilePackagesCacheDisabledCreatesNoCacheRoot(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/cachedefault\n\ngo 1.25.3\n",
		"main.go": "package cachedefault\nconst Value = 1\n",
	})
	outputDir := filepath.Join(t.TempDir(), "out")
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	comp, err := NewCompiler(&Config{
		Dir:        moduleDir,
		OutputPath: outputDir,
		CacheRoot:  "",
	}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := comp.CompilePackages(context.Background(), "."); err != nil {
		t.Fatal(err)
	}
	if _, err := os.Stat(cacheRoot); !os.IsNotExist(err) {
		t.Fatalf("disabled cache root stat err = %v, want not exist", err)
	}
}

func TestCompilePackagesCacheReplaysOutput(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/cachereplay\n\ngo 1.25.3\n",
		"main.go": "package cachereplay\nconst Value = 1\n",
	})
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	firstOut := filepath.Join(t.TempDir(), "first")
	result := compileCacheFixture(t, moduleDir, firstOut, cacheRoot)
	if len(result.CompiledPackages) != 1 || result.CompiledPackages[0] != "example.test/cachereplay" {
		t.Fatalf("compiled packages = %#v", result.CompiledPackages)
	}
	manifest := firstCacheManifestPath(t, cacheRoot)
	if manifest == "" {
		t.Fatal("cache manifest not written")
	}
	firstManifestCount := countCacheManifests(t, cacheRoot)

	secondOut := filepath.Join(t.TempDir(), "second")
	second := compileCacheFixture(t, moduleDir, secondOut, cacheRoot)
	if len(second.CompiledPackages) != 1 || second.CompiledPackages[0] != "example.test/cachereplay" {
		t.Fatalf("cached compiled packages = %#v", second.CompiledPackages)
	}

	first := readOutputFile(t, firstOut, "example.test/cachereplay", "main.gs.ts")
	replayed := readOutputFile(t, secondOut, "example.test/cachereplay", "main.gs.ts")
	if first != replayed {
		t.Fatalf("cache replay output changed:\nfirst:\n%s\nsecond:\n%s", first, replayed)
	}
	if got := countCacheManifests(t, cacheRoot); got != firstManifestCount {
		t.Fatalf("cache manifests after replay = %d, want %d", got, firstManifestCount)
	}
}

func TestCompilePackagesCacheReplaysEquivalentMultiPackageOutput(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":      "module example.test/cacheequiv\n\ngo 1.25.3\n",
		"version.txt": "1.2.3\n",
		"main.go": strings.Join([]string{
			"package cacheequiv",
			"import (",
			"  _ \"embed\"",
			"  \"example.test/cacheequiv/dep\"",
			"  _ \"example.test/cacheequiv/side\"",
			")",
			"//go:embed version.txt",
			"var Version string",
			"const Value = dep.Value",
			"",
		}, "\n"),
		"foo.pb.go": "package cacheequiv\ntype Foo struct{}\n",
		"foo.pb.ts": "export const Foo = \"first\";\n",
		"dep/dep.go": strings.Join([]string{
			"package dep",
			"const Value = 3",
			"",
		}, "\n"),
		"side/side.go": strings.Join([]string{
			"package side",
			"func init() {}",
			"",
		}, "\n"),
	})
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	outputRoot := filepath.Join(t.TempDir(), "out")
	compileCacheFixtureConfig(t, Config{
		AllDependencies:           true,
		ProtobufTypeScriptBinding: true,
	}, moduleDir, outputRoot, cacheRoot)
	firstSnapshot := outputTreeSnapshot(t, outputRoot)
	firstManifestCount := countCacheManifests(t, cacheRoot)

	if err := os.RemoveAll(outputRoot); err != nil {
		t.Fatal(err)
	}
	compileCacheFixtureConfig(t, Config{
		AllDependencies:           true,
		ProtobufTypeScriptBinding: true,
	}, moduleDir, outputRoot, cacheRoot)
	secondSnapshot := outputTreeSnapshot(t, outputRoot)
	if firstSnapshot != secondSnapshot {
		t.Fatalf("cache replay output differs:\nfirst:\n%s\nsecond:\n%s", firstSnapshot, secondSnapshot)
	}
	if got := countCacheManifests(t, cacheRoot); got != firstManifestCount {
		t.Fatalf("cache manifests after multi-package replay = %d, want %d", got, firstManifestCount)
	}
}

func TestCompilePackagesCacheInvalidatesSourceChange(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/cacheinvalidate\n\ngo 1.25.3\n",
		"main.go": "package cacheinvalidate\nconst Value = 1\n",
	})
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	firstOut := filepath.Join(t.TempDir(), "first")
	compileCacheFixture(t, moduleDir, firstOut, cacheRoot)

	if err := os.WriteFile(filepath.Join(moduleDir, "main.go"), []byte("package cacheinvalidate\nconst Value = 2\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	secondOut := filepath.Join(t.TempDir(), "second")
	compileCacheFixture(t, moduleDir, secondOut, cacheRoot)
	text := readOutputFile(t, secondOut, "example.test/cacheinvalidate", "main.gs.ts")
	if !strings.Contains(text, "Value: number = 2") {
		t.Fatalf("source change was not reflected in output:\n%s", text)
	}
	if countCacheManifests(t, cacheRoot) < 2 {
		t.Fatal("source change did not create a distinct cache entry")
	}
}

func TestCompilePackagesCacheRequestedModeValidatesImportsBeforeReplay(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/cacherequestedimports\n\ngo 1.25.3\n",
		"main.go": strings.Join([]string{
			"package cacherequestedimports",
			"import \"example.test/cacherequestedimports/dep\"",
			"const Value = dep.Value",
			"",
		}, "\n"),
		"dep/dep.go": strings.Join([]string{
			"package dep",
			"const Value = 1",
			"",
		}, "\n"),
	})
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	compileCacheFixture(t, moduleDir, filepath.Join(t.TempDir(), "first"), cacheRoot)
	firstManifestCount := countCacheManifests(t, cacheRoot)

	if err := os.WriteFile(filepath.Join(moduleDir, "dep", "dep.go"), []byte("package dep\nconst Other = 1\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	comp, err := NewCompiler(&Config{
		Dir:        moduleDir,
		OutputPath: filepath.Join(t.TempDir(), "second"),
		CacheRoot:  cacheRoot,
	}, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	if _, err := comp.CompilePackages(context.Background(), "."); err == nil {
		t.Fatal("requested-mode cache replay skipped imported package type validation")
	}
	if got := countCacheManifests(t, cacheRoot); got != firstManifestCount {
		t.Fatalf("invalid imported package wrote cache manifests: got %d want %d", got, firstManifestCount)
	}
}

func TestCompilePackagesCacheInvalidatesEmbedFileChange(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":      "module example.test/cacheembed\n\ngo 1.25.3\n",
		"version.txt": "1.2.3\n",
		"main.go": strings.Join([]string{
			"package cacheembed",
			"import _ \"embed\"",
			"//go:embed version.txt",
			"var Version string",
			"",
		}, "\n"),
	})
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	firstOut := filepath.Join(t.TempDir(), "first")
	compileCacheFixtureConfig(t, Config{AllDependencies: true}, moduleDir, firstOut, cacheRoot)

	if err := os.WriteFile(filepath.Join(moduleDir, "version.txt"), []byte("2.0.0\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	secondOut := filepath.Join(t.TempDir(), "second")
	compileCacheFixtureConfig(t, Config{AllDependencies: true}, moduleDir, secondOut, cacheRoot)
	text := readOutputFile(t, secondOut, "example.test/cacheembed", "main.gs.ts")
	if !strings.Contains(text, `Version: string = "2.0.0\n"`) {
		t.Fatalf("embed file change was not reflected in output:\n%s", text)
	}
	if countCacheManifests(t, cacheRoot) < 2 {
		t.Fatal("embed file change did not create a distinct cache entry")
	}
}

func TestCompilePackagesCacheInvalidatesProtobufBindingFileChange(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/cachepb\n\ngo 1.25.3\n",
		"foo.pb.go": `package cachepb

type Foo struct{}
`,
		"foo.pb.ts": `export const Foo = "first";
`,
	})
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	outputRoot := filepath.Join(t.TempDir(), "out")
	compileCacheFixtureConfig(t, Config{ProtobufTypeScriptBinding: true}, moduleDir, outputRoot, cacheRoot)

	if err := os.WriteFile(filepath.Join(moduleDir, "foo.pb.ts"), []byte(`export const Bar = "second";
`), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.RemoveAll(outputRoot); err != nil {
		t.Fatal(err)
	}
	compileCacheFixtureConfig(t, Config{ProtobufTypeScriptBinding: true}, moduleDir, outputRoot, cacheRoot)
	text := readOutputFile(t, outputRoot, "example.test/cachepb", "foo.pb.ts")
	if strings.Contains(text, "__protobufTypeScriptMessage = __protobuf_ts.Foo") {
		t.Fatalf("protobuf binding change was not reflected in output:\n%s", text)
	}
	if countCacheManifests(t, cacheRoot) < 2 {
		t.Fatal("protobuf binding change did not create a distinct cache entry")
	}
}

func TestCompilerCacheKeyInvalidatesRequestAndModuleInputs(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/cachekey\n\ngo 1.25.3\n",
		"main.go": "package cachekey\nconst Value = 1\n",
	})
	baseReq := &CompileRequest{
		Patterns:            []string{"."},
		Dir:                 moduleDir,
		OutputPath:          filepath.Join(t.TempDir(), "out"),
		CacheRoot:           filepath.Join(t.TempDir(), "cache"),
		DependencyMode:      DependencyModeRequested,
		RuntimeEmissionMode: RuntimeEmissionModeEmit,
	}
	graph := singleNodeCacheGraph(moduleDir, "example.test/cachekey")
	baseKey := generatedCacheKey(t, baseReq, graph)

	cases := []struct {
		name string
		edit func(*CompileRequest)
	}{
		{name: "build flags", edit: func(req *CompileRequest) { req.BuildFlags = []string{"tags=cachetest"} }},
		{name: "package blocklist", edit: func(req *CompileRequest) { req.PackageBlocklist = []string{"example.test/blocked"} }},
		{name: "dependency mode", edit: func(req *CompileRequest) { req.DependencyMode = DependencyModeAll }},
		{name: "runtime mode", edit: func(req *CompileRequest) { req.RuntimeEmissionMode = RuntimeEmissionModeReference }},
		{name: "test variants", edit: func(req *CompileRequest) { req.Tests = true }},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			req := *baseReq
			tc.edit(&req)
			if key := generatedCacheKey(t, &req, graph); key == baseKey {
				t.Fatalf("%s did not change generated package key", tc.name)
			}
		})
	}

	if err := os.WriteFile(filepath.Join(moduleDir, "go.mod"), []byte("module example.test/cachekey\n\ngo 1.25.3\n\nrequire example.test/dep v0.0.0\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if key := generatedCacheKey(t, baseReq, graph); key == baseKey {
		t.Fatal("module file change did not change generated package key")
	}
}

func TestCompilerCacheKeyTracksOverridesAndProtobufOutputRelation(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":    "module example.test/cachekeypb\n\ngo 1.25.3\n",
		"foo.pb.go": "package cachekeypb\ntype Foo struct{}\n",
		"foo.pb.ts": "export const Foo = \"first\";\n",
	})
	req := &CompileRequest{
		Patterns:                  []string{"."},
		Dir:                       moduleDir,
		OutputPath:                filepath.Join(t.TempDir(), "out-a"),
		CacheRoot:                 filepath.Join(t.TempDir(), "cache"),
		DependencyMode:            DependencyModeRequested,
		RuntimeEmissionMode:       RuntimeEmissionModeEmit,
		ProtobufTypeScriptBinding: true,
	}
	graph := singleNodeCacheGraph(moduleDir, "example.test/cachekeypb")
	graph.Nodes[0].CompiledGoFiles = []string{filepath.Join(moduleDir, "foo.pb.go")}
	graph.Nodes[0].GoFiles = graph.Nodes[0].CompiledGoFiles
	baseKey := generatedCacheKey(t, req, graph)

	outputReq := *req
	outputReq.OutputPath = filepath.Join(t.TempDir(), "out-b")
	if key := generatedCacheKey(t, &outputReq, graph); key == baseKey {
		t.Fatal("protobuf output root relation did not change generated package key")
	}

	plan := &overrideCopyPlan{packages: []overrideCopyPackage{{
		path:  "example.test/cachekeypb",
		files: []overrideCopyFile{{path: "example.test/cachekeypb/index.ts", data: []byte("first")}},
	}}}
	changedPlan := &overrideCopyPlan{packages: []overrideCopyPackage{{
		path:  "example.test/cachekeypb",
		files: []overrideCopyFile{{path: "example.test/cachekeypb/index.ts", data: []byte("second")}},
	}}}
	baseOverrideKey := copiedCacheKey(t, req, graph, plan)
	if key := copiedCacheKey(t, req, graph, changedPlan); key == baseOverrideKey {
		t.Fatal("override file content did not change copied package key")
	}
}

func TestCompilerCacheFastReplayRequiresTypedGraphForStrictParity(t *testing.T) {
	graph := &PackageGraph{
		Nodes: []*PackageGraphNode{{
			PkgPath:           "example.test/override",
			OverrideCandidate: true,
		}},
	}
	if overrideParityRequiresTypedGraph(graph, &OverrideFacts{packages: map[string]overridePackageFacts{
		"example.test/override": {
			parity: overrideParityLedger{
				Strict:  true,
				Symbols: map[string]overrideParityEntry{"Value": {Status: overrideParityStatusReal}},
			},
		},
	}}) {
		return
	}
	t.Fatal("strict override parity did not require a typed graph")
}

func TestCompilerCacheFastReplayAllowsUntypedOverrideMetadata(t *testing.T) {
	graph := &PackageGraph{
		Nodes: []*PackageGraphNode{{
			PkgPath:           "context",
			OverrideCandidate: true,
		}},
	}
	if overrideParityRequiresTypedGraph(graph, &OverrideFacts{packages: map[string]overridePackageFacts{
		"context": {metadata: newOverrideMetadata()},
	}}) {
		t.Fatal("metadata-only override required a typed graph")
	}
}

func TestCompilePackagesCacheCorruptionFallsBackToFreshCompile(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/cachecorrupt\n\ngo 1.25.3\n",
		"main.go": "package cachecorrupt\nconst Value = 1\n",
	})
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	firstOut := filepath.Join(t.TempDir(), "first")
	compileCacheFixture(t, moduleDir, firstOut, cacheRoot)

	blob := firstCacheBlobPath(t, cacheRoot)
	if blob == "" {
		t.Fatal("cache blob not written")
	}
	if err := os.WriteFile(blob, []byte("corrupt"), 0o644); err != nil {
		t.Fatal(err)
	}
	secondOut := filepath.Join(t.TempDir(), "second")
	compileCacheFixture(t, moduleDir, secondOut, cacheRoot)
	text := readOutputFile(t, secondOut, "example.test/cachecorrupt", "main.gs.ts")
	if !strings.Contains(text, "Value: number = 1") {
		t.Fatalf("fresh fallback output missing value:\n%s", text)
	}
}

func TestCompilePackagesCacheInvalidManifestEntriesFallBackToFreshCompile(t *testing.T) {
	cases := []struct {
		name   string
		tamper func(*testing.T, string)
	}{
		{
			name: "missing blob",
			tamper: func(t *testing.T, cacheRoot string) {
				t.Helper()
				if err := os.Remove(firstCacheBlobPath(t, cacheRoot)); err != nil {
					t.Fatal(err)
				}
			},
		},
		{
			name: "bad key",
			tamper: func(t *testing.T, cacheRoot string) {
				t.Helper()
				manifest := firstCacheManifestPath(t, cacheRoot)
				data, err := os.ReadFile(manifest)
				if err != nil {
					t.Fatal(err)
				}
				data = []byte(strings.Replace(string(data), `"key": "`, `"key": "bad`, 1))
				if err := os.WriteFile(manifest, data, 0o644); err != nil {
					t.Fatal(err)
				}
			},
		},
		{
			name: "unsupported schema",
			tamper: func(t *testing.T, cacheRoot string) {
				t.Helper()
				manifest := firstCacheManifestPath(t, cacheRoot)
				data, err := os.ReadFile(manifest)
				if err != nil {
					t.Fatal(err)
				}
				data = []byte(strings.Replace(string(data), compilerCacheSchema, "unsupported-schema", 1))
				if err := os.WriteFile(manifest, data, 0o644); err != nil {
					t.Fatal(err)
				}
			},
		},
		{
			name: "incomplete entry",
			tamper: func(t *testing.T, cacheRoot string) {
				t.Helper()
				if err := os.Remove(filepath.Join(filepath.Dir(firstCacheManifestPath(t, cacheRoot)), "complete")); err != nil {
					t.Fatal(err)
				}
			},
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			moduleDir := writePackageGraphFixture(t, map[string]string{
				"go.mod":  "module example.test/cacheinvalidmanifest\n\ngo 1.25.3\n",
				"main.go": "package cacheinvalidmanifest\nconst Value = 1\n",
			})
			cacheRoot := filepath.Join(t.TempDir(), "cache")
			compileCacheFixture(t, moduleDir, filepath.Join(t.TempDir(), "first"), cacheRoot)
			tc.tamper(t, cacheRoot)

			secondOut := filepath.Join(t.TempDir(), "second")
			compileCacheFixture(t, moduleDir, secondOut, cacheRoot)
			text := readOutputFile(t, secondOut, "example.test/cacheinvalidmanifest", "main.gs.ts")
			if !strings.Contains(text, "Value: number = 1") {
				t.Fatalf("fresh fallback output missing value:\n%s", text)
			}
		})
	}
}

func TestCompilerCacheGoEmbedFilesTreatsQuestionAsPattern(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod": "module example.test/cacheembedpattern\n\ngo 1.25.3\n",
		"a.txt":  "one\n",
	})
	files, err := compilerCacheGoEmbedFiles(moduleDir, "?.txt")
	if err != nil {
		t.Fatal(err)
	}
	if len(files) != 1 || !strings.HasSuffix(files[0], string(filepath.Separator)+"a.txt") {
		t.Fatalf("embed pattern files = %#v, want a.txt", files)
	}
}

func TestCompilePackagesCacheConcurrentWritersConverge(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/cacheconcurrent\n\ngo 1.25.3\n",
		"main.go": "package cacheconcurrent\nconst Value = 1\n",
	})
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	outputRoots := make([]string, 4)
	for idx := range outputRoots {
		outputRoots[idx] = filepath.Join(t.TempDir(), "out")
	}
	var wg sync.WaitGroup
	errs := make(chan error, 4)
	for idx := range 4 {
		wg.Add(1)
		go func(idx int) {
			defer wg.Done()
			comp, err := NewCompiler(&Config{
				Dir:        moduleDir,
				OutputPath: outputRoots[idx],
				CacheRoot:  cacheRoot,
			}, nil, nil)
			if err != nil {
				errs <- err
				return
			}
			_, err = comp.CompilePackages(context.Background(), ".")
			errs <- err
		}(idx)
	}
	wg.Wait()
	close(errs)
	for err := range errs {
		if err != nil {
			t.Fatal(err)
		}
	}
	if count := countCacheManifests(t, cacheRoot); count == 0 {
		t.Fatal("concurrent writers did not leave any complete cache manifests")
	}
}

func TestCompilePackagesCacheUnsafeManifestPathFallsBackToFreshCompile(t *testing.T) {
	moduleDir := writePackageGraphFixture(t, map[string]string{
		"go.mod":  "module example.test/cacheunsafe\n\ngo 1.25.3\n",
		"main.go": "package cacheunsafe\nconst Value = 1\n",
	})
	cacheRoot := filepath.Join(t.TempDir(), "cache")
	compileCacheFixture(t, moduleDir, filepath.Join(t.TempDir(), "first"), cacheRoot)

	manifest := firstCacheManifestPath(t, cacheRoot)
	data, err := os.ReadFile(manifest)
	if err != nil {
		t.Fatal(err)
	}
	data = []byte(strings.Replace(string(data), "@goscript/example.test/cacheunsafe/main.gs.ts", "../escape.ts", 1))
	if err := os.WriteFile(manifest, data, 0o644); err != nil {
		t.Fatal(err)
	}

	secondOut := filepath.Join(t.TempDir(), "second")
	compileCacheFixture(t, moduleDir, secondOut, cacheRoot)
	if _, err := os.Stat(filepath.Join(secondOut, "..", "escape.ts")); !os.IsNotExist(err) {
		t.Fatalf("unsafe replay path stat err = %v, want not exist", err)
	}
}

func singleNodeCacheGraph(moduleDir, importPath string) *PackageGraph {
	file := filepath.Join(moduleDir, "main.go")
	node := &PackageGraphNode{
		ID:              importPath,
		PkgPath:         importPath,
		Name:            filepath.Base(importPath),
		ModulePath:      importPath,
		ModuleDir:       moduleDir,
		GoFiles:         []string{file},
		CompiledGoFiles: []string{file},
		Requested:       true,
	}
	return &PackageGraph{
		RequestedPatterns:     []string{"."},
		RequestedPackagePaths: []string{importPath},
		Nodes:                 []*PackageGraphNode{node},
		NodesByPackagePath:    map[string]*PackageGraphNode{importPath: node},
	}
}

func generatedCacheKey(t *testing.T, req *CompileRequest, graph *PackageGraph) string {
	t.Helper()
	entries := NewCompilerCacheOwner().Entries(req, graph, nil)
	if len(entries) == 0 {
		t.Fatal("no cache entries")
	}
	return entries[0].key
}

func copiedCacheKey(t *testing.T, req *CompileRequest, graph *PackageGraph, plan *overrideCopyPlan) string {
	t.Helper()
	entries := NewCompilerCacheOwner().Entries(req, graph, plan)
	for _, entry := range entries {
		if entry.kind == compilerCacheEntryCopied {
			return entry.key
		}
	}
	t.Fatal("no copied cache entry")
	return ""
}

func compileCacheFixture(t *testing.T, moduleDir, outputDir, cacheRoot string) *CompilationResult {
	t.Helper()
	return compileCacheFixtureConfig(t, Config{}, moduleDir, outputDir, cacheRoot)
}

func compileCacheFixtureConfig(t *testing.T, config Config, moduleDir, outputDir, cacheRoot string) *CompilationResult {
	t.Helper()
	config.Dir = moduleDir
	config.OutputPath = outputDir
	config.CacheRoot = cacheRoot
	comp, err := NewCompiler(&config, nil, nil)
	if err != nil {
		t.Fatal(err)
	}
	result, err := comp.CompilePackages(context.Background(), ".")
	if err != nil {
		t.Fatal(err)
	}
	return result
}

func readOutputFile(t *testing.T, outputRoot, importPath, name string) string {
	t.Helper()
	data, err := os.ReadFile(filepath.Join(outputRoot, "@goscript", filepath.FromSlash(importPath), name))
	if err != nil {
		t.Fatal(err)
	}
	return string(data)
}

func outputTreeSnapshot(t *testing.T, root string) string {
	t.Helper()
	var snapshot strings.Builder
	err := filepath.WalkDir(root, func(path string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if entry.IsDir() {
			return nil
		}
		rel, err := filepath.Rel(root, path)
		if err != nil {
			return err
		}
		data, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		snapshot.WriteString(filepath.ToSlash(rel))
		snapshot.WriteByte('\n')
		snapshot.Write(data)
		snapshot.WriteByte('\n')
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	return snapshot.String()
}

func firstCacheManifestPath(t *testing.T, cacheRoot string) string {
	t.Helper()
	var found string
	err := filepath.WalkDir(cacheRoot, func(path string, entry os.DirEntry, err error) error {
		if err != nil || found != "" {
			return err
		}
		if !entry.IsDir() && entry.Name() == "manifest.json" {
			found = path
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	return found
}

func firstCacheBlobPath(t *testing.T, cacheRoot string) string {
	t.Helper()
	var found string
	err := filepath.WalkDir(filepath.Join(cacheRoot, compilerCacheSchema, "blobs"), func(path string, entry os.DirEntry, err error) error {
		if err != nil || found != "" {
			return err
		}
		if !entry.IsDir() {
			found = path
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	return found
}

func countCacheManifests(t *testing.T, cacheRoot string) int {
	t.Helper()
	count := 0
	err := filepath.WalkDir(cacheRoot, func(path string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !entry.IsDir() && entry.Name() == "manifest.json" {
			count++
		}
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
	return count
}
