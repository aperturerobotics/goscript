// Generated file based on map_support.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export async function main(): Promise<void> {
	let scores = $.makeMap<string, number>()
	$.println("Empty map created: Expected: true, Actual:", $.len(scores) == 0)
	$.mapSet(scores, "Alice", 90)
	$.mapSet(scores, "Bob", 85)
	$.mapSet(scores, "Charlie", 92)
	$.println("Map size after adding 3 items: Expected: 3, Actual:", $.len(scores))
	$.println("Alice's score: Expected: 90, Actual:", $.mapGet(scores, "Alice", 0)[0])
	$.println("Bob's score: Expected: 85, Actual:", $.mapGet(scores, "Bob", 0)[0])
	$.mapSet(scores, "Bob", 88)
	$.println("Bob's updated score: Expected: 88, Actual:", $.mapGet(scores, "Bob", 0)[0])
	let [value, exists] = $.mapGet(scores, "David", 0)
	$.println("Does David exist in map? Expected: false, Actual:", exists)
	$.println("Value for non-existent key: Expected: 0, Actual:", value)
	$.deleteMapEntry(scores, "Charlie")
	let __goscriptTuple859 = $.mapGet(scores, "Charlie", 0)
	exists = __goscriptTuple859[1]
	$.println("After delete, does Charlie exist? Expected: false, Actual:", exists)
	let colors = new Map<string, string>([["red", "#ff0000"], ["green", "#00ff00"], ["blue", "#0000ff"]])
	$.println("Map literal size: Expected: 3, Actual:", $.len(colors))
	$.println("Color code for red: Expected: #ff0000, Actual:", $.mapGet(colors, "red", "")[0])
	$.println("Iterating over scores map:")
	let stringMap = new Map<string, string>([["Alice", "A+"], ["Bob", "B+"], ["Charlie", "A"]])
	let scoreResults: $.Slice<string> = null
	for (const [name, grade] of stringMap?.entries() ?? []) {
		let result = "  - Name: " + name + " Grade: " + grade
		scoreResults = $.append(scoreResults, result)
	}
	let n = $.len(scoreResults)
	for (let i = 0; i < n - 1; i++) {
		for (let j = 0; j < n - i - 1; j++) {
			if (scoreResults[j] > scoreResults[j + 1]) {
				let __goscriptAssign2043_0 = scoreResults[j + 1]
				let __goscriptAssign2043_1 = scoreResults[j]
				scoreResults[j] = __goscriptAssign2043_0
				scoreResults[j + 1] = __goscriptAssign2043_1
			}
		}
	}
	for (let __rangeIndex = 0; __rangeIndex < $.len(scoreResults); __rangeIndex++) {
		let result = scoreResults[__rangeIndex]
		$.println(result)
	}
}


if ($.isMainScript(import.meta)) {
	await main()
}
