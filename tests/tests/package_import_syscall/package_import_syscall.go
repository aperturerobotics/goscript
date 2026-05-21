package main

import (
	"fmt"
	"syscall"
)

func main() {
	syscall.CloseOnExec(1)
	if err := syscall.SetNonblock(1, true); err != nil {
		fmt.Println("set true:", err)
		return
	}
	if err := syscall.SetNonblock(1, false); err != nil {
		fmt.Println("set false:", err)
		return
	}
	fmt.Println("set nonblock ok")
}
