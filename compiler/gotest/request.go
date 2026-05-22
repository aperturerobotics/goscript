package gotest

import (
	"path/filepath"
	"slices"
	"strings"
	"time"

	"github.com/pkg/errors"
)

// Request describes one GoScript package-test run.
type Request struct {
	// Dir is the working directory for package loading.
	Dir string
	// Patterns are Go package patterns to test.
	Patterns []string
	// BuildTags are normalized into a Go -tags build flag.
	BuildTags []string
	// OverrideDirs are additional GoScript override roots.
	OverrideDirs []string
	// Run is the optional Go test name regexp.
	Run string
	// Count is the number of times to run matched tests.
	Count int
	// Short reports true from testing.Short in generated tests.
	Short bool
	// Timeout bounds compile, typecheck, and execution.
	Timeout time.Duration
	// Verbose emits test-level output.
	Verbose bool
	// WorkDir stores generated runner files and logs.
	WorkDir string
	// OutputRoot stores generated TypeScript packages.
	OutputRoot string
}

type normalizedRequest struct {
	Dir          string
	Patterns     []string
	BuildFlags   []string
	OverrideDirs []string
	Run          string
	Count        int
	Short        bool
	Timeout      time.Duration
	Verbose      bool
	WorkDir      string
	OutputRoot   string
}

func (r *Request) normalize() (*normalizedRequest, error) {
	if r == nil {
		return nil, errors.New("goscript test request cannot be nil")
	}

	dir := strings.TrimSpace(r.Dir)
	if dir == "" {
		dir = "."
	}
	absDir, err := filepath.Abs(dir)
	if err != nil {
		return nil, errors.Wrap(err, "resolve test working directory")
	}

	patterns := normalizePatterns(r.Patterns)
	if len(patterns) == 0 {
		return nil, errors.New("at least one Go package pattern is required")
	}

	count := r.Count
	if count == 0 {
		count = 1
	}
	if count < 0 {
		return nil, errors.New("test count must be positive")
	}

	buildTags := normalizeBuildTags(r.BuildTags)
	var buildFlags []string
	if len(buildTags) != 0 {
		buildFlags = append(buildFlags, "-tags="+strings.Join(buildTags, ","))
	}
	overrideDirs, err := normalizeOverrideDirs(r.OverrideDirs)
	if err != nil {
		return nil, err
	}

	workDir := strings.TrimSpace(r.WorkDir)
	if workDir != "" {
		var err error
		workDir, err = filepath.Abs(workDir)
		if err != nil {
			return nil, errors.Wrap(err, "resolve test work directory")
		}
	}

	outputRoot := strings.TrimSpace(r.OutputRoot)
	if outputRoot != "" {
		var err error
		outputRoot, err = filepath.Abs(outputRoot)
		if err != nil {
			return nil, errors.Wrap(err, "resolve test output root")
		}
	}

	return &normalizedRequest{
		Dir:          absDir,
		Patterns:     patterns,
		BuildFlags:   buildFlags,
		OverrideDirs: overrideDirs,
		Run:          strings.TrimSpace(r.Run),
		Count:        count,
		Short:        r.Short,
		Timeout:      r.Timeout,
		Verbose:      r.Verbose,
		WorkDir:      workDir,
		OutputRoot:   outputRoot,
	}, nil
}

func normalizeOverrideDirs(dirs []string) ([]string, error) {
	if len(dirs) == 0 {
		return nil, nil
	}
	var normalized []string
	seen := make(map[string]bool)
	for _, dir := range dirs {
		dir = strings.TrimSpace(dir)
		if dir == "" {
			continue
		}
		abs, err := filepath.Abs(dir)
		if err != nil {
			return nil, errors.Wrap(err, "resolve override directory")
		}
		if seen[abs] {
			continue
		}
		seen[abs] = true
		normalized = append(normalized, abs)
	}
	return normalized, nil
}

func normalizePatterns(patterns []string) []string {
	if len(patterns) == 0 {
		return nil
	}
	normalized := make([]string, 0, len(patterns))
	for _, pattern := range patterns {
		pattern = strings.TrimSpace(pattern)
		if pattern != "" {
			normalized = append(normalized, pattern)
		}
	}
	return normalized
}

func normalizeBuildTags(tags []string) []string {
	seen := make(map[string]bool)
	var normalized []string
	for _, value := range tags {
		for _, tag := range strings.FieldsFunc(value, func(r rune) bool {
			return r == ',' || r == ' ' || r == '\t' || r == '\n'
		}) {
			tag = strings.TrimSpace(tag)
			if tag == "" || seen[tag] {
				continue
			}
			seen[tag] = true
			normalized = append(normalized, tag)
		}
	}
	slices.Sort(normalized)
	return normalized
}
