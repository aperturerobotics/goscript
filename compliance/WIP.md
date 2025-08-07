# Work In Progress

- Target test: `package_import_go_parser`
- Observed: Hundreds of TS errors cascade from generated deps when importing `go/parser`.
- Most critical issue: member access on awaited call results is emitted with wrong precedence. Example from generated code:

  `await fset!.PositionFor(pos, false)!.Line`

  This tries to access `.Line` on a Promise before awaiting, leading to errors like:
  - Property 'Line' does not exist on type 'Promise<Position>'
  - 'await' expressions only allowed within async functions

  Correct emission should be:

  `(await fset!.PositionFor(pos, false))!.Line`

  i.e., property access needs to occur after awaiting the Promise result.

- Root cause:
  - `WriteSelectorExpr` writes selectors by first emitting the base expression via `WriteValueExpr(exp.X)` and then appending `!.` or `.`. When the base is a call expression that `WriteCallExpr` prefixes with `await`, we end up with `await call()!.prop`. In TypeScript, `await` has lower precedence than member access, so this parses as `await (call()!.prop)` instead of `(await call())!.prop`.

- Minimal reproducer (no go/parser):
  - A function `F()` that becomes async (e.g., contains a channel send), returns `*S` where `S` has a field `V int`.
  - Using `F().V` in `main()` triggers selector on a call-expression base. The current compiler generates `await F()!.V` which is wrong; after fix it should be `(await F())!.V`.

- Planned change:
  - In `compiler/expr-selector.go`, detect when the selector base `exp.X` is an `*ast.CallExpr`. Wrap it in parentheses when emitting the base, so that any `await` prefix produced by `WriteCallExpr` is properly grouped: `(<base>)!.`.
  - This is a general, non-test-specific fix and safe even when the call is not async.

- Implementation steps:
  1. Add parens around call-expression bases in `WriteSelectorExpr` normal path.
  2. Create new compliance test `await_selector_on_call` that reproduces the issue without importing external packages.
  3. Run the new test, iterate until green.
