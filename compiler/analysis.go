package compiler

import (
	"encoding/json"
	"go/ast"
	"go/token"
	"go/types"
	"path/filepath"
	"slices"
	"strings"

	"github.com/aperturerobotics/goscript"
	"golang.org/x/tools/go/packages"
)

// fileImport tracks an import in a file.
type fileImport struct {
	importPath string
	importVars map[string]struct{}
}

// AssignmentType indicates how a variable's value was assigned or used.
type AssignmentType int

const (
	// DirectAssignment represents a direct value copy (e.g., x = y)
	DirectAssignment AssignmentType = iota
	// AddressOfAssignment represents taking the address (e.g., p = &y)
	// or assigning to a dereferenced pointer (*p = y) - indicating the pointer p is used.
	AddressOfAssignment
)

// AssignmentInfo stores information about a single assignment source or destination.
type AssignmentInfo struct {
	Object types.Object   // The source or destination variable object
	Type   AssignmentType // The type of assignment involved
}

// VariableUsageInfo tracks how a variable is used throughout the code.
type VariableUsageInfo struct {
	// Sources lists variables whose values (or addresses) are assigned TO this variable.
	// Example: For `x = y`, y is a source for x. For `x = &y`, y is a source for x.
	Sources []AssignmentInfo
	// Destinations lists variables that are assigned the value (or address) FROM this variable.
	// Example: For `y = x`, y is a destination for x. For `p = &x`, p is a destination for x.
	Destinations []AssignmentInfo
}

// ShadowingInfo tracks variable shadowing in if statement initializations
type ShadowingInfo struct {
	// ShadowedVariables maps shadowed variable names to their outer scope objects
	ShadowedVariables map[string]types.Object
	// TempVariables maps shadowed variable names to temporary variable names
	TempVariables map[string]string
	// TypeShadowedVars maps variable names that shadow type names to their renamed identifier
	// This happens when a variable name matches a type name used in its initialization
	// e.g., field := field{...} where the variable 'field' shadows the type 'field'
	TypeShadowedVars map[string]string
}

// FunctionTypeInfo represents Go function type information for reflection
type FunctionTypeInfo struct {
	Params   []types.Type // Parameter types
	Results  []types.Type // Return types
	Variadic bool         // Whether the function is variadic
}

// FunctionInfo consolidates function-related tracking data.
type FunctionInfo struct {
	ReceiverUsed bool
	NamedReturns []string
}

// ReflectedFunctionInfo tracks functions that need reflection support
type ReflectedFunctionInfo struct {
	FuncType     *types.Signature // The function's type signature
	NeedsReflect bool             // Whether this function is used with reflection
}

// NodeInfo consolidates node-related tracking data.
type NodeInfo struct {
	NeedsDefer        bool
	InAsyncContext    bool
	IsBareReturn      bool
	EnclosingFuncDecl *ast.FuncDecl
	EnclosingFuncLit  *ast.FuncLit
	IsInsideFunction  bool           // true if this declaration is inside a function body
	IsMethodValue     bool           // true if this SelectorExpr is a method value that needs binding
	ShadowingInfo     *ShadowingInfo // variable shadowing information for if statements
	IdentifierMapping string         // replacement name for this identifier (e.g., receiver -> "receiver")
}

// GsMetadata represents the structure of a meta.json file in gs/ packages
type GsMetadata struct {
	Dependencies []string        `json:"dependencies,omitempty"`
	AsyncMethods map[string]bool `json:"asyncMethods,omitempty"`
}

// InterfaceMethodKey uniquely identifies an interface method
type InterfaceMethodKey struct {
	InterfaceType string // The string representation of the interface type
	MethodName    string // The method name
}

// MethodKey uniquely identifies a method for async analysis
type MethodKey struct {
	PackagePath  string // Package path
	ReceiverType string // Receiver type name (empty for package-level functions)
	MethodName   string // Method or function name
}

// ImplementationInfo tracks information about a struct that implements an interface method
type ImplementationInfo struct {
	StructType *types.Named // The struct type that implements the interface
	Method     *types.Func  // The method object
}

// Analysis holds information gathered during the analysis phase of the Go code compilation.
// This data is used to make decisions about how to generate TypeScript code.
// Analysis is read-only after being built and should not be modified during code generation.
type Analysis struct {
	// VariableUsage tracks how variables are assigned and used, particularly for pointer analysis.
	// The key is the variable's types.Object.
	VariableUsage map[types.Object]*VariableUsageInfo

	// Imports stores the imports for the file
	Imports map[string]*fileImport

	// Cmap stores the comment map for the file
	Cmap ast.CommentMap

	// FunctionData consolidates function-related tracking into one map
	FunctionData map[types.Object]*FunctionInfo

	// NodeData consolidates node-related tracking into one map
	NodeData map[ast.Node]*NodeInfo

	// Keep specialized maps that serve different purposes
	// FuncLitData tracks function literal specific data since they don't have types.Object
	FuncLitData map[*ast.FuncLit]*FunctionInfo

	// ReflectedFunctions tracks functions that need reflection type metadata
	ReflectedFunctions map[ast.Node]*ReflectedFunctionInfo

	// FunctionAssignments tracks which function literals are assigned to which variables
	FunctionAssignments map[types.Object]ast.Node

	// AsyncReturningVars tracks variables whose function type returns async values
	// This happens when a variable is assigned from a higher-order function (like sync.OnceValue)
	// that receives an async function literal as an argument
	AsyncReturningVars map[types.Object]bool

	// NamedBasicTypes tracks types that should be implemented as type aliases with standalone functions
	// This includes named types with basic underlying types (like uint32, string) that have methods
	NamedBasicTypes map[types.Type]bool

	// AllPackages stores all loaded packages for dependency analysis
	// Key: package path, Value: package data
	AllPackages map[string]*packages.Package

	// InterfaceImplementations tracks which struct types implement which interface methods
	// This is used to determine interface method async status based on implementations
	InterfaceImplementations map[InterfaceMethodKey][]ImplementationInfo

	// MethodAsyncStatus stores the async status of all methods analyzed
	// This is computed once during analysis and reused during code generation
	MethodAsyncStatus map[MethodKey]bool

	// ReferencedTypesPerFile tracks which named types are referenced in each file.
	// This is used to filter synthetic imports to only include packages needed
	// by types actually used in each specific file, not all types in the package.
	// Key: file path, Value: set of named types referenced in that file
	ReferencedTypesPerFile map[string]map[*types.Named]bool

	// SyntheticImportsPerFile stores synthetic imports needed per file.
	// Key: file path, Value: map of package name to import info
	SyntheticImportsPerFile map[string]map[string]*fileImport
}

// PackageAnalysis holds cross-file analysis data for a package
type PackageAnalysis struct {
	// FunctionDefs maps file names to the functions defined in that file
	// Key: filename (without .go extension), Value: list of function names
	FunctionDefs map[string][]string

	// FunctionCalls maps file names to the functions they call from other files
	// Key: filename (without .go extension), Value: map[sourceFile][]functionNames
	FunctionCalls map[string]map[string][]string

	// TypeDefs maps file names to the types defined in that file
	// Key: filename (without .go extension), Value: list of type names
	TypeDefs map[string][]string

	// TypeCalls maps file names to the types they reference from other files
	// Key: filename (without .go extension), Value: map[sourceFile][]typeNames
	TypeCalls map[string]map[string][]string

	// VariableDefs maps file names to the package-level variables defined in that file
	// Key: filename (without .go extension), Value: list of variable names
	VariableDefs map[string][]string

	// VariableCalls maps file names to the package-level variables they reference from other files
	// Key: filename (without .go extension), Value: map[sourceFile][]variableNames
	VariableCalls map[string]map[string][]string
}

// NewAnalysis creates a new Analysis instance.
func NewAnalysis(allPackages map[string]*packages.Package) *Analysis {
	if allPackages == nil {
		allPackages = make(map[string]*packages.Package)
	}

	return &Analysis{
		VariableUsage:            make(map[types.Object]*VariableUsageInfo),
		Imports:                  make(map[string]*fileImport),
		FunctionData:             make(map[types.Object]*FunctionInfo),
		NodeData:                 make(map[ast.Node]*NodeInfo),
		FuncLitData:              make(map[*ast.FuncLit]*FunctionInfo),
		ReflectedFunctions:       make(map[ast.Node]*ReflectedFunctionInfo),
		FunctionAssignments:      make(map[types.Object]ast.Node),
		AsyncReturningVars:       make(map[types.Object]bool),
		NamedBasicTypes:          make(map[types.Type]bool),
		AllPackages:              allPackages,
		InterfaceImplementations: make(map[InterfaceMethodKey][]ImplementationInfo),
		MethodAsyncStatus:        make(map[MethodKey]bool),
		ReferencedTypesPerFile:   make(map[string]map[*types.Named]bool),
		SyntheticImportsPerFile:  make(map[string]map[string]*fileImport),
	}
}

// NewPackageAnalysis creates a new PackageAnalysis instance
func NewPackageAnalysis() *PackageAnalysis {
	return &PackageAnalysis{
		FunctionDefs:  make(map[string][]string),
		FunctionCalls: make(map[string]map[string][]string),
		TypeDefs:      make(map[string][]string),
		TypeCalls:     make(map[string]map[string][]string),
		VariableDefs:  make(map[string][]string),
		VariableCalls: make(map[string]map[string][]string),
	}
}

// ensureNodeData ensures that NodeData exists for a given node and returns it
func (a *Analysis) ensureNodeData(node ast.Node) *NodeInfo {
	if node == nil {
		return nil
	}
	if a.NodeData[node] == nil {
		a.NodeData[node] = &NodeInfo{}
	}
	return a.NodeData[node]
}

// ensureFunctionData ensures that FunctionData exists for a given object and returns it
func (a *Analysis) ensureFunctionData(obj types.Object) *FunctionInfo {
	if obj == nil {
		return nil
	}
	if a.FunctionData[obj] == nil {
		a.FunctionData[obj] = &FunctionInfo{}
	}
	return a.FunctionData[obj]
}

// GetFunctionInfoFromContext returns FunctionInfo based on the enclosing function context
func (a *Analysis) GetFunctionInfoFromContext(nodeInfo *NodeInfo, pkg *packages.Package) *FunctionInfo {
	if nodeInfo == nil {
		return nil
	}
	if nodeInfo.EnclosingFuncDecl != nil {
		if obj := pkg.TypesInfo.ObjectOf(nodeInfo.EnclosingFuncDecl.Name); obj != nil {
			return a.FunctionData[obj]
		}
	}
	if nodeInfo.EnclosingFuncLit != nil {
		return a.FuncLitData[nodeInfo.EnclosingFuncLit]
	}
	return nil
}

// NeedsDefer returns whether the given node needs defer handling.
func (a *Analysis) NeedsDefer(node ast.Node) bool {
	if node == nil {
		return false
	}
	nodeInfo := a.NodeData[node]
	if nodeInfo == nil {
		return false
	}
	return nodeInfo.NeedsDefer
}

// IsInAsyncFunction returns whether the given node is inside an async function.
func (a *Analysis) IsInAsyncFunction(node ast.Node) bool {
	if node == nil {
		return false
	}
	nodeInfo := a.NodeData[node]
	if nodeInfo == nil {
		return false
	}
	return nodeInfo.InAsyncContext
}

// IsAsyncFunc returns whether the given object represents an async function.
func (a *Analysis) IsAsyncFunc(obj types.Object) bool {
	if obj == nil {
		return false
	}

	// Use MethodAsyncStatus for all async status lookups
	funcObj, ok := obj.(*types.Func)
	if !ok {
		return false
	}

	// Create MethodKey for lookup
	methodKey := MethodKey{
		PackagePath:  funcObj.Pkg().Path(),
		ReceiverType: "", // Functions have no receiver, methods are handled separately
		MethodName:   funcObj.Name(),
	}

	// Check if it's a method with receiver
	if sig, ok := funcObj.Type().(*types.Signature); ok && sig.Recv() != nil {
		// For methods, get the receiver type name using same format as analysis
		recv := sig.Recv()
		recvType := recv.Type()
		// Handle pointer receivers
		if ptr, isPtr := recvType.(*types.Pointer); isPtr {
			recvType = ptr.Elem()
		}
		// Use short type name, not full path (consistent with analysis)
		if named, ok := recvType.(*types.Named); ok {
			methodKey.ReceiverType = named.Obj().Name()
		} else {
			methodKey.ReceiverType = recvType.String()
		}
	}

	if isAsync, exists := a.MethodAsyncStatus[methodKey]; exists {
		return isAsync
	}
	return false
}

// IsAsyncReturningVar returns whether the given variable holds a function that returns async values.
// This is true when the variable is assigned from a higher-order function that receives an async function literal.
func (a *Analysis) IsAsyncReturningVar(obj types.Object) bool {
	if obj == nil {
		return false
	}
	return a.AsyncReturningVars[obj]
}

func (a *Analysis) IsReceiverUsed(obj types.Object) bool {
	if obj == nil {
		return false
	}
	funcInfo := a.FunctionData[obj]
	if funcInfo == nil {
		return false
	}
	return funcInfo.ReceiverUsed
}

// IsFuncLitAsync checks if a function literal is async based on our analysis.
func (a *Analysis) IsFuncLitAsync(funcLit *ast.FuncLit) bool {
	if funcLit == nil {
		return false
	}
	// Check function literal specific data first - but IsAsync field was removed
	// Function literals don't have types.Object, so fall back to node data
	nodeInfo := a.NodeData[funcLit]
	if nodeInfo == nil {
		return false
	}
	return nodeInfo.InAsyncContext
}

// NeedsVarRef returns whether the given object needs to be variable referenced.
// This is true when the object's address is taken (e.g., &myVar) in the analyzed code.
// Variables that have their address taken must be wrapped in VarRef to maintain identity.
func (a *Analysis) NeedsVarRef(obj types.Object) bool {
	if obj == nil {
		return false
	}

	usageInfo, exists := a.VariableUsage[obj]
	if !exists {
		return false
	}
	// Check if any destination assignment involves taking the address of 'obj'
	for _, destInfo := range usageInfo.Destinations {
		if destInfo.Type == AddressOfAssignment {
			return true
		}
	}
	return false
}

// NeedsVarRefAccess returns whether accessing the given object requires '.value' access in TypeScript.
// This is more nuanced than NeedsVarRef and considers both direct variable references and
// pointers that may point to variable-referenced values.
//
// Examples:
//   - Direct variable reference (NeedsVarRef = true):
//     Example: let x = $.varRef(10) => x.value
//   - Pointer pointing to a variable-referenced value:
//     Example: let p: VarRef<number> | null = x => p!.value
//   - Regular pointer (NeedsVarRef = false, but points to variable reference):
//     Example: let q = x => q!.value (where x is VarRef)
func (a *Analysis) NeedsVarRefAccess(obj types.Object) bool {
	if obj == nil {
		return false
	}

	// If the variable itself is variable referenced, it needs .value access
	if a.NeedsVarRef(obj) {
		return true
	}

	// For pointer variables, check if they point to a variable-referenced value
	if _, ok := obj.Type().(*types.Pointer); ok {
		// Check all assignments to this pointer variable
		for varObj, info := range a.VariableUsage {
			if varObj == obj {
				for _, src := range info.Sources {
					if src.Type == AddressOfAssignment && src.Object != nil {
						// This pointer was assigned &someVar, check if someVar is variable referenced
						return a.NeedsVarRef(src.Object)
					}
				}
			}
		}
	}

	return false
}

// IsMethodValue returns whether the given SelectorExpr node is a method value that needs binding.
func (a *Analysis) IsMethodValue(node *ast.SelectorExpr) bool {
	if node == nil {
		return false
	}
	nodeInfo := a.NodeData[node]
	if nodeInfo == nil {
		return false
	}
	return nodeInfo.IsMethodValue
}

// HasVariableShadowing returns whether the given node has variable shadowing issues
func (a *Analysis) HasVariableShadowing(node ast.Node) bool {
	if node == nil {
		return false
	}
	nodeInfo := a.NodeData[node]
	if nodeInfo == nil {
		return false
	}
	return nodeInfo.ShadowingInfo != nil
}

// GetShadowingInfo returns the variable shadowing information for the given node
func (a *Analysis) GetShadowingInfo(node ast.Node) *ShadowingInfo {
	if node == nil {
		return nil
	}
	nodeInfo := a.NodeData[node]
	if nodeInfo == nil {
		return nil
	}
	return nodeInfo.ShadowingInfo
}

// analysisVisitor implements ast.Visitor and is used to traverse the AST during analysis.
type analysisVisitor struct {
	// analysis stores information gathered during the traversal
	analysis *Analysis

	// pkg provides type information and other package details
	pkg *packages.Package

	// inAsyncFunction tracks if we're currently inside an async function
	inAsyncFunction bool

	// currentFuncName tracks the name of the function we're currently analyzing
	currentFuncName string

	// currentReceiver tracks the object of the receiver if inside a method
	currentReceiver *types.Var

	// currentFuncObj tracks the object of the function declaration we're currently analyzing
	currentFuncObj types.Object

	// currentFuncDecl tracks the *ast.FuncDecl of the function we're currently analyzing.
	currentFuncDecl *ast.FuncDecl

	// currentFuncLit tracks the *ast.FuncLit of the function literal we're currently analyzing.
	currentFuncLit *ast.FuncLit

	// currentFilePath tracks the file path of the file we're currently analyzing.
	// This is used to track which types are referenced in each file.
	currentFilePath string
}

// getOrCreateUsageInfo retrieves or creates the VariableUsageInfo for a given object.
func (v *analysisVisitor) getOrCreateUsageInfo(obj types.Object) *VariableUsageInfo {
	if obj == nil {
		return nil // Should not happen with valid objects
	}
	info, exists := v.analysis.VariableUsage[obj]
	if !exists {
		info = &VariableUsageInfo{}
		v.analysis.VariableUsage[obj] = info
	}
	return info
}

// Visit implements the ast.Visitor interface.
// It analyzes each node in the AST to gather information needed for code generation.
func (v *analysisVisitor) Visit(node ast.Node) ast.Visitor {
	if node == nil {
		return nil
	}

	// Initialize and store async state for the current node
	nodeInfo := v.analysis.ensureNodeData(node)
	nodeInfo.InAsyncContext = v.inAsyncFunction

	switch n := node.(type) {
	case *ast.GenDecl:
		// Handle general declarations (var, const, type, import)
		if n.Tok == token.VAR {
			for _, spec := range n.Specs {
				if valueSpec, ok := spec.(*ast.ValueSpec); ok {
					// Track type references from variable declarations for synthetic import filtering
					if valueSpec.Type != nil {
						if t := v.pkg.TypesInfo.TypeOf(valueSpec.Type); t != nil {
							v.trackTypeReference(t)
						}
					}
					for _, name := range valueSpec.Names {
						if obj := v.pkg.TypesInfo.ObjectOf(name); obj != nil {
							v.trackTypeReference(obj.Type())
						}
					}

					// Process each declared variable (LHS)
					for i, lhsIdent := range valueSpec.Names {
						if lhsIdent.Name == "_" {
							continue
						}
						lhsObj := v.pkg.TypesInfo.ObjectOf(lhsIdent)
						if lhsObj == nil {
							continue
						}
						// Check if there's a corresponding initial value (RHS)
						if valueSpec.Values != nil && i < len(valueSpec.Values) {
							rhsExpr := valueSpec.Values[i]

							// --- Analyze RHS and Update Usage Info (similar to AssignStmt) ---
							assignmentType := DirectAssignment
							var sourceObj types.Object
							shouldTrackUsage := true

							if unaryExpr, ok := rhsExpr.(*ast.UnaryExpr); ok && unaryExpr.Op == token.AND {
								// Case: var lhs = &rhs_expr
								assignmentType = AddressOfAssignment
								if rhsIdent, ok := unaryExpr.X.(*ast.Ident); ok {
									// Case: var lhs = &rhs_ident (taking address of a variable)
									sourceObj = v.pkg.TypesInfo.ObjectOf(rhsIdent)
								} else {
									// Case: var lhs = &CompositeLit{} (taking address of composite literal)
									// No variable tracking needed - this doesn't create VarRef requirements
									shouldTrackUsage = false
								}
							} else if rhsIdent, ok := rhsExpr.(*ast.Ident); ok {
								// Case: var lhs = rhs_ident
								assignmentType = DirectAssignment
								sourceObj = v.pkg.TypesInfo.ObjectOf(rhsIdent)
							} else if funcLit, ok := rhsExpr.(*ast.FuncLit); ok {
								// Case: var lhs = func(...) { ... }
								// Track function literal assignment
								v.analysis.FunctionAssignments[lhsObj] = funcLit
							}

							// --- Record Usage ---
							// Only create usage tracking if we're dealing with variable references
							if shouldTrackUsage {
								// Ensure usage info exists for LHS only when needed
								lhsUsageInfo := v.getOrCreateUsageInfo(lhsObj)

								if sourceObj != nil {
									// Record source for LHS
									lhsUsageInfo.Sources = append(lhsUsageInfo.Sources, AssignmentInfo{
										Object: sourceObj,
										Type:   assignmentType,
									})

									// Record destination for RHS source
									sourceUsageInfo := v.getOrCreateUsageInfo(sourceObj)
									sourceUsageInfo.Destinations = append(sourceUsageInfo.Destinations, AssignmentInfo{
										Object: lhsObj,
										Type:   assignmentType,
									})
								}
							}
						}
					}
				}
			}
		}
		return v

	case *ast.FuncDecl:
		return v.visitFuncDecl(n)

	case *ast.FuncLit:
		return v.visitFuncLit(n)

	case *ast.BlockStmt:
		return v.visitBlockStmt(n)

	case *ast.UnaryExpr:
		// We handle address-of (&) within AssignStmt where it's actually used.
		return v

	case *ast.CallExpr:
		return v.visitCallExpr(n)

	case *ast.SelectorExpr:
		return v.visitSelectorExpr(n)

	case *ast.AssignStmt:
		return v.visitAssignStmt(n)

	case *ast.ReturnStmt:
		return v.visitReturnStmt(n)

	case *ast.DeclStmt:
		return v.visitDeclStmt(n)

	case *ast.IfStmt:
		return v.visitIfStmt(n)

	case *ast.TypeAssertExpr:
		return v.visitTypeAssertExpr(n)

	case *ast.CompositeLit:
		// Traverse into composite literal elements to detect &variable expressions
		// This is important for cases like: arr := []interface{}{value1, &value2}
		// where value2 needs to be marked as NeedsVarRef due to the &value2 usage
		return v.visitCompositeLit(n)
	}

	// For all other nodes, continue traversal
	return v
}

// visitFuncDecl handles function declaration analysis
func (v *analysisVisitor) visitFuncDecl(n *ast.FuncDecl) ast.Visitor {
	// Save original states to restore after visiting
	originalInAsync := v.inAsyncFunction
	originalFuncObj := v.currentFuncObj
	originalFuncDecl := v.currentFuncDecl
	originalFuncLit := v.currentFuncLit
	originalReceiver := v.currentReceiver

	// Reset for current function
	v.currentFuncName = n.Name.Name
	v.currentFuncDecl = n
	v.currentFuncLit = nil
	v.currentReceiver = nil

	nodeInfo := v.analysis.ensureNodeData(n)
	// InAsyncContext will be set by the second analysis phase

	// Set current receiver if this is a method
	if n.Recv != nil && len(n.Recv.List) > 0 {
		// Assuming a single receiver for simplicity for now
		if len(n.Recv.List[0].Names) > 0 {
			if ident := n.Recv.List[0].Names[0]; ident != nil && ident.Name != "_" {
				if def := v.pkg.TypesInfo.Defs[ident]; def != nil {
					if vr, ok := def.(*types.Var); ok {
						v.currentReceiver = vr
						// Add the receiver variable to the VariableUsage map
						v.getOrCreateUsageInfo(v.currentReceiver)

						// Check if receiver is used in method body
						receiverUsed := false
						if n.Body != nil {
							receiverUsed = v.containsReceiverUsage(n.Body, vr)
						}

						// Update function data with receiver usage info
						if obj := v.pkg.TypesInfo.ObjectOf(n.Name); obj != nil {
							funcInfo := v.analysis.ensureFunctionData(obj)
							funcInfo.ReceiverUsed = receiverUsed
						}

						// If receiver is used, mark all identifiers that refer to the receiver variable
						if receiverUsed && n.Body != nil {
							recvName := ident.Name
							ast.Inspect(n.Body, func(nn ast.Node) bool {
								id, ok := nn.(*ast.Ident)
								if !ok {
									return true
								}
								if obj := v.pkg.TypesInfo.Uses[id]; obj != nil && obj == vr {
									ni := v.analysis.ensureNodeData(id)
									ni.IdentifierMapping = recvName
								}
								return true
							})
						}
					}
				}
			}
		}
	}

	// Store named return variables (sanitized for TypeScript)
	if n.Type != nil && n.Type.Results != nil {
		var namedReturns []string
		for _, field := range n.Type.Results.List {
			for _, name := range field.Names {
				namedReturns = append(namedReturns, sanitizeIdentifier(name.Name))
			}
		}
		if len(namedReturns) > 0 {
			if obj := v.pkg.TypesInfo.ObjectOf(n.Name); obj != nil {
				funcInfo := v.analysis.ensureFunctionData(obj)
				funcInfo.NamedReturns = namedReturns
			}
		}
	}

	// Update visitor state for this function
	// Note: inAsyncFunction will be determined later by comprehensive analysis phase
	v.currentFuncObj = v.pkg.TypesInfo.ObjectOf(n.Name)

	if n.Body != nil {
		// Check if the body contains any defer statements
		if v.containsDefer(n.Body) {
			nodeInfo.NeedsDefer = true
		}

		// Visit the body with updated state
		ast.Walk(v, n.Body)
	}

	// Restore states after visiting
	defer func() {
		v.currentFuncName = ""
		v.inAsyncFunction = originalInAsync
		v.currentReceiver = originalReceiver
		v.currentFuncObj = originalFuncObj
		v.currentFuncDecl = originalFuncDecl
		v.currentFuncLit = originalFuncLit
	}()
	return nil // Stop traversal here, ast.Walk handled the body
}

// visitFuncLit handles function literal analysis
func (v *analysisVisitor) visitFuncLit(n *ast.FuncLit) ast.Visitor {
	// Save original inAsyncFunction state to restore after visiting
	originalInAsync := v.inAsyncFunction
	originalFuncDecl := v.currentFuncDecl
	originalFuncLit := v.currentFuncLit

	// Set current function literal
	v.currentFuncDecl = nil
	v.currentFuncLit = n

	// Note: Function literal async analysis is handled by comprehensive analysis phase
	nodeInfo := v.analysis.ensureNodeData(n)

	// Store named return variables for function literal
	if n.Type != nil && n.Type.Results != nil {
		var namedReturns []string
		for _, field := range n.Type.Results.List {
			for _, name := range field.Names {
				namedReturns = append(namedReturns, name.Name)
			}
		}
		if len(namedReturns) > 0 {
			v.analysis.FuncLitData[n] = &FunctionInfo{
				NamedReturns: namedReturns,
				// IsAsync will be set by comprehensive analysis
			}
		}
	}

	// Check if the body contains any defer statements
	if n.Body != nil && v.containsDefer(n.Body) {
		nodeInfo.NeedsDefer = true
	}

	// Visit the body with updated state
	ast.Walk(v, n.Body)

	// Restore inAsyncFunction state after visiting
	v.inAsyncFunction = originalInAsync
	v.currentFuncDecl = originalFuncDecl
	v.currentFuncLit = originalFuncLit
	return nil // Stop traversal here, ast.Walk handled the body
}

// visitBlockStmt handles block statement analysis
func (v *analysisVisitor) visitBlockStmt(n *ast.BlockStmt) ast.Visitor {
	if n == nil || len(n.List) == 0 {
		return v
	}

	// Initialize NodeData for this block
	nodeInfo := v.analysis.ensureNodeData(n)

	// Check for defer statements in this block
	if v.containsDefer(n) {
		nodeInfo.NeedsDefer = true
	}

	return v
}

// visitCallExpr handles call expression analysis
func (v *analysisVisitor) visitCallExpr(n *ast.CallExpr) ast.Visitor {
	// Check for reflect function calls that operate on functions
	v.checkReflectUsage(n)

	// Track interface implementations from function call arguments
	v.trackInterfaceCallArguments(n)

	// Check for implicit address-taking in method calls with pointer receivers
	v.checkImplicitAddressTaking(n)

	// Check for address-of expressions in function arguments
	v.checkAddressOfInArguments(n)

	return v
}

// checkAddressOfInArguments detects when &variable is passed as a function argument.
// Example: json.Unmarshal(data, &person) where person needs to be marked as NeedsVarRef
func (v *analysisVisitor) checkAddressOfInArguments(callExpr *ast.CallExpr) {
	for _, arg := range callExpr.Args {
		if unaryExpr, ok := arg.(*ast.UnaryExpr); ok && unaryExpr.Op == token.AND {
			if ident, ok := unaryExpr.X.(*ast.Ident); ok {
				if obj := v.pkg.TypesInfo.ObjectOf(ident); obj != nil {
					usageInfo := v.getOrCreateUsageInfo(obj)
					usageInfo.Destinations = append(usageInfo.Destinations, AssignmentInfo{
						Object: nil,
						Type:   AddressOfAssignment,
					})
				}
			}
		}
	}
}

// checkImplicitAddressTaking detects when a method call with a pointer receiver
// is called on a non-pointer variable, which requires implicit address-taking.
// Example: var s MySlice; s.Add(10) where Add has receiver *MySlice
// This is equivalent to (&s).Add(10), so s needs to be marked as NeedsVarRef
func (v *analysisVisitor) checkImplicitAddressTaking(callExpr *ast.CallExpr) {
	// Check if this is a method call (selector expression)
	selExpr, ok := callExpr.Fun.(*ast.SelectorExpr)
	if !ok {
		return
	}

	// Get the selection information
	selection := v.pkg.TypesInfo.Selections[selExpr]
	if selection == nil || selection.Kind() != types.MethodVal {
		return
	}

	// Get the method object
	methodObj := selection.Obj()
	if methodObj == nil {
		return
	}

	// Get the method's signature to check the receiver type
	methodFunc, ok := methodObj.(*types.Func)
	if !ok {
		return
	}

	sig := methodFunc.Type().(*types.Signature)
	recv := sig.Recv()
	if recv == nil {
		return
	}

	// Check if the method has a pointer receiver
	recvType := recv.Type()
	_, hasPointerReceiver := recvType.(*types.Pointer)
	if !hasPointerReceiver {
		return
	}

	// Get the type of the receiver expression (the thing before the dot)
	exprType := v.pkg.TypesInfo.TypeOf(selExpr.X)
	if exprType == nil {
		return
	}

	// Check if the receiver expression is NOT already a pointer
	_, exprIsPointer := exprType.(*types.Pointer)
	if exprIsPointer {
		// Expression is already a pointer, no implicit address-taking needed
		return
	}

	// At this point, we have:
	// - A method with a pointer receiver
	// - Being called on a non-pointer expression
	// This means Go will implicitly take the address

	// Check if the receiver expression is an identifier (variable)
	ident, ok := selExpr.X.(*ast.Ident)
	if !ok {
		return
	}

	// Get the variable object
	obj := v.pkg.TypesInfo.ObjectOf(ident)
	if obj == nil {
		return
	}

	// Mark this variable as needing VarRef (its address is being taken)
	usageInfo := v.getOrCreateUsageInfo(obj)
	usageInfo.Destinations = append(usageInfo.Destinations, AssignmentInfo{
		Object: nil, // No specific destination for method calls
		Type:   AddressOfAssignment,
	})
}

// visitSelectorExpr handles selector expression analysis
func (v *analysisVisitor) visitSelectorExpr(n *ast.SelectorExpr) ast.Visitor {
	// Check if this is a method value (method being used as a value, not called immediately)
	if selection := v.pkg.TypesInfo.Selections[n]; selection != nil {
		if selection.Kind() == types.MethodVal {
			// This is a method value - mark it for binding during code generation
			nodeInfo := v.analysis.ensureNodeData(n)
			nodeInfo.IsMethodValue = true
		}
	}
	return v
}

// visitAssignStmt handles assignment statement analysis
func (v *analysisVisitor) visitAssignStmt(n *ast.AssignStmt) ast.Visitor {
	// Handle variable assignment tracking and generate shadowing information
	shadowingInfo := v.detectVariableShadowing(n)

	// Store shadowing information if needed for code generation
	if shadowingInfo != nil {
		nodeInfo := v.analysis.ensureNodeData(n)
		nodeInfo.ShadowingInfo = shadowingInfo
	}

	// Track assignment relationships for pointer analysis
	for i, lhsExpr := range n.Lhs {
		if i < len(n.Rhs) {
			v.analyzeAssignment(lhsExpr, n.Rhs[i])
		}
	}

	// Track interface implementations for assignments to interface variables
	v.trackInterfaceAssignments(n)

	// Track function assignments (function literals assigned to variables)
	if len(n.Lhs) == 1 && len(n.Rhs) == 1 {
		if lhsIdent, ok := n.Lhs[0].(*ast.Ident); ok {
			if rhsFuncLit, ok := n.Rhs[0].(*ast.FuncLit); ok {
				// Get the object for the LHS variable
				if obj := v.pkg.TypesInfo.ObjectOf(lhsIdent); obj != nil {
					v.analysis.FunctionAssignments[obj] = rhsFuncLit
				}
			}
		}
	}

	// NOTE: Async-returning variable tracking (trackAsyncReturningVar) is done in a separate pass
	// after function literals are analyzed for async status. See trackAsyncReturningVarsAllFiles.

	return v
}

// trackAsyncReturningVar tracks variables that are assigned from higher-order function calls
// where one of the arguments is an async function literal.
// Pattern: x := higherOrderFunc(asyncFuncLit)
// This is needed because when sync.OnceValue(asyncFunc) is called, the result is a function
// that returns a Promise, and callers of x() need to await the result.
func (v *analysisVisitor) trackAsyncReturningVar(lhs ast.Expr, rhs ast.Expr) {
	// LHS must be an identifier
	lhsIdent, ok := lhs.(*ast.Ident)
	if !ok {
		return
	}

	// RHS must be a call expression
	callExpr, ok := rhs.(*ast.CallExpr)
	if !ok {
		return
	}

	// The result type of the call must be a function type
	rhsType := v.pkg.TypesInfo.TypeOf(rhs)
	if rhsType == nil {
		return
	}
	_, isFunc := rhsType.Underlying().(*types.Signature)
	if !isFunc {
		return
	}

	// Check if any argument is an async function literal
	// Use containsAsyncOperationsComplete to check the function body directly
	// rather than relying on the InAsyncContext flag which may not be set yet
	hasAsyncArg := false
	for _, arg := range callExpr.Args {
		if funcLit, ok := arg.(*ast.FuncLit); ok {
			if funcLit.Body != nil && v.containsAsyncOperationsComplete(funcLit.Body, v.pkg) {
				hasAsyncArg = true
				break
			}
		}
	}

	if !hasAsyncArg {
		return
	}

	// Mark the LHS variable as returning async values
	if obj := v.pkg.TypesInfo.ObjectOf(lhsIdent); obj != nil {
		v.analysis.AsyncReturningVars[obj] = true
	}
}

// visitReturnStmt handles return statement analysis
func (v *analysisVisitor) visitReturnStmt(n *ast.ReturnStmt) ast.Visitor {
	nodeInfo := v.analysis.ensureNodeData(n)

	// Record the enclosing function/literal for this return statement
	if v.currentFuncDecl != nil {
		nodeInfo.EnclosingFuncDecl = v.currentFuncDecl
	} else if v.currentFuncLit != nil {
		nodeInfo.EnclosingFuncLit = v.currentFuncLit
	}

	// Check if it's a bare return
	if len(n.Results) == 0 {
		if v.analysis.GetFunctionInfoFromContext(nodeInfo, v.pkg) != nil {
			nodeInfo.IsBareReturn = true
		}
	}
	return v
}

// visitDeclStmt handles declaration statement analysis
func (v *analysisVisitor) visitDeclStmt(n *ast.DeclStmt) ast.Visitor {
	// Handle declarations inside functions (const, var, type declarations within function bodies)
	// These should not have export modifiers in TypeScript
	if genDecl, ok := n.Decl.(*ast.GenDecl); ok {
		// Check if we're inside a function (either FuncDecl or FuncLit)
		isInsideFunction := v.currentFuncDecl != nil || v.currentFuncLit != nil

		for _, spec := range genDecl.Specs {
			if isInsideFunction {
				// Mark all specs in this declaration as being inside a function
				nodeInfo := v.analysis.ensureNodeData(spec)
				nodeInfo.IsInsideFunction = true
			}

			// Track type references from variable declarations (e.g., var w MyWriter)
			if valueSpec, ok := spec.(*ast.ValueSpec); ok {
				// Track explicit type if present
				if valueSpec.Type != nil {
					if t := v.pkg.TypesInfo.TypeOf(valueSpec.Type); t != nil {
						v.trackTypeReference(t)
					}
				}
				// Also track types inferred from values
				for _, name := range valueSpec.Names {
					if obj := v.pkg.TypesInfo.ObjectOf(name); obj != nil {
						v.trackTypeReference(obj.Type())
					}
				}
			}
		}
	}
	return v
}

// visitIfStmt handles if statement analysis
func (v *analysisVisitor) visitIfStmt(n *ast.IfStmt) ast.Visitor {
	// Detect variable shadowing in if statement initializations
	if n.Init != nil {
		if assignStmt, ok := n.Init.(*ast.AssignStmt); ok && assignStmt.Tok == token.DEFINE {
			shadowingInfo := v.detectVariableShadowing(assignStmt)
			if shadowingInfo != nil {
				nodeInfo := v.analysis.ensureNodeData(n)
				nodeInfo.ShadowingInfo = shadowingInfo
			}
		}
	}
	return v
}

// visitTypeAssertExpr handles type assertion analysis for interface method implementations
func (v *analysisVisitor) visitTypeAssertExpr(typeAssert *ast.TypeAssertExpr) ast.Visitor {
	// Get the type being asserted to
	assertedType := v.pkg.TypesInfo.TypeOf(typeAssert.Type)
	if assertedType == nil {
		return v
	}

	// Track the asserted type for synthetic import filtering
	v.trackTypeReference(assertedType)

	// Check if the asserted type is an interface
	interfaceType, isInterface := assertedType.Underlying().(*types.Interface)
	if !isInterface {
		return v
	}

	// Get the type of the expression being asserted
	exprType := v.pkg.TypesInfo.TypeOf(typeAssert.X)
	if exprType == nil {
		return v
	}

	// Handle pointer types by getting the element type
	if ptrType, isPtr := exprType.(*types.Pointer); isPtr {
		exprType = ptrType.Elem()
	}

	// Check if the expression type is a named struct type
	namedType, isNamed := exprType.(*types.Named)
	if !isNamed {
		return v
	}

	// For each method in the interface, check if the struct implements it
	for i := 0; i < interfaceType.NumExplicitMethods(); i++ {
		interfaceMethod := interfaceType.ExplicitMethod(i)

		// Find the corresponding method in the struct type
		structMethod := v.findStructMethod(namedType, interfaceMethod.Name())
		if structMethod != nil {
			// Track this interface implementation
			v.analysis.trackInterfaceImplementation(interfaceType, namedType, structMethod)
		}
	}
	return v
}

// trackTypeReference records that a named type is referenced in the current file.
// This is used to filter synthetic imports to only include packages actually needed.
func (v *analysisVisitor) trackTypeReference(t types.Type) {
	if t == nil || v.currentFilePath == "" {
		return
	}
	// Unwrap pointers
	if ptr, ok := t.(*types.Pointer); ok {
		t = ptr.Elem()
	}
	// Track named types per file
	if named, ok := t.(*types.Named); ok {
		if v.analysis.ReferencedTypesPerFile[v.currentFilePath] == nil {
			v.analysis.ReferencedTypesPerFile[v.currentFilePath] = make(map[*types.Named]bool)
		}
		v.analysis.ReferencedTypesPerFile[v.currentFilePath][named] = true
	}
}

// visitCompositeLit analyzes composite literals for address-of expressions
// This is important for detecting cases like: arr := []interface{}{value1, &value2}
// where value2 needs to be marked as NeedsVarRef due to the &value2 usage
func (v *analysisVisitor) visitCompositeLit(compLit *ast.CompositeLit) ast.Visitor {
	// Track the type of this composite literal for synthetic import filtering
	if compLit.Type != nil {
		if t := v.pkg.TypesInfo.TypeOf(compLit.Type); t != nil {
			v.trackTypeReference(t)
		}
	}

	// Analyze each element of the composite literal
	for _, elt := range compLit.Elts {
		// Handle both direct elements and key-value pairs
		var expr ast.Expr
		if kv, ok := elt.(*ast.KeyValueExpr); ok {
			// For key-value pairs, analyze the value expression
			expr = kv.Value
		} else {
			// For direct elements, analyze the element expression
			expr = elt
		}

		// Check if this element is an address-of expression
		if unaryExpr, ok := expr.(*ast.UnaryExpr); ok && unaryExpr.Op == token.AND {
			// Found &something in the composite literal
			if ident, ok := unaryExpr.X.(*ast.Ident); ok {
				// Found &variable - mark the variable as needing VarRef
				if obj := v.pkg.TypesInfo.ObjectOf(ident); obj != nil {
					// Record that this variable has its address taken
					usageInfo := v.getOrCreateUsageInfo(obj)
					usageInfo.Destinations = append(usageInfo.Destinations, AssignmentInfo{
						Object: nil, // No specific destination object for composite literals
						Type:   AddressOfAssignment,
					})
				}
			}
		}
	}
	return v
}

// containsAsyncOperations checks if a node contains any async operations like channel operations.

// containsDefer checks if a block contains any defer statements.
func (v *analysisVisitor) containsDefer(block *ast.BlockStmt) bool {
	hasDefer := false

	ast.Inspect(block, func(n ast.Node) bool {
		if n == nil {
			return true
		}
		if _, ok := n.(*ast.DeferStmt); ok {
			hasDefer = true
			return false
		}
		return true
	})

	return hasDefer
}

// containsReceiverUsage checks if a method body contains any references to the receiver variable.
func (v *analysisVisitor) containsReceiverUsage(node ast.Node, receiver *types.Var) bool {
	if receiver == nil {
		return false
	}

	var hasReceiverUsage bool

	ast.Inspect(node, func(n ast.Node) bool {
		if n == nil {
			return true
		}

		switch expr := n.(type) {
		case *ast.Ident:
			// Check if this identifier refers to the receiver variable
			if obj := v.pkg.TypesInfo.Uses[expr]; obj != nil && obj == receiver {
				hasReceiverUsage = true
				return false
			}
		case *ast.SelectorExpr:
			// Check if selector expression uses the receiver (e.g., m.Field, m.Method())
			if ident, ok := expr.X.(*ast.Ident); ok {
				if obj := v.pkg.TypesInfo.Uses[ident]; obj != nil && obj == receiver {
					hasReceiverUsage = true
					return false
				}
			}
		}

		return true
	})

	return hasReceiverUsage
}

// AnalyzePackageFiles analyzes all Go source files in a package and populates the Analysis struct
// with information that will be used during code generation to properly handle pointers,
// variables that need varRefing, receiver usage, etc. This replaces the old file-by-file analysis.
func AnalyzePackageFiles(pkg *packages.Package, allPackages map[string]*packages.Package) *Analysis {
	analysis := NewAnalysis(allPackages)

	// Load package metadata for async function detection
	analysis.LoadPackageMetadata()

	// Process imports from all files in the package
	for _, file := range pkg.Syntax {
		// Create comment map for each file and store it (we'll merge them if needed)
		cmap := ast.NewCommentMap(pkg.Fset, file, file.Comments)
		if len(analysis.Cmap) == 0 {
			analysis.Cmap = cmap
		} else {
			// Merge comment maps from multiple files
			for node, comments := range cmap {
				analysis.Cmap[node] = append(analysis.Cmap[node], comments...)
			}
		}

		// Process imports from this file
		for _, imp := range file.Imports {
			path := ""
			if imp.Path != nil {
				path = imp.Path.Value
				// Remove quotes from the import path string
				path = path[1 : len(path)-1]
			}

			// Store the import in the analysis
			if path != "" {
				name := ""
				if imp.Name != nil {
					name = imp.Name.Name
				}

				fileImp := &fileImport{
					importPath: path,
					importVars: make(map[string]struct{}),
				}

				// Use the import name or the actual package name as the key
				var key string
				if name != "" {
					// Explicit alias provided
					key = name
				} else {
					// No explicit alias, use the actual package name from type information
					// This handles cases where package name differs from the last path segment
					if actualName, err := getActualPackageName(path, pkg.Imports); err == nil {
						key = actualName
					} else {
						// Fallback to last segment of path if package not found in type information
						pts := strings.Split(path, "/")
						key = pts[len(pts)-1]
					}
				}

				analysis.Imports[key] = fileImp
			}
		}
	}

	// Create visitor for the entire package
	visitor := &analysisVisitor{
		analysis: analysis,
		pkg:      pkg,
	}

	// First pass: analyze all declarations and statements across all files
	for i, file := range pkg.Syntax {
		// Set the current file path for per-file type tracking
		if i < len(pkg.CompiledGoFiles) {
			visitor.currentFilePath = pkg.CompiledGoFiles[i]
		}
		ast.Walk(visitor, file)
	}

	// Post-processing: Find all CallExpr nodes and unmark their Fun SelectorExpr as method values
	// This distinguishes between method calls (obj.Method()) and method values (obj.Method)
	for _, file := range pkg.Syntax {
		ast.Inspect(file, func(n ast.Node) bool {
			if callExpr, ok := n.(*ast.CallExpr); ok {
				if selExpr, ok := callExpr.Fun.(*ast.SelectorExpr); ok {
					// This SelectorExpr is the function being called, so it's NOT a method value
					if nodeInfo := analysis.NodeData[selExpr]; nodeInfo != nil {
						nodeInfo.IsMethodValue = false
					}
				}
			}
			return true
		})
	}

	// Second pass: analyze interface implementations first
	interfaceVisitor := &interfaceImplementationVisitor{
		analysis: analysis,
		pkg:      pkg,
	}
	for _, file := range pkg.Syntax {
		ast.Walk(interfaceVisitor, file)
	}

	// Third pass: comprehensive async analysis for all methods
	// Interface implementation async status is now updated on-demand in IsInterfaceMethodAsync
	visitor.analyzeAllMethodsAsync()

	// Fourth pass: collect imports needed by promoted methods from embedded structs
	analysis.addImportsForPromotedMethods(pkg)

	return analysis
}

// addImportsForPromotedMethods scans struct types that are actually referenced in each file
// and adds imports for any packages referenced by the promoted methods' parameter/return types.
// This generates per-file synthetic imports to avoid adding unused imports.
func (a *Analysis) addImportsForPromotedMethods(pkg *packages.Package) {
	// Process each file's referenced types separately
	for filePath, referencedTypes := range a.ReferencedTypesPerFile {
		// Collect package imports needed for this specific file
		packagesToAdd := make(map[string]*types.Package)

		// Only process types that are actually referenced in this file
		// and are defined in the current package
		for namedType := range referencedTypes {
			// Skip types from other packages - we only need to process types defined in this package
			if namedType.Obj().Pkg() != pkg.Types {
				continue
			}

			// Check if it's a struct
			structType, ok := namedType.Underlying().(*types.Struct)
			if !ok {
				continue
			}

			// Look for embedded fields
			for i := 0; i < structType.NumFields(); i++ {
				field := structType.Field(i)
				if !field.Embedded() {
					continue
				}

				// Get the type of the embedded field
				embeddedType := field.Type()

				// Handle pointer to embedded type
				if ptr, ok := embeddedType.(*types.Pointer); ok {
					embeddedType = ptr.Elem()
				}

				// Use method set to get all promoted methods including pointer receiver methods
				// This matches Go's behavior where embedding T promotes both T and *T methods
				methodSetType := embeddedType
				if _, isPtr := embeddedType.(*types.Pointer); !isPtr {
					if _, isInterface := embeddedType.Underlying().(*types.Interface); !isInterface {
						methodSetType = types.NewPointer(embeddedType)
					}
				}
				embeddedMethodSet := types.NewMethodSet(methodSetType)

				// Scan all methods in the method set
				for j := 0; j < embeddedMethodSet.Len(); j++ {
					selection := embeddedMethodSet.At(j)
					method := selection.Obj()
					sig, ok := method.Type().(*types.Signature)
					if !ok {
						continue
					}

					// Scan parameters
					if sig.Params() != nil {
						for k := 0; k < sig.Params().Len(); k++ {
							param := sig.Params().At(k)
							a.collectPackageFromType(param.Type(), pkg.Types, packagesToAdd)
						}
					}

					// Scan results
					if sig.Results() != nil {
						for k := 0; k < sig.Results().Len(); k++ {
							result := sig.Results().At(k)
							a.collectPackageFromType(result.Type(), pkg.Types, packagesToAdd)
						}
					}
				}
			}
		}

		// Store the synthetic imports for this file
		if len(packagesToAdd) > 0 {
			fileImports := make(map[string]*fileImport)
			for pkgName, pkgObj := range packagesToAdd {
				tsImportPath := "@goscript/" + pkgObj.Path()
				fileImports[pkgName] = &fileImport{
					importPath: tsImportPath,
					importVars: make(map[string]struct{}),
				}
			}
			a.SyntheticImportsPerFile[filePath] = fileImports
		}
	}
}

// collectPackageFromType recursively collects packages referenced by a type.
func (a *Analysis) collectPackageFromType(t types.Type, currentPkg *types.Package, packagesToAdd map[string]*types.Package) {
	switch typ := t.(type) {
	case *types.Named:
		pkg := typ.Obj().Pkg()
		if pkg != nil && pkg != currentPkg {
			packagesToAdd[pkg.Name()] = pkg
		}
		// Check type arguments for generics
		if typ.TypeArgs() != nil {
			for i := 0; i < typ.TypeArgs().Len(); i++ {
				a.collectPackageFromType(typ.TypeArgs().At(i), currentPkg, packagesToAdd)
			}
		}
	case *types.Interface:
		// For interfaces, we need to check embedded interfaces and method signatures
		for i := 0; i < typ.NumEmbeddeds(); i++ {
			a.collectPackageFromType(typ.EmbeddedType(i), currentPkg, packagesToAdd)
		}
		for i := 0; i < typ.NumExplicitMethods(); i++ {
			method := typ.ExplicitMethod(i)
			a.collectPackageFromType(method.Type(), currentPkg, packagesToAdd)
		}
	case *types.Pointer:
		a.collectPackageFromType(typ.Elem(), currentPkg, packagesToAdd)
	case *types.Slice:
		a.collectPackageFromType(typ.Elem(), currentPkg, packagesToAdd)
	case *types.Array:
		a.collectPackageFromType(typ.Elem(), currentPkg, packagesToAdd)
	case *types.Map:
		a.collectPackageFromType(typ.Key(), currentPkg, packagesToAdd)
		a.collectPackageFromType(typ.Elem(), currentPkg, packagesToAdd)
	case *types.Chan:
		a.collectPackageFromType(typ.Elem(), currentPkg, packagesToAdd)
	case *types.Signature:
		// Collect from parameters
		if typ.Params() != nil {
			for i := 0; i < typ.Params().Len(); i++ {
				a.collectPackageFromType(typ.Params().At(i).Type(), currentPkg, packagesToAdd)
			}
		}
		// Collect from results
		if typ.Results() != nil {
			for i := 0; i < typ.Results().Len(); i++ {
				a.collectPackageFromType(typ.Results().At(i).Type(), currentPkg, packagesToAdd)
			}
		}
	}
}

// AnalyzePackageImports performs package-level analysis to collect function definitions
// and calls across all files in the package for auto-import generation
func AnalyzePackageImports(pkg *packages.Package) *PackageAnalysis {
	analysis := NewPackageAnalysis()

	// First pass: collect all function definitions per file
	for i, syntax := range pkg.Syntax {
		fileName := pkg.CompiledGoFiles[i]
		baseFileName := strings.TrimSuffix(filepath.Base(fileName), ".go")

		var functions []string
		var typeNames []string
		var variables []string
		for _, decl := range syntax.Decls {
			if funcDecl, ok := decl.(*ast.FuncDecl); ok {
				// Collect top-level functions (not methods)
				if funcDecl.Recv == nil {
					functions = append(functions, funcDecl.Name.Name)
				} else {
					// Check if this is a method on a wrapper type (named basic type)
					// If so, it will be compiled as TypeName_MethodName function
					if len(funcDecl.Recv.List) > 0 {
						recvType := funcDecl.Recv.List[0].Type
						// Handle pointer receiver (*Type)
						if starExpr, ok := recvType.(*ast.StarExpr); ok {
							recvType = starExpr.X
						}
						if recvIdent, ok := recvType.(*ast.Ident); ok {
							// Check if this receiver type is a wrapper type
							if obj := pkg.TypesInfo.Uses[recvIdent]; obj != nil {
								if typeName, ok := obj.(*types.TypeName); ok {
									if namedType, ok := typeName.Type().(*types.Named); ok {
										if _, ok := namedType.Underlying().(*types.Basic); ok {
											// This is a method on a wrapper type
											funcName := recvIdent.Name + "_" + funcDecl.Name.Name
											functions = append(functions, funcName)
										}
									}
								}
							}
						}
					}
				}
			}
			if genDecl, ok := decl.(*ast.GenDecl); ok {
				// Collect type declarations
				for _, spec := range genDecl.Specs {
					if typeSpec, ok := spec.(*ast.TypeSpec); ok {
						typeNames = append(typeNames, typeSpec.Name.Name)
					}
					// Collect variable/constant declarations
					if valueSpec, ok := spec.(*ast.ValueSpec); ok {
						for _, name := range valueSpec.Names {
							variables = append(variables, name.Name)
						}
					}
				}
			}
		}

		if len(functions) > 0 {
			analysis.FunctionDefs[baseFileName] = functions
		}
		if len(typeNames) > 0 {
			analysis.TypeDefs[baseFileName] = typeNames
		}
		if len(variables) > 0 {
			analysis.VariableDefs[baseFileName] = variables
		}
	}

	// Second pass: analyze function calls and determine which need imports
	for i, syntax := range pkg.Syntax {
		fileName := pkg.CompiledGoFiles[i]
		baseFileName := strings.TrimSuffix(filepath.Base(fileName), ".go")

		// Find all function calls in this file
		callsFromOtherFiles := make(map[string][]string)

		ast.Inspect(syntax, func(n ast.Node) bool {
			if callExpr, ok := n.(*ast.CallExpr); ok {
				if ident, ok := callExpr.Fun.(*ast.Ident); ok {
					funcName := ident.Name

					// Check if this function is defined in the current file
					currentFileFuncs := analysis.FunctionDefs[baseFileName]
					isDefinedInCurrentFile := slices.Contains(currentFileFuncs, funcName)

					// If not defined in current file, find which file defines it
					if !isDefinedInCurrentFile {
						for sourceFile, funcs := range analysis.FunctionDefs {
							if sourceFile == baseFileName {
								continue // Skip current file
							}
							if slices.Contains(funcs, funcName) {
								// Found the function in another file
								if callsFromOtherFiles[sourceFile] == nil {
									callsFromOtherFiles[sourceFile] = []string{}
								}
								// Check if already added to avoid duplicates
								found := slices.Contains(callsFromOtherFiles[sourceFile], funcName)
								if !found {
									callsFromOtherFiles[sourceFile] = append(callsFromOtherFiles[sourceFile], funcName)
								}
							}
						}
					}
				}
			}
			return true
		})

		if len(callsFromOtherFiles) > 0 {
			analysis.FunctionCalls[baseFileName] = callsFromOtherFiles
		}
	}

	// Third pass: analyze type references and determine which need imports
	for i, syntax := range pkg.Syntax {
		fileName := pkg.CompiledGoFiles[i]
		baseFileName := strings.TrimSuffix(filepath.Base(fileName), ".go")

		// Find all type references in this file
		typeRefsFromOtherFiles := make(map[string][]string)

		ast.Inspect(syntax, func(n ast.Node) bool {
			// Look for type references in struct fields, function parameters, etc.
			if ident, ok := n.(*ast.Ident); ok {
				// Check if this identifier refers to a type
				if obj := pkg.TypesInfo.Uses[ident]; obj != nil {
					if _, ok := obj.(*types.TypeName); ok {
						typeName := ident.Name

						// Check if this type is defined in the current file
						currentFileTypes := analysis.TypeDefs[baseFileName]
						isDefinedInCurrentFile := slices.Contains(currentFileTypes, typeName)

						// If not defined in current file, find which file defines it
						if !isDefinedInCurrentFile {
							for sourceFile, types := range analysis.TypeDefs {
								if sourceFile == baseFileName {
									continue // Skip current file
								}
								if slices.Contains(types, typeName) {
									// Found the type in another file
									if typeRefsFromOtherFiles[sourceFile] == nil {
										typeRefsFromOtherFiles[sourceFile] = []string{}
									}
									// Check if already added to avoid duplicates
									found := slices.Contains(typeRefsFromOtherFiles[sourceFile], typeName)
									if !found {
										typeRefsFromOtherFiles[sourceFile] = append(typeRefsFromOtherFiles[sourceFile], typeName)
									}
								}
							}
						}
					}
				}
			}
			return true
		})

		if len(typeRefsFromOtherFiles) > 0 {
			analysis.TypeCalls[baseFileName] = typeRefsFromOtherFiles
		}
	}

	// Fourth pass: analyze variable references and determine which need imports
	for i, syntax := range pkg.Syntax {
		fileName := pkg.CompiledGoFiles[i]
		baseFileName := strings.TrimSuffix(filepath.Base(fileName), ".go")

		// Find all variable references in this file
		varRefsFromOtherFiles := make(map[string][]string)

		ast.Inspect(syntax, func(n ast.Node) bool {
			// Look for identifier references
			if ident, ok := n.(*ast.Ident); ok {
				// Check if this identifier refers to a package-level variable
				if obj := pkg.TypesInfo.Uses[ident]; obj != nil {
					if varObj, ok := obj.(*types.Var); ok {
						// Only track package-level variables (not function parameters or local vars)
						if varObj.Parent() == pkg.Types.Scope() {
							varName := ident.Name

							// Check if this variable is defined in the current file
							currentFileVars := analysis.VariableDefs[baseFileName]
							isDefinedInCurrentFile := slices.Contains(currentFileVars, varName)

							// If not defined in current file, find which file defines it
							if !isDefinedInCurrentFile {
								for sourceFile, vars := range analysis.VariableDefs {
									if sourceFile == baseFileName {
										continue // Skip current file
									}
									if slices.Contains(vars, varName) {
										// Found the variable in another file
										if varRefsFromOtherFiles[sourceFile] == nil {
											varRefsFromOtherFiles[sourceFile] = []string{}
										}
										// Check if already added to avoid duplicates
										found := slices.Contains(varRefsFromOtherFiles[sourceFile], varName)
										if !found {
											varRefsFromOtherFiles[sourceFile] = append(varRefsFromOtherFiles[sourceFile], varName)
										}
									}
								}
							}
						}
					}
					// Also check for constants
					if constObj, ok := obj.(*types.Const); ok {
						// Only track package-level constants
						if constObj.Parent() == pkg.Types.Scope() {
							constName := ident.Name

							// Check if this constant is defined in the current file
							currentFileVars := analysis.VariableDefs[baseFileName]
							isDefinedInCurrentFile := slices.Contains(currentFileVars, constName)

							// If not defined in current file, find which file defines it
							if !isDefinedInCurrentFile {
								for sourceFile, vars := range analysis.VariableDefs {
									if sourceFile == baseFileName {
										continue // Skip current file
									}
									if slices.Contains(vars, constName) {
										// Found the constant in another file
										if varRefsFromOtherFiles[sourceFile] == nil {
											varRefsFromOtherFiles[sourceFile] = []string{}
										}
										// Check if already added to avoid duplicates
										found := slices.Contains(varRefsFromOtherFiles[sourceFile], constName)
										if !found {
											varRefsFromOtherFiles[sourceFile] = append(varRefsFromOtherFiles[sourceFile], constName)
										}
									}
								}
							}
						}
					}
				}
			}
			return true
		})

		if len(varRefsFromOtherFiles) > 0 {
			analysis.VariableCalls[baseFileName] = varRefsFromOtherFiles
		}
	}

	// Fifth pass: analyze method calls on wrapper types (named basic types with methods)
	// These generate TypeName_MethodName function calls that need to be imported
	for i, syntax := range pkg.Syntax {
		fileName := pkg.CompiledGoFiles[i]
		baseFileName := strings.TrimSuffix(filepath.Base(fileName), ".go")

		// Find all method calls on wrapper types in this file
		ast.Inspect(syntax, func(n ast.Node) bool {
			callExpr, ok := n.(*ast.CallExpr)
			if !ok {
				return true
			}

			// Check if this is a method call (selector expression)
			selectorExpr, ok := callExpr.Fun.(*ast.SelectorExpr)
			if !ok {
				return true
			}

			// Get the type of the receiver
			receiverType := pkg.TypesInfo.TypeOf(selectorExpr.X)
			if receiverType == nil {
				return true
			}

			// Check if this is a wrapper type (named type with basic underlying type and methods)
			namedType, ok := receiverType.(*types.Named)
			if !ok {
				return true
			}

			// Check if it has a basic underlying type
			if _, ok := namedType.Underlying().(*types.Basic); !ok {
				return true
			}

			// Check if this type is defined in the same package
			obj := namedType.Obj()
			if obj == nil || obj.Pkg() == nil || obj.Pkg() != pkg.Types {
				return true // Not from this package
			}

			// Check if this type has the method being called
			methodName := selectorExpr.Sel.Name
			found := false
			for j := 0; j < namedType.NumMethods(); j++ {
				if namedType.Method(j).Name() == methodName {
					found = true
					break
				}
			}
			if !found {
				return true
			}

			// Generate the function name: TypeName_MethodName
			funcName := obj.Name() + "_" + methodName

			// Find which file defines this function
			for sourceFile, funcs := range analysis.FunctionDefs {
				if sourceFile == baseFileName {
					continue // Skip current file
				}
				if slices.Contains(funcs, funcName) {
					// Found the function in another file
					if analysis.FunctionCalls[baseFileName] == nil {
						analysis.FunctionCalls[baseFileName] = make(map[string][]string)
					}
					if analysis.FunctionCalls[baseFileName][sourceFile] == nil {
						analysis.FunctionCalls[baseFileName][sourceFile] = []string{}
					}
					// Check if already added to avoid duplicates
					if !slices.Contains(analysis.FunctionCalls[baseFileName][sourceFile], funcName) {
						analysis.FunctionCalls[baseFileName][sourceFile] = append(analysis.FunctionCalls[baseFileName][sourceFile], funcName)
					}
				}
			}

			return true
		})
	}

	return analysis
}

// LoadPackageMetadata loads metadata from gs packages using embedded JSON files
func (a *Analysis) LoadPackageMetadata() {
	// Discover all packages in the embedded gs/ directory
	packagePaths := a.discoverEmbeddedGsPackages()

	for _, pkgPath := range packagePaths {
		metaFilePath := filepath.Join("gs", pkgPath, "meta.json")

		// Try to read the meta.json file from embedded filesystem
		// We need access to the embedded FS, which should be imported from the parent package
		if metadata := a.loadGsMetadata(metaFilePath); metadata != nil {
			// Store async method information
			for methodKey, isAsync := range metadata.AsyncMethods {
				// Convert method key to our internal key format
				parts := strings.Split(methodKey, ".")
				var typeName, methodName string

				if len(parts) == 2 {
					// "Type.Method" format for methods
					typeName = parts[0]
					methodName = parts[1]
				} else if len(parts) == 1 {
					// "Function" format for package-level functions
					typeName = "" // Empty type name for package-level functions
					methodName = parts[0]
				} else {
					// Skip invalid formats
					continue
				}

				// Use MethodKey instead of PackageMetadataKey for consistency
				key := MethodKey{
					PackagePath:  pkgPath,
					ReceiverType: typeName,
					MethodName:   methodName,
				}

				// Store the async value directly in MethodAsyncStatus
				a.MethodAsyncStatus[key] = isAsync
			}
		}
	}
}

// discoverEmbeddedGsPackages finds all packages in the embedded gs/ directory
func (a *Analysis) discoverEmbeddedGsPackages() []string {
	var packageList []string

	// Read the gs/ directory from the embedded filesystem
	entries, err := goscript.GsOverrides.ReadDir("gs")
	if err != nil {
		// If we can't read the gs/ directory, return empty list
		return packageList
	}

	// Iterate through all entries in gs/
	for _, entry := range entries {
		if entry.IsDir() {
			packageList = append(packageList, entry.Name())
		}
	}

	return packageList
}

// loadGsMetadata loads metadata from a meta.json file in the embedded filesystem
func (a *Analysis) loadGsMetadata(metaFilePath string) *GsMetadata {
	// Read the meta.json file from the embedded filesystem
	content, err := goscript.GsOverrides.ReadFile(metaFilePath)
	if err != nil {
		return nil // No metadata file found
	}

	var metadata GsMetadata
	if err := json.Unmarshal(content, &metadata); err != nil {
		return nil // Invalid JSON
	}

	return &metadata
}

// isHandwrittenPackage checks if a package path corresponds to a handwritten package in gs/
func (a *Analysis) isHandwrittenPackage(pkgPath string) bool {
	// Check if the package exists in the embedded gs/ directory
	metaFilePath := filepath.Join("gs", pkgPath, "meta.json")
	_, err := goscript.GsOverrides.ReadFile(metaFilePath)
	return err == nil
}

// IsMethodAsync checks if a method call is async based on package metadata
func (a *Analysis) IsMethodAsync(pkgPath, typeName, methodName string) bool {
	// First, check pre-computed method async status
	methodKey := MethodKey{
		PackagePath:  pkgPath,
		ReceiverType: typeName,
		MethodName:   methodName,
	}

	if status, exists := a.MethodAsyncStatus[methodKey]; exists {
		return status
	}

	// If no pre-computed status found, external methods default to sync
	// Comprehensive analysis should have already analyzed all packages and loaded metadata
	return false
}

// NeedsReflectionMetadata returns whether the given function node needs reflection type metadata
func (a *Analysis) NeedsReflectionMetadata(node ast.Node) bool {
	if node == nil {
		return false
	}
	reflectInfo := a.ReflectedFunctions[node]
	return reflectInfo != nil && reflectInfo.NeedsReflect
}

// GetFunctionTypeInfo returns the function type information for reflection
func (a *Analysis) GetFunctionTypeInfo(node ast.Node) *ReflectedFunctionInfo {
	if node == nil {
		return nil
	}
	return a.ReflectedFunctions[node]
}

// MarkFunctionForReflection marks a function node as needing reflection support
func (a *Analysis) MarkFunctionForReflection(node ast.Node, funcType *types.Signature) {
	if node == nil || funcType == nil {
		return
	}
	a.ReflectedFunctions[node] = &ReflectedFunctionInfo{
		FuncType:     funcType,
		NeedsReflect: true,
	}
}

// checkReflectUsage checks for reflect function calls that operate on functions
func (v *analysisVisitor) checkReflectUsage(callExpr *ast.CallExpr) {
	// Check if this is a reflect package function call
	if selExpr, ok := callExpr.Fun.(*ast.SelectorExpr); ok {
		// Check if the selector is from reflect package
		if ident, ok := selExpr.X.(*ast.Ident); ok {
			// Check if this is a reflect package call (reflect.TypeOf, reflect.ValueOf, etc.)
			if obj := v.pkg.TypesInfo.Uses[ident]; obj != nil {
				if pkgName, ok := obj.(*types.PkgName); ok && pkgName.Imported().Path() == "reflect" {
					methodName := selExpr.Sel.Name

					// Check for reflect.TypeOf and reflect.ValueOf calls
					if methodName == "TypeOf" || methodName == "ValueOf" {
						// Check if any argument is a function
						for _, arg := range callExpr.Args {
							v.checkReflectArgument(arg)
						}
					}
				}
			}
		}
	}
}

// checkReflectArgument checks if an argument to a reflect function is a function that needs metadata
func (v *analysisVisitor) checkReflectArgument(arg ast.Expr) {
	// Check if the argument is an identifier (variable)
	if ident, ok := arg.(*ast.Ident); ok {
		// Get the object this identifier refers to
		if obj := v.pkg.TypesInfo.Uses[ident]; obj != nil {
			// Check if this object has a function type
			if funcType, ok := obj.Type().(*types.Signature); ok {
				// This is a function variable being passed to reflect
				// We need to find the original function definition/assignment
				v.markFunctionVariable(ident, funcType)
			}
		}
	} else if funcLit, ok := arg.(*ast.FuncLit); ok {
		// This is a function literal being passed directly to reflect
		if funcType := v.pkg.TypesInfo.Types[funcLit].Type.(*types.Signature); funcType != nil {
			v.analysis.MarkFunctionForReflection(funcLit, funcType)
		}
	}
}

// markFunctionVariable finds the function definition/assignment for a variable and marks it for reflection
func (v *analysisVisitor) markFunctionVariable(ident *ast.Ident, funcType *types.Signature) {
	// Get the object for this identifier
	obj := v.pkg.TypesInfo.Uses[ident]
	if obj == nil {
		return
	}

	// Check if we have a tracked function assignment for this variable
	if funcNode := v.analysis.FunctionAssignments[obj]; funcNode != nil {
		// Mark the function node for reflection
		v.analysis.MarkFunctionForReflection(funcNode, funcType)
	}
}

// detectVariableShadowing detects variable shadowing in any := assignment
func (v *analysisVisitor) detectVariableShadowing(assignStmt *ast.AssignStmt) *ShadowingInfo {
	shadowingInfo := &ShadowingInfo{
		ShadowedVariables: make(map[string]types.Object),
		TempVariables:     make(map[string]string),
		TypeShadowedVars:  make(map[string]string),
	}

	hasShadowing := false

	// First, collect all LHS variable names that are being declared
	lhsVarNames := make(map[string]*ast.Ident)
	for _, lhsExpr := range assignStmt.Lhs {
		if lhsIdent, ok := lhsExpr.(*ast.Ident); ok && lhsIdent.Name != "_" {
			lhsVarNames[lhsIdent.Name] = lhsIdent
		}
	}

	// Next, check all RHS expressions for usage of variables that are also being declared on LHS
	for _, rhsExpr := range assignStmt.Rhs {
		v.findVariableUsageInExpr(rhsExpr, lhsVarNames, shadowingInfo, &hasShadowing)
	}

	// Check for type shadowing: variable name matches a type name used in its initialization
	// e.g., field := field{...} where the variable 'field' shadows the type 'field'
	if assignStmt.Tok == token.DEFINE {
		for i, lhsExpr := range assignStmt.Lhs {
			if i < len(assignStmt.Rhs) {
				if lhsIdent, ok := lhsExpr.(*ast.Ident); ok && lhsIdent.Name != "_" {
					if typeName := v.findTypeShadowing(lhsIdent.Name, assignStmt.Rhs[i]); typeName != "" {
						shadowingInfo.TypeShadowedVars[lhsIdent.Name] = lhsIdent.Name + "_"
						hasShadowing = true
					}
				}
			}
		}
	}

	if hasShadowing {
		return shadowingInfo
	}
	return nil
}

// findTypeShadowing checks if the given variable name matches a type name used in the RHS expression.
// Returns the type name if shadowing is detected, empty string otherwise.
func (v *analysisVisitor) findTypeShadowing(varName string, rhsExpr ast.Expr) string {
	// Handle address-of expressions: field := &field{...}
	if unary, ok := rhsExpr.(*ast.UnaryExpr); ok && unary.Op == token.AND {
		rhsExpr = unary.X
	}

	// Check if RHS is a composite literal with a type name matching varName
	compLit, ok := rhsExpr.(*ast.CompositeLit)
	if !ok {
		return ""
	}

	// Get the type name from the composite literal
	var typeName string
	switch t := compLit.Type.(type) {
	case *ast.Ident:
		typeName = t.Name
	case *ast.SelectorExpr:
		// pkg.Type - just use the type name part
		typeName = t.Sel.Name
	default:
		return ""
	}

	// Check if variable name matches type name
	if typeName == varName {
		return typeName
	}
	return ""
}

// findVariableUsageInExpr recursively searches for variable usage in an expression
func (v *analysisVisitor) findVariableUsageInExpr(expr ast.Expr, lhsVarNames map[string]*ast.Ident, shadowingInfo *ShadowingInfo, hasShadowing *bool) {
	if expr == nil {
		return
	}

	switch e := expr.(type) {
	case *ast.Ident:
		// Check if this identifier is being shadowed
		if lhsIdent, exists := lhsVarNames[e.Name]; exists {
			// This variable is being used on RHS but also declared on LHS - this is shadowing!

			// Get the outer scope object for this variable
			if outerObj := v.pkg.TypesInfo.Uses[e]; outerObj != nil {
				// Make sure this isn't the same object as the LHS (which would mean no shadowing)
				if lhsObj := v.pkg.TypesInfo.Defs[lhsIdent]; lhsObj != outerObj {
					shadowingInfo.ShadowedVariables[e.Name] = outerObj
					shadowingInfo.TempVariables[e.Name] = "_temp_" + e.Name
					*hasShadowing = true
				}
			}
		}

	case *ast.CallExpr:
		// Check function arguments
		for _, arg := range e.Args {
			v.findVariableUsageInExpr(arg, lhsVarNames, shadowingInfo, hasShadowing)
		}
		// Check function expression itself
		v.findVariableUsageInExpr(e.Fun, lhsVarNames, shadowingInfo, hasShadowing)

	case *ast.SelectorExpr:
		// Check the base expression (e.g., x in x.Method())
		v.findVariableUsageInExpr(e.X, lhsVarNames, shadowingInfo, hasShadowing)

	case *ast.IndexExpr:
		// Check both the expression and index (e.g., arr[i])
		v.findVariableUsageInExpr(e.X, lhsVarNames, shadowingInfo, hasShadowing)
		v.findVariableUsageInExpr(e.Index, lhsVarNames, shadowingInfo, hasShadowing)

	case *ast.SliceExpr:
		// Check the expression and slice bounds
		v.findVariableUsageInExpr(e.X, lhsVarNames, shadowingInfo, hasShadowing)
		if e.Low != nil {
			v.findVariableUsageInExpr(e.Low, lhsVarNames, shadowingInfo, hasShadowing)
		}
		if e.High != nil {
			v.findVariableUsageInExpr(e.High, lhsVarNames, shadowingInfo, hasShadowing)
		}
		if e.Max != nil {
			v.findVariableUsageInExpr(e.Max, lhsVarNames, shadowingInfo, hasShadowing)
		}

	case *ast.UnaryExpr:
		// Check the operand (e.g., &x, -x, !x)
		v.findVariableUsageInExpr(e.X, lhsVarNames, shadowingInfo, hasShadowing)

	case *ast.BinaryExpr:
		// Check both operands (e.g., x + y)
		v.findVariableUsageInExpr(e.X, lhsVarNames, shadowingInfo, hasShadowing)
		v.findVariableUsageInExpr(e.Y, lhsVarNames, shadowingInfo, hasShadowing)

	case *ast.ParenExpr:
		// Check the parenthesized expression
		v.findVariableUsageInExpr(e.X, lhsVarNames, shadowingInfo, hasShadowing)

	case *ast.TypeAssertExpr:
		// Check the expression being type-asserted
		v.findVariableUsageInExpr(e.X, lhsVarNames, shadowingInfo, hasShadowing)

	case *ast.StarExpr:
		// Check the expression being dereferenced
		v.findVariableUsageInExpr(e.X, lhsVarNames, shadowingInfo, hasShadowing)

	// Add more expression types as needed
	default:
		// For other expression types, we might need to add specific handling
		// For now, we'll ignore them as they're less common in shadowing scenarios
	}
}

// trackInterfaceImplementation records that a struct type implements an interface method
func (a *Analysis) trackInterfaceImplementation(interfaceType *types.Interface, structType *types.Named, method *types.Func) {
	key := InterfaceMethodKey{
		InterfaceType: interfaceType.String(),
		MethodName:    method.Name(),
	}

	implementation := ImplementationInfo{
		StructType: structType,
		Method:     method,
	}

	a.InterfaceImplementations[key] = append(a.InterfaceImplementations[key], implementation)
}

// IsInterfaceMethodAsync determines if an interface method should be async based on its implementations
func (a *Analysis) IsInterfaceMethodAsync(interfaceType *types.Interface, methodName string) bool {
	key := InterfaceMethodKey{
		InterfaceType: interfaceType.String(),
		MethodName:    methodName,
	}

	// Find all implementations of this interface method
	implementations, exists := a.InterfaceImplementations[key]
	if !exists {
		return false
	}

	// If ANY implementation is async, the interface method is async
	for _, impl := range implementations {
		methodKey := MethodKey{
			PackagePath:  impl.StructType.Obj().Pkg().Path(),
			ReceiverType: impl.StructType.Obj().Name(),
			MethodName:   impl.Method.Name(),
		}

		if isAsync, exists := a.MethodAsyncStatus[methodKey]; exists && isAsync {
			return true
		}
	}

	return false
}

// MustBeAsyncDueToInterface checks if a struct method must be async due to interface constraints
func (a *Analysis) MustBeAsyncDueToInterface(structType *types.Named, methodName string) bool {
	// Find all interfaces that this struct implements
	for key, implementations := range a.InterfaceImplementations {
		if key.MethodName != methodName {
			continue
		}

		// Check if this struct is among the implementations
		for _, impl := range implementations {
			if impl.StructType == structType {
				// This struct implements this interface method
				// Check if the interface method is marked as async
				interfaceType := a.findInterfaceTypeByString(key.InterfaceType)
				if interfaceType != nil && a.IsInterfaceMethodAsync(interfaceType, methodName) {
					return true
				}
			}
		}
	}

	return false
}

// findInterfaceTypeByString finds an interface type by its string representation
// This is a helper method for MustBeAsyncDueToInterface
func (a *Analysis) findInterfaceTypeByString(interfaceString string) *types.Interface {
	// This is a simplified implementation - in practice, we might need to store
	// the actual interface types in our tracking data structure
	for _, pkg := range a.AllPackages {
		for _, syntax := range pkg.Syntax {
			for _, decl := range syntax.Decls {
				if genDecl, ok := decl.(*ast.GenDecl); ok {
					for _, spec := range genDecl.Specs {
						if typeSpec, ok := spec.(*ast.TypeSpec); ok {
							if interfaceType, ok := typeSpec.Type.(*ast.InterfaceType); ok {
								if goType := pkg.TypesInfo.TypeOf(interfaceType); goType != nil {
									if iface, ok := goType.(*types.Interface); ok {
										if iface.String() == interfaceString {
											return iface
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return nil
}

// GetReceiverMapping returns the receiver variable mapping for a function declaration
func (a *Analysis) GetReceiverMapping(funcDecl *ast.FuncDecl) string {
	if funcDecl.Recv != nil && len(funcDecl.Recv.List) > 0 {
		for _, field := range funcDecl.Recv.List {
			for _, name := range field.Names {
				if name != nil && name.Name != "_" {
					return "receiver"
				}
			}
		}
	}
	return ""
}

// GetIdentifierMapping returns the replacement name for an identifier
func (a *Analysis) GetIdentifierMapping(ident *ast.Ident) string {
	if ident == nil {
		return ""
	}

	// Check if this identifier has a mapping in NodeData
	if nodeInfo := a.NodeData[ident]; nodeInfo != nil {
		return nodeInfo.IdentifierMapping
	}

	return ""
}

// findStructMethod finds a method with the given name on a named type
func (v *analysisVisitor) findStructMethod(namedType *types.Named, methodName string) *types.Func {
	// Check methods directly on the type
	for i := 0; i < namedType.NumMethods(); i++ {
		method := namedType.Method(i)
		if method.Name() == methodName {
			return method
		}
	}
	return nil
}

// analyzeAssignment analyzes a single assignment for pointer analysis
func (v *analysisVisitor) analyzeAssignment(lhsExpr, rhsExpr ast.Expr) {
	// Determine RHS assignment type and source object
	rhsAssignmentType := DirectAssignment
	var rhsSourceObj types.Object

	if unaryExpr, ok := rhsExpr.(*ast.UnaryExpr); ok && unaryExpr.Op == token.AND {
		// RHS is &some_expr
		rhsAssignmentType = AddressOfAssignment
		if rhsIdent, ok := unaryExpr.X.(*ast.Ident); ok {
			rhsSourceObj = v.pkg.TypesInfo.ObjectOf(rhsIdent)
		}
	} else if rhsIdent, ok := rhsExpr.(*ast.Ident); ok {
		// RHS is variable
		rhsAssignmentType = DirectAssignment
		rhsSourceObj = v.pkg.TypesInfo.ObjectOf(rhsIdent)
	}

	// Determine LHS object
	var lhsTrackedObj types.Object

	if lhsIdent, ok := lhsExpr.(*ast.Ident); ok {
		if lhsIdent.Name != "_" {
			lhsTrackedObj = v.pkg.TypesInfo.ObjectOf(lhsIdent)
		}
	} else if selExpr, ok := lhsExpr.(*ast.SelectorExpr); ok {
		if selection := v.pkg.TypesInfo.Selections[selExpr]; selection != nil {
			lhsTrackedObj = selection.Obj()
		}
	}

	// Record usage information
	if _, isVar := lhsTrackedObj.(*types.Var); isVar {
		lhsUsageInfo := v.getOrCreateUsageInfo(lhsTrackedObj)
		if rhsSourceObj != nil {
			lhsUsageInfo.Sources = append(lhsUsageInfo.Sources, AssignmentInfo{
				Object: rhsSourceObj,
				Type:   rhsAssignmentType,
			})
		} else if rhsAssignmentType == AddressOfAssignment {
			lhsUsageInfo.Sources = append(lhsUsageInfo.Sources, AssignmentInfo{
				Object: nil,
				Type:   rhsAssignmentType,
			})
		}
	}

	if rhsSourceObj != nil {
		sourceUsageInfo := v.getOrCreateUsageInfo(rhsSourceObj)
		sourceUsageInfo.Destinations = append(sourceUsageInfo.Destinations, AssignmentInfo{
			Object: lhsTrackedObj,
			Type:   rhsAssignmentType,
		})
	}
}

// trackInterfaceAssignments tracks interface implementations in assignment statements
func (v *analysisVisitor) trackInterfaceAssignments(assignStmt *ast.AssignStmt) {
	// For each assignment, check if we're assigning a struct to an interface variable
	for i, lhsExpr := range assignStmt.Lhs {
		if i >= len(assignStmt.Rhs) {
			continue
		}
		rhsExpr := assignStmt.Rhs[i]

		// Get the type of the LHS (destination)
		lhsType := v.pkg.TypesInfo.TypeOf(lhsExpr)
		if lhsType == nil {
			continue
		}

		// Check if LHS is an interface type
		interfaceType, isInterface := lhsType.Underlying().(*types.Interface)
		if !isInterface {
			continue
		}

		// Get the type of the RHS (source)
		rhsType := v.pkg.TypesInfo.TypeOf(rhsExpr)
		if rhsType == nil {
			continue
		}

		// Handle pointer types
		if ptrType, isPtr := rhsType.(*types.Pointer); isPtr {
			rhsType = ptrType.Elem()
		}

		// Check if RHS is a named struct type
		namedType, isNamed := rhsType.(*types.Named)
		if !isNamed {
			continue
		}

		// Track implementations for all interface methods
		for j := 0; j < interfaceType.NumExplicitMethods(); j++ {
			interfaceMethod := interfaceType.ExplicitMethod(j)

			structMethod := v.findStructMethod(namedType, interfaceMethod.Name())
			if structMethod != nil {
				v.analysis.trackInterfaceImplementation(interfaceType, namedType, structMethod)
			}
		}
	}
}

// trackInterfaceCallArguments analyzes function call arguments to detect interface implementations
func (v *analysisVisitor) trackInterfaceCallArguments(callExpr *ast.CallExpr) {
	// Get the function signature to determine parameter types
	var funcType *types.Signature

	if callFunType := v.pkg.TypesInfo.TypeOf(callExpr.Fun); callFunType != nil {
		if sig, ok := callFunType.(*types.Signature); ok {
			funcType = sig
		}
	}

	if funcType == nil {
		return
	}

	// Check each argument against its corresponding parameter
	params := funcType.Params()
	for i, arg := range callExpr.Args {
		if i >= params.Len() {
			break // More arguments than parameters (variadic case)
		}

		paramType := params.At(i).Type()

		// Check if the parameter is an interface type
		interfaceType, isInterface := paramType.Underlying().(*types.Interface)
		if !isInterface {
			continue
		}

		// Get the type of the argument
		argType := v.pkg.TypesInfo.TypeOf(arg)
		if argType == nil {
			continue
		}

		// Handle pointer types
		if ptrType, isPtr := argType.(*types.Pointer); isPtr {
			argType = ptrType.Elem()
		}

		// Check if argument is a named struct type
		namedType, isNamed := argType.(*types.Named)
		if !isNamed {
			continue
		}

		// Track implementations for all interface methods
		for j := 0; j < interfaceType.NumExplicitMethods(); j++ {
			interfaceMethod := interfaceType.ExplicitMethod(j)

			structMethod := v.findStructMethod(namedType, interfaceMethod.Name())
			if structMethod != nil {
				v.analysis.trackInterfaceImplementation(interfaceType, namedType, structMethod)
			}
		}
	}
}

// IsNamedBasicType returns whether the given type should be implemented as a type alias with standalone functions
// This applies to named types with basic underlying types (like uint32, string, etc.) that have methods
// It excludes struct types, which should remain as classes
func (a *Analysis) IsNamedBasicType(t types.Type) bool {
	if t == nil {
		return false
	}

	// Check if we already have this result cached
	if result, exists := a.NamedBasicTypes[t]; exists {
		return result
	}

	var originalType types.Type = t
	var foundMethods bool

	// Traverse the type chain to find any type with methods
	for {
		switch typed := t.(type) {
		case *types.Named:
			// Built-in types cannot be named basic types
			if typed.Obj().Pkg() == nil {
				return false
			}

			// Check if this named type has methods
			if typed.NumMethods() > 0 {
				foundMethods = true
			}

			// Check underlying type
			underlying := typed.Underlying()
			switch underlying.(type) {
			case *types.Struct, *types.Interface:
				return false
			}
			t = underlying

		case *types.Alias:
			// Built-in types cannot be named basic types
			if typed.Obj().Pkg() == nil {
				return false
			}
			t = typed.Underlying()

		default:
			// We've reached a non-named, non-alias type
			// Check if it's a supported type with methods
			switch t.(type) {
			case *types.Basic, *types.Slice, *types.Array, *types.Map:
				if foundMethods {
					a.NamedBasicTypes[originalType] = true
					return true
				}
				return false
			default:
				return false
			}
		}
	}
}

// interfaceImplementationVisitor performs a second pass to analyze interface implementations
type interfaceImplementationVisitor struct {
	analysis *Analysis
	pkg      *packages.Package
}

func (v *interfaceImplementationVisitor) Visit(node ast.Node) ast.Visitor {
	switch n := node.(type) {
	case *ast.GenDecl:
		// Look for interface type specifications
		for _, spec := range n.Specs {
			if typeSpec, ok := spec.(*ast.TypeSpec); ok {
				if interfaceType, ok := typeSpec.Type.(*ast.InterfaceType); ok {
					// This is an interface declaration, find all potential implementations
					v.findInterfaceImplementations(interfaceType)
				}
			}
		}
	}
	return v
}

// findInterfaceImplementations finds all struct types that implement the given interface
func (v *interfaceImplementationVisitor) findInterfaceImplementations(interfaceAST *ast.InterfaceType) {
	// Get the interface type from TypesInfo
	interfaceGoType := v.pkg.TypesInfo.TypeOf(interfaceAST)
	if interfaceGoType == nil {
		return
	}

	interfaceType, ok := interfaceGoType.(*types.Interface)
	if !ok {
		return
	}

	// Look through all packages for potential implementations
	for _, pkg := range v.analysis.AllPackages {
		v.findImplementationsInPackage(interfaceType, pkg)
	}
}

// findImplementationsInPackage finds implementations of an interface in a specific package
func (v *interfaceImplementationVisitor) findImplementationsInPackage(interfaceType *types.Interface, pkg *packages.Package) {
	// Get all named types in the package
	scope := pkg.Types.Scope()
	for _, name := range scope.Names() {
		obj := scope.Lookup(name)
		if obj == nil {
			continue
		}

		// Check if this is a type name
		typeName, ok := obj.(*types.TypeName)
		if !ok {
			continue
		}

		namedType, ok := typeName.Type().(*types.Named)
		if !ok {
			continue
		}

		// Check if this type implements the interface
		if types.Implements(namedType, interfaceType) || types.Implements(types.NewPointer(namedType), interfaceType) {
			v.trackImplementation(interfaceType, namedType)
		}
	}
}

// trackImplementation records that a named type implements an interface
func (v *interfaceImplementationVisitor) trackImplementation(interfaceType *types.Interface, namedType *types.Named) {
	// For each method in the interface, find the corresponding implementation
	for i := 0; i < interfaceType.NumExplicitMethods(); i++ {
		interfaceMethod := interfaceType.ExplicitMethod(i)

		// Find the method in the implementing type
		structMethod := v.findMethodInType(namedType, interfaceMethod.Name())
		if structMethod != nil {
			v.analysis.trackInterfaceImplementation(interfaceType, namedType, structMethod)
		}
	}
}

// findMethodInType finds a method with the given name in a named type
func (v *interfaceImplementationVisitor) findMethodInType(namedType *types.Named, methodName string) *types.Func {
	for i := 0; i < namedType.NumMethods(); i++ {
		method := namedType.Method(i)
		if method.Name() == methodName {
			return method
		}
	}
	return nil
}

// analyzeAllMethodsAsync performs comprehensive async analysis on all methods in all packages using topological sort
func (v *analysisVisitor) analyzeAllMethodsAsync() {
	// Build the method call graph for all packages
	methodCalls := v.buildMethodCallGraph()

	// Topologically sort methods by their dependencies
	sorted, cycles := v.topologicalSortMethods(methodCalls)

	// Mark methods in cycles - check if they contain async operations
	// We can't rely on the call graph for methods in cycles (circular dependency),
	// but we can still detect if they call async external methods
	//
	// We need to iterate multiple times because methods in cycles can call each other,
	// and we need to propagate async status until no changes occur
	maxIterations := 10
	for iteration := 0; iteration < maxIterations; iteration++ {
		changed := false

		for _, methodKey := range cycles {
			// For methods in cycles, we need to check their body directly for async operations
			pkg := v.analysis.AllPackages[methodKey.PackagePath]
			if pkg == nil && methodKey.PackagePath == v.pkg.Types.Path() {
				pkg = v.pkg
			}

			if pkg != nil {
				var funcDecl *ast.FuncDecl
				if methodKey.ReceiverType == "" {
					funcDecl = v.findFunctionDecl(methodKey.MethodName, pkg)
				} else {
					funcDecl = v.findMethodDecl(methodKey.ReceiverType, methodKey.MethodName, pkg)
				}

				if funcDecl != nil && funcDecl.Body != nil {
					// Check if the method contains async operations (including calls to async external methods)
					isAsync := v.containsAsyncOperationsComplete(funcDecl.Body, pkg)

					// Check if status changed
					if oldStatus, exists := v.analysis.MethodAsyncStatus[methodKey]; !exists || oldStatus != isAsync {
						changed = true
					}

					v.analysis.MethodAsyncStatus[methodKey] = isAsync
					continue
				}
			}

			// Fallback: mark as sync if we can't analyze the body
			if _, exists := v.analysis.MethodAsyncStatus[methodKey]; !exists {
				v.analysis.MethodAsyncStatus[methodKey] = false
				changed = true
			}
		}

		// If no changes in this iteration, we're done
		if !changed {
			break
		}
	}

	// Analyze methods in dependency order (dependencies analyzed before dependents)
	for _, methodKey := range sorted {
		v.analyzeMethodAsyncTopological(methodKey, methodCalls[methodKey])
	}

	// Track async-returning variables BEFORE analyzing function literals
	// This detects variables assigned from higher-order functions with async function literal args
	// e.g., indirect := sync.OnceValue(asyncFunc)
	// This must happen first so that function literals containing calls to these variables
	// will be correctly identified as async.
	v.trackAsyncReturningVarsAllFiles()

	// Finally, analyze function literals in the current package only
	// (external packages' function literals are not accessible)
	// This must run AFTER trackAsyncReturningVarsAllFiles so that function literals
	// containing calls to async-returning variables are correctly marked as async.
	v.analyzeFunctionLiteralsAsync(v.pkg)
}

// buildMethodCallGraph builds a graph of which methods call which other methods
func (v *analysisVisitor) analyzeFunctionLiteralsAsync(pkg *packages.Package) {
	for _, file := range pkg.Syntax {
		ast.Inspect(file, func(n ast.Node) bool {
			if funcLit, ok := n.(*ast.FuncLit); ok {
				v.analyzeFunctionLiteralAsync(funcLit, pkg)
			}
			return true
		})
	}
}

// trackAsyncReturningVarsAllFiles scans all files for assignment statements
// and marks variables that are assigned from higher-order functions with async function literal args
func (v *analysisVisitor) trackAsyncReturningVarsAllFiles() {
	for _, file := range v.pkg.Syntax {
		ast.Inspect(file, func(n ast.Node) bool {
			if assignStmt, ok := n.(*ast.AssignStmt); ok {
				if len(assignStmt.Lhs) == 1 && len(assignStmt.Rhs) == 1 {
					v.trackAsyncReturningVar(assignStmt.Lhs[0], assignStmt.Rhs[0])
				}
			}
			return true
		})
	}
}

// analyzeFunctionLiteralAsync determines if a function literal is async and stores the result
func (v *analysisVisitor) analyzeFunctionLiteralAsync(funcLit *ast.FuncLit, pkg *packages.Package) {
	// Check if already analyzed
	nodeInfo := v.analysis.NodeData[funcLit]
	if nodeInfo != nil && nodeInfo.InAsyncContext {
		// Already marked as async, skip
		return
	}

	// Analyze function literal body for async operations
	isAsync := false
	if funcLit.Body != nil {
		isAsync = v.containsAsyncOperationsComplete(funcLit.Body, pkg)
	}

	// Store result in NodeData
	if nodeInfo == nil {
		nodeInfo = v.analysis.ensureNodeData(funcLit)
	}
	nodeInfo.InAsyncContext = isAsync
}

// buildMethodCallGraph builds a graph of which methods call which other methods
func (v *analysisVisitor) buildMethodCallGraph() map[MethodKey][]MethodKey {
	methodCalls := make(map[MethodKey][]MethodKey)

	// Iterate through all packages
	allPkgs := []*packages.Package{v.pkg}
	for _, pkg := range v.analysis.AllPackages {
		if pkg != v.pkg {
			allPkgs = append(allPkgs, pkg)
		}
	}

	for _, pkg := range allPkgs {
		for _, file := range pkg.Syntax {
			for _, decl := range file.Decls {
				if funcDecl, ok := decl.(*ast.FuncDecl); ok {
					methodKey := v.getMethodKey(funcDecl, pkg)

					// Initialize the entry for this method
					if _, exists := methodCalls[methodKey]; !exists {
						methodCalls[methodKey] = []MethodKey{}
					}

					// Extract method calls from the function body
					if funcDecl.Body != nil {
						callees := v.extractMethodCalls(funcDecl.Body, pkg)
						methodCalls[methodKey] = callees
					}
				}
			}
		}
	}

	return methodCalls
}

// extractMethodCalls extracts all method and function calls from a node
func (v *analysisVisitor) extractMethodCalls(node ast.Node, pkg *packages.Package) []MethodKey {
	var calls []MethodKey
	seen := make(map[MethodKey]bool)

	ast.Inspect(node, func(n ast.Node) bool {
		if n == nil {
			return false
		}

		if callExpr, ok := n.(*ast.CallExpr); ok {
			methodKeys := v.extractMethodKeysFromCall(callExpr, pkg)
			for _, methodKey := range methodKeys {
				if !seen[methodKey] {
					seen[methodKey] = true
					calls = append(calls, methodKey)
				}
			}
		}

		return true
	})

	return calls
}

// extractMethodKeysFromCall extracts MethodKeys from a call expression
// Returns multiple keys for interface method calls (one for each implementation)
func (v *analysisVisitor) extractMethodKeysFromCall(callExpr *ast.CallExpr, pkg *packages.Package) []MethodKey {
	singleKey := v.extractMethodKeyFromCall(callExpr, pkg)
	if singleKey != nil {
		return []MethodKey{*singleKey}
	}

	// Check if this is an interface method call
	if selExpr, ok := callExpr.Fun.(*ast.SelectorExpr); ok {
		if receiverType := pkg.TypesInfo.TypeOf(selExpr.X); receiverType != nil {
			if interfaceType, isInterface := receiverType.Underlying().(*types.Interface); isInterface {
				methodName := selExpr.Sel.Name
				// Find all implementations of this interface method
				key := InterfaceMethodKey{
					InterfaceType: interfaceType.String(),
					MethodName:    methodName,
				}
				if implementations, exists := v.analysis.InterfaceImplementations[key]; exists {
					var keys []MethodKey
					for _, impl := range implementations {
						keys = append(keys, MethodKey{
							PackagePath:  impl.StructType.Obj().Pkg().Path(),
							ReceiverType: impl.StructType.Obj().Name(),
							MethodName:   impl.Method.Name(),
						})
					}
					return keys
				}
			}
		}
	}

	return nil
}

// extractMethodKeyFromCall extracts a MethodKey from a call expression
func (v *analysisVisitor) extractMethodKeyFromCall(callExpr *ast.CallExpr, pkg *packages.Package) *MethodKey {
	switch fun := callExpr.Fun.(type) {
	case *ast.Ident:
		// Direct function call
		if obj := pkg.TypesInfo.Uses[fun]; obj != nil {
			if funcObj, ok := obj.(*types.Func); ok {
				pkgPath := pkg.Types.Path()
				if funcObj.Pkg() != nil {
					pkgPath = funcObj.Pkg().Path()
				}
				return &MethodKey{
					PackagePath:  pkgPath,
					ReceiverType: "",
					MethodName:   funcObj.Name(),
				}
			}
		}

	case *ast.SelectorExpr:
		// Package-level function call (e.g., time.Sleep)
		if ident, ok := fun.X.(*ast.Ident); ok {
			if obj := pkg.TypesInfo.Uses[ident]; obj != nil {
				if pkgName, isPkg := obj.(*types.PkgName); isPkg {
					return &MethodKey{
						PackagePath:  pkgName.Imported().Path(),
						ReceiverType: "",
						MethodName:   fun.Sel.Name,
					}
				}
			}
		}

		// Check if this is an interface method call - if so, return nil
		// so extractMethodKeysFromCall can expand it to all implementations
		if receiverType := pkg.TypesInfo.TypeOf(fun.X); receiverType != nil {
			if _, isInterface := receiverType.Underlying().(*types.Interface); isInterface {
				// This is an interface method call - return nil to let
				// extractMethodKeysFromCall handle expanding to implementations
				return nil
			}
		}

		// Method call on concrete objects
		if selection := pkg.TypesInfo.Selections[fun]; selection != nil {
			if methodObj := selection.Obj(); methodObj != nil {
				receiverType := ""
				methodPkgPath := ""

				// Get receiver type
				switch x := fun.X.(type) {
				case *ast.Ident:
					if obj := pkg.TypesInfo.Uses[x]; obj != nil {
						if varObj, ok := obj.(*types.Var); ok {
							receiverType = v.getTypeName(varObj.Type())
						}
					}
				case *ast.SelectorExpr:
					if typeExpr := pkg.TypesInfo.TypeOf(x); typeExpr != nil {
						receiverType = v.getTypeName(typeExpr)
					}
				}

				// Get method's package path
				if methodFunc, ok := methodObj.(*types.Func); ok {
					if methodFunc.Pkg() != nil {
						methodPkgPath = methodFunc.Pkg().Path()
					}
				}

				if methodPkgPath == "" {
					methodPkgPath = pkg.Types.Path()
				}

				return &MethodKey{
					PackagePath:  methodPkgPath,
					ReceiverType: receiverType,
					MethodName:   methodObj.Name(),
				}
			}
		}
	}

	return nil
}

// topologicalSortMethods performs a topological sort of methods based on their call dependencies
// Returns sorted methods and methods involved in cycles
func (v *analysisVisitor) topologicalSortMethods(methodCalls map[MethodKey][]MethodKey) ([]MethodKey, []MethodKey) {
	// Kahn's algorithm for topological sorting
	inDegree := make(map[MethodKey]int)
	graph := make(map[MethodKey][]MethodKey)

	// Initialize in-degree counts and reverse graph
	for method := range methodCalls {
		inDegree[method] = 0
		graph[method] = []MethodKey{}
	}

	// Build reverse graph and count in-degrees
	// graph[dependency] = methods that depend on it
	for method, callees := range methodCalls {
		for _, callee := range callees {
			// Only create dependency edges for callees that exist in the call graph
			// This automatically excludes handwritten packages that aren't being compiled
			if _, exists := inDegree[callee]; exists {
				// Additionally, skip if the callee is from a handwritten package
				// This prevents our code from being blocked by unresolved handwritten package dependencies
				if !v.analysis.isHandwrittenPackage(callee.PackagePath) {
					graph[callee] = append(graph[callee], method)
					inDegree[method]++
				}
			}
		}
	}

	// Find methods with no dependencies (in-degree == 0)
	var queue []MethodKey
	for method, degree := range inDegree {
		if degree == 0 {
			queue = append(queue, method)
		}
	}

	var sorted []MethodKey

	for len(queue) > 0 {
		// Remove method from queue
		current := queue[0]
		queue = queue[1:]
		sorted = append(sorted, current)

		// For each method that depends on current
		for _, dependent := range graph[current] {
			inDegree[dependent]--
			if inDegree[dependent] == 0 {
				queue = append(queue, dependent)
			}
		}
	}

	// Find methods in cycles (not in sorted list)
	var cycles []MethodKey
	if len(sorted) != len(methodCalls) {
		for method := range methodCalls {
			found := slices.Contains(sorted, method)
			if !found {
				cycles = append(cycles, method)
			}
		}
	}

	return sorted, cycles
}

// analyzeMethodAsyncTopological analyzes a single method for async operations in topological order
func (v *analysisVisitor) analyzeMethodAsyncTopological(methodKey MethodKey, callees []MethodKey) {
	// Check if method is from handwritten package
	isHandwrittenPackage := v.analysis.isHandwrittenPackage(methodKey.PackagePath)

	if isHandwrittenPackage {
		// For handwritten packages, check if we have pre-loaded metadata
		_, hasMetadata := v.analysis.MethodAsyncStatus[methodKey]
		if hasMetadata {
			// Already set from metadata, don't override
			return
		}
		// No metadata means assume sync
		v.analysis.MethodAsyncStatus[methodKey] = false
		return
	}

	// Find the method declaration
	pkg := v.analysis.AllPackages[methodKey.PackagePath]
	if pkg == nil {
		if methodKey.PackagePath == v.pkg.Types.Path() {
			pkg = v.pkg
		}
	}

	if pkg == nil {
		// Can't find package, assume sync
		v.analysis.MethodAsyncStatus[methodKey] = false
		return
	}

	var funcDecl *ast.FuncDecl
	if methodKey.ReceiverType == "" {
		// Package-level function
		funcDecl = v.findFunctionDecl(methodKey.MethodName, pkg)
	} else {
		// Method with receiver
		funcDecl = v.findMethodDecl(methodKey.ReceiverType, methodKey.MethodName, pkg)
	}

	if funcDecl == nil || funcDecl.Body == nil {
		// No body to analyze, assume sync
		v.analysis.MethodAsyncStatus[methodKey] = false
		return
	}

	// Check if method contains async operations (including calls to async external methods)
	isAsync := v.containsAsyncOperationsComplete(funcDecl.Body, pkg)

	// If not directly async, check if any callee from the call graph is async
	// (This catches calls to other methods in the same codebase)
	if !isAsync {
		for _, callee := range callees {
			if calleeAsync, exists := v.analysis.MethodAsyncStatus[callee]; exists && calleeAsync {
				isAsync = true
				break
			}
		}
	}

	v.analysis.MethodAsyncStatus[methodKey] = isAsync
}

// getMethodKey creates a unique key for a method
func (v *analysisVisitor) getMethodKey(funcDecl *ast.FuncDecl, pkg *packages.Package) MethodKey {
	packagePath := pkg.Types.Path()
	methodName := funcDecl.Name.Name
	receiverType := ""

	if funcDecl.Recv != nil && len(funcDecl.Recv.List) > 0 {
		// Try to get receiver type from TypesInfo first
		if len(funcDecl.Recv.List[0].Names) > 0 && pkg.TypesInfo != nil {
			if def := pkg.TypesInfo.Defs[funcDecl.Recv.List[0].Names[0]]; def != nil {
				if vr, ok := def.(*types.Var); ok {
					receiverType = v.getTypeName(vr.Type())
				}
			}
		}

		// Fallback to AST if TypesInfo is unavailable or failed
		if receiverType == "" {
			receiverType = v.getReceiverTypeFromAST(funcDecl.Recv.List[0].Type)
		}
	}

	return MethodKey{
		PackagePath:  packagePath,
		ReceiverType: receiverType,
		MethodName:   methodName,
	}
}

// getTypeName extracts a clean type name from a types.Type
func (v *analysisVisitor) getTypeName(t types.Type) string {
	switch typ := t.(type) {
	case *types.Named:
		return typ.Obj().Name()
	case *types.Pointer:
		return v.getTypeName(typ.Elem())
	default:
		return typ.String()
	}
}

// getReceiverTypeFromAST extracts the receiver type name from AST when TypesInfo is unavailable
func (v *analysisVisitor) getReceiverTypeFromAST(expr ast.Expr) string {
	switch t := expr.(type) {
	case *ast.StarExpr:
		// Pointer receiver: *Type
		return v.getReceiverTypeFromAST(t.X)
	case *ast.Ident:
		// Simple type name
		return t.Name
	case *ast.SelectorExpr:
		// Qualified type: pkg.Type
		return t.Sel.Name
	default:
		return ""
	}
}

// containsAsyncOperationsComplete is a comprehensive async detection that handles method calls
func (v *analysisVisitor) containsAsyncOperationsComplete(node ast.Node, pkg *packages.Package) bool {
	var hasAsync bool
	var asyncReasons []string

	ast.Inspect(node, func(n ast.Node) bool {
		if n == nil {
			return false
		}

		switch s := n.(type) {
		case *ast.SendStmt:
			// Channel send operation (ch <- value)
			hasAsync = true
			asyncReasons = append(asyncReasons, "channel send")
			return false

		case *ast.UnaryExpr:
			// Channel receive operation (<-ch)
			if s.Op == token.ARROW {
				hasAsync = true
				asyncReasons = append(asyncReasons, "channel receive")
				return false
			}

		case *ast.SelectStmt:
			// Select statement with channel operations
			hasAsync = true
			asyncReasons = append(asyncReasons, "select statement")
			return false

		case *ast.CallExpr:
			// Check if we're calling a function known to be async
			if v.isCallAsync(s, pkg) {
				hasAsync = true
				return false
			}
		}

		return true
	})

	return hasAsync
}

// isCallAsync determines if a call expression is async
func (v *analysisVisitor) isCallAsync(callExpr *ast.CallExpr, pkg *packages.Package) bool {
	switch fun := callExpr.Fun.(type) {
	case *ast.Ident:
		// Direct function call
		if obj := pkg.TypesInfo.Uses[fun]; obj != nil {
			if funcObj, ok := obj.(*types.Func); ok {
				result := v.isFunctionAsync(funcObj, pkg)
				return result
			}
			// Check if this is a variable that returns async values
			// (e.g., indirect := sync.OnceValue(asyncFunc))
			if v.analysis.IsAsyncReturningVar(obj) {
				return true
			}
		}

	case *ast.SelectorExpr:
		// Handle package-level function calls (e.g., time.Sleep)
		if ident, ok := fun.X.(*ast.Ident); ok {
			if obj := pkg.TypesInfo.Uses[ident]; obj != nil {
				if pkgName, isPkg := obj.(*types.PkgName); isPkg {
					methodName := fun.Sel.Name
					pkgPath := pkgName.Imported().Path()
					// Check if this package-level function is async (empty TypeName)
					isAsync := v.analysis.IsMethodAsync(pkgPath, "", methodName)
					return isAsync
				}
			}
		}

		// Check if this is an interface method call
		if receiverType := pkg.TypesInfo.TypeOf(fun.X); receiverType != nil {
			if interfaceType, isInterface := receiverType.Underlying().(*types.Interface); isInterface {
				methodName := fun.Sel.Name
				// For interface method calls, check if the interface method is async
				result := v.analysis.IsInterfaceMethodAsync(interfaceType, methodName)
				return result
			}
		}

		// Method call on concrete objects
		if selection := pkg.TypesInfo.Selections[fun]; selection != nil {
			if methodObj := selection.Obj(); methodObj != nil {
				result := v.isMethodAsyncFromSelection(fun, methodObj, pkg)
				return result
			}
		}
	}

	return false
}

// isFunctionAsync checks if a function object is async
func (v *analysisVisitor) isFunctionAsync(funcObj *types.Func, pkg *packages.Package) bool {
	// Check if it's from external package metadata
	if funcObj.Pkg() != nil && funcObj.Pkg() != pkg.Types {
		return v.analysis.IsMethodAsync(funcObj.Pkg().Path(), "", funcObj.Name())
	}

	// Check internal method status (should already be computed during analysis)
	methodKey := MethodKey{
		PackagePath:  pkg.Types.Path(),
		ReceiverType: "",
		MethodName:   funcObj.Name(),
	}

	if status, exists := v.analysis.MethodAsyncStatus[methodKey]; exists {
		return status
	}

	// Not found - should have been analyzed during analyzeAllMethodsAsync
	return false
}

// isMethodAsyncFromSelection checks if a method call is async based on selection
func (v *analysisVisitor) isMethodAsyncFromSelection(selExpr *ast.SelectorExpr, methodObj types.Object, pkg *packages.Package) bool {
	// Get receiver type - handle both direct identifiers and field access
	var receiverType string
	var methodPkgPath string

	// Handle different receiver patterns
	switch x := selExpr.X.(type) {
	case *ast.Ident:
		// Direct variable (e.g., mtx.Lock())
		if obj := pkg.TypesInfo.Uses[x]; obj != nil {
			if varObj, ok := obj.(*types.Var); ok {
				receiverType = v.getTypeName(varObj.Type())
			}
		}
	case *ast.SelectorExpr:
		// Field access (e.g., l.m.Lock() or d.mu.Lock())
		if typeExpr := pkg.TypesInfo.TypeOf(x); typeExpr != nil {
			receiverType = v.getTypeName(typeExpr)
		}
	default:
		// For other cases, try to get type directly
		if typeExpr := pkg.TypesInfo.TypeOf(x); typeExpr != nil {
			receiverType = v.getTypeName(typeExpr)
		}
	}

	// Get the method's package path
	if methodFunc, ok := methodObj.(*types.Func); ok {
		if methodFunc.Pkg() != nil {
			methodPkgPath = methodFunc.Pkg().Path()
		}
	}

	if methodPkgPath == "" {
		methodPkgPath = pkg.Types.Path()
	}

	// For external packages, check unified MethodAsyncStatus first
	// For internal packages, try analysis first, then fallback to lookup
	methodKey := MethodKey{
		PackagePath:  methodPkgPath,
		ReceiverType: receiverType,
		MethodName:   methodObj.Name(),
	}

	if status, exists := v.analysis.MethodAsyncStatus[methodKey]; exists {
		return status
	}

	// Not found - should have been analyzed during analyzeAllMethodsAsync
	return false
}

// findFunctionDecl finds a function declaration by name in a package
func (v *analysisVisitor) findFunctionDecl(funcName string, pkg *packages.Package) *ast.FuncDecl {
	for _, file := range pkg.Syntax {
		for _, decl := range file.Decls {
			if funcDecl, ok := decl.(*ast.FuncDecl); ok {
				if funcDecl.Name.Name == funcName && funcDecl.Recv == nil {
					return funcDecl
				}
			}
		}
	}
	return nil
}

// findMethodDecl finds a method declaration by receiver type and method name
func (v *analysisVisitor) findMethodDecl(receiverType, methodName string, pkg *packages.Package) *ast.FuncDecl {
	for _, file := range pkg.Syntax {
		for _, decl := range file.Decls {
			if funcDecl, ok := decl.(*ast.FuncDecl); ok {
				if funcDecl.Name.Name == methodName && funcDecl.Recv != nil {
					if len(funcDecl.Recv.List) > 0 && len(funcDecl.Recv.List[0].Names) > 0 {
						if def := pkg.TypesInfo.Defs[funcDecl.Recv.List[0].Names[0]]; def != nil {
							if vr, ok := def.(*types.Var); ok {
								if v.getTypeName(vr.Type()) == receiverType {
									return funcDecl
								}
							}
						}
					}
				}
			}
		}
	}
	return nil
}

// IsLocalMethodAsync checks if a local method is async using pre-computed analysis
func (a *Analysis) IsLocalMethodAsync(pkgPath, receiverType, methodName string) bool {
	methodKey := MethodKey{
		PackagePath:  pkgPath,
		ReceiverType: receiverType,
		MethodName:   methodName,
	}

	if status, exists := a.MethodAsyncStatus[methodKey]; exists {
		return status
	}

	return false
}
