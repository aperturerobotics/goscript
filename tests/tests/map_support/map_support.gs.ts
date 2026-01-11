// Generated file based on map_support.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

export async function main(): Promise<void> {
	// Create map using make
	let scores = $.makeMap<string, number>()
	$.println("Empty map created: Expected: true, Actual:", $.len(scores) == 0)

	// Add key-value pairs
	$.mapSet(scores, "Alice", 90)
	$.mapSet(scores, "Bob", 85)
	$.mapSet(scores, "Charlie", 92)

	// Map size
	$.println("Map size after adding 3 items: Expected: 3, Actual:", $.len(scores))

	// Access values
	$.println("Alice's score: Expected: 90, Actual:", $.mapGet(scores, "Alice", 0)[0])
	$.println("Bob's score: Expected: 85, Actual:", $.mapGet(scores, "Bob", 0)[0])

	// Modify a value
	$.mapSet(scores, "Bob", 88)
	$.println("Bob's updated score: Expected: 88, Actual:", $.mapGet(scores, "Bob", 0)[0])

	// Check if key exists (comma-ok idiom)
	let [value, exists] = $.mapGet(scores, "David", 0)
	$.println("Does David exist in map? Expected: false, Actual:", exists)
	$.println("Value for non-existent key: Expected: 0, Actual:", value)

	// Delete a key
	$.deleteMapEntry(scores, "Charlie")
	;[, exists] = $.mapGet(scores, "Charlie", 0)
	$.println("After delete, does Charlie exist? Expected: false, Actual:", exists)

	// Create map with literal syntax
	let colors = new Map([["red", "#ff0000"], ["green", "#00ff00"], ["blue", "#0000ff"]])
	$.println("Map literal size: Expected: 3, Actual:", $.len(colors))
	$.println("Color code for red: Expected: #ff0000, Actual:", $.mapGet(colors, "red", "")[0])

	// Iterate over a map with range
	$.println("Iterating over scores map:")

	// Create a new map with string keys and string values for testing iteration
	let stringMap = new Map([["Alice", "A+"], ["Bob", "B+"], ["Charlie", "A"]])

	// Note: Map iteration is not ordered in Go, so we will collect the results and sort them for consistent test output.
	let scoreResults: $.Slice<string> = null

	// Using string concatenation to build the output string
	for (const [name, grade] of stringMap?.entries() ?? []) {
		{
			// Using string concatenation to build the output string
			let result = "  - Name: " + name + " Grade: " + grade
			scoreResults = $.append(scoreResults, result)
		}
	}

	// Inline bubble sort for string slice
	// (avoid importing sort package yet)
	let n = $.len(scoreResults)
	for (let i = 0; i < n - 1; i++) {
		for (let j = 0; j < n - i - 1; j++) {
			if (scoreResults![j] > scoreResults![j + 1]) {
				;[scoreResults![j], scoreResults![j + 1]] = [scoreResults![j + 1], scoreResults![j]]
			}
		}
	}

	for (let _i = 0; _i < $.len(scoreResults); _i++) {
		let result = scoreResults![_i]
		{
			$.println(result)
		}
	}
}

