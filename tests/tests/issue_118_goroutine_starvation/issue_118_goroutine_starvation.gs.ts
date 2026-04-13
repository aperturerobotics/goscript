// Generated file based on issue_118_goroutine_starvation.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"

import * as time from "@goscript/time/index.js"

export async function main(): Promise<void> {
	let wg: $.VarRef<sync.WaitGroup> = $.varRef(new sync.WaitGroup())
	let done = $.makeChannel<boolean>(0, false, 'both')
	let result = $.makeChannel<number>(2, 0, 'both')

	// Worker 1: Does a tight loop (CPU-bound work)
	// In Go: Will be preempted, allowing other goroutines to run
	// In GoScript: Would block forever, starving other goroutines

	// Simulate CPU-bound work with a tight loop
	// In real code this might be a computation without I/O
	wg!.value.Go(async (): Promise<void> => {
		let sum = 0
		// Simulate CPU-bound work with a tight loop
		// In real code this might be a computation without I/O
		for (let i = 0; i < 1000000; i++) {{
			sum += i
		}
	}
	await $.chanSend(result, sum)
})

// Worker 2: Quick task that should complete
// In Go: Will run concurrently with worker1
// In GoScript: Would never run if worker1 starves the event loop
wg!.value.Go(async (): Promise<void> => {
	await $.chanSend(result, 42)
})

// Wait for both workers with a timeout
queueMicrotask(async () => {
	await wg!.value.Wait()
	done.close()
})

// Collect results
let results = $.arrayToSlice<number>([])
let timeout = time.After(5 * time.Second)

// All done
for (let _i = 0; _i < 2; _i++) {{

	// All done
	const [_select_has_return_6b49, _select_value_6b49] = await $.selectStatement([
		{
			id: 0,
			isSend: false,
			channel: result,
			onSelected: async (result) => {
				const r = result.value
				results = $.append(results, r)
			}
		},
		{
			id: 1,
			isSend: false,
			channel: timeout,
			onSelected: async (result) => {
				$.println("TIMEOUT: goroutine starvation detected")
				return 
			}
		},
		{
			id: 2,
			isSend: false,
			channel: done,
			onSelected: async (result) => {
			}
		},
	], false)
	if (_select_has_return_6b49) {
		return _select_value_6b49!
	}
	// If _select_has_return_6b49 is false, continue execution
}
}

// Both workers completed
$.println("worker1 completed")
$.println("worker2 completed")
$.println("no starvation detected")
}

