package tsworkspace

import "time"

// Result describes one workspace file or process operation.
type Result struct {
	Phase   Phase
	Command []string
	Output  string
	Error   string
	Elapsed time.Duration
}

// Failed returns true when the operation failed.
func (r Result) Failed() bool {
	return r.Error != ""
}
