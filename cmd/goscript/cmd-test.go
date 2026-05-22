package main

import (
	"context"
	"io"
	"strconv"
	"strings"
	"time"

	"github.com/aperturerobotics/cli"
	"github.com/aperturerobotics/goscript/compiler/gotest"
	"github.com/pkg/errors"
)

func testCommands() []*cli.Command {
	return []*cli.Command{newTestCommand()}
}

func newTestCommand() *cli.Command {
	var tags cli.StringSlice
	var run string
	var count int
	var timeout time.Duration
	var verbose bool
	var outputRoot string
	var workDir string
	var dir string

	return &cli.Command{
		Name:     "test",
		Category: "test",
		Usage:    "compile and run Go package tests through GoScript",
		Action: func(c *cli.Context) error {
			req := &gotest.Request{
				Dir:        dir,
				Patterns:   c.Args().Slice(),
				BuildTags:  tags.Value(),
				Run:        run,
				Count:      count,
				Timeout:    timeout,
				Verbose:    verbose,
				WorkDir:    workDir,
				OutputRoot: outputRoot,
			}
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
		},
	}
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
