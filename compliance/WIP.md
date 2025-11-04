# Issue: Method `array()` not marked as async despite calling async method `value()`

## Root Cause Confirmed

Debug output shows the exact problem:

```
DEBUG: Analyzing method decodeState.array async status
DEBUG: Checking call to value: isAsync=false  <- array() checks value() but it's not analyzed yet
DEBUG: Method decodeState.array analyzed as async=false  <- array() marked as sync
DEBUG: Method decodeState.value analyzed as async=true  <- value() marked as async AFTER array()
```

**The Problem**: Methods are analyzed in a single pass. When `array()` is analyzed, `value()` hasn't been analyzed yet, so `value()` appears to be sync. Later when `value()` is marked as async, `array()` is never re-analyzed.

## Solution: Fixed-Point Iteration

Implement a multi-pass algorithm in `analyzeAllMethodsAsync()`:

1. Do an initial pass analyzing all methods
2. Keep track of which methods changed from sync to async
3. If any methods changed, do another pass (only re-analyzing methods that depend on changed ones)
4. Repeat until no methods change (fixed point reached)

This is similar to how dataflow analysis works in compilers.

## Implementation Plan

Modify `analyzeAllMethodsAsync()` to:

1. Loop until no changes occur
2. Clear the `MethodAsyncStatus` map at the start of each iteration (or track previous values)
3. Re-analyze all methods in each iteration
4. Compare new results with previous iteration
5. Stop when nothing changes
