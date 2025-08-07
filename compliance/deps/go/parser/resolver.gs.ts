import * as $ from "@goscript/builtin/index.js"
import { assert } from "./parser.gs.js";
import { bailout } from "./parser.gs.js";

import * as fmt from "@goscript/fmt/index.js"

import * as ast from "@goscript/go/ast/index.js"

import * as token from "@goscript/go/token/index.js"

import * as strings from "@goscript/strings/index.js"

let debugResolve: boolean = false

let maxScopeDepth: number = 1e3

export class resolver {
	public get handle(): token.File | null {
		return this._fields.handle.value
	}
	public set handle(value: token.File | null) {
		this._fields.handle.value = value
	}

	public get declErr(): ((p0: token.Pos, p1: string) => void) | null {
		return this._fields.declErr.value
	}
	public set declErr(value: ((p0: token.Pos, p1: string) => void) | null) {
		this._fields.declErr.value = value
	}

	// Ordinary identifier scopes
	// pkgScope.Outer == nil
	public get pkgScope(): ast.Scope | null {
		return this._fields.pkgScope.value
	}
	public set pkgScope(value: ast.Scope | null) {
		this._fields.pkgScope.value = value
	}

	// top-most scope; may be pkgScope
	public get topScope(): ast.Scope | null {
		return this._fields.topScope.value
	}
	public set topScope(value: ast.Scope | null) {
		this._fields.topScope.value = value
	}

	// unresolved identifiers
	public get unresolved(): $.Slice<ast.Ident | null> {
		return this._fields.unresolved.value
	}
	public set unresolved(value: $.Slice<ast.Ident | null>) {
		this._fields.unresolved.value = value
	}

	// scope depth
	public get depth(): number {
		return this._fields.depth.value
	}
	public set depth(value: number) {
		this._fields.depth.value = value
	}

	// Label scopes
	// (maintained by open/close LabelScope)
	// label scope for current function
	public get labelScope(): ast.Scope | null {
		return this._fields.labelScope.value
	}
	public set labelScope(value: ast.Scope | null) {
		this._fields.labelScope.value = value
	}

	// stack of unresolved labels
	public get targetStack(): $.Slice<$.Slice<ast.Ident | null>> {
		return this._fields.targetStack.value
	}
	public set targetStack(value: $.Slice<$.Slice<ast.Ident | null>>) {
		this._fields.targetStack.value = value
	}

	public _fields: {
		handle: $.VarRef<token.File | null>;
		declErr: $.VarRef<((p0: token.Pos, p1: string) => void) | null>;
		pkgScope: $.VarRef<ast.Scope | null>;
		topScope: $.VarRef<ast.Scope | null>;
		unresolved: $.VarRef<$.Slice<ast.Ident | null>>;
		depth: $.VarRef<number>;
		labelScope: $.VarRef<ast.Scope | null>;
		targetStack: $.VarRef<$.Slice<$.Slice<ast.Ident | null>>>;
	}

	constructor(init?: Partial<{declErr?: ((p0: token.Pos, p1: string) => void) | null, depth?: number, handle?: token.File | null, labelScope?: ast.Scope | null, pkgScope?: ast.Scope | null, targetStack?: $.Slice<$.Slice<ast.Ident | null>>, topScope?: ast.Scope | null, unresolved?: $.Slice<ast.Ident | null>}>) {
		this._fields = {
			handle: $.varRef(init?.handle ?? null),
			declErr: $.varRef(init?.declErr ?? null),
			pkgScope: $.varRef(init?.pkgScope ?? null),
			topScope: $.varRef(init?.topScope ?? null),
			unresolved: $.varRef(init?.unresolved ?? null),
			depth: $.varRef(init?.depth ?? 0),
			labelScope: $.varRef(init?.labelScope ?? null),
			targetStack: $.varRef(init?.targetStack ?? null)
		}
	}

	public clone(): resolver {
		const cloned = new resolver()
		cloned._fields = {
			handle: $.varRef(this._fields.handle.value ? $.markAsStructValue(this._fields.handle.value.clone()) : null),
			declErr: $.varRef(this._fields.declErr.value),
			pkgScope: $.varRef(this._fields.pkgScope.value ? $.markAsStructValue(this._fields.pkgScope.value.clone()) : null),
			topScope: $.varRef(this._fields.topScope.value ? $.markAsStructValue(this._fields.topScope.value.clone()) : null),
			unresolved: $.varRef(this._fields.unresolved.value),
			depth: $.varRef(this._fields.depth.value),
			labelScope: $.varRef(this._fields.labelScope.value ? $.markAsStructValue(this._fields.labelScope.value.clone()) : null),
			targetStack: $.varRef(this._fields.targetStack.value)
		}
		return cloned
	}

	public trace(format: string, ...args: any[]): void {
		const r = this
		fmt.Println(strings.Repeat(". ", r.depth) + r.sprintf(format, ...(args ?? [])))
	}

	public sprintf(format: string, ...args: any[]): string {
		const r = this
		for (let i = 0; i < $.len(args); i++) {
			const arg = args![i]
			{
				$.typeSwitch(arg, [{ types: ['token.Pos'], body: (arg) => {
					args![i] = $.markAsStructValue(await r.handle!.Position(arg).clone())
				}}])
			}
		}
		return fmt.Sprintf(format, ...(args ?? []))
	}

	public openScope(pos: token.Pos): void {
		const r = this
		r.depth++
		if (r.depth > 1000) {
			$.panic($.markAsStructValue(new bailout({msg: "exceeded max scope depth during object resolution", pos: pos})))
		}
		if (false) {
			r.trace("opening scope @%v", pos)
		}
		r.topScope = ast.NewScope(r.topScope)
	}

	public closeScope(): void {
		const r = this
		r.depth--
		if (false) {
			r.trace("closing scope")
		}
		r.topScope = r.topScope!.Outer
	}

	public openLabelScope(): void {
		const r = this
		r.labelScope = ast.NewScope(r.labelScope)
		r.targetStack = $.append(r.targetStack, null)
	}

	public closeLabelScope(): void {
		const r = this
		let n = $.len(r.targetStack) - 1
		let scope = r.labelScope
		for (let _i = 0; _i < $.len(r.targetStack![n]); _i++) {
			const ident = r.targetStack![n]![_i]
			{
				ident!.Obj = scope!.Lookup(ident!.Name)
				if (ident!.Obj == null && r.declErr != null) {
					r.declErr(ident!.Pos(), fmt.Sprintf("label %s undefined", ident!.Name))
				}
			}
		}
		r.targetStack = $.goSlice(r.targetStack, 0, n)
		r.labelScope = r.labelScope!.Outer
	}

	public _declare(decl: null | any, data: null | any, scope: ast.Scope | null, kind: ast.ObjKind, ...idents: ast.Ident | null[]): void {
		const r = this
		for (let _i = 0; _i < $.len(idents); _i++) {
			const ident = idents![_i]
			{
				if (ident!.Obj != null) {
					$.panic(fmt.Sprintf("%v: identifier %s already declared or resolved", ident!.Pos(), ident!.Name))
				}
				let obj = ast.NewObj(kind, ident!.Name)
				// remember the corresponding declaration for redeclaration
				// errors and global variable resolution/typechecking phase
				obj!.Decl = decl
				obj!.Data = data
				// Identifiers (for receiver type parameters) are written to the scope, but
				// never set as the resolved object. See go.dev/issue/50956.
				{
					let { ok: ok } = $.typeAssert<ast.Ident | null>(decl, {kind: $.TypeKind.Pointer, elemType: 'ast.Ident'})
					if (!ok) {
						ident!.Obj = obj
					}
				}
				if (ident!.Name != "_") {
					if (false) {
						r.trace("declaring %s@%v", ident!.Name, ident!.Pos())
					}
					{
						let alt = scope!.Insert(obj)
						if (alt != null && r.declErr != null) {
							let prevDecl = ""
							{
								let pos = alt!.Pos()
								if (token.Pos_IsValid(pos)) {
									prevDecl = r.sprintf("\n\tprevious declaration at %v", pos)
								}
							}
							r.declErr(ident!.Pos(), fmt.Sprintf("%s redeclared in this block%s", ident!.Name, prevDecl))
						}
					}
				}
			}
		}
	}

	public shortVarDecl(decl: ast.AssignStmt | null): void {
		const r = this
		let n = 0 // number of new variables
		for (let _i = 0; _i < $.len(decl!.Lhs); _i++) {
			const x = decl!.Lhs![_i]
			{

				// remember corresponding assignment for other tools

				// redeclaration

				// new declaration
				{
					let { value: ident, ok: isIdent } = $.typeAssert<ast.Ident | null>(x, {kind: $.TypeKind.Pointer, elemType: 'ast.Ident'})
					if (isIdent) {
						assert(ident!.Obj == null, "identifier already declared or resolved")
						let obj = ast.NewObj(ast.Var, ident!.Name)
						// remember corresponding assignment for other tools
						obj!.Decl = decl
						ident!.Obj = obj

						// redeclaration

						// new declaration
						if (ident!.Name != "_") {
							if (false) {
								r.trace("declaring %s@%v", ident!.Name, ident!.Pos())
							}

							// redeclaration

							// new declaration
							{
								let alt = r.topScope!.Insert(obj)
								if (alt != null) {
									ident!.Obj = alt // redeclaration
								}
								 else {
									n++
								}
							}
						}
					}
				}
			}
		}
		if (n == 0 && r.declErr != null) {
			r.declErr(decl!.Lhs![0]!.Pos(), "no new variables on left side of :=")
		}
	}

	// If x is an identifier, resolve attempts to resolve x by looking up
	// the object it denotes. If no object is found and collectUnresolved is
	// set, x is marked as unresolved and collected in the list of unresolved
	// identifiers.
	public resolve(ident: ast.Ident | null, collectUnresolved: boolean): void {
		const r = this
		if (ident!.Obj != null) {
			$.panic(r.sprintf("%v: identifier %s already declared or resolved", ident!.Pos(), ident!.Name))
		}
		if (ident!.Name == "_") {
			return 
		}
		for (let s = r.topScope; s != null; s = s!.Outer) {

			// Identifiers (for receiver type parameters) are written to the scope,
			// but never set as the resolved object. See go.dev/issue/50956.
			{
				let obj = s!.Lookup(ident!.Name)
				if (obj != null) {
					if (false) {
						r.trace("resolved %v:%s to %v", ident!.Pos(), ident!.Name, obj)
					}
					assert(obj!.Name != "", "obj with no name")
					// Identifiers (for receiver type parameters) are written to the scope,
					// but never set as the resolved object. See go.dev/issue/50956.
					{
						let { ok: ok } = $.typeAssert<ast.Ident | null>(obj!.Decl, {kind: $.TypeKind.Pointer, elemType: 'ast.Ident'})
						if (!ok) {
							ident!.Obj = obj
						}
					}
					return 
				}
			}
		}
		if (collectUnresolved) {
			ident!.Obj = unresolved
			r.unresolved = $.append(r.unresolved, ident)
		}
	}

	public walkExprs(list: $.Slice<ast.Expr>): void {
		const r = this
		for (let _i = 0; _i < $.len(list); _i++) {
			const node = list![_i]
			{
				ast.Walk(r, node)
			}
		}
	}

	public walkLHS(list: $.Slice<ast.Expr>): void {
		const r = this
		for (let _i = 0; _i < $.len(list); _i++) {
			const expr = list![_i]
			{
				let expr = ast.Unparen(expr)
				{
					let { ok: ok } = $.typeAssert<ast.Ident | null>(expr, {kind: $.TypeKind.Pointer, elemType: 'ast.Ident'})
					if (!ok && expr != null) {
						ast.Walk(r, expr)
					}
				}
			}
		}
	}

	public walkStmts(list: $.Slice<ast.Stmt>): void {
		const r = this
		for (let _i = 0; _i < $.len(list); _i++) {
			const stmt = list![_i]
			{
				ast.Walk(r, stmt)
			}
		}
	}

	public Visit(node: ast.Node): ast.Visitor {
		const r = this
		using __defer = new $.DisposableStack();
		if (false && node != null) {
			r.trace("node %T@%v", node, node!.Pos())
		}
		$.typeSwitch(node, [{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.Ident'}], body: (n) => {
			r.resolve(n, true)
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.FuncLit'}], body: (n) => {
			r.openScope(n!.Pos())
			__defer.defer(() => {
				r.closeScope()
			});
			r.walkFuncType(n!.Type)
			r.walkBody(n!.Body)
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.SelectorExpr'}], body: (n) => {
			ast.Walk(r, n!.X)
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.StructType'}], body: (n) => {
			r.openScope(n!.Pos())
			__defer.defer(() => {
				r.closeScope()
			});
			r.walkFieldList(n!.Fields, ast.Var)
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.FuncType'}], body: (n) => {
			r.openScope(n!.Pos())
			__defer.defer(() => {
				r.closeScope()
			});
			r.walkFuncType(n)
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.CompositeLit'}], body: (n) => {
			if (n!.Type != null) {
				ast.Walk(r, n!.Type)
			}
			for (let _i = 0; _i < $.len(n!.Elts); _i++) {
				const e = n!.Elts![_i]
				{

					// See go.dev/issue/45160: try to resolve composite lit keys, but don't
					// collect them as unresolved if resolution failed. This replicates
					// existing behavior when resolving during parsing.
					{
						let { value: kv } = $.typeAssert<ast.KeyValueExpr | null>(e, {kind: $.TypeKind.Pointer, elemType: 'ast.KeyValueExpr'})
						if (kv != null) {
							// See go.dev/issue/45160: try to resolve composite lit keys, but don't
							// collect them as unresolved if resolution failed. This replicates
							// existing behavior when resolving during parsing.
							{
								let { value: ident } = $.typeAssert<ast.Ident | null>(kv!.Key, {kind: $.TypeKind.Pointer, elemType: 'ast.Ident'})
								if (ident != null) {
									r.resolve(ident, false)
								}
								 else {
									ast.Walk(r, kv!.Key)
								}
							}
							ast.Walk(r, kv!.Value)
						}
						 else {
							ast.Walk(r, e)
						}
					}
				}
			}
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.InterfaceType'}], body: (n) => {
			r.openScope(n!.Pos())
			__defer.defer(() => {
				r.closeScope()
			});
			r.walkFieldList(n!.Methods, ast.Fun)
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.LabeledStmt'}], body: (n) => {
			r._declare(n, null, r.labelScope, ast.Lbl, n!.Label)
			ast.Walk(r, n!.Stmt)
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.AssignStmt'}], body: (n) => {
			r.walkExprs(n!.Rhs)
			if (n!.Tok == token.DEFINE) {
				r.shortVarDecl(n)
			}
			 else {
				r.walkExprs(n!.Lhs)
			}
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.BranchStmt'}], body: (n) => {
			if (n!.Tok != token.FALLTHROUGH && n!.Label != null) {
				let depth = $.len(r.targetStack) - 1
				r.targetStack![depth] = $.append(r.targetStack![depth], n!.Label)
			}
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.BlockStmt'}], body: (n) => {
			r.openScope(n!.Pos())
			__defer.defer(() => {
				r.closeScope()
			});
			r.walkStmts(n!.List)
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.IfStmt'}], body: (n) => {
			r.openScope(n!.Pos())
			__defer.defer(() => {
				r.closeScope()
			});
			if (n!.Init != null) {
				ast.Walk(r, n!.Init)
			}
			ast.Walk(r, n!.Cond)
			ast.Walk(r, n!.Body)
			if (n!.Else != null) {
				ast.Walk(r, n!.Else)
			}
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.CaseClause'}], body: (n) => {
			r.walkExprs(n!.List)
			r.openScope(n!.Pos())
			__defer.defer(() => {
				r.closeScope()
			});
			r.walkStmts(n!.Body)
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.SwitchStmt'}], body: (n) => {
			r.openScope(n!.Pos())
			__defer.defer(() => {
				r.closeScope()
			});
			if (n!.Init != null) {
				ast.Walk(r, n!.Init)
			}
			if (n!.Tag != null) {
				using __defer = new $.DisposableStack();
				// The scope below reproduces some unnecessary behavior of the parser,
				// opening an extra scope in case this is a type switch. It's not needed
				// for expression switches.
				// TODO: remove this once we've matched the parser resolution exactly.
				if (n!.Init != null) {
					using __defer = new $.DisposableStack();
					r.openScope(n!.Tag!.Pos())
					__defer.defer(() => {
						r.closeScope()
					});
				}
				ast.Walk(r, n!.Tag)
			}
			if (n!.Body != null) {
				r.walkStmts(n!.Body!.List)
			}
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.TypeSwitchStmt'}], body: (n) => {
			if (n!.Init != null) {
				using __defer = new $.DisposableStack();
				r.openScope(n!.Pos())
				__defer.defer(() => {
					r.closeScope()
				});
				ast.Walk(r, n!.Init)
			}
			r.openScope(n!.Assign!.Pos())
			__defer.defer(() => {
				r.closeScope()
			});
			ast.Walk(r, n!.Assign)
			if (n!.Body != null) {
				r.walkStmts(n!.Body!.List)
			}
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.CommClause'}], body: (n) => {
			r.openScope(n!.Pos())
			__defer.defer(() => {
				r.closeScope()
			});
			if (n!.Comm != null) {
				ast.Walk(r, n!.Comm)
			}
			r.walkStmts(n!.Body)
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.SelectStmt'}], body: (n) => {
			if (n!.Body != null) {
				r.walkStmts(n!.Body!.List)
			}
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.ForStmt'}], body: (n) => {
			r.openScope(n!.Pos())
			__defer.defer(() => {
				r.closeScope()
			});
			if (n!.Init != null) {
				ast.Walk(r, n!.Init)
			}
			if (n!.Cond != null) {
				ast.Walk(r, n!.Cond)
			}
			if (n!.Post != null) {
				ast.Walk(r, n!.Post)
			}
			ast.Walk(r, n!.Body)
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.RangeStmt'}], body: (n) => {
			r.openScope(n!.Pos())
			__defer.defer(() => {
				r.closeScope()
			});
			ast.Walk(r, n!.X)
			let lhs: $.Slice<ast.Expr> = null
			if (n!.Key != null) {
				lhs = $.append(lhs, n!.Key)
			}
			if (n!.Value != null) {
				lhs = $.append(lhs, n!.Value)
			}
			if ($.len(lhs) > 0) {

				// Note: we can't exactly match the behavior of object resolution
				// during the parsing pass here, as it uses the position of the RANGE
				// token for the RHS OpPos. That information is not contained within
				// the AST.

				// TODO(rFindley): this walkLHS reproduced the parser resolution, but
				// is it necessary? By comparison, for a normal AssignStmt we don't
				// walk the LHS in case there is an invalid identifier list.
				if (n!.Tok == token.DEFINE) {
					// Note: we can't exactly match the behavior of object resolution
					// during the parsing pass here, as it uses the position of the RANGE
					// token for the RHS OpPos. That information is not contained within
					// the AST.
					let _as = new ast.AssignStmt({Lhs: lhs, Rhs: $.arrayToSlice<ast.Expr>([new ast.UnaryExpr({Op: token.RANGE, X: n!.X})]), Tok: token.DEFINE, TokPos: n!.TokPos})
					// TODO(rFindley): this walkLHS reproduced the parser resolution, but
					// is it necessary? By comparison, for a normal AssignStmt we don't
					// walk the LHS in case there is an invalid identifier list.
					r.walkLHS(lhs)
					r.shortVarDecl(_as)
				}
				 else {
					r.walkExprs(lhs)
				}
			}
			ast.Walk(r, n!.Body)
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.GenDecl'}], body: (n) => {
			switch (n!.Tok) {
				case token.CONST:
				case token.VAR:
					for (let i = 0; i < $.len(n!.Specs); i++) {
						const spec = n!.Specs![i]
						{
							let spec = $.mustTypeAssert<ast.ValueSpec | null>(spec, {kind: $.TypeKind.Pointer, elemType: 'ast.ValueSpec'})
							let kind = ast.Con
							if (n!.Tok == token.VAR) {
								kind = ast.Var
							}
							r.walkExprs(spec!.Values)
							if (spec!.Type != null) {
								ast.Walk(r, spec!.Type)
							}
							r._declare(spec, i, r.topScope, kind, ...(spec!.Names ?? []))
						}
					}
					break
				case token.TYPE:
					for (let _i = 0; _i < $.len(n!.Specs); _i++) {
						const spec = n!.Specs![_i]
						{
							using __defer = new $.DisposableStack();
							let spec = $.mustTypeAssert<ast.TypeSpec | null>(spec, {kind: $.TypeKind.Pointer, elemType: 'ast.TypeSpec'})
							// Go spec: The scope of a type identifier declared inside a function begins
							// at the identifier in the TypeSpec and ends at the end of the innermost
							// containing block.
							r._declare(spec, null, r.topScope, ast.Typ, spec!.Name)
							if (spec!.TypeParams != null) {
								using __defer = new $.DisposableStack();
								r.openScope(spec!.Pos())
								__defer.defer(() => {
									r.closeScope()
								});
								r.walkTParams(spec!.TypeParams)
							}
							ast.Walk(r, spec!.Type)
						}
					}
					break
			}
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.FuncDecl'}], body: (n) => {
			r.openScope(n!.Pos())
			__defer.defer(() => {
				r.closeScope()
			});
			r.walkRecv(n!.Recv)
			if (n!.Type!.TypeParams != null) {

				// TODO(rFindley): need to address receiver type parameters.
				r.walkTParams(n!.Type!.TypeParams)
				// TODO(rFindley): need to address receiver type parameters.
			}
			r.resolveList(n!.Type!.Params)
			r.resolveList(n!.Type!.Results)
			r.declareList(n!.Recv, ast.Var)
			r.declareList(n!.Type!.Params, ast.Var)
			r.declareList(n!.Type!.Results, ast.Var)
			r.walkBody(n!.Body)
			if (n!.Recv == null && n!.Name!.Name != "init") {
				r._declare(n, null, r.pkgScope, ast.Fun, n!.Name)
			}
		}}], () => {
			return r
		})
		return null
	}

	public walkFuncType(typ: ast.FuncType | null): void {
		const r = this
		r.resolveList(typ!.Params)
		r.resolveList(typ!.Results)
		r.declareList(typ!.Params, ast.Var)
		r.declareList(typ!.Results, ast.Var)
	}

	public resolveList(list: ast.FieldList | null): void {
		const r = this
		if (list == null) {
			return 
		}
		for (let _i = 0; _i < $.len(list!.List); _i++) {
			const f = list!.List![_i]
			{
				if (f!.Type != null) {
					ast.Walk(r, f!.Type)
				}
			}
		}
	}

	public declareList(list: ast.FieldList | null, kind: ast.ObjKind): void {
		const r = this
		if (list == null) {
			return 
		}
		for (let _i = 0; _i < $.len(list!.List); _i++) {
			const f = list!.List![_i]
			{
				r._declare(f, null, r.topScope, kind, ...(f!.Names ?? []))
			}
		}
	}

	public walkRecv(recv: ast.FieldList | null): void {
		const r = this
		if (recv == null || $.len(recv!.List) == 0) {
			return 
		}
		let typ = recv!.List![0]!.Type
		{
			let { value: ptr, ok: ok } = $.typeAssert<ast.StarExpr | null>(typ, {kind: $.TypeKind.Pointer, elemType: 'ast.StarExpr'})
			if (ok) {
				typ = ptr!.X
			}
		}
		// exprs to declare
		let declareExprs: $.Slice<ast.Expr> = null
		// exprs to resolve
		let resolveExprs: $.Slice<ast.Expr> = null
		$.typeSwitch(typ, [{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.IndexExpr'}], body: (typ) => {
			declareExprs = $.arrayToSlice<ast.Expr>([typ!.Index])
			resolveExprs = $.append(resolveExprs, typ!.X)
		}},
		{ types: [{kind: $.TypeKind.Pointer, elemType: 'ast.IndexListExpr'}], body: (typ) => {
			declareExprs = typ!.Indices
			resolveExprs = $.append(resolveExprs, typ!.X)
		}}], () => {
			resolveExprs = $.append(resolveExprs, typ)
		})
		for (let _i = 0; _i < $.len(declareExprs); _i++) {
			const expr = declareExprs![_i]
			{

				// The receiver type parameter expression is invalid, but try to resolve
				// it anyway for consistency.
				{
					let { value: id } = $.typeAssert<ast.Ident | null>(expr, {kind: $.TypeKind.Pointer, elemType: 'ast.Ident'})
					if (id != null) {
						r._declare(expr, null, r.topScope, ast.Typ, id)
					}
					 else {
						// The receiver type parameter expression is invalid, but try to resolve
						// it anyway for consistency.
						resolveExprs = $.append(resolveExprs, expr)
					}
				}
			}
		}
		for (let _i = 0; _i < $.len(resolveExprs); _i++) {
			const expr = resolveExprs![_i]
			{
				if (expr != null) {
					ast.Walk(r, expr)
				}
			}
		}
		for (let _i = 0; _i < $.len($.goSlice(recv!.List, 1, undefined)); _i++) {
			const f = $.goSlice(recv!.List, 1, undefined)![_i]
			{
				if (f!.Type != null) {
					ast.Walk(r, f!.Type)
				}
			}
		}
	}

	public walkFieldList(list: ast.FieldList | null, kind: ast.ObjKind): void {
		const r = this
		if (list == null) {
			return 
		}
		r.resolveList(list)
		r.declareList(list, kind)
	}

	// walkTParams is like walkFieldList, but declares type parameters eagerly so
	// that they may be resolved in the constraint expressions held in the field
	// Type.
	public walkTParams(list: ast.FieldList | null): void {
		const r = this
		r.declareList(list, ast.Typ)
		r.resolveList(list)
	}

	public walkBody(body: ast.BlockStmt | null): void {
		const r = this
		using __defer = new $.DisposableStack();
		if (body == null) {
			return 
		}
		r.openLabelScope()
		__defer.defer(() => {
			r.closeLabelScope()
		});
		r.walkStmts(body!.List)
	}

	// Register this type with the runtime type system
	static __typeInfo = $.registerStructType(
	  'resolver',
	  new resolver(),
	  [{ name: "trace", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [] }, { name: "sprintf", args: [{ name: "format", type: { kind: $.TypeKind.Basic, name: "string" } }, { name: "args", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Interface, methods: [] } } }], returns: [{ type: { kind: $.TypeKind.Basic, name: "string" } }] }, { name: "openScope", args: [{ name: "pos", type: "Pos" }], returns: [] }, { name: "closeScope", args: [], returns: [] }, { name: "openLabelScope", args: [], returns: [] }, { name: "closeLabelScope", args: [], returns: [] }, { name: "declare", args: [{ name: "decl", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "data", type: { kind: $.TypeKind.Interface, methods: [] } }, { name: "scope", type: { kind: $.TypeKind.Pointer, elemType: "Scope" } }, { name: "kind", type: "ObjKind" }, { name: "idents", type: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "Ident" } } }], returns: [] }, { name: "shortVarDecl", args: [{ name: "decl", type: { kind: $.TypeKind.Pointer, elemType: "AssignStmt" } }], returns: [] }, { name: "resolve", args: [{ name: "ident", type: { kind: $.TypeKind.Pointer, elemType: "Ident" } }, { name: "collectUnresolved", type: { kind: $.TypeKind.Basic, name: "boolean" } }], returns: [] }, { name: "walkExprs", args: [{ name: "list", type: { kind: $.TypeKind.Slice, elemType: "Expr" } }], returns: [] }, { name: "walkLHS", args: [{ name: "list", type: { kind: $.TypeKind.Slice, elemType: "Expr" } }], returns: [] }, { name: "walkStmts", args: [{ name: "list", type: { kind: $.TypeKind.Slice, elemType: "Stmt" } }], returns: [] }, { name: "Visit", args: [{ name: "node", type: "Node" }], returns: [{ type: "Visitor" }] }, { name: "walkFuncType", args: [{ name: "typ", type: { kind: $.TypeKind.Pointer, elemType: "FuncType" } }], returns: [] }, { name: "resolveList", args: [{ name: "list", type: { kind: $.TypeKind.Pointer, elemType: "FieldList" } }], returns: [] }, { name: "declareList", args: [{ name: "list", type: { kind: $.TypeKind.Pointer, elemType: "FieldList" } }, { name: "kind", type: "ObjKind" }], returns: [] }, { name: "walkRecv", args: [{ name: "recv", type: { kind: $.TypeKind.Pointer, elemType: "FieldList" } }], returns: [] }, { name: "walkFieldList", args: [{ name: "list", type: { kind: $.TypeKind.Pointer, elemType: "FieldList" } }, { name: "kind", type: "ObjKind" }], returns: [] }, { name: "walkTParams", args: [{ name: "list", type: { kind: $.TypeKind.Pointer, elemType: "FieldList" } }], returns: [] }, { name: "walkBody", args: [{ name: "body", type: { kind: $.TypeKind.Pointer, elemType: "BlockStmt" } }], returns: [] }],
	  resolver,
	  {"handle": { kind: $.TypeKind.Pointer, elemType: "File" }, "declErr": { kind: $.TypeKind.Function, params: ["Pos", { kind: $.TypeKind.Basic, name: "string" }], results: [] }, "pkgScope": { kind: $.TypeKind.Pointer, elemType: "Scope" }, "topScope": { kind: $.TypeKind.Pointer, elemType: "Scope" }, "unresolved": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "Ident" } }, "depth": { kind: $.TypeKind.Basic, name: "number" }, "labelScope": { kind: $.TypeKind.Pointer, elemType: "Scope" }, "targetStack": { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Slice, elemType: { kind: $.TypeKind.Pointer, elemType: "Ident" } } }}
	);
}

let unresolved: ast.Object | null = new ast.Object()

// resolveFile walks the given file to resolve identifiers within the file
// scope, updating ast.Ident.Obj fields with declaration information.
//
// If declErr is non-nil, it is used to report declaration errors during
// resolution. tok is used to format position in error messages.
export function resolveFile(file: ast.File | null, handle: token.File | null, declErr: ((p0: token.Pos, p1: string) => void) | null): void {
	let pkgScope = null
	let r = new resolver({declErr: declErr, depth: 1, handle: handle, pkgScope: pkgScope, topScope: pkgScope})

	for (let _i = 0; _i < $.len(file!.Decls); _i++) {
		const decl = file!.Decls![_i]
		{
			ast.Walk(r, decl)
		}
	}

	r!.closeScope()
	assert(r!.topScope == null, "unbalanced scopes")
	assert(r!.labelScope == null, "unbalanced label scopes")

	// resolve global identifiers within the same file
	let i = 0

	// i <= index for current ident

	// also removes unresolved sentinel
	for (let _i = 0; _i < $.len(r!.unresolved); _i++) {
		const ident = r!.unresolved![_i]
		{
			// i <= index for current ident
			assert((ident!.Obj === unresolved), "object already resolved")
			ident!.Obj = r!.pkgScope!.Lookup(ident!.Name) // also removes unresolved sentinel
			if (ident!.Obj == null) {
				r!.unresolved![i] = ident
				i++
			}
			 else if (false) {
				let pos = $.mustTypeAssert<null | {
					Pos(): token.Pos
				}>(ident!.Obj!.Decl, {kind: $.TypeKind.Interface, methods: [{ name: 'Pos', args: [], returns: [{ type: 'token.Pos' }] }]})!.Pos()
				r!.trace("resolved %s@%v to package object %v", ident!.Name, ident!.Pos(), pos)
			}
		}
	}
	file!.Scope = r!.pkgScope
	file!.Unresolved = $.goSlice(r!.unresolved, 0, i)
}

