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
}

type loweredImport struct {
	alias  string
	source string
}

type loweredDecl struct {
	code            string
	indexExport     string
	typeIndexExport string
	function        *loweredFunction
	structType      *loweredStruct
}

type loweredStruct struct {
	exported      bool
	indexExported bool
	name          string
	typeName      string
	fields        []loweredStructField
	methods       []loweredFunction
}

type loweredStructField struct {
	name        string
	typ         string
	zero        string
	runtimeType string
	doc         string
	tag         string
	structValue bool
}

type loweredFunction struct {
	exported      bool
	indexExported bool
	async         bool
	name          string
	receiverAlias string
	params        []loweredParam
	namedResults  []loweredNamedResult
	result        string
	body          []loweredStmt
	deferState    *loweredDeferState
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
	returnBranch *loweredRangeBranch
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
	value       string
	cases       []loweredSwitchCase
	defaultBody []loweredStmt
}

type loweredSwitchCase struct {
	values       []string
	body         []loweredStmt
	fallsThrough bool
}

type loweredSelect struct {
	hasReturn  string
	value      string
	resultType string
	cases      []loweredSelectCase
	hasDefault bool
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
	result      string
	cases       []loweredTypeSwitchCase
	defaultBody []loweredStmt
}

type loweredTypeSwitchCase struct {
	types []string
	body  []loweredStmt
}
