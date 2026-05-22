package main

type state int

func (s *state) set(v int) {
	*s = state(v)
}

func call(fn func()) {
	fn()
}

func main() {
	var s state
	call(func() {
		s.set(7)
	})
	println(int(s))
}
