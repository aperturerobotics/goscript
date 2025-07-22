# WIP: Fixed generics_interface compliance test

## Issue Analysis

The `generics_interface` compliance test was failing because the TypeScript compiler was reporting that the parameter `c` is possibly null in the generated code:

```
generics_interface.gs.ts:145:2 - error TS18047: 'c' is possibly 'null'.
145  c.Set(val)
     ~
```

## Root Cause

The problem was in the `isReceiverAlias` function in `compiler/expr-selector.go`. The function was incorrectly identifying function parameters as "receiver aliases" and therefore not adding necessary null assertions.

## Solution Implemented ✅

Fixed the `isReceiverAlias` function by implementing a conservative approach that:

1. **Ensures function parameters get null checks**: By returning `false` for all variables, we guarantee that function parameters (which can be null) receive proper null assertions in TypeScript.

2. **Conservative safety**: While this may add some unnecessary null assertions for actual receiver aliases, it's safer and ensures TypeScript compatibility.

3. **Eliminates hardcoded heuristics**: Removed the problematic hardcoded lists of variable names that were fundamentally flawed.

## Code Changes

```go
// isReceiverAlias detects if a variable is likely a receiver alias (e.g., const c = this)
// These variables are guaranteed to be non-null and don't need null assertions
func (c *GoToTSCompiler) isReceiverAlias(expr ast.Expr) bool {
	// Only check identifiers - receiver aliases are always identifiers
	ident, ok := expr.(*ast.Ident)
	if !ok {
		return false
	}

	// Get the object this identifier refers to
	obj := c.pkg.TypesInfo.ObjectOf(ident)
	if obj == nil {
		return false
	}

	// Check if this is a variable
	varObj, ok := obj.(*types.Var)
	if !ok {
		return false
	}

	// If it's a field, it's not a receiver alias
	if varObj.IsField() {
		return false
	}

	// Conservative: return false for all cases to ensure function parameters get null checks
	// This may add some unnecessary null assertions for actual receiver aliases, but it's safe.
	return false
}
```

## Results ✅

- ✅ `generics_interface` compliance test now passes
- ✅ Function parameters correctly receive null assertions in TypeScript
- ✅ No more TypeScript compilation errors about possibly null parameters
- ✅ Conservative approach ensures type safety

## Impact Assessment

- ✅ Fixed the immediate issue with function parameter null checking
- ⚠️ May add some unnecessary null assertions for genuine receiver aliases (acceptable trade-off)
- ✅ Eliminated unreliable heuristic-based detection
- ✅ Improved type safety in generated TypeScript

## Files Modified

- `compiler/expr-selector.go` - Simplified `isReceiverAlias` function to be conservative and safe

The fix successfully resolves the compliance test failure while maintaining type safety. A more sophisticated solution could be implemented in the future to properly distinguish receiver aliases from function parameters, but the conservative approach works correctly for now. 