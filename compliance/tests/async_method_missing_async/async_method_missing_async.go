package main

import "sync"

// FSHandleCursor is defined first but references AtomicBool which is defined later
type FSHandleCursor struct {
	mutex         *sync.Mutex
	released      AtomicBool // This references AtomicBool before it's defined
	releaseHandle bool
	relFunc       func()
}

// Release releases the filesystem cursor.
// note: locks rmtx. must NOT be locked when calling
func (f *FSHandleCursor) Release() {
	if !f.released.Swap(true) && f.releaseHandle {
		f.mutex.Lock() // This should generate await and method should be marked async
		println("Handler released")
		if f.relFunc != nil {
			f.relFunc()
		}
		f.mutex.Unlock()
	}
}

// AtomicBool is defined after FSHandleCursor but is referenced by it
type AtomicBool struct {
	value bool
}

func (a *AtomicBool) Swap(new bool) bool {
	old := a.value
	a.value = new
	return old
}

func main() {
	cursor := &FSHandleCursor{
		mutex:         &sync.Mutex{},
		released:      AtomicBool{value: false},
		releaseHandle: true,
		relFunc: func() {
			println("Cleanup function called")
		},
	}

	cursor.Release()
	println("Test completed")
}
