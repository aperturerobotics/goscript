package main

// AsyncResource represents a resource that needs async cleanup
type AsyncResource struct {
	name string
}

// Release is an async method that contains channel operations
func (r *AsyncResource) Release() {
	ch := make(chan bool, 1)
	go func() {
		ch <- true
	}()
	<-ch // This will generate await in TypeScript
	println("Released", r.name)
}

func main() {
	res := &AsyncResource{name: "test"}
	defer res.Release() // This should use async defer
	println("main function")
}
