package main

type Match struct {
	Size int
}

type Matcher struct {
	matches []Match
}

func (m *Matcher) Blocks() []Match {
	return m.matches
}

func (m *Matcher) Total() int {
	total := 0
	for _, m := range m.Blocks() {
		total += m.Size
	}
	return total
}

func main() {
	m := &Matcher{matches: []Match{{Size: 3}, {Size: 4}}}
	println(m.Total())
}
