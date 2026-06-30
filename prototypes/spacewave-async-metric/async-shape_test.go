package asyncmetric

import (
	"bytes"
	"context"
	"crypto/sha256"
	"encoding/hex"
	"hash"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"
	"testing"

	"github.com/pkg/errors"
	"github.com/s4wave/goscript/compiler"
	_ "github.com/s4wave/spacewave/core/goscriptbench"
)

var spacewaveCorePatterns = []string{
	"./core/resource/root/controller",
	"./core/resource/listener",
	"./core/session/controller",
	"./core/provider/local",
	"./core/provider/spacewave",
	"./core/space/sobject",
	"./core/sobject/world/engine",
	"./core/space/world/optypes",
	"./core/plugin/space",
	"./core/space/http/download",
	"./core/space/http/export",
	"./db/blocktype/controller-factory",
	"github.com/s4wave/spacewave/db/object/peer",
}

type asyncShapeStats struct {
	files             int
	bytes             int64
	asyncFunctions    int
	awaitTokens       int
	returnAwaitTokens int
	awaitUsingTokens  int
	treeHash          string
}

func TestAsyncShapeStatsCountTokens(t *testing.T) {
	root := t.TempDir()
	writeFile(t, root, "a.ts", "async function a() {\n  return await b()\n}\n")
	writeFile(t, root, "b.ts", "const b = async () => {\n  await using cleanup = c();\n  await d();\n}\n")

	stats, err := collectAsyncShapeStats(root)
	if err != nil {
		t.Fatal(err)
	}
	if stats.files != 2 {
		t.Fatalf("files = %d, want 2", stats.files)
	}
	if stats.asyncFunctions != 2 {
		t.Fatalf("asyncFunctions = %d, want 2", stats.asyncFunctions)
	}
	if stats.awaitTokens != 3 {
		t.Fatalf("awaitTokens = %d, want 3", stats.awaitTokens)
	}
	if stats.returnAwaitTokens != 1 {
		t.Fatalf("returnAwaitTokens = %d, want 1", stats.returnAwaitTokens)
	}
	if stats.awaitUsingTokens != 1 {
		t.Fatalf("awaitUsingTokens = %d, want 1", stats.awaitUsingTokens)
	}
}

func BenchmarkSpacewaveCoreAsyncShape(b *testing.B) {
	spacewaveDir := spacewaveRepoDir(b)
	for i := 0; i < b.N; i++ {
		out := filepath.Join(b.TempDir(), "out")
		compileSpacewaveCore(b, spacewaveDir, out)

		stats, err := collectAsyncShapeStats(out)
		if err != nil {
			b.Fatal(err)
		}
		b.ReportMetric(float64(stats.files), "files/op")
		b.ReportMetric(float64(stats.bytes)/(1024*1024), "MiB/op")
		b.ReportMetric(float64(stats.asyncFunctions), "async_fns/op")
		b.ReportMetric(float64(stats.awaitTokens), "awaits/op")
		b.ReportMetric(float64(stats.returnAwaitTokens), "return_awaits/op")
		b.ReportMetric(float64(stats.awaitUsingTokens), "await_using/op")
		b.Logf("tree_hash=%s", stats.treeHash)
	}
}

func compileSpacewaveCore(tb testing.TB, spacewaveDir string, out string) {
	tb.Helper()
	comp, err := compiler.NewCompiler(&compiler.Config{
		Dir:             spacewaveDir,
		OutputPath:      out,
		BuildFlags:      []string{"-tags=goscript,skip_e2e,purego"},
		AllDependencies: true,
	}, nil, nil)
	if err != nil {
		tb.Fatal(err)
	}
	if _, err := comp.CompilePackages(context.Background(), spacewaveCorePatterns...); err != nil {
		tb.Fatal(err)
	}
}

func spacewaveRepoDir(tb testing.TB) string {
	tb.Helper()
	if dir := strings.TrimSpace(os.Getenv("SPACEWAVE_REPO")); dir != "" {
		return mustAbsDir(tb, dir)
	}

	cmd := exec.Command("go", "list", "-m", "-f", "{{.Dir}}", "github.com/s4wave/spacewave")
	cmd.Dir = moduleDir(tb)
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	if err := cmd.Run(); err != nil {
		tb.Fatalf("resolve github.com/s4wave/spacewave module dir: %v\nstderr:\n%s", err, stderr.String())
	}
	return mustAbsDir(tb, strings.TrimSpace(stdout.String()))
}

func moduleDir(tb testing.TB) string {
	tb.Helper()
	dir, err := os.Getwd()
	if err != nil {
		tb.Fatal(err)
	}
	for {
		if _, err := os.Stat(filepath.Join(dir, "go.mod")); err == nil {
			return dir
		}
		next := filepath.Dir(dir)
		if next == dir {
			tb.Fatal("module root with go.mod not found")
		}
		dir = next
	}
}

func mustAbsDir(tb testing.TB, dir string) string {
	tb.Helper()
	abs, err := filepath.Abs(dir)
	if err != nil {
		tb.Fatal(err)
	}
	info, err := os.Stat(abs)
	if err != nil {
		tb.Fatal(err)
	}
	if !info.IsDir() {
		tb.Fatalf("%s is not a directory", abs)
	}
	return abs
}

func collectAsyncShapeStats(root string) (*asyncShapeStats, error) {
	if strings.TrimSpace(root) == "" {
		return nil, errors.New("empty output root")
	}
	stats := &asyncShapeStats{}
	h := sha256.New()
	err := filepath.WalkDir(root, func(path string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if entry.IsDir() {
			return nil
		}
		info, err := entry.Info()
		if err != nil {
			return err
		}
		content, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		rel, err := filepath.Rel(root, path)
		if err != nil {
			return err
		}

		stats.files++
		stats.bytes += info.Size()
		stats.asyncFunctions += countAsyncFunctions(content)
		stats.awaitTokens += bytes.Count(content, []byte("await"))
		stats.returnAwaitTokens += bytes.Count(content, []byte("return await"))
		stats.awaitUsingTokens += bytes.Count(content, []byte("await using"))
		writeHashPart(h, []byte(filepath.ToSlash(rel)))
		writeHashPart(h, content)
		return nil
	})
	if err != nil {
		return nil, err
	}
	stats.treeHash = hex.EncodeToString(h.Sum(nil))
	return stats, nil
}

func countAsyncFunctions(content []byte) int {
	return bytes.Count(content, []byte("async function")) + bytes.Count(content, []byte("async ("))
}

func writeFile(tb testing.TB, root string, rel string, content string) {
	tb.Helper()
	path := filepath.Join(root, filepath.FromSlash(rel))
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		tb.Fatal(err)
	}
	if err := os.WriteFile(path, []byte(content), 0o644); err != nil {
		tb.Fatal(err)
	}
}

func writeHashPart(h hash.Hash, data []byte) {
	_, _ = h.Write(strconv.AppendInt(nil, int64(len(data)), 10))
	_, _ = h.Write([]byte{0})
	_, _ = h.Write(data)
	_, _ = h.Write([]byte{0})
}
