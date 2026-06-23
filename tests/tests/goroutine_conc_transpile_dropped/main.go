package main

import (
	"context"
	"sync"

	"github.com/aperturerobotics/util/conc"
)

// This fixture drives github.com/aperturerobotics/util/conc.ConcurrentQueue with
// the conc gs/ override removed, so GoScript transpiles the real Go source
// (persistent looping worker goroutines + broadcast.Broadcast + linkedlist)
// instead of the hand-written microtask override. It reproduces the drive
// copy-walk fan-out shape: a re-entrant DAG (root -> children -> leaves, each
// interior job Enqueue'ing its children from inside its own running job) at
// maxConcurrency 16, every leaf holding an await-free CPU span (the issue_118
// starvation shape). If the transpiled persistent-goroutine model starves or
// loses a WaitIdle wakeup at 16, WaitIdle never returns and the run hangs.

const (
	children = 16
	leaves   = 8
)

func main() {
	var mu sync.Mutex
	completed := 0

	q := conc.NewConcurrentQueue(16)

	leaf := func() {
		// Await-free CPU span: a tight loop with no I/O or channel op.
		sum := 0
		for i := 0; i < 200000; i++ {
			sum += i * 3
		}
		_ = sum
		mu.Lock()
		completed++
		mu.Unlock()
	}

	child := func() {
		jobs := make([]func(), 0, leaves)
		for l := 0; l < leaves; l++ {
			jobs = append(jobs, leaf)
		}
		q.Enqueue(jobs...)
	}

	root := func() {
		jobs := make([]func(), 0, children)
		for c := 0; c < children; c++ {
			jobs = append(jobs, child)
		}
		q.Enqueue(jobs...)
	}

	q.Enqueue(root)

	if err := q.WaitIdle(context.Background(), nil); err != nil {
		println("WaitIdle error:", err.Error())
		return
	}

	if completed == children*leaves {
		println("all 128 leaves completed")
	} else {
		println("INCOMPLETE")
	}
}
