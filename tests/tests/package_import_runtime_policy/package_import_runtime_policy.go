package main

import (
	"bytes"
	"context"
	"runtime"
	"runtime/pprof"
	"runtime/trace"
)

func main() {
	println("runtime trace:", runtime.StartTrace() != nil)

	var profile bytes.Buffer
	println(
		"pprof:",
		pprof.StartCPUProfile(&profile) != nil,
		pprof.Lookup("heap").WriteTo(&profile, 0) != nil,
	)

	var traceBuf bytes.Buffer
	ctx, task := trace.NewTask(context.Background(), "task")
	task.End()
	println("trace:", trace.Start(&traceBuf) != nil, trace.IsEnabled())
	trace.Log(ctx, "category", "message")
	trace.Stop()
}
