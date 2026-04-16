package compiler

import (
	"fmt"
	"path/filepath"
	"strings"

	"golang.org/x/tools/go/packages"
)

// ComputeModulePath computes the root of the output typescript module.
func ComputeModulePath(outputRoot, goPkg string) string {
	return filepath.Join(outputRoot, translateGoPathToTypescriptPath(goPkg))
}

var typeScriptGoStubPrefix = "@ts/"

const builtinGoImportPath = "github.com/aperturerobotics/goscript/builtin"

// translateGoPathToTypescriptPath translates a go package import path to a typescript import path.
func translateGoPathToTypescriptPath(goImportPath string) string {
	if strings.HasPrefix(goImportPath, typeScriptGoStubPrefix) {
		return goImportPath[len(typeScriptGoStubPrefix):]
	}
	return fmt.Sprintf("@goscript/%s", goImportPath)
}

// translateGoImportPathToTypescriptModulePath maps a Go import path to a TypeScript module path.
func translateGoImportPathToTypescriptModulePath(goImportPath string) string {
	if goImportPath == builtinGoImportPath {
		return "@goscript/builtin"
	}
	return translateGoPathToTypescriptPath(goImportPath)
}

// translateTypescriptModulePathToIndexImportPath maps a TypeScript module path to its index.ts import path.
func translateTypescriptModulePathToIndexImportPath(modulePath string) string {
	return modulePath + "/index.ts"
}

// translateGeneratedFileToImportPath maps a generated file stem to its .ts import path.
func translateGeneratedFileToImportPath(fileName string) string {
	return fmt.Sprintf("./%s.ts", fileName)
}

// translateGeneratedGoFileToImportPath maps a generated Go file stem to its .gs.ts import path.
func translateGeneratedGoFileToImportPath(fileName string) string {
	return fmt.Sprintf("./%s.gs.ts", fileName)
}

// translateGeneratedProtobufFileToImportPath maps a protobuf file stem to its .pb.ts import path.
func translateGeneratedProtobufFileToImportPath(fileName string) string {
	return fmt.Sprintf("./%s.pb.ts", fileName)
}

// getActualPackageName returns the actual Go package name from package information.
// If the package is not found in the imports map, returns an error instead of falling back.
// This handles cases where the package name differs from the last segment of the import path.
func getActualPackageName(importPath string, importsMap map[string]*packages.Package) (string, error) {
	if pkg, exists := importsMap[importPath]; exists && pkg.Name != "" {
		return pkg.Name, nil
	}
	return "", fmt.Errorf("package %s not found in imports map", importPath)
}

// TranslateGoFilePathToTypescriptFilePath converts the go package path and typescript filename to output path within the typescript output dir
func TranslateGoFilePathToTypescriptFilePath(goPkgPath, goCodeFilename string) string {
	op := translateGoPathToTypescriptPath(goPkgPath)
	baseFilename := goCodeFilename[:len(goCodeFilename)-3]
	baseFilename = fmt.Sprintf("%s.gs.ts", baseFilename)
	return filepath.Join(op, baseFilename)
}
