package main

import (
	"context"
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/aperturerobotics/goscript/compiler/gotest"
	"github.com/pkg/errors"
)

func main() {
	if err := run(context.Background(), os.Args[1:], os.Stdout); err != nil {
		_, _ = fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func run(ctx context.Context, args []string, stdout io.Writer) error {
	req, err := requestFromGoToolArgs(args)
	if err != nil {
		return err
	}
	result, err := gotest.NewRunner().Run(ctx, req)
	if err != nil {
		return err
	}
	if err := printResult(stdout, result); err != nil {
		return err
	}
	if !result.Passed() {
		return errors.New("goscript browser test failed")
	}
	return nil
}

func requestFromGoToolArgs(args []string) (*gotest.Request, error) {
	if len(args) != 0 && !strings.HasPrefix(args[0], "-") {
		args = args[1:]
	}
	cwd, err := os.Getwd()
	if err != nil {
		return nil, errors.Wrap(err, "get package working directory")
	}
	req := &gotest.Request{
		Dir:            cwd,
		Patterns:       []string{"."},
		Count:          1,
		Timeout:        10 * time.Minute,
		RuntimeBackend: gotest.RuntimeBackendBrowser,
	}
	for idx := 0; idx < len(args); idx++ {
		name, value, hasValue := splitFlag(args[idx])
		switch name {
		case "-test.v":
			if !hasValue {
				req.Verbose = true
				continue
			}
			verbose, err := parseTestBool(value)
			if err != nil {
				return nil, errors.Wrapf(err, "parse %s", name)
			}
			req.Verbose = verbose
		case "-test.run":
			if !hasValue {
				idx++
				if idx >= len(args) {
					return nil, errors.New("-test.run requires a value")
				}
				value = args[idx]
			}
			req.Run = value
		case "-test.count":
			if !hasValue {
				idx++
				if idx >= len(args) {
					return nil, errors.New("-test.count requires a value")
				}
				value = args[idx]
			}
			count, err := strconv.Atoi(value)
			if err != nil {
				return nil, errors.Wrap(err, "parse -test.count")
			}
			req.Count = count
		case "-test.short":
			if !hasValue {
				req.Short = true
				continue
			}
			short, err := parseTestBool(value)
			if err != nil {
				return nil, errors.Wrap(err, "parse -test.short")
			}
			req.Short = short
		case "-test.timeout":
			if !hasValue {
				idx++
				if idx >= len(args) {
					return nil, errors.New("-test.timeout requires a value")
				}
				value = args[idx]
			}
			timeout, err := time.ParseDuration(value)
			if err != nil {
				return nil, errors.Wrap(err, "parse -test.timeout")
			}
			req.Timeout = timeout
		case "-test.paniconexit0":
			if !hasValue {
				req.PanicOnExit0 = true
				continue
			}
			panicOnExit0, err := parseTestBool(value)
			if err != nil {
				return nil, errors.Wrap(err, "parse -test.paniconexit0")
			}
			req.PanicOnExit0 = panicOnExit0
		case "-test.parallel":
			if !hasValue {
				idx++
				if idx >= len(args) {
					return nil, errors.New("-test.parallel requires a value")
				}
			}
		case "-test.testlogfile":
			if !hasValue {
				idx++
				if idx >= len(args) {
					return nil, errors.New("-test.testlogfile requires a value")
				}
			}
		default:
			return nil, errors.Errorf("unsupported go_js_wasm_exec flag %s", name)
		}
	}
	return req, nil
}

func splitFlag(arg string) (string, string, bool) {
	name, value, ok := strings.Cut(arg, "=")
	return name, value, ok
}

func parseTestBool(value string) (bool, error) {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "", "1", "t", "true", "test2json":
		return true, nil
	case "0", "f", "false":
		return false, nil
	default:
		return false, errors.Errorf("invalid boolean value %q", value)
	}
}

func printResult(w io.Writer, result *gotest.Result) error {
	if result == nil {
		return errors.New("goscript browser test result is nil")
	}
	for _, pkg := range result.Packages {
		if strings.TrimSpace(pkg.Output) != "" {
			if _, err := io.WriteString(w, strings.TrimSpace(pkg.Output)+"\n"); err != nil {
				return err
			}
		}
		switch pkg.Action {
		case gotest.ActionPass:
			if _, err := io.WriteString(w, "ok  \t"+pkg.PackagePath+"\n"); err != nil {
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
		if _, err := io.WriteString(w, "goscript browser test workdir: "+result.WorkDir+"\n"); err != nil {
			return err
		}
	}
	return nil
}
