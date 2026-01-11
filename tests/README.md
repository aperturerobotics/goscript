# GoScript Compliance Tests

The compliance tests verify that Go code can be correctly transpiled to TypeScript and produce the same output as the original Go code.

## Test Structure

Each compliance test is a directory under `tests/tests/` containing:

**Core Files:**
- **`*.go`** - Go source code to be transpiled
- **`*.gs.ts`** - Generated TypeScript files (auto-created, do not edit manually)
- **`expected.log`** - Expected output when running the code (auto-generated from Go if missing)
- **`actual.log`** - Actual output from TypeScript (created when tests fail)

**Configuration Files (all optional):**
- **`packages`** - List of packages to compile (one per line, supports comments with #)
- **`skip-test`** - Skip this test entirely
- **`expect-fail`** - Test compilation but skip execution
- **`skip-typecheck`** - Skip TypeScript type checking
- **`expect-typecheck-fail`** - Expect TypeScript type checking to fail
- **`no-all-deps`** - Disable automatic dependency compilation

**Generated Files:**
- **`index.ts`** - Package index files (auto-generated)
- **`tsconfig.json`** - TypeScript configuration for type checking (auto-generated)

## Test Lifecycle

When a compliance test runs, the following steps occur:

### 1. Preparation
- Creates a temporary `run/` directory in the test folder
- Sets up TypeScript configuration files
- Determines which packages need to be compiled

### 2. Compilation
- Compiles Go source files to TypeScript using the GoScript compiler
- Outputs to `run/output/@goscript/MODULE_PATH/tests/tests/TEST_NAME/`
- Copies generated `.gs.ts` and `index.ts` files back to the test directory
- Adds header comments to `.gs.ts` files indicating they're auto-generated
- Copies dependency packages to `tests/deps/` for git tracking

### 3. Execution (unless `expect-fail` present)
- Generates a `runner.ts` script that imports and executes the main function
- Runs the TypeScript code using `bun`
- Captures stdout output

### 4. Comparison (unless `expect-fail` present)
- Compares TypeScript output with `expected.log`
- If `expected.log` doesn't exist, generates it by running `go run ./`
- Creates `actual.log` if outputs differ

### 5. Type Checking (unless skipped)
- Generates a `tsconfig.json` for type checking the generated files
- Runs `tsc` to verify TypeScript types are correct
- Uses path mapping to resolve `@goscript/*` imports

## Multi-Package Tests

Tests can contain multiple packages in subdirectories:
```
test_name/
├── main.go          # Main package
├── subpkg/
│   └── helper.go    # Subpackage
└── packages         # Optional: explicit package list
```

The compiler auto-detects packages by scanning for `.go` files, or uses the `packages` file if present.

**`packages` file format:**
```
./
./subpkg
./another/package
# Lines starting with # are comments
```

## Dependency Management

The test system automatically handles dependencies:

1. **Builtin packages** - Handwritten TypeScript in `gs/` directory
2. **Test dependencies** - Automatically compiled and cached in `tests/deps/`
3. **Path mapping** - TypeScript imports resolved via `@goscript/*` paths

Dependencies are copied to `tests/deps/` to ensure they're tracked in git and available for type checking.

## Running Tests

### All compliance tests

```bash
go test -v ./compiler
```

### Specific test

```bash
go test -timeout 30s -run ^TestCompliance/test_name$ ./compiler
```
