package main

import (
	"bytes"
	"strings"
	"testing"
	"time"

	"github.com/aperturerobotics/goscript/compiler/gotest"
)

func TestRequestFromGoToolArgsMapsSupportedFlags(t *testing.T) {
	dir := t.TempDir()
	t.Chdir(dir)

	req, err := requestFromGoToolArgs([]string{
		"/tmp/pkg.test.wasm",
		"-test.v=test2json",
		"-test.run", "TestBrowser",
		"-test.count=2",
		"-test.short",
		"-test.timeout=3s",
		"-test.paniconexit0",
		"-test.parallel", "8",
		"-test.testlogfile=ignored",
	})
	if err != nil {
		t.Fatalf("parse go tool args: %v", err)
	}
	if req.Dir != dir {
		t.Fatalf("Dir = %q, want %q", req.Dir, dir)
	}
	if len(req.Patterns) != 1 || req.Patterns[0] != "." {
		t.Fatalf("Patterns = %#v, want .", req.Patterns)
	}
	if req.RuntimeBackend != gotest.RuntimeBackendBrowser {
		t.Fatalf("RuntimeBackend = %q, want browser", req.RuntimeBackend)
	}
	if !req.Verbose || req.Run != "TestBrowser" || req.Count != 2 || !req.Short || req.Timeout != 3*time.Second || !req.PanicOnExit0 {
		t.Fatalf("unexpected mapped request: %#v", req)
	}
}

func TestRequestFromGoToolArgsMapsPanicOnExitZeroFalse(t *testing.T) {
	t.Chdir(t.TempDir())

	req, err := requestFromGoToolArgs([]string{"/tmp/pkg.test.wasm", "-test.paniconexit0=false"})
	if err != nil {
		t.Fatalf("parse go tool args: %v", err)
	}
	if req.PanicOnExit0 {
		t.Fatal("expected explicit -test.paniconexit0=false to disable panic-on-exit-zero")
	}
}

func TestRequestFromGoToolArgsRejectsUnsupportedFlags(t *testing.T) {
	t.Chdir(t.TempDir())

	if _, err := requestFromGoToolArgs([]string{"/tmp/pkg.test.wasm", "-test.coverprofile=cover.out"}); err == nil {
		t.Fatal("expected unsupported flag to fail")
	} else if !strings.Contains(err.Error(), "unsupported go_js_wasm_exec flag -test.coverprofile") {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestPrintResult(t *testing.T) {
	var out bytes.Buffer
	err := printResult(&out, &gotest.Result{
		WorkDir: "/work",
		Packages: []gotest.PackageResult{{
			PackagePath: "example.test/browser",
			Action:      gotest.ActionPass,
			Output:      "browser ok",
		}},
	})
	if err != nil {
		t.Fatalf("print result: %v", err)
	}
	got := out.String()
	if !strings.Contains(got, "browser ok") || !strings.Contains(got, "ok  \texample.test/browser") {
		t.Fatalf("unexpected output:\n%s", got)
	}
}
