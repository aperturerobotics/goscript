package main

import "runtime"

func main() {
	// Test basic runtime functions
	println("GOOS:", runtime.GOOS)
	println("GOARCH:", runtime.GOARCH)
	// println("Version:", runtime.Version()) - not stable for the test (go.mod may change)
	// println("NumCPU:", runtime.NumCPU()) - not stable for the test (number of cores may change)

	// Test GOMAXPROCS
	procs := runtime.GOMAXPROCS(0) // Get current value
	println("GOMAXPROCS(-1):", runtime.GOMAXPROCS(-1))
	println("GOMAXPROCS(0):", procs)

	// Test NumGoroutine
	println("NumGoroutine:", runtime.NumGoroutine())

	// Test GC (should be no-op)
	runtime.GC()
	println("GC called successfully")

	pcs := make([]uintptr, 0)
	println("Callers empty:", runtime.Callers(0, pcs))
	frames := runtime.CallersFrames(pcs)
	frame, more := frames.Next()
	println("Frames empty:", frame.Line, more)
}
