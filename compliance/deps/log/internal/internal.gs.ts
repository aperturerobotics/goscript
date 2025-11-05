import * as $ from "@goscript/builtin/index.js"

export let DefaultOutput: ((pc: uintptr, data: $.Bytes) => $.GoError) | null = null

