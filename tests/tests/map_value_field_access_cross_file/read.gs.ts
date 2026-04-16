// Generated file based on read.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"
import { Foo } from "./types.gs.ts";
import { Storage } from "./types.gs.ts";

export function ReadValue(key: string): string {
	return $.mapGet(Storage, key, new Foo())[0].Value
}

