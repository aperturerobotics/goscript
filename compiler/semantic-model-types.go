package compiler

import (
	"go/types"

	"golang.org/x/tools/go/packages"
)

// SemanticModel is the immutable compiler semantic surface consumed by lowering.
type SemanticModel struct {
	packages                 map[string]*semanticPackage
	addressTaken             map[types.Object]bool
	needsVarRef              map[types.Object]bool
	functions                map[*types.Func]*semanticFunction
	functionCallers          map[*types.Func][]*semanticFunction
	functionsByFullName      map[string]*semanticFunction
	functionLookupMisses     map[*types.Func]bool
	functionFullNames        map[*types.Func]string
	types                    map[*types.Named]*semanticType
	values                   map[types.Object]*semanticValue
	generatedImports         map[string]map[string]bool
	generatedImportTypes     map[string]map[types.Type]bool
	interfaceImplementations []semanticInterfaceImplementation
	asyncInterfaceMethods    map[string]bool
	asyncInterfaceMethodObjs map[*types.Func]bool
}

type semanticPackage struct {
	pkgPath          string
	name             string
	source           *packages.Package
	declarations     []semanticDeclaration
	imports          []semanticImport
	types            []*semanticType
	values           []*semanticValue
	functions        []*semanticFunction
	initOrder        []types.Object
	generatedImports map[string]map[string]bool
	typeAssertions   []semanticTypeAssertion
	nilFacts         []semanticNilFact
}

type semanticDeclaration struct {
	kind     string
	name     string
	object   types.Object
	position sourcePosition
}

type semanticImport struct {
	path     string
	name     string
	file     string
	position sourcePosition
}

type semanticType struct {
	name        string
	named       *types.Named
	isInterface bool
	fields      []semanticField
	position    sourcePosition
}

type semanticField struct {
	name     string
	typ      types.Type
	doc      string
	tag      string
	embedded bool
}

type semanticValue struct {
	name                    string
	object                  types.Object
	typ                     types.Type
	zeroValueKind           string
	position                sourcePosition
	topLevel                bool
	asyncCompatibleFunction bool
}

type semanticFunction struct {
	name            string
	function        *types.Func
	signature       *types.Signature
	receiver        *types.Named
	receiverPointer bool
	position        sourcePosition
	hasBody         bool
	async           bool
	asyncReasons    []string
	calls           map[*types.Func]bool
}

type semanticInterfaceImplementation struct {
	typ     *types.Named
	iface   *types.Named
	pointer bool
}

type semanticInterfaceImplementationGraphEntry struct {
	typ          *types.Named
	iface        *types.Named
	pointer      bool
	ifaceMethods map[string]*types.Func
	implMethods  map[string]*types.Func
}

type semanticAnonymousInterfaceImplementation struct {
	ifaceMethods map[string]*types.Func
	implMethods  map[string]*types.Func
}

type semanticImplementationMethodSet struct {
	typ      *types.Named
	receiver types.Type
	pointer  bool
	methods  map[string]*types.Func
}

type semanticTypeAssertion struct {
	position sourcePosition
	source   types.Type
	target   types.Type
}

type semanticNilFact struct {
	position sourcePosition
	kind     string
	typ      types.Type
}

type sourcePosition struct {
	file   string
	line   int
	column int
}
