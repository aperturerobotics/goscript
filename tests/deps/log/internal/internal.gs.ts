// Generated file based on internal.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export let DefaultOutput: ((pc: number, data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null = null as ((pc: number, data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null

export function __goscript_set_DefaultOutput(__goscriptValue: ((pc: number, data: $.Slice<number>) => $.GoError | globalThis.Promise<$.GoError>) | null): void {
	DefaultOutput = __goscriptValue
}
