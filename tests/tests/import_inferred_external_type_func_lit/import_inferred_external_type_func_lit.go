package main

import "os"

func main() {
	fileName := "external-type-func-lit.txt"
	if err := os.WriteFile(fileName, []byte("contents"), 0o644); err != nil {
		println("write error:", err.Error())
		return
	}
	defer os.Remove(fileName)

	func() {
		info, err := os.Stat(fileName)
		if err != nil {
			println("stat error:", err.Error())
			return
		}
		if false {
			println("size:", info.Size())
		} else {
			println("stat closure ok")
		}
	}()
}
