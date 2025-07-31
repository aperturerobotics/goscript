# Review of compiler/ for heuristics, hard-coding, and edge cases

This document reports areas in the compiler that currently rely on heuristics or hard-coded assumptions, or that have obvious mistakes/edge cases. For each, I outline why it’s problematic and suggest concrete, analysis-driven improvements using AST/types or package metadata where applicable.

Summary of key issues

- Protobuf handling: heuristic detection and hard-coded exports/imports.
- Selector expression null-assertion and receiver-alias handling: conservative and partially heuristic.
- Range over string uses hard-coded index variable name.
- Generic string conversions: heuristic handling of constraints.
- Primitive and token mappings: potential correctness issues (bitwise XOR_ASSIGN, ellipsis handling, bigint types).
- Shadowing/type assertion code paths: generally analysis-driven but need validation for all LHS forms.
- Misc: some comments indicate assumptions that may miss edge cases.

Detailed findings and recommendations

1) Protobuf integration relies on name-based heuristics and hard-coded exports/imports

Files: compiler/protobuf.go, compiler/compiler.go

Findings
- Protobuf type detection uses a heuristic: treat a named type as protobuf if its name ends with "Msg" and there is any .pb.go in the package.
  Evidence:
  - compiler/protobuf.go: lines 20–37. The comment explicitly says “simple heuristic.”
  - compiler/compiler.go: lines 641–667 similarly filter TypeCalls by suffix “Msg” and presence of any .pb.go.
- Export/import generation is hard-coded to ExampleMsg and protobufPackage.
  Evidence:
  - compiler/protobuf.go: writeProtobufExports and addProtobufImports use hard-coded identifiers and don’t parse .pb.ts for actual exports.

Why this is risky
- Real projects don’t guarantee type names end with “Msg”. Multiple messages, enums, and services can be present.
- Packages may have .pb.go without .pb.ts, or vice versa; names differ across generators.
- Hard-coded exports (ExampleMsg) will silently miscompile other packages.

Recommendations
- Replace suffix-based detection with actual source-based analysis:
  - When encountering a named type T in current package with a corresponding .pb.go file, scan for its Go file/annotations or import path to determine if it’s protobuf-generated (e.g., presence of generated comments, package path of generator imports, or types that implement proto.Message for gogo/proto APIs). Prefer types info: check if the type implements a known protobuf interface in the loaded dependencies.
  - For import/exports, parse the .pb.ts file to extract exported symbols. Options:
    - Lightweight: read the .pb.ts and regex for `export (class|interface|const|function) <Name>` and `export { ... }` aggregates. Build the import/export list dynamically.
    - Better: maintain a small parser or rely on TS compiler API if available offline; minimally, scan for `export class` names and `export const protobufPackage`.
- When emitting method translations (Marshal/Unmarshal), resolve the actual TS symbol to reference, not just the Go type name; map Go named type to TS export based on the parsed .pb.ts.
- In addProtobufImports, import the set of discovered exports instead of hard-coding `ExampleMsg`.

2) Selector expression null-assertion logic and receiver alias detection

File: compiler/expr-selector.go

Findings
- The code adds non-null assertions (`!.`) for selector base types that are pointers, interfaces, or calls, but skips when it heuristically detects a “receiver alias.” The current `isReceiverAlias` function always returns false as a conservative fallback.
  Evidence: lines 129–156 and 257–295. Comment suggests replacing heuristics with proper analysis; currently it disables receiver alias detection entirely.
- There is a special-case handling for dereferenced pointer-to-struct selectors, attempting to decide whether to append an extra `.value`; relies on `NeedsVarRefAccess(obj)` which is analysis-driven, but the outer logic is complex and potentially brittle.

Why this is risky
- Over-asserting null on safe receivers adds unnecessary operators and may mask logic.
- Under-asserting can change semantics (missing panic on nil deref). The current blanket conservative path is safe but unoptimized.

Recommendations
- Implement robust receiver-alias detection in Analysis:
  - Track when the compiler emits `const <alias> = this` for methods translated into classes, and record the alias symbol in NodeData.IdentifierMapping or a dedicated map.
  - Propagate this info so `isReceiverAlias` can consult analysis instead of guessing.
- For null assertion decisions, use types.Info on the selector base and flow analysis where available:
  - If base is a local variable proven non-nil in dominator region (e.g., guarded by `if x != nil`), we could optionally elide `!`. This is an optimization and can be added later.

3) for-range over string uses wrong index variable name

File: compiler/stmt-range.go

Findings
- In writeStringRange, the value binding uses `_runes[i]` while the loop index variable might not be `i`.
  Evidence: line 198 has a TODO noting it should use `indexVarName`.

Why this is a correctness bug
- If the user’s index variable isn’t `i`, generated code references an undefined `i`.

Recommendation
- Replace the hard-coded `i` with the computed `indexVarName` when indexing `_runes`.

4) Generic string conversions use heuristic constraint handling

File: compiler/expr-call-type-conversion.go

Findings
- string(T) for generic T that could be `string | []byte` is handled by a heuristic assuming any type parameter with a constraint needs a generic helper.
  Evidence: lines 181–195, with comments noting the heuristic.

Why this is risky
- Over-applies the helper to unconstrained type params, potentially generating incorrect or inefficient code.

Recommendations
- Inspect the constraint via types.Interface and its terms to detect precisely whether the union includes string and/or []byte:
  - Walk embedded constraints; if a term’s underlying is `types.Basic` of string, flag string; if it’s a slice of byte, flag []byte. Use that to select the appropriate runtime conversion. The file already has helper functions for map constraints; similar approach applies here.

5) Primitive and token mappings

File: compiler/primitive.go

Findings
- int64/uint64 are mapped to number with TODO for bigint. Environments may not safely represent 64-bit integers in number.
- XOR_ASSIGN mapping to "^=" has a TODO; JS bitwise ops are 32-bit signed; but parity with Go’s ^ is generally acceptable for 32-bit.
- token.ELLIPSIS maps to "..." with a TODO; spread/variadic treatment depends on context and may require special handling rather than direct token mapping.

Recommendations
- At minimum, annotate in code paths that use 64-bit ints about potential precision loss; consider emitting bigint if config/target supports it. Provide a compiler config flag to choose bigint.
- Ensure variadic handling does not use generic token mapping but is handled in call sites (as currently done); consider removing the generic ELLIPSIS mapping to avoid accidental misuse.

6) Type assertion assignment paths and shadowing

Files: compiler/type-assert.go, compiler/stmt.go

Findings
- Type assertion with ok into selector/indexed LHS uses temporary variables with deterministic IDs; this is correct structurally, though there are many branches.
- Shadowing handling around if-inits and assignments uses analysis-driven maps; appears sound, but ensure it also covers built-in identifiers and package-level function names (there is a code path for built-ins).

Recommendations
- Add tests for the following edge cases:
  - value is blank, ok is selector; ok is blank, value is selector; both selectors (should be rejected); LHS index into map vs slice distinction; multiple statements in if-init with shadowing.
  - Built-in shadowing like `len := 1; if len, err := f(); ...` to ensure temp captures original builtin.

7) Protobuf field name conversion

File: compiler/protobuf.go

Findings
- convertProtobufFieldName lowercases the first rune of the field name by subtracting 'A'-'a', which assumes ASCII.

Recommendation
- Use unicode-aware lowercasing for first rune if needed, or at least guard only when the rune is ASCII upper-case. Given Go generated field names are ASCII, this is acceptable but could be clarified.

Additional minor observations

- Various comments note assumptions that may be fine but should be validated:
  - compiler/stmt.go: “We assume this is always synchronous (no async function returned by type assertion)” could be checked via analysis of method/function async status.
  - Multiple places mention being conservative for now; these should be tracked with issues and tests.

Actionable next steps

A. Fix the string range index bug.
B. Replace protobuf heuristics with analysis:
   - Detect protobuf types by interface implementation or generated markers.
   - Parse .pb.ts files for export lists; import/export accordingly.
C. Improve generic constraint inspection for string conversions.
D. Implement receiver-alias detection in Analysis and use it in selector expression null-assertions.
E. Add a configuration option for 64-bit ints as bigint and ensure safe handling.
F. Add tests for the outlined edge cases, especially around shadowing and type assertions. 