import * as $ from "@goscript/builtin/index.js"
import { Inspect } from "./walk.gs.js";
import { Comment, CommentGroup, Decl, Field, File, Ident, Node, Spec, Stmt } from "./ast.gs.js";

import * as bytes from "@goscript/bytes/index.js"

import * as cmp from "@goscript/cmp/index.js"

import * as fmt from "@goscript/fmt/index.js"

import * as token from "@goscript/go/token/index.js"

import * as slices from "@goscript/slices/index.js"

import * as strings from "@goscript/strings/index.js"

export type CommentMap = Map<Node, $.Slice<CommentGroup | null>> | null;

export function CommentMap_addComment(cmap: CommentMap, n: Node, c: CommentGroup | null): void {
	let list = $.mapGet(cmap, n, null)[0]
	if ($.len(list) == 0) {
		list = $.arrayToSlice<CommentGroup | null>([c])
	}
	 else {
		list = $.append(list, c)
	}
	$.mapSet(cmap, n, list)
}

export function CommentMap_Update(cmap: CommentMap, old: Node, _new: Node): Node {
	{
		let list = $.mapGet(cmap, old, null)[0]
		if ($.len(list) > 0) {
			$.deleteMapEntry(cmap, old)
			$.mapSet(cmap, _new, $.append($.mapGet(cmap, _new, null)[0], list))
		}
	}
	return _new
}

export function CommentMap_Filter(cmap: CommentMap, node: Node): CommentMap {
	let umap = $.makeMap<Node, $.Slice<CommentGroup | null>>()
	Inspect(node, (n: Node): boolean => {
		{
			let g = $.mapGet(cmap, n, null)[0]
			if ($.len(g) > 0) {
				$.mapSet(umap, n, g)
			}
		}
		return true
	})
	return umap
}

export function CommentMap_Comments(cmap: CommentMap): $.Slice<CommentGroup | null> {
	let list = $.makeSlice<CommentGroup | null>(0, $.len(cmap))
	for (const [_k, e] of cmap?.entries() ?? []) {
		{
			list = $.append(list, e)
		}
	}
	sortComments(list)
	return list
}

export function CommentMap_String(cmap: CommentMap): string {
	let nodes: $.Slice<Node> = null
	for (const [node, _v] of cmap?.entries() ?? []) {
		{
			nodes = $.append(nodes, node)
		}
	}
	slices.SortFunc(nodes, (a: Node, b: Node): number => {
		let r = cmp.Compare(a!.Pos(), b!.Pos())
		if (r != 0) {
			return r
		}
		return cmp.Compare(a!.End(), b!.End())
	})
	let buf: strings.Builder = new strings.Builder()
	fmt.Fprintln(buf, "CommentMap {")
	for (let _i = 0; _i < $.len(nodes); _i++) {
		const node = nodes![_i]
		{
			let comment = $.mapGet(cmap, node, null)[0]
			// print name of identifiers; print node type for other nodes
			let s: string = ""
			{
				let { value: ident, ok: ok } = $.typeAssert<Ident | null>(node, {kind: $.TypeKind.Pointer, elemType: 'Ident'})
				if (ok) {
					s = ident!.Name
				}
				 else {
					s = fmt.Sprintf("%T", node)
				}
			}
			fmt.Fprintf(buf, "\t%p  %20s:  %s\n", node, s, summary(comment))
		}
	}
	fmt.Fprintln(buf, "}")
	return buf.String()
}


export class commentListReader {
	public get fset(): token.FileSet | null {
		return this._fields.fset.value
	}
	public set fset(value: token.FileSet | null) {
		this._fields.fset.value = value
	}

	public get list(): $.Slice<CommentGroup | null> {
		return this._fields.list.value
	}
	public set list(value: $.Slice<CommentGroup | null>) {
		this._fields.list.value = value
	}

	public get index(): number {
		return this._fields.index.value
	}
	public set index(value: number) {
		this._fields.index.value = value
	}

	// comment group at current index
	public get comment(): CommentGroup | null {
		return this._fields.comment.value
	}
	public set comment(value: CommentGroup | null) {
		this._fields.comment.value = value
	}

	// source interval of comment group at current index
	public get pos(): token.Position {
		return this._fields.pos.value
	}
	public set pos(value: token.Position) {
		this._fields.pos.value = value
	}

	// source interval of comment group at current index
	public get end(): token.Position {
		return this._fields.end.value
	}
	public set end(value: token.Position) {
		this._fields.end.value = value
	}

	public _fields: {
		fset: $.VarRef<token.FileSet | null>;
		list: $.VarRef<$.Slice<CommentGroup | null>>;
		index: $.VarRef<number>;
		comment: $.VarRef<CommentGroup | null>;
		pos: $.VarRef<token.Position>;
		end: $.VarRef<token.Position>;
	}

	constructor(init?: Partial<{comment?: CommentGroup | null, end?: token.Position, fset?: token.FileSet | null, index?: number, list?: $.Slice<CommentGroup | null>, pos?: token.Position}>) {
		this._fields = {
			fset: $.varRef(init?.fset ?? null),
			list: $.varRef(init?.list ?? null),
			index: $.varRef(init?.index ?? 0),
			comment: $.varRef(init?.comment ?? null),
			pos: $.varRef(init?.pos ? $.markAsStructValue(init.pos.clone()) : new token.Position()),
			end: $.varRef(init?.end ? $.markAsStructValue(init.end.clone()) : new token.Position())
		}
	}

	public clone(): commentListReader {
		const cloned = new commentListReader()
		cloned._fields = {
			fset: $.varRef(this._fields.fset.value ? $.markAsStructValue(this._fields.fset.value.clone()) : null),
			list: $.varRef(this._fields.list.value),
			index: $.varRef(this._fields.index.value),
			comment: $.varRef(this._fields.comment.value ? $.markAsStructValue(this._fields.comment.value.clone()) : null),
			pos: $.varRef($.markAsStructValue(this._fields.pos.value.clone())),
			end: $.varRef($.markAsStructValue(this._fields.end.value.clone()))
		}
		return cloned
	}

	public eol(): boolean {
		const r = this
		return r.index >= $.len(r.list)
	}

	public next(): void {
		const r = this
		if (!r.eol()) {
			r.comment = r.list![r.index]
			r.pos = $.markAsStructValue(await r.fset!.Position(r.comment!.Pos()).clone())
			r.end = $.markAsStructValue(await r.fset!.Position(r.comment!.End()).clone())
			r.index++
		}
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'commentListReader',
	  new commentListReader(),
	  [{ name: "eol", args: [], returns: [{ type: { kind: $.TypeKind.Basic, name: "boolean" } }] }, { name: "next", args: [], returns: [] }],
	  commentListReader,
	  {"fset": { kind: $.TypeKind.Pointer, elemType: "FileSet" }, "list": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "CommentGroup" } }, "index": { kind: $.TypeKind.Basic, name: "number" }, "comment": { kind: $.TypeKind.Pointer, elemType: "CommentGroup" }, "pos": "Position", "end": "Position"}
	);
}

export type nodeStack = $.Slice<Node>;

export function nodeStack_push(s: $.VarRef<nodeStack>, n: Node): void {
	s.pop(n!.Pos())
	s!.value = $.append((s!.value), n)
}

export function nodeStack_pop(s: $.VarRef<nodeStack>, pos: token.Pos): Node {
	let i = $.len(s!.value)
	for (; i > 0 && (s!.value)![i - 1]!.End() <= pos; ) {
		top = (s!.value)![i - 1]
		i--
	}
	s!.value = $.goSlice((s!.value), 0, i)
	return top
}


// sortComments sorts the list of comment groups in source order.
export function sortComments(list: $.Slice<CommentGroup | null>): void {
	slices.SortFunc(list, (a: CommentGroup | null, b: CommentGroup | null): number => {
		return cmp.Compare(a!.Pos(), b!.Pos())
	})
}

// nodeList returns the list of nodes of the AST n in source order.
export function nodeList(n: Node): $.Slice<Node> {
	let list: $.Slice<Node> = null

	// don't collect comments
	Inspect(n, (n: Node): boolean => {
		// don't collect comments
		$.typeSwitch(n, [{ types: ['nil', {kind: $.TypeKind.Pointer, elemType: 'CommentGroup'}, {kind: $.TypeKind.Pointer, elemType: 'Comment'}], body: () => {
			return false
		}}])
		list = $.append(list, n)
		return true
	})

	// Note: The current implementation assumes that Inspect traverses the
	//       AST in depth-first and thus _source_ order. If AST traversal
	//       does not follow source order, the sorting call below will be
	//       required.
	// slices.Sort(list, func(a, b Node) int {
	//       r := cmp.Compare(a.Pos(), b.Pos())
	//       if r != 0 {
	//               return r
	//       }
	//       return cmp.Compare(a.End(), b.End())
	// })

	return list
}

// NewCommentMap creates a new comment map by associating comment groups
// of the comments list with the nodes of the AST specified by node.
//
// A comment group g is associated with a node n if:
//
//   - g starts on the same line as n ends
//   - g starts on the line immediately following n, and there is
//     at least one empty line after g and before the next node
//   - g starts before n and is not associated to the node before n
//     via the previous rules
//
// NewCommentMap tries to associate a comment group to the "largest"
// node possible: For instance, if the comment is a line comment
// trailing an assignment, the comment is associated with the entire
// assignment rather than just the last operand in the assignment.
export function NewCommentMap(fset: token.FileSet | null, node: Node, comments: $.Slice<CommentGroup | null>): CommentMap {

	// no comments to map
	if ($.len(comments) == 0) {
		return null
	}

	let cmap = $.makeMap<Node, $.Slice<CommentGroup | null>>()

	// set up comment reader r
	let tmp = $.makeSlice<CommentGroup | null>($.len(comments))
	$.copy(tmp, comments) // don't change incoming comments
	sortComments(tmp)
	let r = $.markAsStructValue(new commentListReader({fset: fset, list: tmp})) // !r.eol() because len(comments) > 0
	r.next()

	// create node list in lexical order
	let nodes = nodeList(node)
	nodes = $.append(nodes, null) // append sentinel

	// set up iteration variables

	// previous node
	// end of p
	// previous node group (enclosing nodes of "importance")
	// end of pg
	// stack of node groups
	// previous node
	let p: Node = null
	// end of p
	let pend: token.Position = new token.Position()
	// previous node group (enclosing nodes of "importance")
	let pg: Node = null
	// end of pg
	let pgend: token.Position = new token.Position()
	// stack of node groups
	let stack: nodeStack = null

	// current node position

	// set fake sentinel position to infinity so that
	// all comments get processed before the sentinel

	// process comments before current node

	// determine recent node group

	// Try to associate a comment first with a node group
	// (i.e., a node of "importance" such as a declaration);
	// if that fails, try to associate it with the most recent
	// node.
	// TODO(gri) try to simplify the logic below

	// 1) comment starts on same line as previous node group ends, or
	// 2) comment starts on the line immediately after the
	//    previous node group and there is an empty line before
	//    the current node
	// => associate comment with previous node group

	// same rules apply as above for p rather than pg,
	// but also associate with p if we are at the end (q == nil)

	// otherwise, associate comment with current node

	// we can only reach here if there was no p
	// which would imply that there were no nodes

	// update previous node

	// update previous node group if we see an "important" node
	for (let _i = 0; _i < $.len(nodes); _i++) {
		const q = nodes![_i]
		{
			let qpos: token.Position = new token.Position()

			// current node position

			// set fake sentinel position to infinity so that
			// all comments get processed before the sentinel
			if (q != null) {
				qpos = $.markAsStructValue(await fset!.Position(q!.Pos()).clone()) // current node position
			}
			 else {
				// set fake sentinel position to infinity so that
				// all comments get processed before the sentinel
				let infinity: number = (1 << 30)
				qpos.Offset = 1073741824
				qpos.Line = 1073741824
			}

			// process comments before current node

			// determine recent node group

			// Try to associate a comment first with a node group
			// (i.e., a node of "importance" such as a declaration);
			// if that fails, try to associate it with the most recent
			// node.
			// TODO(gri) try to simplify the logic below

			// 1) comment starts on same line as previous node group ends, or
			// 2) comment starts on the line immediately after the
			//    previous node group and there is an empty line before
			//    the current node
			// => associate comment with previous node group

			// same rules apply as above for p rather than pg,
			// but also associate with p if we are at the end (q == nil)

			// otherwise, associate comment with current node

			// we can only reach here if there was no p
			// which would imply that there were no nodes
			for (; r.end.Offset <= qpos.Offset; ) {
				// determine recent node group
				{
					let top = nodeStack_pop(stack, r.comment!.Pos())
					if (top != null) {
						pg = top
						pgend = $.markAsStructValue(await fset!.Position(pg!.End()).clone())
					}
				}
				// Try to associate a comment first with a node group
				// (i.e., a node of "importance" such as a declaration);
				// if that fails, try to associate it with the most recent
				// node.
				// TODO(gri) try to simplify the logic below
				let assoc: Node = null

				// 1) comment starts on same line as previous node group ends, or
				// 2) comment starts on the line immediately after the
				//    previous node group and there is an empty line before
				//    the current node
				// => associate comment with previous node group

				// same rules apply as above for p rather than pg,
				// but also associate with p if we are at the end (q == nil)

				// otherwise, associate comment with current node

				// we can only reach here if there was no p
				// which would imply that there were no nodes
				switch (true) {
					case pg != null && (pgend.Line == r.pos.Line || pgend.Line + 1 == r.pos.Line && r.end.Line + 1 < qpos.Line):
						assoc = pg
						break
					case p != null && (pend.Line == r.pos.Line || pend.Line + 1 == r.pos.Line && r.end.Line + 1 < qpos.Line || q == null):
						assoc = p
						break
					default:
						if (q == null) {
							// we can only reach here if there was no p
							// which would imply that there were no nodes
							$.panic("internal error: no comments should be associated with sentinel")
						}
						assoc = q
						break
				}
				CommentMap_addComment(cmap, assoc, r.comment)
				if (r.eol()) {
					return cmap
				}
				r.next()
			}

			// update previous node
			p = q
			pend = $.markAsStructValue(await fset!.Position(p!.End()).clone())

			// update previous node group if we see an "important" node
			$.typeSwitch(q, [{ types: [{kind: $.TypeKind.Pointer, elemType: 'File'}, {kind: $.TypeKind.Pointer, elemType: 'Field'}, 'Decl', 'Spec', 'Stmt'], body: () => {
				nodeStack_push(stack, q)
			}}])
		}
	}

	return cmap
}

export function summary(list: $.Slice<CommentGroup | null>): string {
	let maxLen: number = 40
	let buf: bytes.Buffer = new bytes.Buffer()

	// collect comments text

	// Note: CommentGroup.Text() does too much work for what we
	//       need and would only replace this innermost loop.
	//       Just do it explicitly.
	loop: for (let _i = 0; _i < $.len(list); _i++) {
		const group = list![_i]
		{
			// Note: CommentGroup.Text() does too much work for what we
			//       need and would only replace this innermost loop.
			//       Just do it explicitly.
			for (let _i = 0; _i < $.len(group!.List); _i++) {
				const comment = group!.List![_i]
				{
					if (buf.Len() >= 40) {
						break
					}
					buf.WriteString(comment!.Text)
				}
			}
		}
	}

	// truncate if too long
	if (buf.Len() > 40) {
		buf.Truncate(40 - 3)
		buf.WriteString("...")
	}

	// replace any invisibles with blanks
	let bytes = buf.Bytes()
	for (let i = 0; i < $.len(bytes); i++) {
		const b = bytes![i]
		{
			switch (b) {
				case 9:
				case 10:
				case 13:
					bytes![i] = 32
					break
			}
		}
	}

	return $.bytesToString(bytes)
}

