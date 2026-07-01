// Generated file based on dep.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Ref = {
	Key(): any
}

$.registerInterfaceType(
	"dep.Ref",
	null,
	[{ name: "Key", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }] }]
);

export async function ToKey(v: Ref | null): globalThis.Promise<any> {
	if (v == null) {
		return null
	}
	return $.pointerValue<Exclude<Ref, null>>(v).Key()
}
