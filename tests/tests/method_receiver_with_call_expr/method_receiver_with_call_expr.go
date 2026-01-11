package main

type State struct {
	value int
}

func (s *State) Process() {
	// This should generate:
	// const s = this
	// ;(getProcessor())!(s)
	// The semicolon is important to prevent: const s = this(getProcessor())!(s)
	getProcessor()(s)
}

func getProcessor() func(*State) {
	return func(s *State) {
		s.value = 42
	}
}

func main() {
	state := &State{}
	state.Process()
	println("value:", state.value)
}
