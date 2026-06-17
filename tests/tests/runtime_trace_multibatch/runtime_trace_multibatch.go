package main

import (
	"context"
	"fmt"
	"runtime/trace"
	"strconv"
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

// eventCount drives both the string-dictionary size and the event-stream size
// well past the trace v2 64 KiB per-batch limit, so a correct encoder must split
// the capture across multiple string and event batches. Each iteration interns
// two distinct strings (a task type and a log message) and emits a task begin,
// a log, and a task end, so the stream holds 3*eventCount user events drawn from
// 2*eventCount unique strings.
const eventCount = 4000

// main records a large, fully distinct set of user tasks and logs so the encoded
// trace exceeds the single-batch ceiling in both its string dictionary and its
// event stream. The upstream reader must still walk the multi-batch stream to
// EOF, which TestRuntimeTraceMultiBatch asserts.
func main() {
	sink := &byteSink{}
	if err := trace.Start(sink); err != nil {
		fmt.Println("ERROR:" + err.Error())
		return
	}

	for i := range eventCount {
		n := strconv.Itoa(i)
		ctx, task := trace.NewTask(context.Background(), "multibatch-task-"+n)
		trace.Log(ctx, "multibatch-key", "multibatch-message-"+n)
		task.End()
	}

	trace.Stop()

	fmt.Println(toHex(sink.data))
}
