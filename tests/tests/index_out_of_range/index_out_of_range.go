package main

// recoverMsg runs fn and prints the recovered runtime error message, proving the
// out-of-range index panic carries the Go runtime error text.
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
	recoverMsg("slice:", func() {
		s := []int{1, 2, 3}
		i := 5
		println(s[i])
	})
	recoverMsg("array:", func() {
		var a [3]int
		i := 7
		println(a[i])
	})
	recoverMsg("negative:", func() {
		s := []int{1, 2, 3}
		i := -1
		println(s[i])
	})
	recoverMsg("string:", func() {
		s := "abc"
		i := 9
		println(s[i])
	})
	recoverMsg("string-negative:", func() {
		s := "abc"
		i := -1
		println(s[i])
	})
	recoverMsg("bytes-negative:", func() {
		b := []byte("abc")
		i := -1
		println(b[i])
	})
	println("done")
}
