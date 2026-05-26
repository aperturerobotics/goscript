// Generated file based on goroutines.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

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
		() => new Message(),
		[],
		Message,
		{"priority": { kind: $.TypeKind.Basic, name: "int" }, "text": { kind: $.TypeKind.Basic, name: "string" }}
	)
}

export const totalMessages: number = 8

export let messages: $.Channel<Message> | null = $.makeChannel<Message>(0, $.markAsStructValue(new Message()), "both")

export function __goscript_set_messages(value: $.Channel<Message> | null): void {
	messages = value
}

export async function worker(id: number): globalThis.Promise<void> {
	// Send worker starting message
	await $.chanSend(messages, $.markAsStructValue(new Message({priority: 10 + id, text: ("Worker " + String.fromCodePoint($.int(48 + id, 32))) + " starting"})))

	// Send worker done message
	await $.chanSend(messages, $.markAsStructValue(new Message({priority: 20 + id, text: ("Worker " + String.fromCodePoint($.int(48 + id, 32))) + " done"})))
}

export async function anotherWorker(name: string): globalThis.Promise<void> {
	await $.chanSend(messages, $.markAsStructValue(new Message({priority: 40, text: "Another worker: " + name})))
}

export async function main(): globalThis.Promise<void> {
	// Create a slice to collect all messages
	let allMessages: $.Slice<Message> = $.makeSlice<Message>(0, totalMessages + 3, undefined, () => $.markAsStructValue(new Message()))

	// Add initial message
	allMessages = $.append(allMessages, $.markAsStructValue(new Message({priority: 0, text: "Main: Starting workers"})))

	// Start 3 worker goroutines
	for (let i = 0; i < 3; i++) {
		queueMicrotask(async () => { await worker(i) })
	}

	// Start another worker goroutine
	queueMicrotask(async () => { await anotherWorker("test") })

	// Start an anonymous function worker
	queueMicrotask(async () => { await ($.functionValue(async (): globalThis.Promise<void> => {
		await $.chanSend(messages, $.markAsStructValue(new Message({priority: 50, text: "Anonymous function worker"})))
	}, ({ kind: $.TypeKind.Function, params: [], results: [] } as $.FunctionTypeInfo)))() })

	// Add status message
	allMessages = $.append(allMessages, $.markAsStructValue(new Message({priority: 1, text: "Main: Workers started"})))

	// Collect all messages from goroutines
	for (let __rangeIndex = 0; __rangeIndex < totalMessages; __rangeIndex++) {
		allMessages = $.append(allMessages, await $.chanRecv(messages))
	}

	// Add final message
	allMessages = $.append(allMessages, $.markAsStructValue(new Message({priority: 100, text: "Main: All workers completed"})))

	// Sort messages by priority for deterministic order
	for (let __goscriptRangeTarget0 = allMessages, i = 0; i < $.len(__goscriptRangeTarget0); i++) {
		for (let j = i + 1; j < $.len(allMessages); j++) {
			if (allMessages![i].priority > allMessages![j].priority) {
				let __goscriptAssign0_0: Message = $.markAsStructValue($.cloneStructValue(allMessages![j]))
				let __goscriptAssign0_1: Message = $.markAsStructValue($.cloneStructValue(allMessages![i]))
				allMessages![i] = __goscriptAssign0_0
				allMessages![j] = __goscriptAssign0_1
			}
		}
	}

	// Print all messages in deterministic order
	for (let __goscriptRangeTarget1 = allMessages, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget1); __rangeIndex++) {
		let msg = __goscriptRangeTarget1![__rangeIndex]
		$.println(msg.priority, msg.text)
	}
	$.println("done")
}

if ($.isMainScript(import.meta)) {
	await main()
}
