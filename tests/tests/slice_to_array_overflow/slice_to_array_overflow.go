package main

// recoverMsg runs fn and prints the recovered runtime error message, proving the
// slice-to-array conversion overflow panic carries the Go runtime error text.
func recoverMsg(label string, fn func()) {
	defer func() {
		if r := recover(); r != nil {
			if err, ok := r.(error); ok {
				println(label, err.Error())
			} else {
				println(label, "non-error panic")
			}
		}
	}()
	fn()
}

func main() {
	recoverMsg("array:", func() {
		values := []byte{1, 2}
		arr := ([4]byte)(values)
		println(arr[0])
	})
	recoverMsg("pointer:", func() {
		values := []byte{1, 2}
		arr := (*[4]byte)(values)
		println(arr[0])
	})
	println("done")
}
