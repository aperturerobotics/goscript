package main

type locked struct {
	value int
}

func newLocked(value int) locked {
	return locked{value: value}
}

func (l *locked) Inc() {
	l.value++
}

func (l *locked) Value() int {
	return l.value
}

func main() {
	locked := newLocked(1)
	locked.Inc()
	println(locked.Value())

	for range 1 {
		locked := newLocked(10)
		locked.Inc()
		println(locked.Value())
	}

	println(locked.Value())
}
