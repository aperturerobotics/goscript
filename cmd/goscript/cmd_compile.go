package main

import (
	"context"
	"slices"

	"github.com/aperturerobotics/cli"
	"github.com/aperturerobotics/goscript/compiler"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

var (
	cliCompiler           *compiler.Compiler
	cliCompilerConfig     compiler.Config
	cliCompilerPkg        cli.StringSlice
	cliCompilerBuildFlags cli.StringSlice
)

// CompileCommands are commands related to compiling code.
var CompileCommands = []*cli.Command{{
	Name:     "compile",
	Category: "compile",
	Usage:    "compile a Go package to TypeScript",
	Action:   compilePackage,
	Before: func(c *cli.Context) (err error) {
		logger := logrus.New()
		logger.SetLevel(logrus.DebugLevel)
		le := logrus.NewEntry(logger)
		cliCompiler, err = compiler.NewCompiler(&cliCompilerConfig, le, nil)
		return
	},
	Flags: []cli.Flag{
		&cli.StringSliceFlag{
			Name:        "package",
			Usage:       "the package(s) to compile",
			Aliases:     []string{"p", "packages"},
			EnvVars:     []string{"GOSCRIPT_PACKAGES"},
			Destination: &cliCompilerPkg,
		},
		&cli.StringFlag{
			Name:        "output",
			Usage:       "the output typescript path to use",
			Destination: &cliCompilerConfig.OutputPath,
			Value:       "./output",
			EnvVars:     []string{"GOSCRIPT_OUTPUT"},
		},
		&cli.StringFlag{
			Name:        "dir",
			Usage:       "the working directory to use for the compiler (default: current directory)",
			Destination: &cliCompilerConfig.Dir,
			Value:       "",
			EnvVars:     []string{"GOSCRIPT_DIR"},
		},
		&cli.StringSliceFlag{
			Name:        "build-flags",
			Aliases:     []string{"b", "buildflags", "build-flag", "buildflag"},
			Usage:       "Go build flags (tags) to use during analysis",
			Destination: &cliCompilerBuildFlags,
			EnvVars:     []string{"GOSCRIPT_BUILD_FLAGS"},
		},
		&cli.BoolFlag{
			Name:        "disable-emit-builtin",
			Usage:       "disable emitting built-in packages that have handwritten equivalents",
			Destination: &cliCompilerConfig.DisableEmitBuiltin,
			Value:       false,
			EnvVars:     []string{"GOSCRIPT_DISABLE_EMIT_BUILTIN"},
		},
		&cli.BoolFlag{
			Name:        "all-dependencies",
			Usage:       "compile all dependencies of the requested packages",
			Aliases:     []string{"all-deps", "deps"},
			Destination: &cliCompilerConfig.AllDependencies,
			Value:       false,
			EnvVars:     []string{"GOSCRIPT_ALL_DEPENDENCIES"},
		},
	},
}}

// compilePackage tries to compile the package.
func compilePackage(c *cli.Context) error {
	pkgs := cliCompilerPkg.Value()
	if len(pkgs) == 0 {
		return errors.New("package(s) must be specified")
	}

	// build flags
	cliCompilerConfig.BuildFlags = slices.Clone(cliCompilerBuildFlags.Value())

	_, err := cliCompiler.CompilePackages(context.Background(), pkgs...)
	return err
}
