// Generated file based on server.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as io from "@goscript/io/index.js"
import "@goscript/io/index.js"

export class Server {
	public _fields: {
	}

	constructor(init?: Partial<{}>) {
		this._fields = {
		}
	}

	public clone(): Server {
		const cloned = new Server()
		cloned._fields = {
		}
		return $.markAsStructValue(cloned)
	}

	public Handle(rwc: io.ReadWriteCloser | null): void {
		$.pointerValue<Exclude<io.ReadWriteCloser, null>>(rwc).Close()
	}

	static __typeInfo = $.registerStructType(
		"main.Server",
		() => new Server(),
		[{ name: "Handle", args: [{ name: "rwc", type: "io.ReadWriteCloser" }], returns: [] }],
		Server,
		[]
	)
}
