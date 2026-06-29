package compiler_test

import (
	"os"
	"path/filepath"
	"slices"
	"strconv"
	"strings"
	"testing"

	"github.com/pkg/errors"
	"github.com/s4wave/goscript/tests"
)

// TestCompliance runs the inherited GoScript compliance fixtures through the
// v2 compiler pipeline.
func TestCompliance(t *testing.T) {
	workspaceDir, err := os.Getwd()
	if err != nil {
		t.Fatalf("failed to get working directory: %v", err)
	}
	workspaceDir = filepath.Clean(filepath.Join(workspaceDir, ".."))

	testsDir := filepath.Join(workspaceDir, "tests", "tests")
	entries, err := os.ReadDir(testsDir)
	if err != nil {
		t.Fatalf("failed to read tests dir: %v", err)
	}

	fixtures := make([]complianceFixture, 0, len(entries))
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		testPath := filepath.Join(testsDir, entry.Name())
		goFiles, err := filepath.Glob(filepath.Join(testPath, "*.go"))
		if err != nil || len(goFiles) == 0 {
			continue
		}
		name := entry.Name()
		fixtures = append(fixtures, complianceFixture{
			name:     name,
			category: complianceCategory(name),
			path:     testPath,
		})
	}

	failures, err := loadComplianceFailureState(workspaceDir)
	if err != nil {
		t.Fatalf("failed to load compliance failure state: %v", err)
	}

	ranTests := 0
	for _, fixture := range failures.order(fixtures) {
		name := fixture.name
		wasFailing := failures.wasFailing(name)
		attempted := false
		passed := t.Run(fixture.category+"/"+name, func(t *testing.T) {
			attempted = true
			if hasComplianceMarker(t, fixture.path, "expect-fail") {
				t.Skip("expected compliance failure marker")
			}
			if expectedV2ComplianceGaps[name] {
				t.Skip("expected v2 compliance gap")
			}
			if complianceHarnessExcluded[name] {
				t.Skip("validated by a dedicated oracle test, not stdout comparison")
			}

			ranTests++
			tests.RunGoScriptTestDir(t, workspaceDir, fixture.path)
			if !t.Failed() {
				if err := os.RemoveAll(filepath.Join(fixture.path, "run")); err != nil {
					t.Logf("failed to remove run directory for %s: %v", name, err)
				}
			}
		})

		if !attempted {
			continue
		}
		if passed {
			failures.recordPass(name)
		} else {
			failures.recordFailure(name)
		}
		if err := failures.save(); err != nil {
			t.Fatalf("failed to save compliance failure state: %v", err)
		}
		if !passed && wasFailing {
			t.Fatalf("compliance fixture %s failed again; cached failure state saved to %s", name, failures.path)
		}
	}

	if ranTests == 0 {
		t.Fatal("compliance harness did not run any fixture directories")
	}
}

type complianceFixture struct {
	name     string
	category string
	path     string
}

// complianceFailureState remembers active fixture failures between local runs.
// A passing run removes the fixture so the next full run only fail-fasts on
// failures that are still reproducing.
type complianceFailureState struct {
	path     string
	failures map[string]int
}

func loadComplianceFailureState(workspaceDir string) (*complianceFailureState, error) {
	state := &complianceFailureState{
		path:     filepath.Join(workspaceDir, ".tmp", "compliance-failures.tsv"),
		failures: make(map[string]int),
	}
	data, err := os.ReadFile(state.path)
	if os.IsNotExist(err) {
		return state, nil
	}
	if err != nil {
		return nil, errors.Wrapf(err, "read %s", state.path)
	}
	for lineNum, line := range strings.Split(strings.TrimSpace(string(data)), "\n") {
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		name, countText, ok := strings.Cut(line, "\t")
		if !ok {
			return nil, errors.Errorf("parse %s line %d: expected fixture and count", state.path, lineNum+1)
		}
		count, err := strconv.Atoi(countText)
		if err != nil || count < 0 {
			return nil, errors.Errorf("parse %s line %d: invalid count %q", state.path, lineNum+1, countText)
		}
		if count > 0 {
			state.failures[name] = count
		}
	}
	return state, nil
}

func (s *complianceFailureState) order(fixtures []complianceFixture) []complianceFixture {
	ordered := slices.Clone(fixtures)
	slices.SortFunc(ordered, func(a, b complianceFixture) int {
		aFailures, bFailures := s.failures[a.name], s.failures[b.name]
		if aFailures > 0 && bFailures == 0 {
			return -1
		}
		if aFailures == 0 && bFailures > 0 {
			return 1
		}
		if aFailures != bFailures {
			return bFailures - aFailures
		}
		if a.category != b.category {
			return strings.Compare(a.category, b.category)
		}
		return strings.Compare(a.name, b.name)
	})
	return ordered
}

func (s *complianceFailureState) wasFailing(name string) bool {
	return s.failures[name] > 0
}

func (s *complianceFailureState) recordFailure(name string) {
	s.failures[name]++
}

func (s *complianceFailureState) recordPass(name string) {
	delete(s.failures, name)
}

func (s *complianceFailureState) save() error {
	if err := os.MkdirAll(filepath.Dir(s.path), 0o755); err != nil {
		return errors.Wrapf(err, "create %s", filepath.Dir(s.path))
	}
	names := make([]string, 0, len(s.failures))
	for name := range s.failures {
		names = append(names, name)
	}
	slices.SortFunc(names, func(a, b string) int {
		aFailures, bFailures := s.failures[a], s.failures[b]
		if aFailures != bFailures {
			return bFailures - aFailures
		}
		return strings.Compare(a, b)
	})

	var out strings.Builder
	out.WriteString("# fixture\tconsecutive_failures\n")
	for _, name := range names {
		out.WriteString(name)
		out.WriteByte('\t')
		out.WriteString(strconv.Itoa(s.failures[name]))
		out.WriteByte('\n')
	}
	if err := os.WriteFile(s.path, []byte(out.String()), 0o644); err != nil {
		return errors.Wrapf(err, "write %s", s.path)
	}
	return nil
}

func TestComplianceFailureState(t *testing.T) {
	state := &complianceFailureState{
		path: filepath.Join(t.TempDir(), ".tmp", "compliance-failures.tsv"),
		failures: map[string]int{
			"recent": 1,
			"stale":  3,
		},
	}

	ordered := state.order([]complianceFixture{
		{name: "clean-b", category: "core"},
		{name: "recent", category: "core"},
		{name: "stale", category: "core"},
		{name: "clean-a", category: "core"},
	})
	got := []string{ordered[0].name, ordered[1].name, ordered[2].name, ordered[3].name}
	want := []string{"stale", "recent", "clean-a", "clean-b"}
	if !slices.Equal(got, want) {
		t.Fatalf("ordered fixtures = %v, want %v", got, want)
	}

	state.recordPass("stale")
	state.recordFailure("recent")
	state.recordFailure("new")
	if err := state.save(); err != nil {
		t.Fatalf("failed to save state: %v", err)
	}
	loaded, err := loadComplianceFailureState(filepath.Dir(filepath.Dir(state.path)))
	if err != nil {
		t.Fatalf("failed to load state: %v", err)
	}
	if loaded.wasFailing("stale") {
		t.Fatal("passing fixture stayed in fail set")
	}
	if got := loaded.failures["recent"]; got != 2 {
		t.Fatalf("recent failure count = %d, want 2", got)
	}
	if got := loaded.failures["new"]; got != 1 {
		t.Fatalf("new failure count = %d, want 1", got)
	}
}

func hasComplianceMarker(t *testing.T, testPath, marker string) bool {
	t.Helper()
	_, err := os.Stat(filepath.Join(testPath, marker))
	if err == nil {
		return true
	}
	if !os.IsNotExist(err) {
		t.Fatalf("failed to check marker %s for %s: %v", marker, testPath, err)
	}
	return false
}

func complianceCategory(name string) string {
	switch {
	case strings.HasPrefix(name, "package_import"):
		return "package-import"
	case strings.Contains(name, "async") ||
		strings.Contains(name, "channel") ||
		strings.Contains(name, "goroutine") ||
		strings.Contains(name, "select") ||
		strings.Contains(name, "defer"):
		return "async"
	case strings.Contains(name, "generic"):
		return "generics"
	case strings.Contains(name, "interface") ||
		strings.Contains(name, "method") ||
		strings.Contains(name, "type_assert") ||
		strings.Contains(name, "type_switch"):
		return "interfaces"
	case strings.Contains(name, "array") ||
		strings.Contains(name, "map") ||
		strings.Contains(name, "slice") ||
		strings.Contains(name, "string"):
		return "collections"
	case strings.Contains(name, "pointer") ||
		strings.Contains(name, "struct") ||
		strings.Contains(name, "varref"):
		return "values"
	default:
		return "core"
	}
}

// complianceHarnessExcluded lists fixture directories that the shared stdout
// comparison harness must skip because a dedicated test validates them another
// way. runtime_trace_proof, runtime_trace_empty, and runtime_trace_multibatch
// emit Go execution-trace bytes whose GoScript subset is intentionally not
// byte-identical to the native runtime trace, so TestRuntimeTraceProof,
// TestRuntimeTraceEmptyCapture, and TestRuntimeTraceMultiBatch validate them
// through the upstream Go trace reader.
var complianceHarnessExcluded = map[string]bool{
	"runtime_trace_proof":      true,
	"runtime_trace_empty":      true,
	"runtime_trace_multibatch": true,
}

var expectedV2ComplianceGaps = map[string]bool{
	"bitwise_and_not_assignment":        true,
	"buffer_value_field_error":          true,
	"bytes":                             true,
	"chan_type_assertion":               true,
	"debug_marshal":                     true,
	"debug_simple":                      true,
	"filepath_walkfunc_call":            true,
	"flag_bitwise_op":                   true,
	"for_init_multi_assign":             true,
	"for_range":                         true,
	"function_call_variable_shadowing":  true,
	"function_signature_type":           true,
	"generics":                          true,
	"generics_interface":                true,
	"generics_leading_int":              true,
	"hex_escape_sequence":               true,
	"if_type_assert":                    true,
	"import_interface":                  true,
	"index_expr_type_assertion":         true,
	"interface_embedding":               true,
	"interface_type_reference":          true,
	"json_debug":                        true,
	"json_encoder_debug":                true,
	"json_numfield":                     true,
	"json_typefields":                   true,
	"json_typefields_flow":              true,
	"linkname_alias":                    true,
	"map_const_key":                     true,
	"map_value_field_access_cross_file": true,
	"method_async_dependency":           true,
	"method_binding":                    true,
	"method_receiver_async_paren":       true,
	"method_receiver_await_paren":       true,
	"method_receiver_call_return":       true,
	"method_receiver_paren_line":        true,
	"method_receiver_shadowing":         true,
	"method_receiver_with_call_expr":    true,
	"missing_valueof_error":             true,
	"multi_return_same_type":            true,
	"named_slice_wrapper":               true,
	"named_struct_async_method":         true,
	"named_types_valueof":               true,
	"nil_pkg_pointer_dereference":       true,
	"os_filemode_struct":                true,
	"path_error_constructor":            true,
	"pointer_circular_ref":              true,
	"pointer_composite_literal_untyped": true,
	"pointer_range_loop":                true,
	"promise_return_type":               true,
	"protobuf_lite_ts":                  true,
	"receiver_variable":                 true,
	"reflect_numfield":                  true,
	"reserved_words":                    true,
	"star_expr_destructuring":           true,
	"struct_embedding":                  true,
	"struct_embedding_bytes_buffer":     true,
	"type_conversion_interface_ptr_nil": true,
	"type_declaration_receiver":         true,
	"util_promise":                      true,
	"varref_deref_struct":               true,
	"wrapper_type_args":                 true,
}
