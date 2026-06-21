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

	"github.com/s4wave/goscript/compiler/tsworkspace"
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
	traceBytes := compileRunTraceFixture(t, "runtime_trace_proof")

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

// TestRuntimeTraceEmptyCapture proves that a Start/Stop with no user task,
// region, or log still emits a complete single-generation trace v2 stream the
// upstream reader walks to EOF without error. This is the GoScript browser
// capture scenario, where the absent goroutine scheduler records no events; the
// encoder must still bind a running P and G so tracetool accepts the bytes.
func TestRuntimeTraceEmptyCapture(t *testing.T) {
	traceBytes := compileRunTraceFixture(t, "runtime_trace_empty")

	reader, err := exptrace.NewReader(bytes.NewReader(traceBytes))
	if err != nil {
		t.Fatalf("upstream trace reader rejected the empty-capture header: %v", err)
	}
	for {
		_, err := reader.ReadEvent()
		if errors.Is(err, io.EOF) {
			break
		}
		if err != nil {
			t.Fatalf("upstream trace reader failed on the empty capture: %v", err)
		}
	}
}

// TestRuntimeTraceMultiBatch proves that a capture large enough to overflow the
// trace v2 64 KiB per-batch ceiling splits across multiple string and event
// batches the upstream reader still walks to EOF. The fixture records thousands
// of distinct user tasks and logs, so a single-batch encoder would emit a batch
// the reader rejects with "invalid batch size". The proof asserts the reader
// surfaces every task and log across the multi-batch stream.
func TestRuntimeTraceMultiBatch(t *testing.T) {
	const eventCount = 4000

	traceBytes := compileRunTraceFixture(t, "runtime_trace_multibatch")

	reader, err := exptrace.NewReader(bytes.NewReader(traceBytes))
	if err != nil {
		t.Fatalf("upstream trace reader rejected the multi-batch header: %v", err)
	}

	var (
		tasks int
		logs  int
	)
	for {
		ev, err := reader.ReadEvent()
		if errors.Is(err, io.EOF) {
			break
		}
		if err != nil {
			t.Fatalf("upstream trace reader failed mid multi-batch stream: %v", err)
		}
		switch ev.Kind() {
		case exptrace.EventTaskBegin:
			if strings.HasPrefix(ev.Task().Type, "multibatch-task-") {
				tasks++
			}
		case exptrace.EventLog:
			if ev.Log().Category == "multibatch-key" {
				logs++
			}
		}
	}

	if tasks != eventCount {
		t.Errorf("expected %d multibatch tasks, reader surfaced %d", eventCount, tasks)
	}
	if logs != eventCount {
		t.Errorf("expected %d multibatch logs, reader surfaced %d", eventCount, logs)
	}
}

// compileRunTraceFixture compiles the named tests/tests fixture through
// GoScript, runs it with bun, and returns its decoded trace bytes. The fixture
// hex-encodes the trace stream to stdout so it survives the bun runner.
func compileRunTraceFixture(t *testing.T, fixtureName string) []byte {
	t.Helper()

	workspaceDir, err := filepath.Abs("..")
	if err != nil {
		t.Fatalf("failed to resolve workspace dir: %v", err)
	}
	testDir := filepath.Join(workspaceDir, "tests", "tests", fixtureName)

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
	return traceBytes
}
