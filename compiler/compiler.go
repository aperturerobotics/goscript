package compiler

import (
	"context"

	"github.com/sirupsen/logrus"
	"golang.org/x/tools/go/packages"
)

// Compiler is the public Go adapter for the v2 compile service.
type Compiler struct {
	le      *logrus.Entry
	config  Config
	service *CompileService
}

// NewCompiler builds a compiler adapter over the v2 compile service.
func NewCompiler(conf *Config, le *logrus.Entry, _ *packages.Config) (*Compiler, error) {
	if err := conf.Validate(); err != nil {
		return nil, err
	}

	return &Compiler{
		le:      le,
		config:  *conf,
		service: NewCompileService(conf.OverrideDirs...),
	}, nil
}

// CompilePackages compiles Go package patterns through the v2 pipeline.
func (c *Compiler) CompilePackages(ctx context.Context, patterns ...string) (*CompilationResult, error) {
	if err := ctx.Err(); err != nil {
		return nil, err
	}

	if c.le != nil {
		c.le.Debugf("goscript v2 compile request: %v", patterns)
	}
	request := c.service.RequestOwner().NewRequest(c.config, patterns)
	return c.service.Compile(ctx, request)
}
