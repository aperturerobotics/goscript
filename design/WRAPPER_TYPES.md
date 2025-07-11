# Wrapper Types in GoScript

## Overview

In Go, named types based on built-in types (e.g., int, string, slice, map) can have methods attached. These "wrapper types" add behavior to the underlying type.

TypeScript cannot add methods to primitives or arrays directly. GoScript translates them using type aliases and standalone functions.

## Basic Wrapper Types (e.g., type MyInt int)

- Type: type MyInt = number;
- Methods: function MyInt_Add(self: MyInt, other: number): number { return self + other; }
- Calls: m.Add(5) -> MyInt_Add(m, 5)

## Wrapper for Slices (e.g., type ErrorList []string)

To handle pointer receivers that modify the slice:
- Type: type ErrorList = string[] | null;
- Variables/fields use VarRef<ErrorList> where address is taken or modifiable.
- Methods take VarRef: function ErrorList_Add(p: VarRef<ErrorList>, msg: string): void {
  if (p.value === null) p.value = [];
  p.value = $.append(p.value, msg);
}
- Calls on addressable receivers pass VarRef: ErrorList_Add(receiverRef, "error")

This mimics Go's pointer semantics and implicit address-taking for pointer methods on addressable values.

## Integration with VarRef

Wrapper types integrate with the VarRef system (see VAR_REFS.md) for reference semantics, especially for pointer receivers and address operations.

Struct fields of wrapper types are stored as VarRef<WrapperType> in _fields, with getters/setters accessing .value. For modifiable fields, methods pass the _fields VarRef. 