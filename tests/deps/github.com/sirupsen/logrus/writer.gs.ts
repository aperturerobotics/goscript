// Generated file based on writer.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as bufio from "@goscript/bufio/index.js"

import * as io from "@goscript/io/index.js"

import * as runtime from "@goscript/runtime/index.js"

import * as strings from "@goscript/strings/index.js"

import * as bytes from "@goscript/bytes/index.js"

import * as context from "@goscript/context/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"

import * as __goscript_buffer_pool from "./buffer_pool.gs.ts"

import * as __goscript_entry from "./entry.gs.ts"

import * as __goscript_formatter from "./formatter.gs.ts"

import * as __goscript_hooks from "./hooks.gs.ts"

import * as __goscript_logger from "./logger.gs.ts"

import * as __goscript_logrus from "./logrus.gs.ts"
import "@goscript/bufio/index.js"
import "@goscript/io/index.js"
import "@goscript/runtime/index.js"
import "@goscript/strings/index.js"
import "@goscript/bytes/index.js"
import "@goscript/context/index.js"
import "@goscript/sync/index.js"
import "@goscript/time/index.js"
import "./buffer_pool.gs.ts"
import "./entry.gs.ts"
import "./formatter.gs.ts"
import "./hooks.gs.ts"
import "./logger.gs.ts"
import "./logrus.gs.ts"

export function writerFinalizer(writer: io.PipeWriter | $.VarRef<io.PipeWriter> | null): void {
	io.PipeWriter.prototype.Close.call($.pointerValue<io.PipeWriter>(writer))
}
