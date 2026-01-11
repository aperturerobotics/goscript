# GoScript Compiler Issue Integration Tests

This document describes the focused integration tests created to isolate and reproduce specific issues in the GoScript compiler.

## Background

These tests were created after discovering multiple issues during the transpilation of the `go/parser` package. Rather than having one large failing test, each issue has been isolated into its own focused test case.

## Test Categories

### ❌ **FAILING TESTS** (Issues To Fix)

#### `promise_return_type_issue/`
**Issue**: Null safety problems with async method calls.

**Problem**: Function parameters typed as `Type | null` but code calls methods without null checking.

**Errors**:
- `'d' is possibly 'null'`

**Marker**: `expect-fail`

#### `missing_package_methods_issue/`
**Issue**: Incomplete TypeScript implementations of Go standard library packages.

**Problem**: The `slices` package is missing methods like:
- `slices.Delete(slice, start, end)`
- `slices.BinarySearchFunc(slice, target, cmp)`

**Errors**:
- `TypeError: slices.Delete is not a function`
- `Property 'Delete' does not exist on type...`

**Marker**: `expect-fail`

#### `missing_import_issue/`
**Issue**: Complex cascading issues when transpiling advanced Go packages.

**Problem**: Using packages like `go/scanner` and `go/token` reveals multiple systemic issues:
- Async/await mismatches
- Missing type definitions (`serializedFileSet`)
- Import generation problems
- Promise handling issues

**Errors**: 81+ TypeScript compilation errors

**Marker**: `expect-fail`

## How to Use These Tests

### Running All Integration Tests
```bash
go test -v ./compiler -run "TestCompliance/(destructuring_assignment_issue|promise_return_type_issue|missing_package_methods_issue|missing_import_issue)"
```

### Running Only Failing Tests
```bash
go test -v ./compiler -run "TestCompliance/(promise_return_type_issue|missing_package_methods_issue|missing_import_issue)"
```

### Running a Specific Test
```bash
go test -timeout 30s -run ^TestCompliance/destructuring_assignment_issue$ ./compiler
```

### Expected Results
- **Passing tests**: Should execute successfully and pass all TypeScript compilation and runtime checks
- **Failing tests**: Should be skipped during execution but compile successfully (marked with `expect-fail`)

## Fixing Issues

When fixing these issues:

1. **Remove the `expect-fail` file** from the test directory
2. **Run the test** to verify it now passes
3. **Update this documentation** to move the test from "FAILING" to "PASSING"

## Test Structure

Each test follows the standard compliance test structure:
- `main.go` - Go source demonstrating the issue
- `expect-fail` - Marks test as expected to fail (for failing tests)
- `main.gs.ts` - Generated TypeScript (auto-created)
- `expected.log` - Expected output (auto-generated)

## Development Workflow

1. **Identify an issue** in the GoScript compiler
2. **Create a minimal test case** that reproduces the issue
3. **Add `expect-fail` marker** with detailed explanation
4. **Fix the underlying issue** in the compiler
5. **Remove `expect-fail`** and verify test passes
6. **Update documentation**

This approach allows for incremental improvement of the compiler while maintaining a clear record of known issues and their resolution status. 