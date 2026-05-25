//go:build !unix

package tsworkspace

import "os/exec"

func configureToolCommand(cmd *exec.Cmd) {}

func killToolCommand(cmd *exec.Cmd) {
	if cmd == nil || cmd.Process == nil {
		return
	}
	_ = cmd.Process.Kill()
}
