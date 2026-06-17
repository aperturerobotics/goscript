package tests

import (
	"bytes"
	"encoding/hex"
	"errors"
	"io"
	"maps"
	"path/filepath"
	"strings"
	"testing"

	"github.com/aperturerobotics/goscript/compiler/tsworkspace"
	"github.com/sirupsen/logrus"

	exptrace "golang.org/x/exp/trace"
)

// TestRuntimeTraceProof proves that the GoScript runtime/trace override emits a
// Go execution-trace v2 stream that the upstream Go trace reader accepts. A Go
// fixture importing runtime/trace is compiled through GoScript, run with bun,
// and its hex-encoded trace bytes are parsed by golang.org/x/exp/trace. The
// proof asserts the user task, region, and log survive the round trip. Against
// the previous no-op override (whose Start returned an error and emitted no
// bytes) this test fails; the encoder makes it pass.
func TestRuntimeTraceProof(t *testing.T) {
	workspaceDir, err := filepath.Abs("..")
	if err != nil {
		t.Fatalf("failed to resolve workspace dir: %v", err)
	}
	testDir := filepath.Join(workspaceDir, "tests", "tests", "runtime_trace_proof")

	parentModPath, err := getParentGoModulePath()
	if err != nil {
		t.Fatalf("failed to determine parent Go module path: %v", err)
	}

	log := logrus.New()
	log.SetLevel(logrus.DebugLevel)
	le := logrus.NewEntry(log)

	tempDir := PrepareTestRunDir(t, testDir)

	relGsPath, err := filepath.Rel(tempDir, filepath.Join(workspaceDir, "gs", "*"))
	if err != nil {
		t.Fatalf("failed to resolve gs path: %v", err)
	}
	relDepsPath, err := filepath.Rel(tempDir, filepath.Join(workspaceDir, "tests", "deps", "*"))
	if err != nil {
		t.Fatalf("failed to resolve deps path: %v", err)
	}

	workspace := tsworkspace.NewOwner(tempDir, workspaceDir)
	runnerTsConfig := maps.Clone(baseTsConfig)
	runnerCompilerOptions := maps.Clone(runnerTsConfig["compilerOptions"].(map[string]any))
	runnerCompilerOptions["paths"] = map[string][]string{
		"*": {"./*"},
		"@goscript/*": {
			"./output/@goscript/*",
			filepath.ToSlash(relGsPath),
			filepath.ToSlash(relDepsPath),
		},
	}
	runnerTsConfig["compilerOptions"] = runnerCompilerOptions
	if phase := workspace.WriteJSON(tsworkspace.PhaseWorkspace, "tsconfig.json", runnerTsConfig); phase.Failed() {
		t.Fatalf("failed to write runner tsconfig.json: %v", phase.Error)
	}
	if phase := workspace.EnsurePackageJSON(); phase.Failed() {
		t.Fatalf("failed to write package.json: %v", phase.Error)
	}

	outputDir := filepath.Join(tempDir, "output")
	CompileGoToTypeScript(t, parentModPath, testDir, tempDir, outputDir, le)
	tsRunner := WriteTypeScriptRunner(t, parentModPath, testDir, tempDir)

	output := strings.TrimSpace(RunTypeScriptRunner(t, workspaceDir, tempDir, tsRunner))
	if strings.HasPrefix(output, "ERROR:") {
		t.Fatalf("fixture reported an error: %s", output)
	}
	if output == "" {
		t.Fatal("fixture produced no trace bytes")
	}

	traceBytes, err := hex.DecodeString(output)
	if err != nil {
		t.Fatalf("failed to hex-decode fixture output (%d chars): %v", len(output), err)
	}

	reader, err := exptrace.NewReader(bytes.NewReader(traceBytes))
	if err != nil {
		t.Fatalf("upstream trace reader rejected the stream header: %v", err)
	}

	var (
		sawTask   bool
		sawRegion bool
		sawLog    bool
	)
	for {
		ev, err := reader.ReadEvent()
		if errors.Is(err, io.EOF) {
			break
		}
		if err != nil {
			t.Fatalf("upstream trace reader failed mid-stream: %v", err)
		}
		switch ev.Kind() {
		case exptrace.EventTaskBegin:
			if ev.Task().Type == "proof-task" {
				sawTask = true
			}
		case exptrace.EventRegionBegin:
			if ev.Region().Type == "proof-region" {
				sawRegion = true
			}
		case exptrace.EventLog:
			lg := ev.Log()
			if lg.Category == "proof-key" && lg.Message == "proof-value" {
				sawLog = true
			}
		}
	}

	if !sawTask {
		t.Error("upstream reader did not surface the proof-task user task")
	}
	if !sawRegion {
		t.Error("upstream reader did not surface the proof-region user region")
	}
	if !sawLog {
		t.Error("upstream reader did not surface the proof-key/proof-value user log")
	}
}
