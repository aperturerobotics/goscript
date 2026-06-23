package main

import (
	"context"

	"github.com/aperturerobotics/util/broadcast"
)

// This fixture isolates the transpiled-Go concurrency the Spacewave drive bundle
// runs on its copy-walk engine path: many concurrent producers signaling a
// single coordinator through broadcast.Broadcast, each producer holding an
// await-free CPU span (the transpiled chksum/gzip transform shape). It mirrors
// ConcurrentQueue.WaitIdle's wait/wake at a raised concurrency to test whether
// the transpiled broadcast wait channel loses a wakeup or starves at 16 under
// GoScript's cooperative scheduler. broadcast.Broadcast is transpiled from Go
// here (no GoScript override), unlike conc.ConcurrentQueue.

const workers = 16

func main() {
	var bcast broadcast.Broadcast
	completed := 0

	for w := 0; w < workers; w++ {
		go func(id int) {
			// Await-free CPU span: a tight loop with no I/O or channel op, the
			// starvation shape from issue_118 scaled across 16 goroutines.
			sum := 0
			for i := 0; i < 200000; i++ {
				sum += i * (id + 1)
			}
			_ = sum
			bcast.HoldLock(func(broadcastFn func(), _ func() <-chan struct{}) {
				completed++
				broadcastFn()
			})
		}(w)
	}

	// Coordinator mirrors ConcurrentQueue.WaitIdle: read state and the wait
	// channel under the same lock, then park on the wait channel until every
	// worker has signaled. A lost wakeup or starvation hangs here.
	ctx := context.Background()
	for {
		var done bool
		var waitCh <-chan struct{}
		bcast.HoldLock(func(_ func(), getWaitCh func() <-chan struct{}) {
			done = completed == workers
			if !done {
				waitCh = getWaitCh()
			}
		})
		if done {
			break
		}
		select {
		case <-ctx.Done():
			println("ctx canceled")
			return
		case <-waitCh:
		}
	}

	if completed == workers {
		println("all 16 workers completed")
	} else {
		println("INCOMPLETE")
	}
}
