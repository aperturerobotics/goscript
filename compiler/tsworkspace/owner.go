package tsworkspace

import (
	"bytes"
	"context"
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"slices"
	"time"

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
)

// Result describes one workspace file or process operation.
type Result struct {
	Phase   Phase
	Command []string
	Output  string
	Error   string
	Elapsed time.Duration
}

// Failed returns true when the operation failed.
func (r Result) Failed() bool {
	return r.Error != ""
}

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

// WriteFile writes a workspace-relative file.
func (o *Owner) WriteFile(phase Phase, name string, data string) Result {
	if o == nil || o.workDir == "" {
		return Result{Phase: phase, Error: "TypeScript workspace directory is empty"}
	}
	if err := os.MkdirAll(o.workDir, 0o755); err != nil {
		return Result{Phase: phase, Error: errors.Wrap(err, "create TypeScript workspace").Error()}
	}
	path := filepath.Join(o.workDir, name)
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
	data, err := json.MarshalIndent(value, "", "  ")
	if err != nil {
		return Result{Phase: phase, Error: errors.Wrap(err, "marshal TypeScript workspace JSON").Error()}
	}
	return o.WriteFile(phase, name, string(append(data, '\n')))
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
	for _, start := range []string{o.toolDir, o.workDir, currentWorkingDirectory()} {
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

func currentWorkingDirectory() string {
	wd, err := os.Getwd()
	if err != nil {
		return ""
	}
	return wd
}
