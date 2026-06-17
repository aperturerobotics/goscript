package compiler

import (
	"context"
	"os"
	"path/filepath"
	"testing"
	"time"
)

// benchDependencyPatterns is a representative existing GoScript dependency
// package graph: real util packages whose closure pulls in generics, channels,
// sync primitives, and context wiring, so the per-stage attribution reflects a
// realistic compile rather than a toy fixture.
var benchDependencyPatterns = []string{
	"github.com/aperturerobotics/util/broadcast",
	"github.com/aperturerobotics/util/keyed",
	"github.com/aperturerobotics/util/ccontainer",
	"github.com/aperturerobotics/util/refcount",
	"github.com/aperturerobotics/util/routine",
}

// BenchmarkCompilePipelineStages runs the full CompileService pipeline over a
// representative existing dependency package graph and attributes wall time to
// each stage owner: package-graph load, semantic-model build, lowering, and
// TypeScript emit. It reports per-stage milliseconds-per-op metrics so a single
// run names the dominant compile-time stage. Service construction (which builds
// the runtime contract owner) is measured once as serviceinit-ms because the
// runtime contract is static setup, not a per-package stage. Emit is measured
// via EmitToMemory to isolate code-generation cost from output disk writes.
func BenchmarkCompilePipelineStages(b *testing.B) {
	moduleRoot := benchModuleRoot(b)
	outputPath := b.TempDir()
	req := &CompileRequest{
		Dir:            moduleRoot,
		OutputPath:     outputPath,
		Patterns:       benchDependencyPatterns,
		DependencyMode: DependencyModeAll,
	}

	// Resolve the dependency graph once outside the timer to confirm the
	// patterns load cleanly and fail fast before measuring.
	if _, diagnostics := NewCompileService().PackageGraphOwner().Load(context.Background(), req); diagnosticsHaveErrors(diagnostics) {
		b.Fatalf("load representative dependency graph: %v", diagnostics)
	}

	var serviceInit, graphLoad, semantic, lowering, emit time.Duration
	loweringOpts := LoweringOptions{
		SourceRoot:  protobufTypeScriptBindingRoot(req.Dir),
		DisplayRoot: req.Dir,
		OutputPath:  req.OutputPath,
	}

	b.ReportAllocs()
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		start := time.Now()
		service := NewCompileService()
		serviceInit += time.Since(start)

		start = time.Now()
		graph, graphDiagnostics := service.PackageGraphOwner().Load(context.Background(), req)
		graphLoad += time.Since(start)
		if diagnosticsHaveErrors(graphDiagnostics) {
			b.Fatalf("graph load: %v", graphDiagnostics)
		}

		start = time.Now()
		model, semanticDiagnostics := service.SemanticModelOwner().Build(context.Background(), graph)
		semantic += time.Since(start)
		if diagnosticsHaveErrors(semanticDiagnostics) {
			b.Fatalf("semantic build: %v", semanticDiagnostics)
		}

		start = time.Now()
		program, loweringDiagnostics := service.LoweringOwner().Build(context.Background(), model, loweringOpts)
		lowering += time.Since(start)
		if diagnosticsHaveErrors(loweringDiagnostics) {
			b.Fatalf("lowering: %v", loweringDiagnostics)
		}

		start = time.Now()
		_, emitDiagnostics := service.TypeScriptEmitOwner().EmitToMemory(context.Background(), program)
		emit += time.Since(start)
		if diagnosticsHaveErrors(emitDiagnostics) {
			b.Fatalf("emit: %v", emitDiagnostics)
		}
	}
	b.StopTimer()

	perOpMs := func(total time.Duration) float64 {
		return float64(total.Nanoseconds()) / float64(b.N) / 1e6
	}
	b.ReportMetric(perOpMs(serviceInit), "serviceinit-ms/op")
	b.ReportMetric(perOpMs(graphLoad), "graphload-ms/op")
	b.ReportMetric(perOpMs(semantic), "semantic-ms/op")
	b.ReportMetric(perOpMs(lowering), "lowering-ms/op")
	b.ReportMetric(perOpMs(emit), "emit-ms/op")
}

// benchModuleRoot walks up from the test working directory to the module root
// that owns go.mod, so the bench loads util packages in the GoScript module's
// own dependency context (resolved go.sum and module cache) rather than a
// synthetic temp module.
func benchModuleRoot(tb testing.TB) string {
	tb.Helper()
	dir, err := os.Getwd()
	if err != nil {
		tb.Fatalf("getwd: %v", err)
	}
	for {
		if _, err := os.Stat(filepath.Join(dir, "go.mod")); err == nil {
			return dir
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			tb.Fatal("module root with go.mod not found above test working directory")
		}
		dir = parent
	}
}
