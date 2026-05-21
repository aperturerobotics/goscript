package main

import "fmt"

func main() {
	if false {
		fn := func() bool {
			select {
			default:
				return true
			}
		}
		_ = fn
	}
	fmt.Println("select literal ok")
}
