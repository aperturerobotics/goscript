// Generated file based on linkedlist.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"
import "@goscript/sync/index.js"

export class LinkedList {
	// mtx guards below fields
	public get mtx(): sync.RWMutex {
		return this._fields.mtx.value
	}
	public set mtx(value: sync.RWMutex) {
		this._fields.mtx.value = value
	}

	// head is the current head elem
	// least-recently-added
	public get head(): linkedListElem | $.VarRef<linkedListElem> | null {
		return this._fields.head.value
	}
	public set head(value: linkedListElem | $.VarRef<linkedListElem> | null) {
		this._fields.head.value = value
	}

	// tail is the current tail item
	// most-recently-added
	public get tail(): linkedListElem | $.VarRef<linkedListElem> | null {
		return this._fields.tail.value
	}
	public set tail(value: linkedListElem | $.VarRef<linkedListElem> | null) {
		this._fields.tail.value = value
	}

	public _fields: {
		mtx: $.VarRef<sync.RWMutex>
		head: $.VarRef<linkedListElem | $.VarRef<linkedListElem> | null>
		tail: $.VarRef<linkedListElem | $.VarRef<linkedListElem> | null>
	}

	constructor(init?: Partial<{mtx?: sync.RWMutex, head?: linkedListElem | $.VarRef<linkedListElem> | null, tail?: linkedListElem | $.VarRef<linkedListElem> | null}>) {
		this._fields = {
			mtx: $.varRef(init?.mtx ? $.markAsStructValue($.cloneStructValue(init.mtx)) : $.markAsStructValue(new sync.RWMutex())),
			head: $.varRef(init?.head ?? (null as linkedListElem | $.VarRef<linkedListElem> | null)),
			tail: $.varRef(init?.tail ?? (null as linkedListElem | $.VarRef<linkedListElem> | null))
		}
	}

	public clone(): LinkedList {
		const cloned = new LinkedList()
		cloned._fields = {
			mtx: $.varRef($.markAsStructValue($.cloneStructValue(this._fields.mtx.value))),
			head: $.varRef(this._fields.head.value),
			tail: $.varRef(this._fields.tail.value)
		}
		return $.markAsStructValue(cloned)
	}

	public async IsEmpty(): globalThis.Promise<boolean> {
		const l: LinkedList | $.VarRef<LinkedList> | null = this
		await $.pointerValue<LinkedList>(l).mtx.Lock()
		let empty = $.pointerValue<LinkedList>(l).head == null
		$.pointerValue<LinkedList>(l).mtx.Unlock()
		return empty
	}

	public async Peek(): globalThis.Promise<[any, boolean]> {
		const l: LinkedList | $.VarRef<LinkedList> | null = this
		await $.pointerValue<LinkedList>(l).mtx.Lock()
		let val: any = null
		let exists = $.pointerValue<LinkedList>(l).head != null
		if (exists) {
			val = $.pointerValue<linkedListElem>($.pointerValue<LinkedList>(l).head).val
		}
		$.pointerValue<LinkedList>(l).mtx.Unlock()
		return [val, exists]
	}

	public async PeekTail(): globalThis.Promise<[any, boolean]> {
		const l: LinkedList | $.VarRef<LinkedList> | null = this
		await $.pointerValue<LinkedList>(l).mtx.Lock()
		let val: any = null
		let exists = $.pointerValue<LinkedList>(l).tail != null
		if (exists) {
			val = $.pointerValue<linkedListElem>($.pointerValue<LinkedList>(l).tail).val
		}
		$.pointerValue<LinkedList>(l).mtx.Unlock()
		return [val, exists]
	}

	public async Pop(): globalThis.Promise<[any, boolean]> {
		let l: LinkedList | $.VarRef<LinkedList> | null = this
		await $.pointerValue<LinkedList>(l).mtx.Lock()
		let val: any = null
		let exists = $.pointerValue<LinkedList>(l).head != null
		if (exists) {
			val = $.pointerValue<linkedListElem>($.pointerValue<LinkedList>(l).head).val
			if ($.pointerValue<linkedListElem>($.pointerValue<LinkedList>(l).head).next != null) {
				$.pointerValue<LinkedList>(l).head = $.pointerValue<linkedListElem>($.pointerValue<LinkedList>(l).head).next
			} else {
				$.pointerValue<LinkedList>(l).head = null
				$.pointerValue<LinkedList>(l).tail = null
			}
		}
		$.pointerValue<LinkedList>(l).mtx.Unlock()
		return [val, exists]
	}

	public async Push(val: any): globalThis.Promise<void> {
		const l: LinkedList | $.VarRef<LinkedList> | null = this
		await $.pointerValue<LinkedList>(l).mtx.Lock()
		LinkedList.prototype.pushElem.call(l, val)
		$.pointerValue<LinkedList>(l).mtx.Unlock()
	}

	public async PushFront(val: any): globalThis.Promise<void> {
		let l: LinkedList | $.VarRef<LinkedList> | null = this
		await $.pointerValue<LinkedList>(l).mtx.Lock()
		let elem: linkedListElem | $.VarRef<linkedListElem> | null = new linkedListElem({val: val})
		if ($.pointerValue<LinkedList>(l).head != null) {
			$.pointerValue<linkedListElem>(elem).next = $.pointerValue<LinkedList>(l).head
		} else {
			$.pointerValue<LinkedList>(l).tail = elem
		}
		$.pointerValue<LinkedList>(l).head = elem
		$.pointerValue<LinkedList>(l).mtx.Unlock()
	}

	public async Reset(): globalThis.Promise<void> {
		let l: LinkedList | $.VarRef<LinkedList> | null = this
		await $.pointerValue<LinkedList>(l).mtx.Lock()
		let __goscriptAssign0_0: linkedListElem | $.VarRef<linkedListElem> | null = null
		let __goscriptAssign0_1: linkedListElem | $.VarRef<linkedListElem> | null = null
		$.pointerValue<LinkedList>(l).head = __goscriptAssign0_0
		$.pointerValue<LinkedList>(l).tail = __goscriptAssign0_1
		$.pointerValue<LinkedList>(l).mtx.Unlock()
	}

	public pushElem(val: any): void {
		let l: LinkedList | $.VarRef<LinkedList> | null = this
		let elem: linkedListElem | $.VarRef<linkedListElem> | null = new linkedListElem({val: val})
		if ($.pointerValue<LinkedList>(l).tail == null) {
			$.pointerValue<LinkedList>(l).head = elem
		} else {
			$.pointerValue<linkedListElem>($.pointerValue<LinkedList>(l).tail).next = elem
		}
		$.pointerValue<LinkedList>(l).tail = elem
	}

	static __typeInfo = $.registerStructType(
		"linkedlist.LinkedList",
		() => new LinkedList(),
		[{ name: "IsEmpty", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Peek", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }, { type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "PeekTail", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }, { type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Pop", args: [], returns: [{ type: { kind: $.TypeKind.Interface, methods: [] } }, { type: { kind: $.TypeKind.Basic, name: "bool" } }] }, { name: "Push", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "PushFront", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }, { name: "Reset", args: [], returns: [] }, { name: "pushElem", args: [{ type: { kind: $.TypeKind.Basic, name: "unknown" } }], returns: [] }],
		LinkedList,
		[{ name: "mtx", key: "mtx", type: "sync.RWMutex" }, { name: "head", key: "head", type: { kind: $.TypeKind.Pointer, elemType: "linkedlist.linkedListElem" } }, { name: "tail", key: "tail", type: { kind: $.TypeKind.Pointer, elemType: "linkedlist.linkedListElem" } }]
	)
}

export class linkedListElem {
	// next is the next element in the list
	public get next(): linkedListElem | $.VarRef<linkedListElem> | null {
		return this._fields.next.value
	}
	public set next(value: linkedListElem | $.VarRef<linkedListElem> | null) {
		this._fields.next.value = value
	}

	// val is the value
	public get val(): any {
		return this._fields.val.value
	}
	public set val(value: any) {
		this._fields.val.value = value
	}

	public _fields: {
		next: $.VarRef<linkedListElem | $.VarRef<linkedListElem> | null>
		val: $.VarRef<any>
	}

	constructor(init?: Partial<{next?: linkedListElem | $.VarRef<linkedListElem> | null, val?: any}>) {
		this._fields = {
			next: $.varRef(init?.next ?? (null as linkedListElem | $.VarRef<linkedListElem> | null)),
			val: $.varRef(init?.val ?? (null as any))
		}
	}

	public clone(): linkedListElem {
		const cloned = new linkedListElem()
		cloned._fields = {
			next: $.varRef(this._fields.next.value),
			val: $.varRef(this._fields.val.value)
		}
		return $.markAsStructValue(cloned)
	}

	static __typeInfo = $.registerStructType(
		"linkedlist.linkedListElem",
		() => new linkedListElem(),
		[],
		linkedListElem,
		[{ name: "next", key: "next", type: { kind: $.TypeKind.Pointer, elemType: "linkedlist.linkedListElem" } }, { name: "val", key: "val", type: { kind: $.TypeKind.Interface, methods: [] } }]
	)
}

export function NewLinkedList<T>(__typeArgs: $.GenericTypeArgs | undefined, elems: $.Slice<T>): LinkedList | $.VarRef<LinkedList> | null {
	let ll: LinkedList | $.VarRef<LinkedList> | null = new LinkedList()
	for (let __goscriptRangeTarget0 = elems, __rangeIndex = 0; __rangeIndex < $.len(__goscriptRangeTarget0); __rangeIndex++) {
		let elem = __goscriptRangeTarget0![__rangeIndex]
		LinkedList.prototype.pushElem.call(ll, elem)
	}
	return ll
}
