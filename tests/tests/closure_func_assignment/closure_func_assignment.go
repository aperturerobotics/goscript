package main

func run(set func(func())) {
	var cb func()
	set(func() {
		set(func() {
			cb = func() {
				println("called")
			}
		})
	})
	if cb != nil {
		cb()
	}
}

func main() {
	run(func(fn func()) {
		fn()
	})
}
