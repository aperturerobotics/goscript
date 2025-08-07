import * as $ from "@goscript/builtin/index.js"
import { ArrayType, AssignStmt, BadDecl, BadExpr, BadStmt, BasicLit, BinaryExpr, BlockStmt, BranchStmt, CallExpr, CaseClause, ChanType, CommClause, Comment, CommentGroup, CompositeLit, DeclStmt, DeferStmt, Ellipsis, EmptyStmt, ExprStmt, Field, FieldList, File, ForStmt, FuncDecl, FuncLit, FuncType, GenDecl, GoStmt, Ident, IfStmt, ImportSpec, IncDecStmt, IndexExpr, IndexListExpr, InterfaceType, KeyValueExpr, LabeledStmt, MapType, Node, Package, ParenExpr, RangeStmt, ReturnStmt, SelectStmt, SelectorExpr, SendStmt, SliceExpr, StarExpr, StructType, SwitchStmt, TypeAssertExpr, TypeSpec, TypeSwitchStmt, UnaryExpr, ValueSpec } from "./ast.gs.js";

import * as fmt from "@goscript/fmt/index.js"

import * as iter from "@goscript/iter/index.js"

export type Visitor = null | {
	Visit(node: Node): Visitor
}

$.registerInterfaceType(
  'Visitor',
  null, // Zero value for interface is null
  [{ name: "Visit", args: [{ name: "node", type: "Node" }], returns: [{ type: "Visitor" }] }]
);

export type inspector = ((p0: Node) => boolean) | null;

export function inspector_Visit(f: inspector, node: Node): Visitor {
	if (f!(node)) {
		return f
	}
	return null
}


export function walkList<N extends Node>(v: Visitor, list: $.Slice<N>): void {
	for (let _i = 0; _i < $.len(list); _i++) {
		const node = list![_i]
		{
			Walk(v, node)
		}
	}
}

// Walk traverses an AST in depth-first order: It starts by calling
// v.Visit(node); node must not be nil. If the visitor w returned by
// v.Visit(node) is not nil, Walk is invoked recursively with visitor
// w for each of the non-nil children of node, followed by a call of
// w.Visit(nil).
export function Walk(v: Visitor, node: Node): void {
	{
		v = v!.Visit(node)
		if (v == null) {
			return 
		}
	}

	// walk children
	// (the order of the cases matches the order
	// of the corresponding node types in ast.go)

	// Comments and fields

	// nothing to do

	// Expressions

	// nothing to do

	// Types

	// Statements

	// nothing to do

	// nothing to do

	// Declarations

	// nothing to do

	// Files and packages

	// don't walk n.Comments - they have been
	// visited already through the individual
	// nodes
	$.typeSwitch(node, [{ types: [{kind: $.TypeKind.Pointer, elemType: 'Comment'}], body: (n) => {}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'CommentGroup'}], body: (n) => {
		walkList(v, n!.List)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'Field'}], body: (n) => {
		if (n!.Doc != null) {
			Walk(v, n!.Doc)
		}
		walkList(v, n!.Names)
		if (n!.Type != null) {
			Walk(v, n!.Type)
		}
		if (n!.Tag != null) {
			Walk(v, n!.Tag)
		}
		if (n!.Comment != null) {
			Walk(v, n!.Comment)
		}
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'FieldList'}], body: (n) => {
		walkList(v, n!.List)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'BadExpr'}, {kind: $.TypeKind.Pointer, elemType: 'Ident'}, {kind: $.TypeKind.Pointer, elemType: 'BasicLit'}], body: (n) => {}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'Ellipsis'}], body: (n) => {
		if (n!.Elt != null) {
			Walk(v, n!.Elt)
		}
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'FuncLit'}], body: (n) => {
		Walk(v, n!.Type)
		Walk(v, n!.Body)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'CompositeLit'}], body: (n) => {
		if (n!.Type != null) {
			Walk(v, n!.Type)
		}
		walkList(v, n!.Elts)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'ParenExpr'}], body: (n) => {
		Walk(v, n!.X)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'SelectorExpr'}], body: (n) => {
		Walk(v, n!.X)
		Walk(v, n!.Sel)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'IndexExpr'}], body: (n) => {
		Walk(v, n!.X)
		Walk(v, n!.Index)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'IndexListExpr'}], body: (n) => {
		Walk(v, n!.X)
		walkList(v, n!.Indices)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'SliceExpr'}], body: (n) => {
		Walk(v, n!.X)
		if (n!.Low != null) {
			Walk(v, n!.Low)
		}
		if (n!.High != null) {
			Walk(v, n!.High)
		}
		if (n!.Max != null) {
			Walk(v, n!.Max)
		}
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'TypeAssertExpr'}], body: (n) => {
		Walk(v, n!.X)
		if (n!.Type != null) {
			Walk(v, n!.Type)
		}
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'CallExpr'}], body: (n) => {
		Walk(v, n!.Fun)
		walkList(v, n!.Args)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'StarExpr'}], body: (n) => {
		Walk(v, n!.X)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'UnaryExpr'}], body: (n) => {
		Walk(v, n!.X)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'BinaryExpr'}], body: (n) => {
		Walk(v, n!.X)
		Walk(v, n!.Y)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'KeyValueExpr'}], body: (n) => {
		Walk(v, n!.Key)
		Walk(v, n!.Value)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'ArrayType'}], body: (n) => {
		if (n!.Len != null) {
			Walk(v, n!.Len)
		}
		Walk(v, n!.Elt)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'StructType'}], body: (n) => {
		Walk(v, n!.Fields)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'FuncType'}], body: (n) => {
		if (n!.TypeParams != null) {
			Walk(v, n!.TypeParams)
		}
		if (n!.Params != null) {
			Walk(v, n!.Params)
		}
		if (n!.Results != null) {
			Walk(v, n!.Results)
		}
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'InterfaceType'}], body: (n) => {
		Walk(v, n!.Methods)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'MapType'}], body: (n) => {
		Walk(v, n!.Key)
		Walk(v, n!.Value)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'ChanType'}], body: (n) => {
		Walk(v, n!.Value)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'BadStmt'}], body: (n) => {}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'DeclStmt'}], body: (n) => {
		Walk(v, n!.Decl)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'EmptyStmt'}], body: (n) => {}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'LabeledStmt'}], body: (n) => {
		Walk(v, n!.Label)
		Walk(v, n!.Stmt)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'ExprStmt'}], body: (n) => {
		Walk(v, n!.X)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'SendStmt'}], body: (n) => {
		Walk(v, n!.Chan)
		Walk(v, n!.Value)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'IncDecStmt'}], body: (n) => {
		Walk(v, n!.X)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'AssignStmt'}], body: (n) => {
		walkList(v, n!.Lhs)
		walkList(v, n!.Rhs)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'GoStmt'}], body: (n) => {
		Walk(v, n!.Call)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'DeferStmt'}], body: (n) => {
		Walk(v, n!.Call)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'ReturnStmt'}], body: (n) => {
		walkList(v, n!.Results)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'BranchStmt'}], body: (n) => {
		if (n!.Label != null) {
			Walk(v, n!.Label)
		}
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'BlockStmt'}], body: (n) => {
		walkList(v, n!.List)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'IfStmt'}], body: (n) => {
		if (n!.Init != null) {
			Walk(v, n!.Init)
		}
		Walk(v, n!.Cond)
		Walk(v, n!.Body)
		if (n!.Else != null) {
			Walk(v, n!.Else)
		}
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'CaseClause'}], body: (n) => {
		walkList(v, n!.List)
		walkList(v, n!.Body)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'SwitchStmt'}], body: (n) => {
		if (n!.Init != null) {
			Walk(v, n!.Init)
		}
		if (n!.Tag != null) {
			Walk(v, n!.Tag)
		}
		Walk(v, n!.Body)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'TypeSwitchStmt'}], body: (n) => {
		if (n!.Init != null) {
			Walk(v, n!.Init)
		}
		Walk(v, n!.Assign)
		Walk(v, n!.Body)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'CommClause'}], body: (n) => {
		if (n!.Comm != null) {
			Walk(v, n!.Comm)
		}
		walkList(v, n!.Body)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'SelectStmt'}], body: (n) => {
		Walk(v, n!.Body)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'ForStmt'}], body: (n) => {
		if (n!.Init != null) {
			Walk(v, n!.Init)
		}
		if (n!.Cond != null) {
			Walk(v, n!.Cond)
		}
		if (n!.Post != null) {
			Walk(v, n!.Post)
		}
		Walk(v, n!.Body)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'RangeStmt'}], body: (n) => {
		if (n!.Key != null) {
			Walk(v, n!.Key)
		}
		if (n!.Value != null) {
			Walk(v, n!.Value)
		}
		Walk(v, n!.X)
		Walk(v, n!.Body)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'ImportSpec'}], body: (n) => {
		if (n!.Doc != null) {
			Walk(v, n!.Doc)
		}
		if (n!.Name != null) {
			Walk(v, n!.Name)
		}
		Walk(v, n!.Path)
		if (n!.Comment != null) {
			Walk(v, n!.Comment)
		}
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'ValueSpec'}], body: (n) => {
		if (n!.Doc != null) {
			Walk(v, n!.Doc)
		}
		walkList(v, n!.Names)
		if (n!.Type != null) {
			Walk(v, n!.Type)
		}
		walkList(v, n!.Values)
		if (n!.Comment != null) {
			Walk(v, n!.Comment)
		}
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'TypeSpec'}], body: (n) => {
		if (n!.Doc != null) {
			Walk(v, n!.Doc)
		}
		Walk(v, n!.Name)
		if (n!.TypeParams != null) {
			Walk(v, n!.TypeParams)
		}
		Walk(v, n!.Type)
		if (n!.Comment != null) {
			Walk(v, n!.Comment)
		}
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'BadDecl'}], body: (n) => {}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'GenDecl'}], body: (n) => {
		if (n!.Doc != null) {
			Walk(v, n!.Doc)
		}
		walkList(v, n!.Specs)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'FuncDecl'}], body: (n) => {
		if (n!.Doc != null) {
			Walk(v, n!.Doc)
		}
		if (n!.Recv != null) {
			Walk(v, n!.Recv)
		}
		Walk(v, n!.Name)
		Walk(v, n!.Type)
		if (n!.Body != null) {
			Walk(v, n!.Body)
		}
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'File'}], body: (n) => {
		if (n!.Doc != null) {
			Walk(v, n!.Doc)
		}
		Walk(v, n!.Name)
		walkList(v, n!.Decls)
	}},
	{ types: [{kind: $.TypeKind.Pointer, elemType: 'Package'}], body: (n) => {
		for (const [_k, f] of n!.Files?.entries() ?? []) {
			{
				Walk(v, f)
			}
		}
	}}], () => {
		$.panic(fmt.Sprintf("ast.Walk: unexpected node type %T", n))
	})

	null
}

// Inspect traverses an AST in depth-first order: It starts by calling
// f(node); node must not be nil. If f returns true, Inspect invokes f
// recursively for each of the non-nil children of node, followed by a
// call of f(nil).
export function Inspect(node: Node, f: ((p0: Node) => boolean) | null): void {
	Walk(Object.assign(f, { __goTypeName: 'inspector' }), node)
}

// Preorder returns an iterator over all the nodes of the syntax tree
// beneath (and including) the specified root, in depth-first
// preorder.
//
// For greater control over the traversal of each subtree, use [Inspect].
export function Preorder(root: Node): iter.Seq<Node> | null {

	// yield must not be called once ok is false.
	return (_yield: ((p0: Node) => boolean) | null): void => {
		let ok = true

		// yield must not be called once ok is false.
		Inspect(root, (n: Node): boolean => {

			// yield must not be called once ok is false.
			if (n != null) {
				// yield must not be called once ok is false.
				ok = ok && _yield!(n)
			}
			return ok
		})
	}
}

