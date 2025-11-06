// Generated file based on protobuf_lite_ts.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"
import { protobufPackage, ExampleMsg } from "./protobuf_lite_ts.pb.js";
import * as base64 from "encoding/base64/index.js"
import * as fmt from "fmt/index.js"
import * as io from "io/index.js"
import * as json from "github.com/aperturerobotics/protobuf-go-lite/json/index.js"
import * as protobuf_go_lite from "github.com/aperturerobotics/protobuf-go-lite/index.js"
import * as strconv from "strconv/index.js"
import * as strings from "strings/index.js"

export async function main(): Promise<void> {
	let msg = ExampleMsg.create({exampleField: $.stringToBytes("hello"), exampleText: "world"})

	const data = ExampleMsg.toBinary(msg)
	let err: $.GoError | null = null as $.GoError | null
	if (err != null) {
		console.log("error marshalling:", err!.Error())
		return 
	}

	console.log("data:", data)

	let out = ExampleMsg.create({})
	out = ExampleMsg.fromBinary($.normalizeBytes(data))
	err = null as $.GoError | null
	if (err != null) {
		console.log("error unmarshalling:", err!.Error())
		return 
	}

	console.log("out:", out)

	const jdata = ExampleMsg.toJsonString(msg)
	err = null as $.GoError | null
	if (err != null) {
		console.log("error marshalling to json:", err!.Error())
		return 
	}

	console.log("json marshaled:", $.bytesToString(jdata))

	out = ExampleMsg.create({})
	out = ExampleMsg.fromJsonString(jdata)
	let err2: $.GoError | null = null as $.GoError | null
	if (err2 != null) {
		console.log("error unmarshalling from json:", err!.Error())
		return 
	}

	console.log("json unmarshaled:", out)
}

