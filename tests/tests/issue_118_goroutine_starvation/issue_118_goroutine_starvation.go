package main

import (
	"sync"
	"time"
)

// This test demonstrates goroutine starvation in cooperative multitasking.
//
// In Go, goroutines are preemptively scheduled - even a tight loop will
// eventually yield to other goroutines.
//
// In GoScript (TypeScript), goroutines use async/await which is cooperative.
// A tight loop without await points will starve other goroutines.
//
// This test would HANG in GoScript because worker1's tight loop never yields,
// preventing worker2 from ever running and signaling completion.

func main() {
	var wg sync.WaitGroup
	done := make(chan bool)
	result := make(chan int, 2)

	// Worker 1: Does a tight loop (CPU-bound work)
	// In Go: Will be preempted, allowing other goroutines to run
	// In GoScript: Would block forever, starving other goroutines
	wg.Add(1)
	go func() {
		defer wg.Done()
		sum := 0
		// Simulate CPU-bound work with a tight loop
		// In real code this might be a computation without I/O
		for i := 0; i < 1000000; i++ {
			sum += i
		}
		result <- sum
	}()

	// Worker 2: Quick task that should complete
	// In Go: Will run concurrently with worker1
	// In GoScript: Would never run if worker1 starves the event loop
	wg.Add(1)
	go func() {
		defer wg.Done()
		result <- 42
	}()

	// Wait for both workers with a timeout
	go func() {
		wg.Wait()
		close(done)
	}()

	// Collect results
	results := []int{}
	timeout := time.After(5 * time.Second)

	for i := 0; i < 2; i++ {
		select {
		case r := <-result:
			results = append(results, r)
		case <-timeout:
			println("TIMEOUT: goroutine starvation detected")
			return
		case <-done:
			// All done
		}
	}

	// Both workers completed
	println("worker1 completed")
	println("worker2 completed")
	println("no starvation detected")
}
