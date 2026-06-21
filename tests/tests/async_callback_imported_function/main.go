package main

import "github.com/s4wave/goscript/tests/tests/async_callback_imported_function/subpkg"

func main() {
	ch := make(chan int, 1)
	ch <- 7

	subpkg.Run("async callback", func() error {
		println("value:", <-ch)
		return nil
	})
}
