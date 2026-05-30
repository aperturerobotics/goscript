package compiler

// LoweredProgram is the compiler-owned IR consumed by TypeScript emission.
type LoweredProgram struct {
	packages []*loweredPackage
}

type loweredPackage struct {
	pkgPath string
	name    string
	files   []*loweredFile
}

type loweredFile struct {
	sourcePath  string
	outputName  string
	imports     []loweredImport
	decls       []loweredDecl
	exports     []string
	typeExports []string
	sideEffect  bool
}

type loweredImport struct {
	alias      string
	source     string
	sideEffect bool
	typeOnly   bool
}

type loweredExpr struct {
	text  string
	async bool
}

type loweredNamedStructConversionExpr struct {
	value      loweredExpr
	target     string
	temp       string
	helper     string
	fields     []loweredConversionField
	castOnly   bool
	castTarget string
}

type loweredConversionField struct {
	name string
}

type loweredDecl struct {
	code            string
	indexExport     string
	typeIndexExport string
	sideEffect      bool
	packageInitCall string
	function        *loweredFunction
	structType      *loweredStruct
}

type loweredStruct struct {
	exported      bool
	indexExported bool
	name          string
	typeName      string
	cloneMethod   string
	fields        []loweredStructField
	methods       []loweredFunction
}

type loweredStructField struct {
	name        string
	runtimeName string
	typ         string
	zero        string
	runtimeType string
	doc         string
	tag         string
	pkgPath     string
	index       []int
	offset      int64
	anonymous   bool
	exported    bool
	structValue bool
	arrayValue  bool
}

type loweredFunction struct {
	exported        bool
	indexExported   bool
	init            bool
	async           bool
	name            string
	typeParams      []string
	runtimeName     string
	receiverAlias   string
	receiverType    string
	receiverValue   string
	receiverMutable bool
	params          []loweredParam
	paramBindings   []loweredStmt
	namedResults    []loweredNamedResult
	result          string
	body            []loweredStmt
	deferState      *loweredDeferState
}

type loweredParam struct {
	name string
	typ  string
}

type loweredNamedResult struct {
	name       string
	typ        string
	zero       string
	returnExpr string
}

type loweredStmt struct {
	text       string
	leading    []string
	hasBlock   bool
	children   []loweredStmt
	elseBody   []loweredStmt
	rangeFunc  *loweredRangeFunc
	switchStmt *loweredSwitch
	selectStmt *loweredSelect
	typeSwitch *loweredTypeSwitch
}

type loweredRangeFunc struct {
	value        string
	params       []string
	body         []loweredStmt
	async        bool
	returnBranch *loweredRangeBranch
	parentBranch *loweredRangeBranch
}

type loweredRangeBranch struct {
	hasReturn  string
	value      string
	resultType string
}

type loweredDeferState struct {
	used  bool
	async bool
}

type loweredSwitch struct {
	value string
	cases []loweredSwitchCase
}

type loweredSwitchCase struct {
	defaultCase  bool
	values       []string
	body         []loweredStmt
	fallsThrough bool
}

type loweredSelect struct {
	hasReturn  string
	value      string
	result     string
	resultType string
	cases      []loweredSelectCase
	hasDefault bool
	returns    bool
	external   bool
}

type loweredSelectCase struct {
	id      int
	isSend  bool
	channel string
	value   string
	prelude []loweredStmt
	body    []loweredStmt
}

type loweredTypeSwitch struct {
	value       string
	varName     string
	varRef      bool
	cases       []loweredTypeSwitchCase
	defaultBody []loweredStmt
	defaultRef  bool
}

type loweredTypeSwitchCase struct {
	types   []string
	tsTypes []string
	varRef  bool
	body    []loweredStmt
}
