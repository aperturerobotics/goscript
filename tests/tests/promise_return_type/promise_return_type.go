package main

import (
	"fmt"
	"sync"
)

type AsyncData struct {
	mu    sync.Mutex
	value int
}

// This returns a value and should be async due to mutex
func (d *AsyncData) GetValue() int {
	d.mu.Lock()
	defer d.mu.Unlock()
	return d.value
}

// This should handle the Promise return type correctly
func processData(d *AsyncData) {
	// This should await the async method call
	result := d.GetValue()
	fmt.Printf("Result: %d\n", result)
}

func main() {
	data := &AsyncData{value: 42}
	processData(data)
}
