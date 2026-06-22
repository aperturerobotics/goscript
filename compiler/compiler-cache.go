package compiler

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"go/parser"
	"go/token"
	"io"
	"os"
	"path"
	"path/filepath"
	"runtime"
	"runtime/debug"
	"slices"
	"strconv"
	"strings"

	jsoniter "github.com/aperturerobotics/json-iterator-lite"
)

const compilerCacheSchema = "goscript-package-artifact-v1"

type compilerCacheEntryKind string

const (
	compilerCacheEntryGenerated compilerCacheEntryKind = "generated"
	compilerCacheEntryCopied    compilerCacheEntryKind = "copied"
)

// CompilerCacheOwner owns persistent compiler artifact lookup, replay, and store.
type CompilerCacheOwner struct{}

type compilerCacheEntry struct {
	key         string
	kind        compilerCacheEntryKind
	packagePath string
}

type compilerCacheManifest struct {
	schema           string
	key              string
	kind             compilerCacheEntryKind
	packagePath      string
	compiledPackages []string
	copiedPackages   []string
	files            []compilerCacheManifestFile
}

type compilerCacheManifestFile struct {
	path   string
	kind   string
	sha256 string
	size   uint64
	blob   string
}

// NewCompilerCacheOwner creates the compiler cache owner.
func NewCompilerCacheOwner() *CompilerCacheOwner {
	return &CompilerCacheOwner{}
}

func (o *CompilerCacheOwner) Enabled(req *CompileRequest) bool {
	return req != nil && strings.TrimSpace(req.CacheRoot) != ""
}

func (o *CompilerCacheOwner) Entries(
	req *CompileRequest,
	graph *PackageGraph,
	overridePlan *overrideCopyPlan,
) []compilerCacheEntry {
	if !o.Enabled(req) || graph == nil {
		return nil
	}

	keyOwner := newCompilerCacheKeyOwner(req, graph)
	entries := make([]compilerCacheEntry, 0, len(graph.Nodes))
	for _, node := range graph.Nodes {
		if node.OverrideCandidate {
			continue
		}
		entries = append(entries, compilerCacheEntry{
			key:         keyOwner.generatedKey(node),
			kind:        compilerCacheEntryGenerated,
			packagePath: node.PkgPath,
		})
	}
	if overridePlan != nil {
		for _, pkg := range overridePlan.packages {
			entries = append(entries, compilerCacheEntry{
				key:         keyOwner.copiedKey(pkg),
				kind:        compilerCacheEntryCopied,
				packagePath: pkg.path,
			})
		}
	}
	return entries
}

func (o *CompilerCacheOwner) Replay(
	ctx context.Context,
	req *CompileRequest,
	entries []compilerCacheEntry,
) (*CompilationResult, bool) {
	if !o.Enabled(req) || len(entries) == 0 {
		return nil, false
	}
	result := &CompilationResult{}
	for _, entry := range entries {
		if err := ctx.Err(); err != nil {
			return nil, false
		}
		manifest, ok := o.readManifest(req, entry)
		if !ok || manifest.kind != entry.kind || manifest.packagePath != entry.packagePath {
			return nil, false
		}
		if !o.replayManifest(req, manifest) {
			return nil, false
		}
		result.CompiledPackages = append(result.CompiledPackages, manifest.compiledPackages...)
		result.CopiedPackages = append(result.CopiedPackages, manifest.copiedPackages...)
	}
	return result, true
}

func (o *CompilerCacheOwner) StoreGenerated(
	req *CompileRequest,
	entries []compilerCacheEntry,
	program *LoweredProgram,
	files map[string]string,
) {
	if !o.Enabled(req) || program == nil || len(files) == 0 {
		return
	}
	entriesByPackage := entriesByKindAndPackage(entries, compilerCacheEntryGenerated)
	for _, pkg := range program.packages {
		entry, ok := entriesByPackage[pkg.pkgPath]
		if !ok {
			continue
		}
		prefix := "@goscript/" + pkg.pkgPath + "/"
		manifest := compilerCacheManifest{
			schema:           compilerCacheSchema,
			key:              entry.key,
			kind:             compilerCacheEntryGenerated,
			packagePath:      pkg.pkgPath,
			compiledPackages: []string{pkg.pkgPath},
		}
		for filePath, contents := range files {
			if !strings.HasPrefix(filePath, prefix) {
				continue
			}
			manifest.files = append(manifest.files, compilerCacheManifestFile{
				path:   filePath,
				kind:   generatedArtifactKind(filePath),
				sha256: sha256Hex([]byte(contents)),
				size:   uint64(len(contents)),
				blob:   o.storeBlob(req, []byte(contents)),
			})
		}
		slices.SortFunc(manifest.files, func(a, b compilerCacheManifestFile) int {
			return strings.Compare(a.path, b.path)
		})
		o.storeManifest(req, manifest)
	}
}

func (o *CompilerCacheOwner) StoreCopied(
	req *CompileRequest,
	entries []compilerCacheEntry,
	plan *overrideCopyPlan,
) {
	if !o.Enabled(req) || plan == nil {
		return
	}
	entriesByPackage := entriesByKindAndPackage(entries, compilerCacheEntryCopied)
	for _, pkg := range plan.packages {
		entry, ok := entriesByPackage[pkg.path]
		if !ok {
			continue
		}
		manifest := compilerCacheManifest{
			schema:         compilerCacheSchema,
			key:            entry.key,
			kind:           compilerCacheEntryCopied,
			packagePath:    pkg.path,
			copiedPackages: []string{pkg.path},
		}
		for _, file := range pkg.files {
			artifactPath := "@goscript/" + filepath.ToSlash(file.path)
			manifest.files = append(manifest.files, compilerCacheManifestFile{
				path:   artifactPath,
				kind:   "override",
				size:   uint64(len(file.data)),
				blob:   o.storeBlob(req, file.data),
				sha256: sha256Hex(file.data),
			})
		}
		slices.SortFunc(manifest.files, func(a, b compilerCacheManifestFile) int {
			return strings.Compare(a.path, b.path)
		})
		o.storeManifest(req, manifest)
	}
}

func (o *CompilerCacheOwner) readManifest(req *CompileRequest, entry compilerCacheEntry) (compilerCacheManifest, bool) {
	path := filepath.Join(o.entryDir(req, entry.key), "manifest.json")
	data, err := os.ReadFile(path)
	if err != nil {
		return compilerCacheManifest{}, false
	}
	if _, err := os.Stat(filepath.Join(o.entryDir(req, entry.key), "complete")); err != nil {
		return compilerCacheManifest{}, false
	}
	manifest := parseCompilerCacheManifest(data)
	if manifest.schema != compilerCacheSchema || manifest.key != entry.key {
		return compilerCacheManifest{}, false
	}
	if len(manifest.files) == 0 {
		return compilerCacheManifest{}, false
	}
	return manifest, true
}

func (o *CompilerCacheOwner) replayManifest(req *CompileRequest, manifest compilerCacheManifest) bool {
	for _, file := range manifest.files {
		if !safeOutputArtifactPath(file.path) || !safeCacheBlobPath(file.blob) {
			return false
		}
		blobPath := filepath.Join(o.schemaRoot(req), filepath.FromSlash(file.blob))
		data, err := os.ReadFile(blobPath)
		if err != nil || uint64(len(data)) != file.size || sha256Hex(data) != file.sha256 {
			return false
		}
		dest := filepath.Join(req.OutputPath, filepath.FromSlash(file.path))
		if err := writeFileAtomic(dest, data, 0o644); err != nil {
			return false
		}
	}
	return true
}

func (o *CompilerCacheOwner) storeManifest(req *CompileRequest, manifest compilerCacheManifest) {
	if len(manifest.files) == 0 {
		return
	}
	tmpRoot := filepath.Join(o.schemaRoot(req), "tmp")
	if err := os.MkdirAll(tmpRoot, 0o755); err != nil {
		return
	}
	tmpDir, err := os.MkdirTemp(tmpRoot, "entry-")
	if err != nil {
		return
	}
	defer os.RemoveAll(tmpDir)

	data := formatCompilerCacheManifest(manifest)
	if err := os.WriteFile(filepath.Join(tmpDir, "manifest.json"), data, 0o644); err != nil {
		return
	}
	if err := os.WriteFile(filepath.Join(tmpDir, "complete"), []byte("complete\n"), 0o644); err != nil {
		return
	}
	entryDir := o.entryDir(req, manifest.key)
	if err := os.MkdirAll(filepath.Dir(entryDir), 0o755); err != nil {
		return
	}
	if err := os.Rename(tmpDir, entryDir); err != nil {
		if _, statErr := os.Stat(filepath.Join(entryDir, "complete")); statErr == nil {
			return
		}
	}
}

func (o *CompilerCacheOwner) storeBlob(req *CompileRequest, data []byte) string {
	digest := sha256Hex(data)
	rel := path.Join("blobs", "sha256", digest[:2], digest)
	blobPath := filepath.Join(o.schemaRoot(req), filepath.FromSlash(rel))
	if _, err := os.Stat(blobPath); err == nil {
		return rel
	}
	if err := os.MkdirAll(filepath.Dir(blobPath), 0o755); err != nil {
		return rel
	}
	tmp, err := os.CreateTemp(filepath.Dir(blobPath), "blob-")
	if err != nil {
		return rel
	}
	tmpName := tmp.Name()
	written, writeErr := tmp.Write(data)
	closeErr := tmp.Close()
	if writeErr != nil || closeErr != nil || written != len(data) {
		os.Remove(tmpName)
		return rel
	}
	if err := os.Rename(tmpName, blobPath); err != nil {
		os.Remove(tmpName)
	}
	return rel
}

func (o *CompilerCacheOwner) schemaRoot(req *CompileRequest) string {
	return filepath.Join(req.CacheRoot, compilerCacheSchema)
}

func (o *CompilerCacheOwner) entryDir(req *CompileRequest, key string) string {
	return filepath.Join(o.schemaRoot(req), "entries", key[:2], key)
}

func entriesByKindAndPackage(entries []compilerCacheEntry, kind compilerCacheEntryKind) map[string]compilerCacheEntry {
	out := make(map[string]compilerCacheEntry)
	for _, entry := range entries {
		if entry.kind == kind {
			out[entry.packagePath] = entry
		}
	}
	return out
}

type compilerCacheKeyOwner struct {
	req          *CompileRequest
	graph        *PackageGraph
	graphDigests map[string]string
}

func newCompilerCacheKeyOwner(req *CompileRequest, graph *PackageGraph) *compilerCacheKeyOwner {
	return &compilerCacheKeyOwner{
		req:          req,
		graph:        graph,
		graphDigests: make(map[string]string),
	}
}

func (o *compilerCacheKeyOwner) generatedKey(node *PackageGraphNode) string {
	var b strings.Builder
	writeKeyField(&b, "schema", compilerCacheSchema)
	writeCompilerIdentity(&b)
	writeRequestIdentity(&b, o.req)
	writeKeyField(&b, "kind", string(compilerCacheEntryGenerated))
	writeKeyField(&b, "package-digest", o.nodeDigest(node.PkgPath))
	return sha256String(b.String())
}

func (o *compilerCacheKeyOwner) copiedKey(pkg overrideCopyPackage) string {
	var b strings.Builder
	writeKeyField(&b, "schema", compilerCacheSchema)
	writeCompilerIdentity(&b)
	writeRequestIdentity(&b, o.req)
	writeKeyField(&b, "kind", string(compilerCacheEntryCopied))
	writeKeyField(&b, "package", pkg.path)
	for _, file := range pkg.files {
		writeKeyField(&b, "override-file", file.path)
		writeKeyField(&b, "override-file-sha256", sha256Hex(file.data))
	}
	return sha256String(b.String())
}

func (o *compilerCacheKeyOwner) nodeDigest(pkgPath string) string {
	if digest := o.graphDigests[pkgPath]; digest != "" {
		return digest
	}
	node := o.graph.NodesByPackagePath[pkgPath]
	if node == nil {
		return ""
	}
	var b strings.Builder
	writeKeyField(&b, "id", node.ID)
	writeKeyField(&b, "path", node.PkgPath)
	writeKeyField(&b, "name", node.Name)
	writeKeyField(&b, "module-path", node.ModulePath)
	writeKeyField(&b, "module-dir", node.ModuleDir)
	writeKeyField(&b, "for-test", node.ForTest)
	writeKeyField(&b, "requested", strconv.FormatBool(node.Requested))
	writeKeyField(&b, "override-candidate", strconv.FormatBool(node.OverrideCandidate))
	for _, file := range node.GoFiles {
		writeKeyField(&b, "go-file", fileIdentity(file))
	}
	for _, file := range node.CompiledGoFiles {
		writeKeyField(&b, "compiled-file", fileIdentity(file))
	}
	for _, input := range compilerCacheSideInputs(o.req, node) {
		writeKeyField(&b, "side-input", input)
	}
	for _, file := range moduleIdentityFiles(node.ModuleDir) {
		writeKeyField(&b, "module-file", fileIdentity(file))
	}
	for _, importPath := range node.Imports {
		writeKeyField(&b, "import", importPath)
		if o.graph.NodesByPackagePath[importPath] != nil {
			writeKeyField(&b, "import-digest", o.nodeDigest(importPath))
		}
	}
	digest := sha256String(b.String())
	o.graphDigests[pkgPath] = digest
	return digest
}

func writeCompilerIdentity(b *strings.Builder) {
	writeKeyField(b, "go-version", runtime.Version())
	if info, ok := debug.ReadBuildInfo(); ok {
		writeKeyField(b, "module", info.Main.Path+"@"+info.Main.Version)
		for _, dep := range info.Deps {
			writeKeyField(b, "dep", dep.Path+"@"+dep.Version)
			if dep.Replace != nil {
				writeKeyField(b, "dep-replace", dep.Replace.Path+"@"+dep.Replace.Version)
			}
		}
	}
}

func writeRequestIdentity(b *strings.Builder, req *CompileRequest) {
	if req == nil {
		return
	}
	for _, pattern := range req.Patterns {
		writeKeyField(b, "pattern", pattern)
	}
	writeKeyField(b, "dir", cleanAbs(req.Dir))
	if req.ProtobufTypeScriptBinding {
		writeKeyField(b, "protobuf-output", cleanAbs(req.OutputPath))
	}
	for _, flag := range goScriptBuildFlags(req.BuildFlags) {
		writeKeyField(b, "build-flag", flag)
	}
	for _, dir := range req.OverrideDirs {
		writeKeyField(b, "override-dir", cleanAbs(dir))
	}
	for _, path := range req.PackageBlocklist {
		writeKeyField(b, "blocklist", path)
	}
	writeKeyField(b, "dependency-mode", string(req.DependencyMode))
	writeKeyField(b, "runtime-mode", string(req.RuntimeEmissionMode))
	writeKeyField(b, "protobuf-ts-binding", strconv.FormatBool(req.ProtobufTypeScriptBinding))
	writeKeyField(b, "tests", strconv.FormatBool(req.Tests))
	for _, key := range goLoaderEnvKeys() {
		writeKeyField(b, "env-"+key, os.Getenv(key))
	}
}

func writeKeyField(b *strings.Builder, key, value string) {
	b.WriteString(key)
	b.WriteByte('=')
	b.WriteString(strconv.Quote(value))
	b.WriteByte('\n')
}

func goLoaderEnvKeys() []string {
	return []string{
		"CGO_ENABLED",
		"GOFLAGS",
		"GOMODCACHE",
		"GONOPROXY",
		"GONOSUMDB",
		"GOPATH",
		"GOPRIVATE",
		"GOPROXY",
		"GOROOT",
		"GOSUMDB",
		"GOWORK",
	}
}

func compilerCacheSideInputs(req *CompileRequest, node *PackageGraphNode) []string {
	if node == nil {
		return nil
	}
	var inputs []string
	for _, file := range node.CompiledGoFiles {
		inputs = append(inputs, compilerCacheGoEmbedSideInputs(file)...)
	}
	inputs = append(inputs, compilerCacheProtobufSideInputs(req, node)...)
	slices.Sort(inputs)
	return inputs
}

func compilerCacheGoEmbedSideInputs(goFile string) []string {
	syntax, err := parser.ParseFile(token.NewFileSet(), goFile, nil, parser.ParseComments)
	if err != nil {
		return []string{"go:embed-parse|" + cleanAbs(goFile) + "|" + err.Error()}
	}
	patterns := goEmbedPatterns(syntax.Comments...)
	if len(patterns) == 0 {
		return nil
	}
	pkgDir := filepath.Dir(goFile)
	var inputs []string
	for _, pattern := range patterns {
		files, err := compilerCacheGoEmbedFiles(pkgDir, pattern)
		if err != nil {
			inputs = append(inputs, "go:embed-error|"+cleanAbs(goFile)+"|"+pattern+"|"+err.Error())
			continue
		}
		for _, file := range files {
			inputs = append(inputs, "go:embed-file|"+pattern+"|"+fileIdentity(file))
		}
	}
	return inputs
}

func compilerCacheGoEmbedFiles(pkgDir, pattern string) ([]string, error) {
	pattern = strings.Trim(pattern, "`\"")
	all := false
	if strings.HasPrefix(pattern, "all:") {
		all = true
		pattern = strings.TrimPrefix(pattern, "all:")
	}
	cleanPattern := path.Clean(pattern)
	if pattern == "" ||
		path.IsAbs(pattern) ||
		cleanPattern == "." ||
		cleanPattern == ".." ||
		strings.HasPrefix(cleanPattern, "../") {
		return nil, errors.New("unsupported go:embed pattern")
	}

	paths := []string{filepath.Join(pkgDir, filepath.FromSlash(cleanPattern))}
	if strings.ContainsAny(cleanPattern, "*?[") {
		matches, err := filepath.Glob(filepath.Join(pkgDir, filepath.FromSlash(cleanPattern)))
		if err != nil {
			return nil, err
		}
		if len(matches) == 0 {
			return nil, errors.New("go:embed pattern matched no files")
		}
		paths = matches
	}

	var files []string
	for _, absPath := range paths {
		collected, err := compilerCacheCollectGoEmbedPath(absPath, all)
		if err != nil {
			return nil, err
		}
		files = append(files, collected...)
	}
	slices.Sort(files)
	return files, nil
}

func compilerCacheCollectGoEmbedPath(absPath string, all bool) ([]string, error) {
	info, err := os.Stat(absPath)
	if err != nil {
		return nil, err
	}
	if !info.IsDir() {
		return []string{absPath}, nil
	}

	var files []string
	err = filepath.WalkDir(absPath, func(path string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if path != absPath && !all && (strings.HasPrefix(entry.Name(), ".") || strings.HasPrefix(entry.Name(), "_")) {
			if entry.IsDir() {
				return filepath.SkipDir
			}
			return nil
		}
		if entry.IsDir() {
			return nil
		}
		files = append(files, path)
		return nil
	})
	if err != nil {
		return nil, err
	}
	if len(files) == 0 {
		return nil, errors.New("go:embed directory matched no files")
	}
	return files, nil
}

func compilerCacheProtobufSideInputs(req *CompileRequest, node *PackageGraphNode) []string {
	if req == nil || !req.ProtobufTypeScriptBinding {
		return nil
	}
	sourceRoot := protobufTypeScriptBindingRoot(req.Dir)
	var inputs []string
	for _, sourcePath := range node.CompiledGoFiles {
		if !strings.HasSuffix(sourcePath, ".pb.go") ||
			strings.HasSuffix(filepath.Base(sourcePath), "_srpc.pb.go") ||
			!protobufTypeScriptBindingInSourceRoot(sourceRoot, sourcePath) {
			continue
		}
		tsPath := strings.TrimSuffix(sourcePath, ".go") + ".ts"
		inputs = append(inputs, "protobuf-ts-binding|"+fileIdentity(tsPath))
	}
	return inputs
}

func moduleIdentityFiles(moduleDir string) []string {
	if moduleDir == "" {
		return nil
	}
	var files []string
	for _, name := range []string{"go.mod", "go.sum", "vendor/modules.txt"} {
		file := filepath.Join(moduleDir, name)
		if _, err := os.Stat(file); err == nil {
			files = append(files, file)
		}
	}
	return files
}

func fileIdentity(file string) string {
	data, err := os.ReadFile(file)
	if err != nil {
		return filepath.ToSlash(file) + "|missing|" + err.Error()
	}
	info, err := os.Stat(file)
	if err != nil {
		return filepath.ToSlash(file) + "|stat|" + err.Error()
	}
	return strings.Join([]string{
		cleanAbs(file),
		strconv.FormatInt(info.Size(), 10),
		strconv.FormatInt(info.ModTime().UnixNano(), 10),
		sha256Hex(data),
	}, "|")
}

func cleanAbs(file string) string {
	if file == "" {
		return ""
	}
	abs, err := filepath.Abs(file)
	if err != nil {
		return filepath.ToSlash(filepath.Clean(file))
	}
	return filepath.ToSlash(filepath.Clean(abs))
}

func generatedArtifactKind(filePath string) string {
	if strings.HasSuffix(filePath, "/index.ts") {
		return "package-index"
	}
	return "generated"
}

func safeOutputArtifactPath(filePath string) bool {
	if filePath == "" || strings.Contains(filePath, "\\") {
		return false
	}
	clean := path.Clean(filePath)
	return clean == filePath &&
		!path.IsAbs(clean) &&
		!strings.HasPrefix(clean, "../") &&
		clean != ".." &&
		(strings.HasPrefix(clean, "@goscript/") || clean == "@goscript")
}

func safeCacheBlobPath(filePath string) bool {
	if filePath == "" || strings.Contains(filePath, "\\") {
		return false
	}
	clean := path.Clean(filePath)
	return clean == filePath &&
		!path.IsAbs(clean) &&
		!strings.HasPrefix(clean, "../") &&
		clean != ".." &&
		strings.HasPrefix(clean, "blobs/sha256/")
}

func writeFileAtomic(path string, data []byte, perm os.FileMode) error {
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}
	tmp, err := os.CreateTemp(filepath.Dir(path), ".goscript-cache-*")
	if err != nil {
		return err
	}
	tmpName := tmp.Name()
	written, writeErr := tmp.Write(data)
	closeErr := tmp.Close()
	if writeErr != nil {
		os.Remove(tmpName)
		return writeErr
	}
	if closeErr != nil {
		os.Remove(tmpName)
		return closeErr
	}
	if written != len(data) {
		os.Remove(tmpName)
		return io.ErrShortWrite
	}
	if err := os.Chmod(tmpName, perm); err != nil {
		os.Remove(tmpName)
		return err
	}
	return os.Rename(tmpName, path)
}

func sha256Hex(data []byte) string {
	sum := sha256.Sum256(data)
	return hex.EncodeToString(sum[:])
}

func sha256String(data string) string {
	return sha256Hex([]byte(data))
}

func formatCompilerCacheManifest(manifest compilerCacheManifest) []byte {
	var buf bytes.Buffer
	stream := jsoniter.NewStream(&buf, 4096, 2)
	stream.WriteObjectStart()
	stream.WriteObjectField("schema")
	stream.WriteString(manifest.schema)
	stream.WriteMore()
	stream.WriteObjectField("key")
	stream.WriteString(manifest.key)
	stream.WriteMore()
	stream.WriteObjectField("kind")
	stream.WriteString(string(manifest.kind))
	stream.WriteMore()
	stream.WriteObjectField("packagePath")
	stream.WriteString(manifest.packagePath)
	stream.WriteMore()
	writeStringArray(stream, "compiledPackages", manifest.compiledPackages)
	stream.WriteMore()
	writeStringArray(stream, "copiedPackages", manifest.copiedPackages)
	stream.WriteMore()
	stream.WriteObjectField("files")
	stream.WriteArrayStart()
	for idx, file := range manifest.files {
		if idx != 0 {
			stream.WriteMore()
		}
		stream.WriteObjectStart()
		stream.WriteObjectField("path")
		stream.WriteString(file.path)
		stream.WriteMore()
		stream.WriteObjectField("kind")
		stream.WriteString(file.kind)
		stream.WriteMore()
		stream.WriteObjectField("sha256")
		stream.WriteString(file.sha256)
		stream.WriteMore()
		stream.WriteObjectField("size")
		stream.WriteUint64(file.size)
		stream.WriteMore()
		stream.WriteObjectField("blob")
		stream.WriteString(file.blob)
		stream.WriteObjectEnd()
	}
	stream.WriteArrayEnd()
	stream.WriteObjectEnd()
	if stream.Error != nil {
		return nil
	}
	return append([]byte(nil), stream.Buffer()...)
}

func writeStringArray(stream *jsoniter.Stream, field string, values []string) {
	stream.WriteObjectField(field)
	stream.WriteArrayStart()
	for idx, value := range values {
		if idx != 0 {
			stream.WriteMore()
		}
		stream.WriteString(value)
	}
	stream.WriteArrayEnd()
}

func parseCompilerCacheManifest(data []byte) compilerCacheManifest {
	var manifest compilerCacheManifest
	iter := jsoniter.ParseBytes(data)
	for field := iter.ReadObject(); field != ""; field = iter.ReadObject() {
		switch field {
		case "schema":
			manifest.schema = iter.ReadString()
		case "key":
			manifest.key = iter.ReadString()
		case "kind":
			manifest.kind = compilerCacheEntryKind(iter.ReadString())
		case "packagePath":
			manifest.packagePath = iter.ReadString()
		case "compiledPackages":
			manifest.compiledPackages = readStringArray(iter)
		case "copiedPackages":
			manifest.copiedPackages = readStringArray(iter)
		case "files":
			for iter.ReadArray() {
				manifest.files = append(manifest.files, readManifestFile(iter))
			}
		default:
			iter.Skip()
		}
	}
	if iter.Error != nil && !errors.Is(iter.Error, io.EOF) {
		return compilerCacheManifest{}
	}
	return manifest
}

func readStringArray(iter *jsoniter.Iterator) []string {
	var values []string
	for iter.ReadArray() {
		values = append(values, iter.ReadString())
	}
	return values
}

func readManifestFile(iter *jsoniter.Iterator) compilerCacheManifestFile {
	var file compilerCacheManifestFile
	for field := iter.ReadObject(); field != ""; field = iter.ReadObject() {
		switch field {
		case "path":
			file.path = iter.ReadString()
		case "kind":
			file.kind = iter.ReadString()
		case "sha256":
			file.sha256 = iter.ReadString()
		case "size":
			file.size = iter.ReadUint64()
		case "blob":
			file.blob = iter.ReadString()
		default:
			iter.Skip()
		}
	}
	return file
}
