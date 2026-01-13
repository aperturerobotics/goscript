# Cross-Issue Insights: The Runtime Type Information Problem

This document explores the fundamental connection between Issues 119 and 120, and proposes a unified approach to solving both.

## The Core Problem: TypeScript Erases Types

Go and TypeScript have fundamentally different relationships with types at runtime:

| Aspect                   | Go                             | TypeScript             |
|--------------------------|--------------------------------|------------------------|
| Runtime type info        | Always available via reflection| Erased completely      |
| Interface representation | Fat pointer: (type, value)     | Just the value         |
| Generic instantiation    | Stenciled or dictionary-based  | Erased to `any`        |
| Method dispatch          | Via type's method table        | Direct property access |
| Zero values              | Known from type                | Only for primitives    |

This difference is the root cause of both Issue 119 and Issue 120.

## Issue 119: Interface Nil Semantics

**What Go has:** An interface is a pair `(type, value)`. The interface is nil only if BOTH are nil.

```go
var dog *Dog = nil
var animal Animal = dog
// animal.type = *Dog (not nil!)
// animal.value = nil
// animal != nil is TRUE
```

**What TypeScript has:** Just the value. No way to distinguish "nil interface" from "non-nil interface with nil value."

```typescript
let animal: Animal = null  // This is all we have
// Can't represent "has type *Dog but value is null"
```

## Issue 120: Generic Zero Values and Methods

**What Go has:** At instantiation time, Go knows the concrete type and can:
- Provide the correct zero value (`0` for `int`, `""` for `string`, etc.)
- Dispatch methods to the correct implementation

```go
func Sum[T Stringer](vals ...T) T {
    var sum T  // Go knows T=IntVal, so sum=0
    sum.String()  // Go knows to call IntVal.String
    return sum
}
```

**What TypeScript has:** Generic type `T` is erased. At runtime, we don't know what `T` is.

```typescript
function Sum<T extends Stringer>(...vals: T[]): T {
    let sum: T = ???  // What's the zero value of T?
    sum.String()  // If T is a primitive type alias, this crashes
    return sum
}
```

## The Unified Insight

**Both problems require carrying runtime type information that TypeScript would otherwise erase.**

| Problem                       | Type Info Needed For                                 |
|-------------------------------|------------------------------------------------------|
| Interface nil check           | Knowing if type component is nil                     |
| Interface method call on nil  | Dispatching to correct method with nil receiver      |
| Generic zero value            | Looking up zero value for concrete type              |
| Generic method call           | Dispatching to method implementation for concrete type|

This suggests a **unified type information system** could solve both issues.

## Proposed Unified Solution: GoValue

### Core Concept

Create a unified runtime representation for values that need type information:

```typescript
/**
 * GoValue wraps a value with its runtime type information.
 * Used for:
 * - Interface values (to track type separate from value)
 * - Generic type parameters (to enable zero values and method dispatch)
 * - Named types with methods (to enable method calls on primitives)
 */
interface GoValue<T = any> {
  /** Fully qualified type name, e.g., "main.IntVal", "*main.Dog" */
  $type: string | null

  /** The actual value (can be null for nil pointers/values) */
  $value: T | null
}
```

### Type Registry

A global registry maps type names to their metadata:

```typescript
interface TypeMetadata<T = any> {
  /** Fully qualified name */
  name: string

  /** Underlying kind (struct, pointer, int, string, etc.) */
  kind: TypeKind

  /** Zero value factory */
  zeroValue: () => T

  /** Method implementations (for types with methods) */
  methods?: Record<string, (receiver: T | null, ...args: any[]) => any>

  /** For pointer types, the element type */
  elemType?: string

  /** For named types, the underlying type */
  underlying?: string
}

// Global registry
const typeRegistry = new Map<string, TypeMetadata>()

// Register types at module load
$.registerType({
  name: 'main.IntVal',
  kind: TypeKind.Named,
  underlying: 'int',
  zeroValue: () => 0,
  methods: {
    String: (i: number) => String(i)
  }
})
```

### Solving Issue 119 with GoValue

```typescript
// Interface assignment
// var animal Animal = dog (where dog is *Dog and nil)
let animal: GoValue<Animal> = {
  $type: '*main.Dog',  // Type is NOT nil!
  $value: null         // Value IS nil
}

// Nil interface check
// if animal != nil
if (animal.$type !== null) {
  // This branch IS taken - interface has a type
}

// Method call on interface
// animal.Name()
$.callMethod(animal, 'Name')
// Looks up '*main.Dog' in registry, calls Name method with null receiver
```

### Solving Issue 120 with GoValue

```typescript
// Generic function with type info
function Sum<T extends Stringer>($T: TypeMetadata<T>, ...vals: T[]): T {
  // Zero value from type metadata
  let sum: T = $T.zeroValue()

  // Method call via type metadata
  for (const v of vals) {
    // For demo - actual addition would need more infrastructure
    console.log($T.methods!.String(v))
  }

  return sum
}

// Call site - compiler passes type metadata
let result = Sum($.getType('main.IntVal'), 1, 2, 3)
```

### Unified Method Dispatch

Both issues need method dispatch that works with:
- Nil receivers (Issue 119)
- Primitive-based types (Issue 120)

```typescript
function callMethod<R>(
  target: GoValue<any>,
  methodName: string,
  ...args: any[]
): R {
  if (target.$type === null) {
    $.panic('method call on nil interface')
  }

  const typeMeta = typeRegistry.get(target.$type)
  if (!typeMeta?.methods?.[methodName]) {
    $.panic(`no method ${methodName} on type ${target.$type}`)
  }

  // Call method with value as receiver (value can be null!)
  return typeMeta.methods[methodName](target.$value, ...args)
}
```

## When to Use GoValue vs Plain Values

Not every value needs to be wrapped. GoValue is needed when:

| Scenario                                     | Needs GoValue? | Reason                                  |
|----------------------------------------------|----------------|-----------------------------------------|
| Local `int` variable                         | No             | No methods, zero value is 0             |
| Local `*Dog` variable                        | No             | Can be null, methods on Dog             |
| Interface variable                           | **Yes**        | Need to track type separate from value  |
| Generic type parameter                       | **Yes**        | Need zero value and method dispatch     |
| Named type with methods (`type IntVal int`)  | Maybe          | If used with generics or interfaces     |
| Struct field of interface type               | **Yes**        | Same as interface variable              |
| Return value of interface type               | **Yes**        | Caller needs type info                  |

### Optimization: Unwrapping

When we know statically that a value is non-nil and its type, we can unwrap:

```typescript
// If we know animal is definitely *Dog and not nil:
let dog = animal.$value as Dog  // Unwrap for direct access
dog.Bark()  // Direct method call
```

## Architectural Implications

### Compiler Changes

1. **Analysis phase:** Track which values need GoValue wrapping
   - Interface-typed expressions
   - Generic type parameters with method constraints
   - Named types with methods used polymorphically

2. **Code generation:**
   - Wrap values when assigning to interfaces
   - Pass TypeMetadata to generic functions
   - Use `$.callMethod` for polymorphic calls

3. **Type registration:**
   - Generate `$.registerType()` calls for all named types
   - Include method implementations in metadata

### Runtime Changes

1. **Type registry:** Global map of type name → metadata
2. **GoValue helpers:** `makeGoValue`, `isNilInterface`, `callMethod`
3. **Zero value lookup:** `zeroValueForType(typeName)`

### Performance Considerations

| Operation        | Overhead                   |
|------------------|----------------------------|
| GoValue creation | Object allocation          |
| Type lookup      | Map lookup (fast)          |
| Method dispatch  | Indirect call via registry |
| Nil check        | Property access            |

Mitigation strategies:
- Cache type metadata locally in hot paths
- Inline nil checks where possible
- Use direct calls when type is statically known
- Pool GoValue objects if allocation becomes bottleneck

## Relationship to Existing Code

### Current Interface Handling

Currently, interfaces are just TypeScript union types:
```typescript
type Animal = null | { Name(): string }
```

This would change to use GoValue internally while possibly keeping the TypeScript type for structural checking.

### Current Generic Handling

Currently, generic zero values are `null as any`:
```typescript
let sum: T = null as any
```

This would change to use type metadata:
```typescript
let sum: T = $T.zeroValue()
```

### Migration Path

1. **Phase 1:** Add GoValue infrastructure without changing existing code
2. **Phase 2:** Update interface handling to use GoValue
3. **Phase 3:** Update generic handling to use TypeMetadata
4. **Phase 4:** Optimize and add unwrapping passes

## Open Questions

1. **Wrapper types for primitives:** Should `type IntVal int` always become a class, or only when used with interfaces/generics?

2. **Embedding and composition:** How does GoValue work with embedded interfaces in structs?

3. **Slice/map of interfaces:** `[]Animal` - is it `GoValue<Animal>[]` or `GoValue<Animal[]>`?

4. **Channel of interfaces:** Similar question for `chan Animal`

5. **Reflection:** Does this infrastructure help with future `reflect` package support?

6. **Binary size:** How much does the type registry add to output size?

7. **Tree shaking:** Can unused type metadata be eliminated?

## Conclusion

Issues 119 and 120 are manifestations of the same fundamental problem: TypeScript erases runtime type information that Go preserves. A unified GoValue + TypeMetadata system can solve both issues with shared infrastructure.

The key insight is that Go's type system is **nominal and runtime-aware**, while TypeScript's is **structural and compile-time-only**. To faithfully transpile Go to TypeScript, we must bridge this gap by carrying type information at runtime where Go would have it.

This is similar to how:
- Java uses `Class<T>` tokens for runtime generics
- C# has runtime type information via `typeof(T)`
- GopherJS handles these cases with type metadata

The cost is some runtime overhead, but the benefit is correct semantics for Go code that relies on these behaviors.
