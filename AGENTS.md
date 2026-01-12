# Agent Rules for GoScript

This document contains guidelines and rules for AI agents working on the GoScript project.

## IMPORTANT

Fix anything that you come across in the project while working that violates any of these guidelines as you encounter it.

**CRITICAL: When asked to update AGENTS.md:**

- ALWAYS read the ENTIRE file first before making edits
- Check for duplicate information across sections
- Condense and consolidate duplicates into a single authoritative section
- Ensure guidelines are clear and non-contradictory
- NEVER run the vite dev server or anything that listens on any port yourself! Ask the user to do it!

Remember to always delete dead code when changing things - for example if you changed something and a function is no longer used anywhere, delete that function.

### General Rules

- Try to keep things in one function unless composable or reusable
- PREFER one exported struct per `.go` file (file named after the struct, e.g., `type-info.go` for `TypeInfo`)
  - Multiple unexported (internal) structs in the same file are acceptable
  - Constants and type aliases can be co-located with the struct that uses them
- DO NOT use `else` statements unless necessary
- DO NOT make git commits
- AVOID `else` statements or "fallback" cases
- PREFER single word variable names where possible
- DO NOT maintain backwards compatibility - this is an experimental project
- Remove any "for backwards compatibility" comments and fallback logic
- NEVER hardcode things: examples include function names, builtins, etc.
- Actively try to improve the codebase to conform to the above when the opportunity arises
- Go standard library sources are located at "go env GOROOT" (shell command)
- Leverage adding more tests, for example in `compiler/analysis_test.go`, instead of debug logging, for diagnosing issues or investigating hypotheses. If the new test case is temporary and you plan to remove it later, add a `tmp_test.go` file or similar to keep things separated.
- AVOID type arguments unless necessary (prefer type inference)
- When making Git commits use the existing commit message pattern and Linux-kernel style commit message bodies.
- When you would normally add a new compliance test check if a very-similar compliance test already exists and if so extend that one instead. For example testing another function in the same package.

## Project Overview

GoScript is an experimental Go to TypeScript transpiler that enables developers to convert high-level Go code into maintainable TypeScript. It translates Go constructs—such as structs, functions, and pointer semantics—into idiomatic TypeScript code while preserving Go's value semantics and type safety. It is designed to bridge the gap between the robust type system of Go and the flexible ecosystem of TypeScript.

**This is an experimental project** - we do not maintain backwards compatibility and prioritize simplicity and correctness over legacy support. You may sometimes encounter a problem that requires a complete re-design or re-think or re-architecting of an aspect of goscript, which is perfectly okay, in this case write a design to `tests/WIP.md` and think it through extensively before performing your refactor. It's perfectly OK to delete large swaths of code as needed. Focus on correctness.

If you want to overwrite WIP.md you must `rm` it first.

The GoScript runtime, located in `gs/builtin/builtin.ts`, provides necessary helper functions and is imported in generated code using the `@goscript/builtin` alias.

**Output Style**: Generated TypeScript should not use semicolons and should always focus on code clarity and correctness.

**Philosophy**: Follow Rick Rubin's concept of being both an engineer and a reducer (not always a producer) by focusing on the shortest, most straightforward solution that is correct.

## Compliance Testing Workflow

When working on compliance tests:

1. **Test Location**: Compliance tests are located at `./tests/tests/{testname}/testname.go` with a package main and using `println()` only for output, trying to not import anything.

2. **Running Tests**: To run a specific test, use this template:

   ```bash
   go test -timeout 60s -run ^TestCompliance/if_statement$ ./compiler
   ```

   To run the full compliance test suite:

   ```bash
   go test -timeout 10m ./compiler
   ```

3. **Analysis Process**:
   - Run the compliance test to check if it passes
   - If not, review the output to see why
   - Deeply consider the generated TypeScript from the source Go code
   - Think about what the correct TypeScript output would look like with as minimal of a change as possible
   - **If the test is too complex** (many cascading errors, large dependencies, or unclear root cause):
     - Create a new, simpler compliance test that isolates a specific subset of the problem
     - Name it descriptively (e.g., `method_async_call` for async method invocation issues)
     - Focus on reproducing just one aspect of the failure in minimal code
     - Fix the isolated test first, then return to the original complex test

4. **Implementation Workflow**:
   - Review the code under `compiler/*.go` to determine what needs to be changed
   - Write your analysis and info about the task at hand to `tests/WIP.md` (overwrite any existing contents)
   - Apply the planned changes to the `compiler/` code
   - Run the integration test again
   - Repeat: update compiler code and/or `tests/WIP.md` until the compliance test passes successfully
   - If you make two or more edits and the test still does not pass, ask the user how to proceed providing several options
   - After fixing a specific test, re-run the top level compliance test to verify everything works properly: `go test -v ./compiler`

Once the issue is fixed and the compliance test passes you may delete WIP.md without updating it with a final summary.

NOTE: `./tests/deps/` contains library dependencies compiled by the goscript compiler! do not edit! they will be re-generated when running the tests.

NOTE: to avoid overwhelming yourself with too much output, run the tests first without -v, grep for FAIL, then run specifically the failing tests with -v.

## Design Patterns & Code Style

### Core Principles

1. **Follow Existing Patterns**: Always reference `/design/DESIGN.md` for design details and existing code patterns

2. **Function Naming Convention**: When writing functions that convert Go AST to TypeScript, name them to match the AST type:
   - For `*ast.FuncDecl`, use `WriteFuncDecl`
   - Try to make a 1-1 match between AST type and function name
   - Avoid hiding logic in unexported functions

3. **Function Organization**:
   - Avoid splitting functions unless:
     - The logic is reused elsewhere
     - The function becomes excessively long and complex
     - Doing so adheres to existing patterns in the codebase

4. **Implementation Completeness**:
   - Avoid leaving undecided implementation details in the code
   - Make a decision and add a comment explaining the choice if necessary

5. **Struct Field Policy**:
   - You **may not** add new fields to `GoToTSCompiler`
   - You **may** add new fields to `Analysis` if you are adding ahead-of-time analysis only

## Linting and Code Quality

When working with golangci-lint:

1. **Running the Linter**: Use `bun lint` to run the linter, `bun lint:go` for go and `bun lint:js` for js
2. **Fixing Errors**: Address linter errors in the affected code files
3. **Iterating**: Repeat the linting process until no errors remain
4. **Ignoring Warnings**: You can ignore linter errors with inline comments when the warning is unnecessarily strict:
   ```go
   defer f.Close() //nolint:errcheck
   ```
   This is appropriate for cases like deferring Close without checking the error return value, which can often be safely ignored.

Make sure that `bun test` and `bun lint` both pass before suggesting a task is complete.

## Specialized Workflows

### Squash Commits

When squashing commits on the `wip` branch:

1. Verify we are on the `wip` branch; if not, ask the user what to do
2. Note the current branch name and HEAD commit hash
3. Verify the git worktree is clean; if not, ask the user what to do
4. Check out `origin/master` with `--detach`
5. Run `git merge --squash COMMIT_HASH` where COMMIT_HASH is the noted hash
6. Ask the user if we are done or if we should merge this to master
7. If merging to master: `git checkout master` then `git cherry-pick HEAD@{1}`

### Update Design from Integration Tests

When updating design documentation from integration tests:

1. Read `design/DESIGN.md` for the initial state
2. List available tests with `ls ./tests/tests/*.gs.ts` (each .gs.ts corresponds to a .go file)
3. Read the .go and .gs.ts files
4. Update `design/DESIGN.md` with any previously undocumented behavior from the tests
5. Skip integration tests that are obviously already represented in the design

### Update Design Documentation

When updating design documents:

1. Receive instructions from the user on design changes
2. Consult the Go specification at `design/GO_SPECIFICATION.html` as needed
3. Update `design/DESIGN.md` with the finalized design changes
4. Use `design/WIP.md` for work-in-progress notes or drafts if necessary
5. Ensure updates accurately reflect the user's instructions and align with project goals
6. Note any divergences from the Go specification clearly
7. Follow any already-noted divergences carefully

### Eliminate Dead Code

When eliminating dead code if requested by the user:

1. Receive instructions from the user
2. Run `golangci-lint run --no-config --enable-only=unused` (exactly this command)
3. Remove any unused code in `./compiler` ignoring ./tests
4. Any line which is unused in `./tests` add a `//nolint:unused` comment at the end.
5. Rerun the golangci-lint command to ensure we got everything.

## Website Playground

The playground at `website/` compiles Go to TypeScript using a WASM build of the compiler. **It only supports single-file compilation without external dependencies.**

- Playground examples are defined in `scripts/generate-examples.ts` (the `CURATED_EXAMPLES` array)
- Do NOT add examples that import packages beyond `@goscript/builtin` (e.g., `encoding/json`) until dependency bundling is implemented
- Run `bun run scripts/generate-examples.ts` then `cd website && bun run build` to update

## Comments

When adding comments to functions, structs, or files:

- Use the format: `// FunctionName does something specific.`
- Start with the function/struct/type name followed by a verb
- End with a period
- Keep it concise and descriptive

Example:

```go
// WriteFuncDecl converts a Go function declaration to TypeScript.
func (c *GoToTSCompiler) WriteFuncDecl(decl *ast.FuncDecl) error {
  ...
}
```

### Go Type Assertions

When using type assertion syntax in Go, add a comment line just before:

```go
// _ is a type assertion
var _ SomeInterface = (*SomeStruct)(nil)
```

This verifies at compile-time that `SomeStruct` implements `SomeInterface`.
