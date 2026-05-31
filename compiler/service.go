package compiler

import (
	"context"
	"slices"
)

// CompileService owns the v2 compiler pipeline.
type CompileService struct {
	requestOwner  *CompileRequestOwner
	graphOwner    *PackageGraphOwner
	semanticOwner *SemanticModelOwner
	loweringOwner *LoweringOwner
	emitterOwner  *TypeScriptEmitOwner
	runtimeOwner  *RuntimeContractOwner
	overrideOwner *OverrideRegistryOwner
	parityOwner   *OverrideParityVerifier
}

// NewCompileService creates a compile service with every pipeline owner.
func NewCompileService(overrideDirs ...string) *CompileService {
	overrideOwner := NewOverrideRegistryOwner(overrideDirs...)
	runtimeOwner := NewRuntimeContractOwner()
	return &CompileService{
		requestOwner:  NewCompileRequestOwner(),
		graphOwner:    NewPackageGraphOwner(overrideOwner),
		semanticOwner: NewSemanticModelOwner(overrideOwner),
		loweringOwner: NewLoweringOwner(runtimeOwner, overrideOwner),
		emitterOwner:  NewTypeScriptEmitOwner(runtimeOwner),
		runtimeOwner:  runtimeOwner,
		overrideOwner: overrideOwner,
		parityOwner:   NewOverrideParityVerifier(),
	}
}

// RequestOwner returns the compile request owner.
func (s *CompileService) RequestOwner() *CompileRequestOwner {
	return s.requestOwner
}

// PackageGraphOwner returns the package graph owner.
func (s *CompileService) PackageGraphOwner() *PackageGraphOwner {
	return s.graphOwner
}

// SemanticModelOwner returns the semantic model owner.
func (s *CompileService) SemanticModelOwner() *SemanticModelOwner {
	return s.semanticOwner
}

// LoweringOwner returns the lowering owner.
func (s *CompileService) LoweringOwner() *LoweringOwner {
	return s.loweringOwner
}

// TypeScriptEmitOwner returns the TypeScript emit owner.
func (s *CompileService) TypeScriptEmitOwner() *TypeScriptEmitOwner {
	return s.emitterOwner
}

// RuntimeContractOwner returns the runtime contract owner.
func (s *CompileService) RuntimeContractOwner() *RuntimeContractOwner {
	return s.runtimeOwner
}

// OverrideRegistryOwner returns the override registry owner.
func (s *CompileService) OverrideRegistryOwner() *OverrideRegistryOwner {
	return s.overrideOwner
}

// Compile runs one request through the v2 pipeline.
func (s *CompileService) Compile(ctx context.Context, req *CompileRequest) (*CompilationResult, error) {
	if err := ctx.Err(); err != nil {
		return nil, err
	}

	result := &CompilationResult{}
	if req != nil {
		result.OriginalPackages = append([]string(nil), req.Patterns...)
	}

	diagnostics := s.requestOwner.Validate(req)
	if diagnosticsHaveErrors(diagnostics) {
		result.Diagnostics = diagnostics
		return result, NewCompileError(diagnostics)
	}
	if !slices.Equal(s.overrideOwner.overrideDirs, req.OverrideDirs) {
		return NewCompileService(req.OverrideDirs...).Compile(ctx, req)
	}

	graph, graphDiagnostics := s.graphOwner.Load(ctx, req)
	diagnostics = append(diagnostics, graphDiagnostics...)
	if graph != nil {
		result.OriginalPackages = append([]string(nil), graph.RequestedPackagePaths...)
	}
	if diagnosticsHaveErrors(diagnostics) {
		result.Diagnostics = diagnostics
		return result, NewCompileError(diagnostics)
	}

	overrideFacts, factsDiagnostics := s.overrideOwner.Facts(ctx)
	diagnostics = append(diagnostics, factsDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		result.Diagnostics = diagnostics
		return result, NewCompileError(diagnostics)
	}
	parityDiagnostics := s.parityOwner.Verify(ctx, graph, overrideFacts)
	diagnostics = append(diagnostics, parityDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		result.Diagnostics = diagnostics
		return result, NewCompileError(diagnostics)
	}

	semanticModel, semanticDiagnostics := s.semanticOwner.Build(ctx, graph)
	diagnostics = append(diagnostics, semanticDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		result.Diagnostics = diagnostics
		return result, NewCompileError(diagnostics)
	}

	overridePlan, overrideDiagnostics := s.overrideOwner.CopyPlan(ctx, req, graph)
	diagnostics = append(diagnostics, overrideDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		result.Diagnostics = diagnostics
		return result, NewCompileError(diagnostics)
	}

	loweredProgram, loweringDiagnostics := s.loweringOwner.Build(ctx, semanticModel, LoweringOptions{
		SourceRoot:                protobufTypeScriptBindingRoot(req.Dir),
		DisplayRoot:               req.Dir,
		OutputPath:                req.OutputPath,
		ProtobufTypeScriptBinding: req.ProtobufTypeScriptBinding,
	})
	diagnostics = append(diagnostics, loweringDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		result.Diagnostics = diagnostics
		return result, NewCompileError(diagnostics)
	}

	compiledPackages, emitDiagnostics := s.emitterOwner.Emit(ctx, req, loweredProgram)
	diagnostics = append(diagnostics, emitDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		result.Diagnostics = diagnostics
		return result, NewCompileError(diagnostics)
	}
	result.CompiledPackages = append(result.CompiledPackages, compiledPackages...)

	copiedPackages, copyDiagnostics := s.overrideOwner.CopyPackages(ctx, req, overridePlan)
	diagnostics = append(diagnostics, copyDiagnostics...)
	if diagnosticsHaveErrors(diagnostics) {
		result.CopiedPackages = append(result.CopiedPackages, copiedPackages...)
		result.Diagnostics = diagnostics
		return result, NewCompileError(diagnostics)
	}
	result.CopiedPackages = append(result.CopiedPackages, copiedPackages...)

	result.Diagnostics = diagnostics
	return result, nil
}
