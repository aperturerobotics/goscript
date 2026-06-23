package main

import (
	"context"
	"strconv"
	"sync"

	"github.com/aperturerobotics/util/conc"
)

// This fixture replaces the behavioral coverage the deleted conc gs/ override
// test carried: ConcurrentQueue honors its concurrency limit and queued/running
// accounting, and every job runs to completion after release. It exercises the
// transpiled Go conc (override removed). Two initial jobs fill maxConcurrency 2
// and park on a release channel, three more queue, and the synchronous Enqueue
// return reports [queued=3 running=2]. After close, all five drain and WaitIdle
// returns nil.

func main() {
	release := make(chan struct{})

	var mu sync.Mutex
	count := 0
	sum := 0

	makeJob := func(idx int) func() {
		return func() {
			<-release
			mu.Lock()
			count++
			sum += idx
			mu.Unlock()
		}
	}

	q := conc.NewConcurrentQueue(2, makeJob(0), makeJob(1))
	queued, running := q.Enqueue(makeJob(2), makeJob(3), makeJob(4))
	println("queued=" + strconv.Itoa(queued) + " running=" + strconv.Itoa(running))

	close(release)

	if err := q.WaitIdle(context.Background(), nil); err != nil {
		println("WaitIdle error: " + err.Error())
		return
	}

	println("completed=" + strconv.Itoa(count) + " sum=" + strconv.Itoa(sum))
}
