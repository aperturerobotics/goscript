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

var expectedV2ComplianceGaps = map[string]bool{
	"async_call_in_return":                true,
	"atomic_struct_field_init":            true,
	"bitwise_and_not_assignment":          true,
	"buffer_value_field_error":            true,
	"bytes":                               true,
	"chan_type_assertion":                 true,
	"constants_iota":                      true,
	"debug_marshal":                       true,
	"debug_simple":                        true,
	"destructure_trailing_comma":          true,
	"destructuring_assignment":            true,
	"embedded_interface_assertion":        true,
	"embedded_interface_null_assertion":   true,
	"filepath_walkfunc_call":              true,
	"flag_bitwise_op":                     true,
	"for_init_multi_assign":               true,
	"for_init_value_ok":                   true,
	"for_loop_infinite":                   true,
	"for_loop_multi_assign_mismatch":      true,
	"for_post_multi_assign":               true,
	"for_range":                           true,
	"function_call_variable_shadowing":    true,
	"function_signature_type":             true,
	"generics":                            true,
	"generics_interface":                  true,
	"generics_leading_int":                true,
	"go_type_assertion":                   true,
	"hex_escape_sequence":                 true,
	"if_type_assert":                      true,
	"import_interface":                    true,
	"import_type_methods":                 true,
	"index_expr_destructuring":            true,
	"index_expr_type_assertion":           true,
	"interface_async_method_call":         true,
	"interface_embedding":                 true,
	"interface_multi_param_return":        true,
	"interface_subset_cast":               true,
	"interface_type_reference":            true,
	"json_debug":                          true,
	"json_encoder_debug":                  true,
	"json_marshal_basic":                  true,
	"json_numfield":                       true,
	"json_simple":                         true,
	"json_typefields":                     true,
	"json_typefields_flow":                true,
	"json_value":                          true,
	"linkname_alias":                      true,
	"map_const_key":                       true,
	"map_value_field_access_cross_file":   true,
	"method_async_call":                   true,
	"method_async_dependency":             true,
	"method_binding":                      true,
	"method_receiver_async_paren":         true,
	"method_receiver_await_paren":         true,
	"method_receiver_call_return":         true,
	"method_receiver_paren_line":          true,
	"method_receiver_shadowing":           true,
	"method_receiver_with_call_expr":      true,
	"method_value_primitive":              true,
	"missing_package_methods_issue":       true,
	"missing_valueof_error":               true,
	"multi_return_same_type":              true,
	"named_channel_zero_value_cross_file": true,
	"named_function_type_call":            true,
	"named_return_method":                 true,
	"named_return_multiple":               true,
	"named_slice_wrapper":                 true,
	"named_struct_async_method":           true,
	"named_types_valueof":                 true,
	"nested_async_method_value":           true,
	"nil_pkg_pointer_dereference":         true,
	"nullable_function_param_call":        true,
	"os_filemode_struct":                  true,
	"package_import_context":              true,
	"package_import_csync":                true,
	"package_import_encoding_json":        true,
	"package_import_go_scanner":           true,
	"package_import_sync_atomic":          true,
	"package_var_async_method":            true,
	"path_error_constructor":              true,
	"pointer_circular_ref":                true,
	"pointer_composite_literal_untyped":   true,
	"pointer_range_loop":                  true,
	"primitive_error_type":                true,
	"promise_return_type":                 true,
	"protobuf_lite_ts":                    true,
	"range_const_reassign":                true,
	"receiver_variable":                   true,
	"redeclaration_assign":                true,
	"reflect_implements":                  true,
	"reflect_numfield":                    true,
	"reflect_struct_field":                true,
	"reserved_word_in":                    true,
	"reserved_words":                      true,
	"return_async_call":                   true,
	"select_mixed_returns":                true,
	"selector_expr_lhs_multi_assign":      true,
	"star_compound_assign":                true,
	"star_expr_destructuring":             true,
	"struct_embedding":                    true,
	"struct_embedding_bytes_buffer":       true,
	"type_conversion_interface_ptr_nil":   true,
	"type_declaration_receiver":           true,
	"type_method_primitive":               true,
	"type_separate_files":                 true,
	"util_promise":                        true,
	"variable_shadowing_scope":            true,
	"varref_deref_struct":                 true,
	"wrapper_slice_append":                true,
	"wrapper_type_args":                   true,
}
