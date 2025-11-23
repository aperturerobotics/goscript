package compiler

import (
	"fmt"
	"go/ast"
	"go/token"
	"go/types"
	"slices"
)

// WriteDecls iterates through a slice of Go top-level declarations (`ast.Decl`)
// and translates each one into its TypeScript equivalent.
// It distinguishes between:
// - Function declarations (`ast.FuncDecl`):
//   - If it's a regular function (no receiver), it delegates to `WriteFuncDeclAsFunction`.
//   - Methods (with receivers) are handled within `WriteTypeSpec` when their
//     associated struct/type is defined, so they are skipped here.
//   - General declarations (`ast.GenDecl`), which can contain imports, constants,
//     variables, or type definitions: It iterates through `d.Specs` and calls
//     `WriteSpec` for each specification.
//
// Type declarations are sorted by dependencies to ensure referenced types are
// defined before types that reference them, avoiding initialization order issues.
// A newline is added after each processed declaration or spec group for readability.
// Unknown declaration types result in a printed diagnostic message.
func (c *GoToTSCompiler) WriteDecls(decls []ast.Decl) error {
	// Separate type declarations from other declarations for dependency sorting
	var typeSpecs []*ast.TypeSpec
	var varSpecs []*ast.ValueSpec
	var otherDecls []ast.Decl
	var otherSpecs []ast.Spec

	for _, decl := range decls {
		switch d := decl.(type) {
		case *ast.FuncDecl:
			// Only handle top-level functions here. Methods are handled within WriteTypeSpec.
			if d.Recv == nil {
				otherDecls = append(otherDecls, d)
			}
		case *ast.GenDecl:
			for _, spec := range d.Specs {
				if typeSpec, ok := spec.(*ast.TypeSpec); ok {
					typeSpecs = append(typeSpecs, typeSpec)
				} else if varSpec, ok := spec.(*ast.ValueSpec); ok && d.Tok == token.VAR {
					varSpecs = append(varSpecs, varSpec)
				} else {
					otherSpecs = append(otherSpecs, spec)
				}
			}
		default:
			otherDecls = append(otherDecls, d)
		}
	}

	// Sort type declarations by dependencies
	sortedTypeSpecs, err := c.sortTypeSpecsByDependencies(typeSpecs)
	if err != nil {
		// Surface the error instead of silently falling back
		return fmt.Errorf("circular dependency detected sorting type declarations: %w", err)
	}

	// Sort variable declarations by type dependencies
	sortedVarSpecs, err := c.sortVarSpecsByTypeDependencies(varSpecs, typeSpecs)
	if err != nil {
		return fmt.Errorf("failed to sort variable declarations: %w", err)
	}

	// Write non-type, non-var declarations first (imports, constants)
	for _, spec := range otherSpecs {
		if err := c.WriteSpec(spec); err != nil {
			return err
		}
		c.tsw.WriteLine("") // Add space after spec
	}

	// Write sorted type declarations
	for _, typeSpec := range sortedTypeSpecs {
		if err := c.WriteSpec(typeSpec); err != nil {
			return err
		}
		c.tsw.WriteLine("") // Add space after spec
	}

	// Write sorted variable declarations
	for _, varSpec := range sortedVarSpecs {
		if err := c.WriteSpec(varSpec); err != nil {
			return err
		}
		c.tsw.WriteLine("") // Add space after spec
	}

	// Write function declarations last
	for _, decl := range otherDecls {
		switch d := decl.(type) {
		case *ast.FuncDecl:
			if err := c.WriteFuncDeclAsFunction(d); err != nil {
				return err
			}
			c.tsw.WriteLine("") // Add space after function
		default:
			return fmt.Errorf("unknown decl: %#v", decl)
		}
	}

	return nil
}

// sortTypeSpecsByDependencies performs a topological sort of type specifications
// based on their dependencies to ensure referenced types are defined before
// types that reference them.
func (c *GoToTSCompiler) sortTypeSpecsByDependencies(typeSpecs []*ast.TypeSpec) ([]*ast.TypeSpec, error) {
	if len(typeSpecs) <= 1 {
		return typeSpecs, nil
	}

	// Build dependency graph
	dependencies := make(map[string][]string) // typeName -> list of types it depends on
	typeSpecMap := make(map[string]*ast.TypeSpec)

	// First pass: collect all type names
	for _, typeSpec := range typeSpecs {
		typeName := typeSpec.Name.Name
		typeSpecMap[typeName] = typeSpec
		dependencies[typeName] = []string{}
	}

	// Second pass: analyze dependencies
	for _, typeSpec := range typeSpecs {
		typeName := typeSpec.Name.Name
		deps := c.extractTypeDependencies(typeSpec.Type, typeSpecMap)
		dependencies[typeName] = deps
	}

	// Perform topological sort
	sorted, err := c.topologicalSort(dependencies)
	if err != nil {
		return nil, err
	}

	// Build result in sorted order
	var result []*ast.TypeSpec
	for _, typeName := range sorted {
		if typeSpec, exists := typeSpecMap[typeName]; exists {
			result = append(result, typeSpec)
		}
	}

	return result, nil
}

// extractTypeDependencies extracts only the dependencies that cause TypeScript initialization order issues.
// These are dependencies where the constructor of one type directly instantiates another type.
//
// TRUE dependencies (cause initialization issues):
// - Direct struct fields (non-pointer): type A struct { b B } -> A constructor calls new B()
// - Embedded struct fields: type A struct { B } -> A constructor calls new B()
// - Direct type aliases: type A B -> A directly wraps B
// - Array/slice of structs: type A []B -> needs B for default values
//
// FALSE dependencies (don't cause initialization issues):
// - Pointer fields: type A struct { b *B } -> just stores reference, no constructor call
// - Interface fields: type A struct { b SomeInterface } -> stores interface, no concrete instantiation
// - Map types: type A map[K]V -> map initialized empty, no constructor calls
// - Array/slice of pointers: type A []*B -> array of pointers, no constructor calls
func (c *GoToTSCompiler) extractTypeDependencies(typeExpr ast.Expr, typeSpecMap map[string]*ast.TypeSpec) []string {
	var deps []string

	switch t := typeExpr.(type) {
	case *ast.Ident:
		// Direct type reference (e.g., type MyType OtherType)
		if _, isLocalType := typeSpecMap[t.Name]; isLocalType {
			deps = append(deps, t.Name)
		}

	case *ast.StructType:
		// Struct type - check field types, but be more selective
		if t.Fields != nil {
			for _, field := range t.Fields.List {
				fieldDeps := c.extractStructFieldDependencies(field.Type, typeSpecMap)
				deps = append(deps, fieldDeps...)
			}
		}

	case *ast.ArrayType:
		// Array/slice type - only depends on element type if element is a struct (not pointer)
		if !c.isPointerType(t.Elt) {
			elemDeps := c.extractTypeDependencies(t.Elt, typeSpecMap)
			deps = append(deps, elemDeps...)
		}
		// Arrays of pointers don't create initialization dependencies

	case *ast.StarExpr:
		// Pointer types don't create initialization dependencies
		// The pointed-to type doesn't need to be initialized when creating a pointer field

	case *ast.MapType:
		// Map types don't create initialization dependencies
		// Maps are initialized empty, no constructor calls needed

	case *ast.InterfaceType:
		// Interface types don't create initialization dependencies

	case *ast.FuncType:
		// Function types don't create initialization dependencies

	case *ast.SelectorExpr:
		// External package types don't create local dependencies

		// Add other type expressions as needed
	}

	// Sort dependencies for deterministic output
	slices.Sort(deps)
	return deps
}

// extractStructFieldDependencies extracts dependencies from struct field types
func (c *GoToTSCompiler) extractStructFieldDependencies(fieldType ast.Expr, typeSpecMap map[string]*ast.TypeSpec) []string {
	var deps []string

	switch t := fieldType.(type) {
	case *ast.Ident:
		// Direct field type: struct { b B } - this requires B to be initialized
		if _, isLocalType := typeSpecMap[t.Name]; isLocalType {
			deps = append(deps, t.Name)
		}

	case *ast.StarExpr:
		// Pointer field: struct { b *B } - this doesn't require B initialization
		// Pointers are just references, no constructor call needed

	case *ast.ArrayType:
		// Array field: struct { b []B } or struct { b [5]B }
		// Only create dependency if element type is not a pointer
		if !c.isPointerType(t.Elt) {
			elemDeps := c.extractTypeDependencies(t.Elt, typeSpecMap)
			deps = append(deps, elemDeps...)
		}

	case *ast.MapType:
		// Map field: struct { b map[K]V } - maps don't require initialization dependencies

	case *ast.InterfaceType:
		// Interface field: struct { b SomeInterface } - no concrete type dependency

	case *ast.FuncType:
		// Function field: struct { b func() } - no dependency

		// Handle other field types as needed
	}

	return deps
}

// sortVarSpecsByTypeDependencies sorts variable declarations based on their value dependencies
// to ensure that variables are initialized in the correct order (respecting JavaScript's TDZ).
// For example: var StdEncoding = NewEncoding(...) must come before var RawStdEncoding = StdEncoding.WithPadding(...)
func (c *GoToTSCompiler) sortVarSpecsByTypeDependencies(varSpecs []*ast.ValueSpec, typeSpecs []*ast.TypeSpec) ([]*ast.ValueSpec, error) {
	if len(varSpecs) <= 1 {
		return varSpecs, nil
	}

	// Build a map of variable names to their specs
	varSpecMap := make(map[string]*ast.ValueSpec)
	varNames := []string{}
	for _, varSpec := range varSpecs {
		if len(varSpec.Names) > 0 {
			name := varSpec.Names[0].Name
			varSpecMap[name] = varSpec
			varNames = append(varNames, name)
		}
	}

	// Build dependency graph: varName -> list of variables it depends on
	dependencies := make(map[string][]string)
	for _, name := range varNames {
		dependencies[name] = []string{}
	}

	// Extract value dependencies from initializer expressions
	for _, varSpec := range varSpecs {
		if len(varSpec.Names) == 0 {
			continue
		}
		varName := varSpec.Names[0].Name

		// Check initializer expressions for variable references
		for _, value := range varSpec.Values {
			deps := c.extractVarDependencies(value, varSpecMap)
			dependencies[varName] = append(dependencies[varName], deps...)
		}
	}

	// Perform topological sort
	sorted, err := c.topologicalSort(dependencies)
	if err != nil {
		return nil, err
	}

	// Build result in sorted order
	result := make([]*ast.ValueSpec, 0, len(varSpecs))
	for _, varName := range sorted {
		if spec, exists := varSpecMap[varName]; exists {
			result = append(result, spec)
		}
	}

	return result, nil
}

// extractVarDependencies extracts variable dependencies from an initializer expression.
// It returns a list of variable names that the expression depends on.
func (c *GoToTSCompiler) extractVarDependencies(expr ast.Expr, varSpecMap map[string]*ast.ValueSpec) []string {
	var deps []string
	seen := make(map[string]bool)

	ast.Inspect(expr, func(n ast.Node) bool {
		if ident, ok := n.(*ast.Ident); ok {
			// Check if this identifier refers to a package-level variable
			if _, isVar := varSpecMap[ident.Name]; isVar {
				if !seen[ident.Name] {
					deps = append(deps, ident.Name)
					seen[ident.Name] = true
				}
			}
		}
		return true
	})

	return deps
}

// topologicalSort performs a topological sort of the dependency graph
func (c *GoToTSCompiler) topologicalSort(dependencies map[string][]string) ([]string, error) {
	// Kahn's algorithm for topological sorting with deterministic ordering
	inDegree := make(map[string]int)
	graph := make(map[string][]string)

	// Initialize in-degree counts and reverse graph
	for node := range dependencies {
		inDegree[node] = 0
		graph[node] = []string{}
	}

	// Build reverse graph and count in-degrees
	for node, deps := range dependencies {
		// Sort dependencies for consistent output
		sortedDeps := make([]string, len(deps))
		copy(sortedDeps, deps)
		slices.Sort(sortedDeps)

		for _, dep := range sortedDeps {
			if _, exists := inDegree[dep]; exists {
				graph[dep] = append(graph[dep], node)
				inDegree[node]++
			}
		}
	}

	// Sort neighbors in graph for consistency
	for node := range graph {
		slices.Sort(graph[node])
	}

	// Find nodes with no incoming edges and sort them
	var queue []string
	for node, degree := range inDegree {
		if degree == 0 {
			queue = append(queue, node)
		}
	}
	slices.Sort(queue) // Sort initial queue for deterministic output

	var result []string

	for len(queue) > 0 {
		// Remove node from queue (already sorted)
		current := queue[0]
		queue = queue[1:]
		result = append(result, current)

		// Collect new zero-degree nodes
		var newZeroNodes []string
		for _, neighbor := range graph[current] {
			inDegree[neighbor]--
			if inDegree[neighbor] == 0 {
				newZeroNodes = append(newZeroNodes, neighbor)
			}
		}

		// Sort new zero-degree nodes and add to queue
		slices.Sort(newZeroNodes)
		queue = append(queue, newZeroNodes...)
	}

	// Check for cycles
	if len(result) != len(dependencies) {
		// Find the remaining nodes to help debug the circular dependency
		processed := make(map[string]bool)
		for _, name := range result {
			processed[name] = true
		}

		var remaining []string
		for name := range dependencies {
			if !processed[name] {
				remaining = append(remaining, name)
			}
		}
		slices.Sort(remaining)

		return nil, fmt.Errorf("circular dependency detected in type declarations. Remaining types: %v", remaining)
	}

	return result, nil
}

// WriteFuncDeclAsFunction translates a Go function declaration (`ast.FuncDecl`)
// that does not have a receiver (i.e., it's a regular function, not a method)
// into a TypeScript function.
//   - Go documentation comments (`decl.Doc`) are preserved.
//   - If the Go function is exported (name starts with an uppercase letter) or is
//     the `main` function, the `export` keyword is added to the TypeScript output.
//   - If the `Analysis` data indicates the function is asynchronous, the `async`
//     keyword is prepended.
//   - The function signature (parameters and return type) is translated using `WriteFuncType`,
//     passing the `isAsync` status.
//   - The function body (`decl.Body`) is translated using `WriteStmt`.
//
// This function specifically handles top-level functions; methods are generated
// by `WriteFuncDeclAsMethod` within the context of their type definition.
func (c *GoToTSCompiler) WriteFuncDeclAsFunction(decl *ast.FuncDecl) error {
	if decl.Recv != nil {
		// This function should not be called for methods.
		// Methods are handled by WriteFuncDeclAsMethod within WriteTypeSpec.
		return nil
	}

	if decl.Doc != nil {
		c.WriteDoc(decl.Doc)
	}

	// Export all functions for intra-package visibility
	// This allows other files in the same package to import functions
	c.tsw.WriteLiterally("export ")

	// Check if this function is async using the analysis data
	var isAsync bool
	if obj := c.pkg.TypesInfo.Defs[decl.Name]; obj != nil {
		isAsync = c.analysis.IsAsyncFunc(obj)
	}

	// Always make main function async (only in main package)
	if decl.Name.Name == "main" && c.pkg.Name == "main" {
		isAsync = true
	}

	if isAsync {
		c.tsw.WriteLiterally("async ")
	}

	c.tsw.WriteLiterally("function ")
	if err := c.WriteValueExpr(decl.Name); err != nil { // Function name is a value identifier
		return fmt.Errorf("failed to write function name: %w", err)
	}

	// Write type parameters if present
	if decl.Type.TypeParams != nil {
		c.WriteTypeParameters(decl.Type.TypeParams)
	}

	// WriteFuncType needs to be aware if the function is async
	c.WriteFuncType(decl.Type, isAsync) // Write signature (params, return type)
	c.tsw.WriteLiterally(" ")

	if c.hasNamedReturns(decl.Type.Results) {
		c.tsw.WriteLine("{")
		c.tsw.Indent(1)

		// Declare named return variables and initialize them to their zero values
		if err := c.writeNamedReturnDeclarations(decl.Type.Results); err != nil {
			return fmt.Errorf("failed to write named return declarations: %w", err)
		}
	}

	if err := c.WriteStmt(decl.Body); err != nil {
		return fmt.Errorf("failed to write function body: %w", err)
	}

	if c.hasNamedReturns(decl.Type.Results) {
		c.tsw.Indent(-1)
		c.tsw.WriteLine("}")
	}

	return nil
}

// WriteFuncDeclAsMethod translates a Go function declaration (`ast.FuncDecl`)
// that has a receiver (i.e., it's a method) into a TypeScript class method.
//   - It preserves Go documentation comments (`decl.Doc`).
//   - The method is declared as `public`.
//   - If the `Analysis` data indicates the method is asynchronous, the `async`
//     keyword is prepended.
//   - The method name retains its original Go casing.
//   - Parameters and return types are translated using `WriteFieldList` and
//     `WriteTypeExpr`, respectively. Async methods have their return types
//     wrapped in `Promise<>`.
//   - The method body is translated. If the Go receiver has a name (e.g., `(s *MyStruct)`),
//     a `const receiverName = this;` binding is generated at the start of the
//     TypeScript method body to make `this` available via the Go receiver's name.
//     If the method body requires deferred cleanup (`NeedsDefer`), the appropriate
//     `using __defer = new $.DisposableStack()` (or `AsyncDisposableStack`)
//     is also generated.
//
// This function assumes it is called only for `FuncDecl` nodes that are methods.
func (c *GoToTSCompiler) WriteFuncDeclAsMethod(decl *ast.FuncDecl) error {
	_, err := c.writeMethodSignature(decl)
	if err != nil {
		return err
	}

	return c.writeMethodBodyWithReceiverBinding(decl, "this")
}

// writeNamedReturnDeclarations generates TypeScript variable declarations for named return parameters.
// It declares each named return variable with its appropriate type and zero value.
func (c *GoToTSCompiler) writeNamedReturnDeclarations(results *ast.FieldList) error {
	if results == nil {
		return nil
	}

	for _, field := range results.List {
		for _, name := range field.Names {
			c.tsw.WriteLiterallyf("let %s: ", c.sanitizeIdentifier(name.Name))
			c.WriteTypeExpr(field.Type)
			c.tsw.WriteLiterally(" = ")
			c.WriteZeroValueForType(c.pkg.TypesInfo.TypeOf(field.Type))
			c.tsw.WriteLine("")
		}
	}
	return nil
}

// hasNamedReturns checks if a function type has any named return parameters.
func (c *GoToTSCompiler) hasNamedReturns(results *ast.FieldList) bool {
	if results == nil {
		return false
	}

	for _, field := range results.List {
		if len(field.Names) > 0 {
			return true
		}
	}
	return false
}

// writeMethodSignature writes the TypeScript method signature including async, public modifiers, name, parameters, and return type
func (c *GoToTSCompiler) writeMethodSignature(decl *ast.FuncDecl) (bool, error) {
	if decl.Doc != nil {
		c.WriteDoc(decl.Doc)
	}

	// Determine if method is async
	var isAsync bool
	if obj := c.pkg.TypesInfo.Defs[decl.Name]; obj != nil {
		isAsync = c.analysis.IsAsyncFunc(obj)

		// Check if this method must be async due to interface constraints
		if !isAsync && decl.Recv != nil && len(decl.Recv.List) > 0 {
			// Get the receiver type
			receiverType := decl.Recv.List[0].Type
			if starExpr, ok := receiverType.(*ast.StarExpr); ok {
				receiverType = starExpr.X
			}

			if ident, ok := receiverType.(*ast.Ident); ok {
				// Get the named type for this receiver
				if receiverObj := c.pkg.TypesInfo.Uses[ident]; receiverObj != nil {
					if namedType, ok := receiverObj.Type().(*types.Named); ok {
						// Check if this method must be async due to interface constraints
						if c.analysis.MustBeAsyncDueToInterface(namedType, decl.Name.Name) {
							isAsync = true
						}
					}
				}
			}
		}
	}

	// Methods are typically public in the TS output
	c.tsw.WriteLiterally("public ")

	// Add async modifier if needed
	if isAsync {
		c.tsw.WriteLiterally("async ")
	}

	// Keep original Go casing for method names
	if err := c.WriteValueExpr(decl.Name); err != nil { // Method name is a value identifier
		return isAsync, err
	}

	// Write signature (parameters and return type)
	funcType := decl.Type
	c.tsw.WriteLiterally("(")
	if funcType.Params != nil {
		c.WriteFieldList(funcType.Params, true) // true = arguments
	}
	c.tsw.WriteLiterally(")")

	// Handle return type
	if funcType.Results != nil && len(funcType.Results.List) > 0 {
		c.tsw.WriteLiterally(": ")
		if isAsync {
			c.tsw.WriteLiterally("Promise<")
		}
		if len(funcType.Results.List) == 1 {
			// Single return value
			resultType := funcType.Results.List[0].Type
			c.WriteTypeExpr(resultType)
		} else {
			// Multiple return values -> tuple type
			c.tsw.WriteLiterally("[")
			first := true
			for _, field := range funcType.Results.List {
				// Each field may represent multiple return values (e.g., "a, b int")
				count := len(field.Names)
				if count == 0 {
					count = 1 // Unnamed return value
				}
				for j := 0; j < count; j++ {
					if !first {
						c.tsw.WriteLiterally(", ")
					}
					first = false
					c.WriteTypeExpr(field.Type)
				}
			}
			c.tsw.WriteLiterally("]")
		}
		if isAsync {
			c.tsw.WriteLiterally(">")
		}
	} else {
		// No return value -> void
		if isAsync {
			c.tsw.WriteLiterally(": Promise<void>")
		} else {
			c.tsw.WriteLiterally(": void")
		}
	}

	c.tsw.WriteLiterally(" ")
	return isAsync, nil
}

// writeMethodBodyWithReceiverBinding writes the method body with optional receiver binding
// receiverTarget should be "this" for struct methods or "this._value" for named type methods
func (c *GoToTSCompiler) writeMethodBodyWithReceiverBinding(decl *ast.FuncDecl, receiverTarget string) error {
	// Bind receiver name conditionally
	if recvField := decl.Recv.List[0]; len(recvField.Names) > 0 {
		recvName := recvField.Names[0].Name
		if recvName != "_" {
			// Check if receiver is actually used
			var needsReceiverBinding bool
			if obj := c.pkg.TypesInfo.Defs[decl.Name]; obj != nil {
				needsReceiverBinding = c.analysis.IsReceiverUsed(obj)
			}

			c.tsw.WriteLine("{")
			c.tsw.Indent(1)

			if needsReceiverBinding {
				// Sanitize the receiver name to avoid conflicts with TypeScript reserved words
				sanitizedRecvName := c.sanitizeIdentifier(recvName)
				c.tsw.WriteLinef("const %s = %s", sanitizedRecvName, receiverTarget)
			}

			// Add using statement if needed
			if c.analysis.NeedsDefer(decl.Body) {
				if c.analysis.IsInAsyncFunction(decl) {
					c.tsw.WriteLine("await using __defer = new $.AsyncDisposableStack();")
				} else {
					c.tsw.WriteLine("using __defer = new $.DisposableStack();")
				}
			}

			// Declare named return variables and initialize them to their zero values
			if err := c.writeNamedReturnDeclarations(decl.Type.Results); err != nil {
				return fmt.Errorf("failed to write named return declarations: %w", err)
			}

			// write method body without outer braces
			for _, stmt := range decl.Body.List {
				if err := c.WriteStmt(stmt); err != nil {
					return fmt.Errorf("failed to write statement in function body: %w", err)
				}
			}
			c.tsw.Indent(-1)
			c.tsw.WriteLine("}")

			return nil
		}
	}
	// no named receiver, write whole body
	if err := c.WriteStmt(decl.Body); err != nil {
		return fmt.Errorf("failed to write function body: %w", err)
	}

	return nil
}
