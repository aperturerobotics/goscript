package main

import (
	"context"
	"fmt"
	"runtime/trace"
)

// byteSink is an io.Writer that accumulates every written byte, so the trace
// stream produced by the GoScript runtime/trace override can be hex-encoded and
// handed back to the upstream Go trace reader for validation.
type byteSink struct {
	data []byte
}

func (s *byteSink) Write(p []byte) (int, error) {
	s.data = append(s.data, p...)
	return len(p), nil
}

const hexDigits = "0123456789abcdef"

// toHex encodes b as a lowercase hex string without depending on encoding/hex,
// keeping the fixture inside the GoScript-supported core feature set.
func toHex(b []byte) string {
	out := make([]byte, len(b)*2)
	for i, c := range b {
		out[i*2] = hexDigits[c>>4]
		out[i*2+1] = hexDigits[c&0x0f]
	}
	return string(out)
}

func main() {
	sink := &byteSink{}
	if err := trace.Start(sink); err != nil {
		fmt.Println("ERROR:" + err.Error())
		return
	}

	ctx, task := trace.NewTask(context.Background(), "proof-task")
	trace.WithRegion(ctx, "proof-region", func() {
		trace.Log(ctx, "proof-key", "proof-value")
	})
	task.End()

	trace.Stop()

	fmt.Println(toHex(sink.data))
}
