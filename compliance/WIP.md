# Analysis: Untyped Struct Literals in Slice Literals

## Problem

When we have a slice literal like:
```go
people := []Person{
    {Name: "Charlie", Age: 30},
    {Name: "Alice", Age: 25},
    {Name: "Bob", Age: 35},
}
```

The generated TypeScript is:
```ts
let people = $.arrayToSlice<Person>([{Age: 30, Name: "Charlie"}, {Age: 25, Name: "Alice"}, {Age: 35, Name: "Bob"}])
```

This generates TypeScript type errors because `{Age: 30, Name: "Charlie"}` is a plain object literal, not a `Person` instance with `_fields` and `clone` methods.

## Root Cause

In `WriteCompositeLit`, when processing array elements at lines 184-186:
```go
if elm, ok := elements[i]; ok && elm != nil {
    if err := c.WriteVarRefedValue(elm); err != nil {
        return fmt.Errorf("failed to write array literal element: %w", err)
    }
}
```

The elements are untyped composite literals (`{Name: "Charlie", Age: 30}`). When `WriteVarRefedValue` is called on these, it delegates to `WriteValueExpr`, which calls `WriteCompositeLit`.

Inside `WriteCompositeLit` for these untyped literals, the function checks if `exp.Type` is nil (line 334). Since these literals don't have an explicit type in the AST, it falls through to the untyped path starting at line 336.

The untyped path calls `writeUntypedStructLiteral` (line 387) which just creates a plain object literal `{...}` instead of calling the struct constructor.

## Solution

When we have an untyped struct literal, we need to check if the inferred type is a named struct type. If it is, we should generate `new StructName({...})` instead of just `{...}`.

The type information is available via `c.pkg.TypesInfo.Types[exp]` which gives us the inferred type.

## Fix

Modify `writeUntypedStructLiteral` to:
1. Check if the inferred type for the expression is a named struct type
2. If so, generate `new TypeName({...})` with the constructor call
3. If it's truly anonymous (no named type), keep the plain object literal

This requires checking the parent types.Type that led us to call writeUntypedStructLiteral.
