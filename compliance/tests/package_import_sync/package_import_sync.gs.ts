// Generated file based on package_import_sync.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"

export async function main(): Promise<void> {
	// Test Mutex
	let mu: $.VarRef<sync.Mutex> = $.varRef(new sync.Mutex())
	await mu!.value.Lock()
	console.log("Mutex locked")
	mu!.value.Unlock()
	console.log("Mutex unlocked")

	// Test TryLock
	if (mu!.value.TryLock()) {
		console.log("TryLock succeeded")
		mu!.value.Unlock()
	}
	 else {
		console.log("TryLock failed")
	}

	// Test WaitGroup
	let wg: $.VarRef<sync.WaitGroup> = $.varRef(new sync.WaitGroup())
	wg!.value.Add(1)
	console.log("WaitGroup counter set to 1")
	wg!.value.Done()
	console.log("WaitGroup counter decremented")
	await wg!.value.Wait()
	console.log("WaitGroup wait completed")

	// Test Once
	let once: $.VarRef<sync.Once> = $.varRef(new sync.Once())
	let counter = 0
	await once!.value.Do((): void => {
		counter++
		console.log("Once function executed, counter:", counter)
	})
	await once!.value.Do((): void => {
		counter++
		console.log("This should not execute")
	})
	console.log("Final counter:", counter)

	// Test OnceFunc
	let onceFunc = await sync.OnceFunc((): void => {
		console.log("OnceFunc executed")
	})
	onceFunc!()
	onceFunc!() // Should not execute again

	// Test OnceValue
	let onceValue = await sync.OnceValue((): number => {
		console.log("OnceValue function executed")
		return 42
	})
	let val1 = onceValue!()
	let val2 = onceValue!()
	console.log("OnceValue results:", val1, val2)

	// Test sync.Map
	let m: $.VarRef<sync.Map> = $.varRef(new sync.Map())
	await m!.value.Store("key1", "value1")
	console.log("Stored key1")

	{
		let [val, ok] = await m!.value.Load("key1")
		if (ok) {
			console.log("Loaded key1:", val)
		}
	}

	{
		let [val, loaded] = await m!.value.LoadOrStore("key2", "value2")
		if (!loaded) {
			console.log("Stored key2:", val)
		}
	}

	await m!.value.Range((key: null | any, value: null | any): boolean => {
		console.log("Range:", key, "->", value)
		return true
	})

	await m!.value.Delete("key1")
	{
		let [, ok] = await m!.value.Load("key1")
		if (!ok) {
			console.log("key1 deleted successfully")
		}
	}

	// Test Pool
	let pool = new sync.Pool({New: (): null | any => {
		console.log("Pool creating new object")
		return "new object"
	}})

	let obj1 = await pool!.Get()
	console.log("Got from pool:", obj1)
	await pool!.Put("reused object")
	let obj2 = await pool!.Get()
	console.log("Got from pool:", obj2)

	console.log("test finished")
}

