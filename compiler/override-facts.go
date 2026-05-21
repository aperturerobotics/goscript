package compiler

import (
	"context"
	"errors"
	"io"
	"io/fs"
	"path"
	"slices"
	"strings"

	gs "github.com/aperturerobotics/goscript"
	jsoniter "github.com/aperturerobotics/json-iterator-lite"
)

// OverrideFacts is the immutable compiler-visible view of GoScript overrides.
type OverrideFacts struct {
	packages map[string]overridePackageFacts
}

type overridePackageFacts struct {
	metadata     OverrideMetadata
	copyPackage  overrideCopyPackage
	dependencies []string
}

// HasPackage returns true when pkgPath has a GoScript override package.
func (f *OverrideFacts) HasPackage(pkgPath string) bool {
	if f == nil || pkgPath == "" {
		return false
	}
	_, ok := f.packages[pkgPath]
	return ok
}

// Metadata returns compiler-visible override metadata for a package path.
func (f *OverrideFacts) Metadata(pkgPath string) OverrideMetadata {
	if f == nil {
		return newOverrideMetadata()
	}
	pkg := f.packages[pkgPath]
	return cloneOverrideMetadata(pkg.metadata)
}

// IsMethodAsync returns true when override metadata marks a method async.
func (f *OverrideFacts) IsMethodAsync(pkgPath, method string) bool {
	if f == nil {
		return false
	}
	pkg := f.packages[pkgPath]
	return pkg.metadata.AsyncMethods[method]
}

func (f *OverrideFacts) copyPackage(pkgPath string) (overrideCopyPackage, []string, bool) {
	if f == nil {
		return overrideCopyPackage{}, nil, false
	}
	pkg, ok := f.packages[pkgPath]
	if !ok {
		return overrideCopyPackage{}, nil, false
	}
	return cloneOverrideCopyPackage(pkg.copyPackage), append([]string(nil), pkg.dependencies...), true
}

func (f *OverrideFacts) importPackageRoot(importPath string) (string, bool) {
	if f == nil {
		return "", false
	}
	importPath = strings.TrimPrefix(importPath, "@goscript/")
	importPath = strings.TrimSuffix(importPath, ".js")
	importPath = strings.TrimSuffix(importPath, ".ts")
	if before, ok := strings.CutSuffix(importPath, "/index"); ok {
		importPath = before
	}
	parts := strings.Split(importPath, "/")
	for idx := len(parts); idx > 0; idx-- {
		candidate := strings.Join(parts[:idx], "/")
		if f.HasPackage(candidate) {
			return candidate, true
		}
	}
	return "", false
}

func buildOverrideFacts(ctx context.Context) (*OverrideFacts, []Diagnostic) {
	roots, err := discoverOverridePackageRoots()
	if err != nil {
		return nil, []Diagnostic{overrideError("discover override packages", "", err)}
	}
	paths := make([]string, 0, len(roots))
	for pkgPath := range roots {
		paths = append(paths, pkgPath)
	}
	slices.Sort(paths)

	facts := &OverrideFacts{packages: make(map[string]overridePackageFacts, len(paths))}
	var diagnostics []Diagnostic
	for _, pkgPath := range paths {
		if err := ctx.Err(); err != nil {
			return facts, []Diagnostic{contextCanceledDiagnostic(err)}
		}
		metadata, err := loadOverrideMetadata(pkgPath)
		if err != nil {
			diagnostics = append(diagnostics, overrideError("read override metadata", pkgPath, err))
			continue
		}
		copyPackage, dependencies, packageDiagnostics := loadOverrideCopyPackage(pkgPath, roots, metadata)
		diagnostics = append(diagnostics, packageDiagnostics...)
		if diagnosticsHaveErrors(packageDiagnostics) {
			continue
		}
		facts.packages[pkgPath] = overridePackageFacts{
			metadata:     cloneOverrideMetadata(metadata),
			copyPackage:  copyPackage,
			dependencies: dependencies,
		}
	}
	if diagnosticsHaveErrors(diagnostics) {
		return facts, diagnostics
	}
	return facts, diagnostics
}

func discoverOverridePackageRoots() (map[string]bool, error) {
	roots := make(map[string]bool)
	if err := fs.WalkDir(gs.GsOverrides, "gs", func(filePath string, entry fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if entry.IsDir() || path.Base(filePath) != "index.ts" {
			return nil
		}
		pkgPath := strings.TrimPrefix(path.Dir(filePath), "gs/")
		if pkgPath != "." && pkgPath != "" {
			roots[pkgPath] = true
		}
		return nil
	}); err != nil {
		return nil, err
	}
	return roots, nil
}

func loadOverrideMetadata(pkgPath string) (OverrideMetadata, error) {
	metadata := newOverrideMetadata()
	data, err := gs.GsOverrides.ReadFile("gs/" + pkgPath + "/meta.json")
	if err != nil {
		if errors.Is(err, fs.ErrNotExist) {
			return metadata, nil
		}
		return OverrideMetadata{}, err
	}

	iter := jsoniter.ParseBytes(data)
	for field := iter.ReadObject(); field != ""; field = iter.ReadObject() {
		switch field {
		case "dependencies":
			for iter.ReadArray() {
				metadata.Dependencies = append(metadata.Dependencies, iter.ReadString())
			}
		case "asyncMethods":
			for method := iter.ReadObject(); method != ""; method = iter.ReadObject() {
				metadata.AsyncMethods[method] = iter.ReadBool()
			}
		default:
			iter.Skip()
		}
	}
	if iter.Error != nil && !errors.Is(iter.Error, io.EOF) {
		return OverrideMetadata{}, iter.Error
	}
	return metadata, nil
}

func loadOverrideCopyPackage(
	pkgPath string,
	roots map[string]bool,
	metadata OverrideMetadata,
) (overrideCopyPackage, []string, []Diagnostic) {
	if !roots[pkgPath] {
		return overrideCopyPackage{}, nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/overrides:missing-package",
			Message:  "override package does not exist",
			Detail:   pkgPath,
		}}
	}

	facts := &OverrideFacts{packages: make(map[string]overridePackageFacts, len(roots))}
	for root := range roots {
		facts.packages[root] = overridePackageFacts{}
	}

	copyPackage := overrideCopyPackage{path: pkgPath}
	dependencySet := make(map[string]bool)
	for _, dependency := range metadata.Dependencies {
		dependency = strings.TrimSpace(dependency)
		if dependency != "" && dependency != pkgPath {
			dependencySet[dependency] = true
		}
	}

	root := "gs/" + pkgPath
	err := fs.WalkDir(gs.GsOverrides, root, func(filePath string, entry fs.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if entry.IsDir() {
			nestedPkg := strings.TrimPrefix(filePath, "gs/")
			if nestedPkg != pkgPath && roots[nestedPkg] {
				return fs.SkipDir
			}
			return nil
		}
		if !isOverrideSourceFile(filePath) {
			return nil
		}
		data, readErr := gs.GsOverrides.ReadFile(filePath)
		if readErr != nil {
			return readErr
		}
		rel := strings.TrimPrefix(filePath, "gs/")
		copyPackage.files = append(copyPackage.files, overrideCopyFile{
			path: rel,
			data: data,
		})
		for _, imported := range scanOverrideImports(string(data)) {
			dependency, ok := facts.importPackageRoot(imported)
			if ok && dependency != "builtin" && dependency != pkgPath {
				dependencySet[dependency] = true
			}
		}
		return nil
	})
	if err != nil {
		return overrideCopyPackage{}, nil, []Diagnostic{overrideError("read override package", pkgPath, err)}
	}

	if len(copyPackage.files) == 0 {
		return overrideCopyPackage{}, nil, []Diagnostic{{
			Severity: DiagnosticSeverityError,
			Code:     "goscript/overrides:empty-package",
			Message:  "override package does not contain TypeScript source files",
			Detail:   pkgPath,
		}}
	}
	slices.SortFunc(copyPackage.files, func(a, b overrideCopyFile) int {
		return strings.Compare(a.path, b.path)
	})

	dependencies := make([]string, 0, len(dependencySet))
	for dependency := range dependencySet {
		dependencies = append(dependencies, dependency)
	}
	slices.Sort(dependencies)
	return copyPackage, dependencies, nil
}

func newOverrideMetadata() OverrideMetadata {
	return OverrideMetadata{AsyncMethods: make(map[string]bool)}
}

func cloneOverrideMetadata(metadata OverrideMetadata) OverrideMetadata {
	return OverrideMetadata{
		Dependencies: append([]string(nil), metadata.Dependencies...),
		AsyncMethods: cloneBoolMap(metadata.AsyncMethods),
	}
}

func cloneBoolMap(values map[string]bool) map[string]bool {
	cloned := make(map[string]bool, len(values))
	for key, value := range values {
		cloned[key] = value
	}
	return cloned
}

func cloneOverrideCopyPackage(pkg overrideCopyPackage) overrideCopyPackage {
	cloned := overrideCopyPackage{
		path:  pkg.path,
		files: make([]overrideCopyFile, 0, len(pkg.files)),
	}
	for _, file := range pkg.files {
		cloned.files = append(cloned.files, overrideCopyFile{
			path: file.path,
			data: append([]byte(nil), file.data...),
		})
	}
	return cloned
}
