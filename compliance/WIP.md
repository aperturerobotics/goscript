# Debug Simple Compliance Test - Current Issue

## Problem: Method Return Type Generation Bug

The `debug_simple` compliance test is failing TypeCheck due to incorrect TypeScript generation for method return types.

### Specific Issue

**Go Source (stdlib encoding/base64/base64.go):**

```go
func (enc *Encoding) decodeQuantum(dst, src []byte, si int) (nsi, n int, err error) {
    // ...
    return si, 0, nil
}
```

**Generated TypeScript (base64.gs.ts:208):**

```typescript
public decodeQuantum(dst: $.Bytes, src: $.Bytes, si: number): [number, $.GoError] {
    // ...
    return [si, 0, null]  // ERROR: 3 values returned but signature expects 2
}
```

**Expected TypeScript:**

```typescript
public decodeQuantum(dst: $.Bytes, src: $.Bytes, si: number): [number, number, $.GoError] {
    // ...
    return [si, 0, null]
}
```

### Root Cause

The compiler is generating incorrect return types for methods with 3+ return values. The method signature shows `[number, $.GoError]` (2 values) but the function body returns 3 values `[number, number, $.GoError]`.

### TypeScript Errors

```
base64.gs.ts(220,19): error TS2322: Type 'number' is not assignable to type 'GoError'.
base64.gs.ts(225,19): error TS2322: Type 'number' is not assignable to type 'GoError'.
... (10+ similar errors)
```

Also tuple destructuring errors:

```
base64.gs.ts(378,18): error TS2493: Tuple type '[number, GoError]' of length '2' has no element at index '2'.
```

### Root Cause Analysis

Found in `compiler/decl.go:618-631` in the `writeMethodSignature` function:

**The Bug:**
The code iterates over `funcType.Results.List` (which are **fields**), not individual return values.

In Go, multiple parameters can share a type:

```go
func foo() (nsi, n int, err error)
```

This creates **2 fields**:

1. Field 1: `nsi, n int` (2 names sharing type `int`)
2. Field 2: `err error` (1 name with type `error`)

But the generated code only produces 2 types `[int, error]` instead of 3 types `[int, int, error]`.

**Current Code (WRONG):**

```go
for i, field := range funcType.Results.List {
    if i > 0 {
        c.tsw.WriteLiterally(", ")
    }
    c.WriteTypeExpr(field.Type)  // Only writes type once per field
}
```

**Fix Needed:**
Expand each field by the number of names (or 1 if no names):

```go
for i, field := range funcType.Results.List {
    count := len(field.Names)
    if count == 0 {
        count = 1  // Unnamed return value
    }
    for j := 0; j < count; j++ {
        if i > 0 || j > 0 {
            c.tsw.WriteLiterally(", ")
        }
        c.WriteTypeExpr(field.Type)
    }
}
```

### Fix Applied

Fixed in 4 locations:

- `compiler/decl.go:622-631` (writeMethodSignature)
- `compiler/type.go:400-410` (WriteFuncType)
- `compiler/spec.go:407-415` (method wrapper return types)
- `compiler/lit.go:144-152` (function literal return types)

All now correctly expand fields with multiple names to individual return values.

### NEW Issue: Named Types That Implement Error

After fixing the return type bug, a new issue appeared:

**Problem:**

```go
type CorruptInputError int64
func (e CorruptInputError) Error() string { ... }
```

Generated TypeScript:

```typescript
export type CorruptInputError = number
return [si, 0, (si - j) as CorruptInputError] // ERROR: number not assignable to GoError
```

In Go, `CorruptInputError` is a valid error type (implements error interface).
In TypeScript, it's just `number`, which is not compatible with `$.GoError`.

**Options to fix:**

1. Generate error-implementing types as wrapper classes
2. Add implicit conversion when assigning to GoError
3. Make GoError a union type that includes primitive error types
4. Use a helper function to wrap primitive errors

Need to investigate the best approach that doesn't break existing error handling.

### Other Issues Found (Secondary)

1. **VarRef nullable type issues**: `VarRef<Type | null>` not assignable to `VarRef<Type>` - needs compiler investigation
2. **JSON decode errors**: Various null checks, missing arguments, async issues
3. **Duplicate min function**: builtin.ts has duplicate min function declarations
