# interface_to_interface_type_assertion

## Problem

Type assertion from one interface to another is failing because the compiler generates an incomplete type name.

**Root Cause:**
In `/Users/cjs/repos/aperture/goscript/compiler/expr-type.go`, the `writeTypeDescription` function handles `*ast.Ident` cases (line 76-139). For non-primitive named types, it just writes `'%s'` with `t.Name` (line 138), which produces the short name `'MyOtherInterface'`.

However, interfaces are registered with their fully qualified names like:

```
'github.com/.../MyOtherInterface'
```

This causes the runtime type assertion to fail because it can't find the type in the registry.

## Solution

Modify `writeTypeDescription` in `expr-type.go` to use the fully qualified type name from `types.TypeString()` for named types, similar to how interface registration works.

For the `case *ast.Ident:` non-primitive path (line 136-139), we should:

1. Get the type info: `goType := c.pkg.TypesInfo.TypeOf(t)`
2. If it's a named type, use `types.TypeString(namedType.Obj().Type(), c.makeTypeStringQualifier())` to get the full package path
3. Write that instead of just `t.Name`

This will make the generated code:

```typescript
$.typeAssert<MyOtherInterface>(i, 'github.com/.../MyOtherInterface')
```

Which matches the registered type name.
