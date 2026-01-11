// Generated file based on atomic_pointer_func.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as atomic from "@goscript/sync/atomic/index.js"

export function getLock(): [(() => void) | null, $.GoError] {
	return [(): void => {
		$.println("lock released")
	}, null]
}

export async function main(): Promise<void> {
	let rel: $.VarRef<atomic.Pointer<(() => void)>> = $.varRef(new atomic.Pointer<(() => void)>())
	let [_varref_tmp_release, ] = getLock()
	let release = $.varRef(_varref_tmp_release!)
	rel!.value.Store(release)

	let loaded = rel!.value.Load()
	if (loaded != null) {
		;(loaded!.value)()
	}
	$.println("done")
}

