package main

import (
	"context"
	"time"
)

func run(ctx context.Context) {
	sctx, sctxCancel := context.WithCancel(ctx)
	defer sctxCancel()

	myCh := make(chan struct{})

	go func() {
		<-sctx.Done()
		myCh <- struct{}{}
	}()

	// Check that myCh is not readable yet
	select {
	case <-myCh:
		println("myCh should not be readable yet")
	default:
		println("myCh is not be readable yet")
	}

	// Cancel context which should trigger the goroutine
	sctxCancel()

	// Now myCh should become readable
	<-myCh

	println("read successfully")
}

func main() {
	ctx := context.Background()
	run(ctx)

	deadlineCtx, cancel := context.WithDeadline(ctx, time.Now().Add(time.Hour))
	defer cancel()
	deadline, ok := deadlineCtx.Deadline()
	println("deadline ok:", ok)
	println("deadline zero:", deadline.IsZero())

	println("test finished")
}
