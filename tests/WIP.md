Investigating the Spacewave provider/sobject frontier.

First owner: pointer-receiver calls on named non-struct values inside function
literals are not marked as address-taken. That causes generated TypeScript to
pass a scalar value to the method function where a VarRef receiver is required.

Focused compliance case: named integer pointer receiver invoked inside a
closure. The expected output should prove the local variable is mutated.

Second owner: errors.As matched an interface target but did not assign through
the VarRef generated for &target. That let ok=true while leaving the target nil.

Focused compliance case: errors.As into an interface that adds Health() to error.
The expected output should prove ok=true and the assigned interface is callable.

Third owner: local named struct types declared inside function literals are
not collected as semantic type facts. Lowering then emits composite literals
that reference the local class name without emitting the class.

Focused compliance case: a callback declares a local struct type, constructs a
slice of that type, and prints field values from the slice.
