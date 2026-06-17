package compiler_test

import (
	"os"
	"path/filepath"
	"slices"
	"strings"
	"testing"

	"github.com/aperturerobotics/goscript/tests"
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

	categories := make(map[string][]string)
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		testPath := filepath.Join(testsDir, entry.Name())
		goFiles, err := filepath.Glob(filepath.Join(testPath, "*.go"))
		if err != nil || len(goFiles) == 0 {
			continue
		}
		category := complianceCategory(entry.Name())
		categories[category] = append(categories[category], testPath)
	}

	categoryNames := make([]string, 0, len(categories))
	for category := range categories {
		categoryNames = append(categoryNames, category)
		slices.Sort(categories[category])
	}
	slices.Sort(categoryNames)

	ranTests := 0
	for _, category := range categoryNames {
		paths := categories[category]
		t.Run(category, func(t *testing.T) {
			for _, testPath := range paths {
				t.Run(filepath.Base(testPath), func(t *testing.T) {
					name := filepath.Base(testPath)
					if hasComplianceMarker(t, testPath, "expect-fail") {
						t.Skip("expected compliance failure marker")
					}
					if expectedV2ComplianceGaps[name] {
						t.Skip("expected v2 compliance gap")
					}
					if complianceHarnessExcluded[name] {
						t.Skip("validated by a dedicated oracle test, not stdout comparison")
					}

					ranTests++
					tests.RunGoScriptTestDir(t, workspaceDir, testPath)
					if !t.Failed() {
						if err := os.RemoveAll(filepath.Join(testPath, "run")); err != nil {
							t.Logf("failed to remove run directory for %s: %v", name, err)
						}
					}
				})
			}
		})
	}

	if ranTests == 0 {
		t.Fatal("compliance harness did not run any fixture directories")
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
