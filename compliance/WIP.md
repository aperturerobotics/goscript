# Async Propagation Bug - missing_import_issue

## Current Error

`errors.gs.ts:132` - `ErrorList.Error()` method has `await fmt.Sprintf()` but the function itself isn't marked as `async`.

## Key Finding: The Paradox

**Test Results:**

- `TestIsCallExprAsyncWithFmtSprintf`: ✅ PASS - `isCallExprAsync(fmt.Sprintf)` correctly returns `false`
- When we create a new Analysis and load metadata, fmt.Sprintf is NOT in MethodAsyncStatus

**The Paradox:**

- The compiler's `isCallExprAsync()` function correctly identifies `fmt.Sprintf` as synchronous
- Yet the generated code still has `await fmt.Sprintf(...)`

## New Theory: Timing Issue with MethodAsyncStatus

**Hypothesis:** During multi-package compilation (main + go/token + go/scanner), something is adding `fmt.Sprintf` to `MethodAsyncStatus` as async.

Possible scenarios:

1. **Analysis propagation bug**: When analyzing `go/scanner.ErrorList.Error()`, the analysis might incorrectly mark `fmt.Sprintf` as async
2. **Multiple Analysis instances**: Different Analysis instances might be used during analysis vs code generation
3. **Side effect during analysis**: The act of analyzing methods that call `fmt.Sprintf` might be modifying `MethodAsyncStatus`

## Code Flow

For `fmt.Sprintf(...)` where `exp.Fun` is `*ast.SelectorExpr`:

1. `WriteCallExpr()` line 89-98: Check for type conversions/wrapper methods
2. Line 102: `writeAsyncCallIfNeeded(exp)` is called
3. This calls `isCallExprAsync(exp)`
4. For selector expression with package identifier (fmt.Sprintf):
   - Line 54-60 in `expr-call-async.go`: Detects it's a package-level function
   - Line 58: Returns `c.analysis.IsMethodAsync(pkgPath, "", methodName)`
5. `IsMethodAsync` checks `MethodAsyncStatus[{PackagePath: "fmt", ReceiverType: "", MethodName: "Sprintf"}]`
6. If not found, returns `false`

**The question:** Is something adding fmt.Sprintf to MethodAsyncStatus between analysis and code generation?

## Next Diagnostic Step

Need to check if `fmt.Sprintf` is in `MethodAsyncStatus` during the ACTUAL compliance test compilation, not just in isolated unit tests.
