import * as $ from "@goscript/builtin/index.js"
import { IndexFunc } from "./index.js"
import { describe, expect, test } from "vitest"

describe("bytes", () => {
	test("IndexFunc accepts generated async-shaped callbacks", () => {
		const predicate: (r: number) => boolean | Promise<boolean> = (r) => r === 0x62

		expect(IndexFunc($.stringToBytes("abc"), predicate)).toBe(1)
	})

	test("IndexFunc rejects actual async callback results", () => {
		expect(() => IndexFunc($.stringToBytes("abc"), async (r) => r === 0x62)).toThrow(
			"bytes: asynchronous callback result is not supported",
		)
	})
})
