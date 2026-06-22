package main

import (
	"context"
	"slices"

	"github.com/aperturerobotics/cli"
	"github.com/pkg/errors"
	"github.com/s4wave/goscript/compiler"
	"github.com/sirupsen/logrus"
)

func compileCommands() []*cli.Command {
	return []*cli.Command{newCompileCommand()}
}

func newCompileCommand() *cli.Command {
	var config compiler.Config
	var packages cli.StringSlice
	var buildFlags rawStringSlice
	var overrideDirs cli.StringSlice
	var packageBlocklist cli.StringSlice

	return &cli.Command{
		Name:     "compile",
		Category: "compile",
		Usage:    "compile a Go package to TypeScript",
		Action: func(c *cli.Context) error {
			config.BuildFlags = buildFlags.Value()
			config.OverrideDirs = slices.Clone(overrideDirs.Value())
			config.PackageBlocklist = slices.Clone(packageBlocklist.Value())
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
			&cli.StringFlag{
				Name:        "compiler-cache-root",
				Usage:       "explicit compiler package artifact cache root",
				Destination: &config.CacheRoot,
				Value:       "",
				EnvVars:     []string{"GOSCRIPT_COMPILER_CACHE_ROOT"},
			},
			&cli.GenericFlag{
				Name:    "build-flags",
				Aliases: []string{"b", "buildflags", "build-flag", "buildflag"},
				Usage:   "Go build flags (tags) to use during analysis",
				Value:   &buildFlags,
				EnvVars: []string{"GOSCRIPT_BUILD_FLAGS"},
			},
			&cli.StringSliceFlag{
				Name:        "gs-path",
				Aliases:     []string{"override-dir"},
				Usage:       "additional GoScript override root containing package-path directories",
				Destination: &overrideDirs,
				EnvVars:     []string{"GOSCRIPT_GS_PATH"},
			},
			&cli.StringSliceFlag{
				Name:        "package-blocklist",
				Usage:       "comma-separated Go import paths to reject from the compiled package graph",
				Destination: &packageBlocklist,
				EnvVars:     []string{"GOSCRIPT_PACKAGE_BLOCKLIST"},
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
			&cli.BoolFlag{
				Name:        "protobuf-ts-binding",
				Usage:       "bind .pb.go files to sibling .pb.ts files instead of emitting .pb.gs.ts",
				Destination: &config.ProtobufTypeScriptBinding,
				Value:       false,
				EnvVars:     []string{"GOSCRIPT_PROTOBUF_TS_BINDING"},
			},
		},
	}
}

type rawStringSlice []string

func (s *rawStringSlice) Set(value string) error {
	if value == "" {
		return nil
	}
	*s = append(*s, value)
	return nil
}

func (s *rawStringSlice) String() string {
	// Keep the flag default empty. The CLI package registers aliases against
	// the same flag value, and echoing accumulated values here re-parses them.
	return ""
}

func (s *rawStringSlice) Value() []string {
	return slices.Clone(*s)
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
