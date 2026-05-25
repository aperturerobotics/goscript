// Generated file based on dep.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export type Directive = {
	Validate(): $.GoError | globalThis.Promise<$.GoError>
}

$.registerInterfaceType(
	"dep.Directive",
	null,
	[{ name: "Validate", args: [], returns: [{ name: "_r0", type: "error" }] }]
)

export async function Use(d: Directive | null): globalThis.Promise<boolean> {
	return await $.pointerValue<Exclude<Directive, null>>(d).Validate() == null
}

export function Accept(d: Directive | null): boolean {
	return d != null
}
