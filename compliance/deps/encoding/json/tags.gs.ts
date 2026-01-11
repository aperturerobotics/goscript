import * as $ from "@goscript/builtin/index.js"

import * as strings from "@goscript/strings/index.js"

export type tagOptions = string;

export function tagOptions_Contains(o: tagOptions, optionName: string): boolean {
	if ($.len(o) == 0) {
		return false
	}
	let s = o
	for (; s != ""; ) {
		let name: string = ""
		;[name, s] = strings.Cut(s, ",")
		if (name == optionName) {
			return true
		}
	}
	return false
}


// parseTag splits a struct field's json tag into its name and
// comma-separated options.
export function parseTag(tag: string): [string, tagOptions] {
	let opt: string
	[tag, opt] = strings.Cut(tag, ",")
	return [tag, (opt as tagOptions)]
}

