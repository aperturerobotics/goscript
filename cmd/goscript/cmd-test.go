package main

import (
	"context"
	"io"
	"os"
	"runtime"
	"runtime/pprof"
	"strconv"
	"strings"
	"time"

	"github.com/aperturerobotics/cli"
	"github.com/pkg/errors"
	"github.com/s4wave/goscript/compiler/gotest"
)

func testCommands() []*cli.Command {
	return []*cli.Command{newTestCommand()}
}

func newTestCommand() *cli.Command {
	var tags cli.StringSlice
	var overrideDirs cli.StringSlice
	var run string
	var count int
	var short bool
	var timeout time.Duration
	var verbose bool
	var outputRoot string
	var workDir string
	var dir string
	var parallelism int
	var runtimeGroups bool
	var browser bool
	var cpuProfile string
	var memProfile string
	var incrementalTypeCheck bool

	return &cli.Command{
		Name:     "test",
		Category: "test",
		Usage:    "compile and run Go package tests through GoScript",
		Action: func(c *cli.Context) (err error) {
			req := &gotest.Request{
				Dir:                  dir,
				Patterns:             c.Args().Slice(),
				BuildTags:            tags.Value(),
				OverrideDirs:         overrideDirs.Value(),
				Run:                  run,
				Count:                count,
				Short:                short,
				Timeout:              timeout,
				Verbose:              verbose,
				WorkDir:              workDir,
				OutputRoot:           outputRoot,
				Parallelism:          parallelism,
				RuntimeBackend:       testRuntimeBackend(browser),
				RuntimeGroups:        runtimeGroups,
				IncrementalTypeCheck: incrementalTypeCheck,
			}
			stopProfile, err := startCPUProfile(cpuProfile)
			if err != nil {
				return err
			}
			if stopProfile != nil {
				defer stopProfile()
			}
			defer func() {
				if profileErr := writeMemProfile(memProfile); profileErr != nil && err == nil {
					err = profileErr
				}
			}()
			result, err := gotest.NewRunner().Run(c.Context, req)
			if err != nil {
				return err
			}
			if err := printTestResult(c.Context, c.App.Writer, result); err != nil {
				return err
			}
			if !result.Passed() {
				return errors.New("goscript test failed")
			}
			return nil
		},
		Flags: []cli.Flag{
			&cli.StringSliceFlag{
				Name:        "tags",
				Usage:       "comma-separated Go build tags",
				Destination: &tags,
			},
			&cli.StringSliceFlag{
				Name:        "gs-path",
				Aliases:     []string{"override-dir"},
				Usage:       "additional GoScript override root containing package-path directories",
				Destination: &overrideDirs,
			},
			&cli.StringFlag{
				Name:        "run",
				Usage:       "run only tests matching the regexp",
				Destination: &run,
			},
			&cli.IntFlag{
				Name:        "count",
				Usage:       "run each selected test this many times",
				Destination: &count,
				Value:       1,
			},
			&cli.BoolFlag{
				Name:        "short",
				Usage:       "report true from testing.Short",
				Destination: &short,
			},
			&cli.DurationFlag{
				Name:        "timeout",
				Usage:       "maximum time for the package-test run",
				Destination: &timeout,
				Value:       30 * time.Second,
			},
			&cli.BoolFlag{
				Name:        "v",
				Aliases:     []string{"verbose"},
				Usage:       "emit verbose test output",
				Destination: &verbose,
			},
			&cli.StringFlag{
				Name:        "output",
				Usage:       "generated TypeScript output root",
				Destination: &outputRoot,
			},
			&cli.StringFlag{
				Name:        "workdir",
				Usage:       "generated test workspace directory",
				Destination: &workDir,
			},
			&cli.StringFlag{
				Name:        "dir",
				Usage:       "Go module working directory",
				Destination: &dir,
			},
			&cli.IntFlag{
				Name:        "p",
				Usage:       "maximum package typecheck/runtime commands to run concurrently",
				Destination: &parallelism,
				Value:       gotest.DefaultParallelism(),
			},
			&cli.BoolFlag{
				Name:        "runtime-groups",
				Usage:       "run package runtimes in grouped Bun worker processes",
				Destination: &runtimeGroups,
			},
			&cli.BoolFlag{
				Name:        "browser",
				Usage:       "run package runtimes in a Chromium browser",
				Destination: &browser,
			},
			&cli.BoolFlag{
				Name:        "incremental-typecheck",
				Usage:       "reuse TypeScript build-info files in the test workdir",
				Destination: &incrementalTypeCheck,
			},
			&cli.StringFlag{
				Name:        "cpuprofile",
				Usage:       "write a Go CPU profile for the goscript test process",
				Destination: &cpuProfile,
			},
			&cli.StringFlag{
				Name:        "memprofile",
				Usage:       "write a Go heap profile for the goscript test process",
				Destination: &memProfile,
			},
		},
	}
}

func testRuntimeBackend(browser bool) gotest.RuntimeBackend {
	if browser {
		return gotest.RuntimeBackendBrowser
	}
	return gotest.RuntimeBackendBun
}

func startCPUProfile(path string) (func(), error) {
	path = strings.TrimSpace(path)
	if path == "" {
		return nil, nil
	}
	file, err := os.Create(path)
	if err != nil {
		return nil, errors.Wrap(err, "create CPU profile")
	}
	if err := pprof.StartCPUProfile(file); err != nil {
		_ = file.Close()
		return nil, errors.Wrap(err, "start CPU profile")
	}
	return func() {
		pprof.StopCPUProfile()
		_ = file.Close()
	}, nil
}

func writeMemProfile(path string) error {
	path = strings.TrimSpace(path)
	if path == "" {
		return nil
	}
	file, err := os.Create(path)
	if err != nil {
		return errors.Wrap(err, "create memory profile")
	}
	defer func() { _ = file.Close() }()
	runtime.GC()
	if err := pprof.WriteHeapProfile(file); err != nil {
		return errors.Wrap(err, "write memory profile")
	}
	return nil
}

func printTestResult(ctx context.Context, w io.Writer, result *gotest.Result) error {
	if err := ctx.Err(); err != nil {
		return err
	}
	if result == nil {
		return errors.New("goscript test result is nil")
	}
	for _, pkg := range result.Packages {
		if strings.TrimSpace(pkg.Output) != "" {
			if _, err := io.WriteString(w, strings.TrimSpace(pkg.Output)+"\n"); err != nil {
				return err
			}
		}
		switch pkg.Action {
		case gotest.ActionPass:
			if _, err := io.WriteString(w, "ok  \t"+pkg.PackagePath+"\t"+formatElapsed(pkg.Elapsed)+"\n"); err != nil {
				return err
			}
		case gotest.ActionSkip:
			if _, err := io.WriteString(w, "?   \t"+pkg.PackagePath+"\t[no test files]\n"); err != nil {
				return err
			}
		case gotest.ActionFail:
			line := "FAIL\t" + pkg.PackagePath
			if pkg.Owner != "" {
				line += "\towner=" + string(pkg.Owner)
			}
			if phase := failedPhase(pkg.Phases); phase != "" {
				line += "\tphase=" + phase
			}
			if _, err := io.WriteString(w, line+"\n"); err != nil {
				return err
			}
			if strings.TrimSpace(pkg.Error) != "" {
				if _, err := io.WriteString(w, strings.TrimSpace(pkg.Error)+"\n"); err != nil {
					return err
				}
			}
		}
	}
	if result.WorkDir != "" {
		if _, err := io.WriteString(w, "goscript test workdir: "+result.WorkDir+"\n"); err != nil {
			return err
		}
	}
	return nil
}

func failedPhase(phases gotest.PackagePhases) string {
	switch {
	case phases.Workspace == gotest.PhaseStatusFail:
		return "workspace"
	case phases.Compile == gotest.PhaseStatusFail:
		return "compile"
	case phases.Emit == gotest.PhaseStatusFail:
		return "emit"
	case phases.TypeCheck == gotest.PhaseStatusFail:
		return "typecheck"
	case phases.Runtime == gotest.PhaseStatusFail:
		return "runtime"
	default:
		return ""
	}
}

func formatElapsed(elapsed time.Duration) string {
	if elapsed <= 0 {
		return "0.000s"
	}
	millis := elapsed.Milliseconds()
	seconds := millis / 1000
	remainder := millis % 1000
	return strconv.FormatInt(seconds, 10) + "." + leftPadMillis(remainder) + "s"
}

func leftPadMillis(value int64) string {
	raw := strconv.FormatInt(value, 10)
	for len(raw) < 3 {
		raw = "0" + raw
	}
	return raw
}
