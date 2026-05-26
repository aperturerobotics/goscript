package main

import "sync"

func main() {
	var once sync.Once
	ch := make(chan int, 1)
	ch <- 17
	value := 0
	once.Do(func() {
		value = <-ch
	})
	once.Do(func() {
		value = 99
	})
	println("once", value)
}
