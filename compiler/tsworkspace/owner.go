package tsworkspace

import (
	"bytes"
	"context"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"slices"
	"strings"
	"time"

	jsoniter "github.com/aperturerobotics/json-iterator-lite"
	"github.com/pkg/errors"
)

// Phase names a TypeScript workspace execution phase.
type Phase string

const (
	// PhaseWorkspace covers workspace file preparation and tool discovery.
	PhaseWorkspace Phase = "workspace"
	// PhaseTypeCheck covers TypeScript type checking.
	PhaseTypeCheck Phase = "typecheck"
	// PhaseRuntime covers TypeScript runtime execution.
	PhaseRuntime Phase = "runtime"

	// NodeAmbientTypesFile names the GoScript runtime ambient declarations.
	NodeAmbientTypesFile = "goscript-node.d.ts"
)

// Owner owns TypeScript test workspace files, tool discovery, and execution.
type Owner struct {
	workDir string
	toolDir string
}

// NewOwner creates a TypeScript workspace owner.
func NewOwner(workDir, toolDir string) *Owner {
	return &Owner{
		workDir: workDir,
		toolDir: toolDir,
	}
}

// WorkDir returns the workspace directory.
func (o *Owner) WorkDir() string {
	if o == nil {
		return ""
	}
	return o.workDir
}

// EnsurePackageJSON writes the module package metadata used by Bun.
func (o *Owner) EnsurePackageJSON() Result {
	return o.WriteFile(PhaseWorkspace, "package.json", "{\"type\":\"module\"}\n")
}

// EnsureNodeAmbientTypes writes host runtime declarations needed by emitted tests.
func (o *Owner) EnsureNodeAmbientTypes() Result {
	if nodeTypesPresent(o.workDir, o.toolDir) {
		return o.WriteFile(PhaseWorkspace, NodeAmbientTypesFile, "")
	}
	return o.WriteFile(PhaseWorkspace, NodeAmbientTypesFile, nodeAmbientTypes)
}

// WriteFile writes a workspace-relative file.
func (o *Owner) WriteFile(phase Phase, name string, data string) Result {
	if o == nil || o.workDir == "" {
		return Result{Phase: phase, Error: "TypeScript workspace directory is empty"}
	}
	if err := os.MkdirAll(o.workDir, 0o755); err != nil {
		return Result{Phase: phase, Error: errors.Wrap(err, "create TypeScript workspace").Error()}
	}
	path, err := o.workspacePath(name)
	if err != nil {
		return Result{Phase: phase, Error: err.Error()}
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return Result{Phase: phase, Error: errors.Wrap(err, "create TypeScript workspace file parent").Error()}
	}
	if err := os.WriteFile(path, []byte(data), 0o644); err != nil {
		return Result{Phase: phase, Error: errors.Wrap(err, "write TypeScript workspace file").Error()}
	}
	return Result{Phase: phase}
}

// WriteJSON writes an indented JSON workspace file.
func (o *Owner) WriteJSON(phase Phase, name string, value any) Result {
	data, err := renderJSON(value)
	if err != nil {
		return Result{Phase: phase, Error: err.Error()}
	}
	return o.WriteFile(phase, name, data)
}

// RunTool finds and executes a TypeScript workspace tool.
func (o *Owner) RunTool(ctx context.Context, phase Phase, dir string, name string, args ...string) Result {
	tool, err := o.FindTool(name)
	if err != nil {
		return Result{Phase: phase, Error: err.Error()}
	}
	if dir == "" {
		dir = o.workDir
	}
	start := time.Now()
	cmd := exec.CommandContext(ctx, tool, args...)
	cmd.Dir = dir
	var output bytes.Buffer
	cmd.Stdout = &output
	cmd.Stderr = &output
	err = cmd.Run()
	result := Result{
		Phase:   phase,
		Command: append([]string{tool}, args...),
		Output:  output.String(),
		Elapsed: time.Since(start),
	}
	if err != nil {
		result.Error = err.Error()
	}
	return result
}

// FindTool locates a TypeScript workspace tool.
func (o *Owner) FindTool(name string) (string, error) {
	if filepath.IsAbs(name) {
		return name, nil
	}
	starts := []string{o.toolDir, o.workDir, sourceDirectory(), currentWorkingDirectory()}
	for _, start := range starts {
		if start == "" {
			continue
		}
		for current := start; current != ""; current = filepath.Dir(current) {
			candidate := filepath.Join(current, "node_modules", ".bin", name)
			info, err := os.Stat(candidate)
			if err == nil && !info.IsDir() {
				return candidate, nil
			}
			if parent := filepath.Dir(current); parent == current {
				break
			}
		}
	}
	if path, err := exec.LookPath(name); err == nil {
		return path, nil
	}
	return "", errors.New(name + " not found in PATH or ancestor node_modules/.bin")
}

func (o *Owner) workspacePath(name string) (string, error) {
	if filepath.IsAbs(name) {
		return "", errors.Errorf("TypeScript workspace path must be relative: %s", name)
	}
	clean := filepath.Clean(name)
	if clean == "." || clean == ".." || strings.HasPrefix(clean, ".."+string(filepath.Separator)) {
		return "", errors.Errorf("TypeScript workspace path escapes workspace: %s", name)
	}
	return filepath.Join(o.workDir, clean), nil
}

// NodeTypeRoots returns existing @types roots visible from the provided dirs.
func NodeTypeRoots(dirs ...string) []string {
	seen := make(map[string]bool)
	var roots []string
	for _, start := range append(dirs, currentWorkingDirectory()) {
		if start == "" {
			continue
		}
		for current := start; current != ""; current = filepath.Dir(current) {
			candidate := filepath.Join(current, "node_modules", "@types")
			info, err := os.Stat(candidate)
			if err == nil && info.IsDir() && !seen[candidate] {
				seen[candidate] = true
				roots = append(roots, candidate)
				break
			}
			if parent := filepath.Dir(current); parent == current {
				break
			}
		}
	}
	slices.Sort(roots)
	return roots
}

func nodeTypesPresent(dirs ...string) bool {
	seen := make(map[string]bool)
	for _, start := range dirs {
		if start == "" {
			continue
		}
		for current := start; current != ""; current = filepath.Dir(current) {
			if seen[current] {
				if parent := filepath.Dir(current); parent == current {
					break
				}
				continue
			}
			seen[current] = true
			candidate := filepath.Join(current, "node_modules", "@types", "node")
			info, err := os.Stat(candidate)
			if err == nil && info.IsDir() {
				return true
			}
			if parent := filepath.Dir(current); parent == current {
				break
			}
		}
	}
	return false
}

func currentWorkingDirectory() string {
	wd, err := os.Getwd()
	if err != nil {
		return ""
	}
	return wd
}

func sourceDirectory() string {
	_, file, _, ok := runtime.Caller(0)
	if !ok {
		return ""
	}
	return filepath.Dir(file)
}

const nodeAmbientTypes = `declare const process: {
  env?: Record<string, string | undefined>
  exit?: (code?: number) => never
}

declare var gc: (() => void) | undefined

declare namespace NodeJS {
  type Timeout = ReturnType<typeof setTimeout>
}

declare module 'node:fs' {
  export function mkdirSync(...args: unknown[]): unknown
}

declare module 'node:os' {
  export function tmpdir(): string
}

declare module 'node:path' {
  export function join(...parts: string[]): string
}
`

func renderJSON(value any) (string, error) {
	stream := jsoniter.NewStream(nil, 512, 2)
	if err := writeJSONValue(stream, value); err != nil {
		return "", errors.Wrap(err, "marshal TypeScript workspace JSON")
	}
	stream.WriteRaw("\n")
	if stream.Error != nil {
		return "", errors.Wrap(stream.Error, "marshal TypeScript workspace JSON")
	}
	return string(stream.Buffer()), nil
}

func writeJSONValue(stream *jsoniter.Stream, value any) error {
	switch typed := value.(type) {
	case nil:
		stream.WriteNil()
	case bool:
		stream.WriteBool(typed)
	case string:
		stream.WriteString(typed)
	case []string:
		stream.WriteArrayStart()
		for idx, item := range typed {
			if idx != 0 {
				stream.WriteMore()
			}
			stream.WriteString(item)
		}
		stream.WriteArrayEnd()
	case []any:
		stream.WriteArrayStart()
		for idx, item := range typed {
			if idx != 0 {
				stream.WriteMore()
			}
			if err := writeJSONValue(stream, item); err != nil {
				return err
			}
		}
		stream.WriteArrayEnd()
	case map[string]string:
		return writeJSONObject(stream, typed, func(value string) error {
			stream.WriteString(value)
			return nil
		})
	case map[string][]string:
		return writeJSONObject(stream, typed, func(value []string) error {
			return writeJSONValue(stream, value)
		})
	case map[string]any:
		return writeJSONObject(stream, typed, func(value any) error {
			return writeJSONValue(stream, value)
		})
	default:
		return errors.Errorf("unsupported TypeScript workspace JSON value %T", value)
	}
	return nil
}

func writeJSONObject[T any](stream *jsoniter.Stream, fields map[string]T, writeValue func(T) error) error {
	stream.WriteObjectStart()
	keys := make([]string, 0, len(fields))
	for key := range fields {
		keys = append(keys, key)
	}
	slices.Sort(keys)
	for idx, key := range keys {
		if idx != 0 {
			stream.WriteMore()
		}
		stream.WriteObjectField(key)
		if err := writeValue(fields[key]); err != nil {
			return err
		}
	}
	stream.WriteObjectEnd()
	return nil
}
