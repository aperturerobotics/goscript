# Issue: atomic.Pointer.Store not receiving VarRef for &variable

## Problem

When Go code passes `&variable` to a method like `atomic.Pointer.Store()`, the compiler generates incorrect code.

Go source:

```go
release, _ := getLock()
rel.Store(&release)
```

Generated TypeScript (WRONG):

```typescript
let [release] = getLock()
rel!.value.Store(release) // release is (() => void) | null, not VarRef
```

## Root Cause Analysis

1. **Analysis works correctly**: The analysis marks `release` as NeedsVarRef because `&release` is used.

2. **Destructuring declaration doesn't handle NeedsVarRef**: When `release, _ := getLock()` is compiled, the `writeMultiVarAssignFromCall` function generates `let [release, ] = getLock()` without checking if any variables need VarRef wrapping.

3. **WriteUnaryExpr assumes variable is already VarRef**: When we have `&release` and the analysis says `release` needs VarRef, the code at line 567-570 in expr.go writes just `release` (assuming it's already a VarRef), but it's not.

## Solution

The fix needs to be in the destructuring declaration code. When a variable is marked as NeedsVarRef and it's being declared via destructuring, we need to:

1. Use a temporary variable for the destructured value
2. Then wrap it in $.varRef() for the actual variable

Example output:

```typescript
let [_tmp_release] = getLock()
let release = $.varRef(_tmp_release)
```

Or alternatively, we can check in WriteUnaryExpr if the variable is ACTUALLY declared as a VarRef (not just marked as needing one).
