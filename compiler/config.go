package compiler

import (
	"go/token"

	"github.com/pkg/errors"
)

// Config is the public compiler configuration.
type Config struct {
	fset *token.FileSet

	// Dir is the working directory for the compiler.
	Dir string
	// OutputPath is the output path root.
	OutputPath string
	// BuildFlags are the Go build flags to use during package loading.
	BuildFlags []string
	// AllDependencies controls whether dependencies are included in the graph.
	AllDependencies bool
	// DisableEmitBuiltin controls whether runtime packages are emitted.
	DisableEmitBuiltin bool
}

// Validate checks the config and initializes owned defaults.
func (c *Config) Validate() error {
	if c == nil {
		return errors.New("config cannot be nil")
	}
	if c.fset == nil {
		c.fset = token.NewFileSet()
	}
	return nil
}
