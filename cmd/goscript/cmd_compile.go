package main

import (
	"context"
	"slices"

	"github.com/aperturerobotics/cli"
	"github.com/aperturerobotics/goscript/compiler"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

func compileCommands() []*cli.Command {
	return []*cli.Command{newCompileCommand()}
}

func newCompileCommand() *cli.Command {
	var config compiler.Config
	var packages cli.StringSlice
	var buildFlags cli.StringSlice
	var overrideDirs cli.StringSlice

	return &cli.Command{
		Name:     "compile",
		Category: "compile",
		Usage:    "compile a Go package to TypeScript",
		Action: func(c *cli.Context) error {
			config.BuildFlags = slices.Clone(buildFlags.Value())
			config.OverrideDirs = slices.Clone(overrideDirs.Value())
			return compilePackage(c.Context, &config, packages.Value())
		},
		Flags: []cli.Flag{
			&cli.StringSliceFlag{
				Name:        "package",
				Usage:       "the package(s) to compile",
				Aliases:     []string{"p", "packages"},
				EnvVars:     []string{"GOSCRIPT_PACKAGES"},
				Destination: &packages,
			},
			&cli.StringFlag{
				Name:        "output",
				Usage:       "the output typescript path to use",
				Destination: &config.OutputPath,
				Value:       "./output",
				EnvVars:     []string{"GOSCRIPT_OUTPUT"},
			},
			&cli.StringFlag{
				Name:        "dir",
				Usage:       "the working directory to use for the compiler (default: current directory)",
				Destination: &config.Dir,
				Value:       "",
				EnvVars:     []string{"GOSCRIPT_DIR"},
			},
			&cli.StringSliceFlag{
				Name:        "build-flags",
				Aliases:     []string{"b", "buildflags", "build-flag", "buildflag"},
				Usage:       "Go build flags (tags) to use during analysis",
				Destination: &buildFlags,
				EnvVars:     []string{"GOSCRIPT_BUILD_FLAGS"},
			},
			&cli.StringSliceFlag{
				Name:        "gs-path",
				Aliases:     []string{"override-dir"},
				Usage:       "additional GoScript override root containing package-path directories",
				Destination: &overrideDirs,
				EnvVars:     []string{"GOSCRIPT_GS_PATH"},
			},
			&cli.BoolFlag{
				Name:        "disable-emit-builtin",
				Usage:       "disable emitting built-in packages that have handwritten equivalents",
				Destination: &config.DisableEmitBuiltin,
				Value:       false,
				EnvVars:     []string{"GOSCRIPT_DISABLE_EMIT_BUILTIN"},
			},
			&cli.BoolFlag{
				Name:        "all-dependencies",
				Usage:       "compile all dependencies of the requested packages",
				Aliases:     []string{"all-deps", "deps"},
				Destination: &config.AllDependencies,
				Value:       false,
				EnvVars:     []string{"GOSCRIPT_ALL_DEPENDENCIES"},
			},
		},
	}
}

// compilePackage tries to compile the package.
func compilePackage(ctx context.Context, config *compiler.Config, pkgs []string) error {
	if len(pkgs) == 0 {
		return errors.New("package(s) must be specified")
	}

	logger := logrus.New()
	logger.SetLevel(logrus.DebugLevel)
	le := logrus.NewEntry(logger)
	comp, err := compiler.NewCompiler(config, le, nil)
	if err != nil {
		return err
	}
	_, err = comp.CompilePackages(ctx, pkgs...)
	return err
}
