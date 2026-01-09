// Generated file based on protobuf_lite_ts.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import { protobufPackage, ExampleMsg } from "./protobuf_lite_ts.pb.js";

export async function main(): Promise<void> {
	let msg = ExampleMsg.create({exampleField: $.stringToBytes("hello"), exampleText: "world"})

	const data = ExampleMsg.toBinary(msg)
	let err: $.GoError | null = null as $.GoError | null
	if (err != null) {
		$.println("error marshalling:", err!.Error())
		return 
	}

	$.println("data:", data)

	let out = ExampleMsg.create({})
	out = ExampleMsg.fromBinary($.normalizeBytes(data))
	err = null as $.GoError | null
	if (err != null) {
		$.println("error unmarshalling:", err!.Error())
		return 
	}

	$.println("out:", out)

	const jdata = ExampleMsg.toJsonString(msg)
	err = null as $.GoError | null
	if (err != null) {
		$.println("error marshalling to json:", err!.Error())
		return 
	}

	$.println("json marshaled:", $.bytesToString(jdata))

	out = ExampleMsg.create({})
	out = ExampleMsg.fromJsonString(jdata)
	let err2: $.GoError | null = null as $.GoError | null
	if (err2 != null) {
		$.println("error unmarshalling from json:", err!.Error())
		return 
	}

	$.println("json unmarshaled:", out)
}

