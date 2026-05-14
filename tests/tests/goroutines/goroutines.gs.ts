// Generated file based on goroutines.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.ts"

export class Message {
	public get priority(): number {
		return this._fields.priority.value
	}
	public set priority(value: number) {
		this._fields.priority.value = value
	}

	public get text(): string {
		return this._fields.text.value
	}
	public set text(value: string) {
		this._fields.text.value = value
	}

	public _fields: {
		priority: $.VarRef<number>
		text: $.VarRef<string>
	}

	constructor(init?: Partial<{priority?: number, text?: string}>) {
		this._fields = {
			priority: $.varRef(init?.priority ?? 0),
			text: $.varRef(init?.text ?? "")
		}
	}

	public clone(): Message {
		const cloned = new Message()
		cloned._fields = {
			priority: $.varRef(this._fields.priority.value),
			text: $.varRef(this._fields.text.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"main.Message",
		new Message(),
		[],
		Message,
		{"priority": { kind: $.TypeKind.Basic, name: "int" }, "text": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export let messages: $.Channel<Message> | null = $.makeChannel<Message>(0, $.markAsStructValue(new Message()), "both")

export const totalMessages: number = 8

export async function worker(id: number): Promise<void> {
	await $.chanSend(messages, $.markAsStructValue(new Message({priority: 10 + id, text: "Worker " + String.fromCodePoint($.int(48 + id)) + " starting"})))
	await $.chanSend(messages, $.markAsStructValue(new Message({priority: 20 + id, text: "Worker " + String.fromCodePoint($.int(48 + id)) + " done"})))
}

export async function anotherWorker(name: string): Promise<void> {
	await $.chanSend(messages, $.markAsStructValue(new Message({priority: 40, text: "Another worker: " + name})))
}

export async function main(): Promise<void> {
	let allMessages = $.makeSlice<Message>(0, totalMessages + 3)
	allMessages = $.append(allMessages, $.markAsStructValue(new Message({priority: 0, text: "Main: Starting workers"})))
	for (let i = 0; i < 3; i++) {
		queueMicrotask(async () => { await worker(i) })
	}
	queueMicrotask(async () => { await anotherWorker("test") })
	queueMicrotask(async () => { await (async (): Promise<void> => {
	await $.chanSend(messages, $.markAsStructValue(new Message({priority: 50, text: "Anonymous function worker"})))
})() })
	allMessages = $.append(allMessages, $.markAsStructValue(new Message({priority: 1, text: "Main: Workers started"})))
	for (let __rangeIndex = 0; __rangeIndex < totalMessages; __rangeIndex++) {
		allMessages = $.append(allMessages, await $.chanRecv(messages))
	}
	allMessages = $.append(allMessages, $.markAsStructValue(new Message({priority: 100, text: "Main: All workers completed"})))
	for (let i = 0; i < $.len(allMessages); i++) {
		for (let j = i + 1; j < $.len(allMessages); j++) {
			if (allMessages![i].priority > allMessages![j].priority) {
				let __goscriptAssign2054_0 = allMessages![j]
				let __goscriptAssign2054_1 = allMessages![i]
				allMessages![i] = __goscriptAssign2054_0
				allMessages![j] = __goscriptAssign2054_1
			}
		}
	}
	for (let __rangeIndex = 0; __rangeIndex < $.len(allMessages); __rangeIndex++) {
		let msg = allMessages![__rangeIndex]
		$.println(msg.priority, msg.text)
	}
	$.println("done")
}


if ($.isMainScript(import.meta)) {
	await main()
}
