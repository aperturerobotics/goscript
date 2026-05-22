// Generated file based on dep.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Ref = null | {
	Key(): any
}

$.registerInterfaceType(
	"dep.Ref",
	null,
	[{ name: "Key", args: [], returns: [{ name: "_r0", type: { kind: $.TypeKind.Interface, methods: [] } }] }]
)

export function ToKey(v: Ref | null): any {
	if (v == null) {
		return null
	}
	return $.pointerValue<Exclude<Ref, null>>(v).Key()
}
