// Generated file based on package_import_sync.go
// Updated when compliance tests are re-run, DO NOT EDIT!

import * as $ from "@goscript/builtin/index.js"

import * as sync from "@goscript/sync/index.js"

export async function main(): Promise<void> {
	// Test Mutex
	let mu: $.VarRef<sync.Mutex> = $.varRef(new sync.Mutex())
	await mu!.value.Lock()
	$.println("Mutex locked")
	mu!.value.Unlock()
	$.println("Mutex unlocked")

	// Test TryLock
	if (mu!.value.TryLock()) {
		$.println("TryLock succeeded")
		mu!.value.Unlock()
	} else {
		$.println("TryLock failed")
	}

	// Test WaitGroup
	let wg: $.VarRef<sync.WaitGroup> = $.varRef(new sync.WaitGroup())
	wg!.value.Add(1)
	$.println("WaitGroup counter set to 1")
	wg!.value.Done()
	$.println("WaitGroup counter decremented")
	await wg!.value.Wait()
	$.println("WaitGroup wait completed")

	// Test Once
	let once: $.VarRef<sync.Once> = $.varRef(new sync.Once())
	let counter = 0
	await once!.value.Do((): void => {
		counter++
		$.println("Once function executed, counter:", counter)
	})
	await once!.value.Do((): void => {
		counter++
		$.println("This should not execute")
	})
	$.println("Final counter:", counter)

	// Test OnceFunc
	let onceFunc = sync.OnceFunc((): void => {
		$.println("OnceFunc executed")
	})
	onceFunc!()
	onceFunc!() // Should not execute again

	// Test OnceValue
	let onceValue = sync.OnceValue((): number => {
		$.println("OnceValue function executed")
		return 42
	})
	let val1 = onceValue!()
	let val2 = onceValue!()
	$.println("OnceValue results:", val1, val2)

	// Test sync.Map
	let m: $.VarRef<sync.Map> = $.varRef(new sync.Map())
	await m!.value.Store("key1", "value1")
	$.println("Stored key1")

	{
		let [val, ok] = await m!.value.Load("key1")
		if (ok) {
			$.println("Loaded key1:", val)
		}
	}

	{
		let [val, loaded] = await m!.value.LoadOrStore("key2", "value2")
		if (!loaded) {
			$.println("Stored key2:", val)
		}
	}

	await m!.value.Range((key: null | any, value: null | any): boolean => {
		$.println("Range:", key, "->", value)
		return true
	})

	await m!.value.Delete("key1")
	{
		let [, ok] = await m!.value.Load("key1")
		if (!ok) {
			$.println("key1 deleted successfully")
		}
	}

	// Test Pool
	let pool = new sync.Pool({New: (): null | any => {
		$.println("Pool creating new object")
		return "new object"
	}})

	let obj1 = pool!.Get()
	$.println("Got from pool:", obj1)
	pool!.Put("reused object")
	let obj2 = pool!.Get()
	$.println("Got from pool:", obj2)

	$.println("test finished")
}

