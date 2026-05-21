package main

type frame struct {
	name string
}

type iterator struct {
	idx int
}

func (it *iterator) Next() (frame, bool) {
	it.idx++
	switch it.idx {
	case 1:
		return frame{name: "first"}, true
	case 2:
		return frame{name: "second"}, true
	default:
		return frame{}, false
	}
}

func findFrame() *frame {
	it := &iterator{}
	for f, again := it.Next(); again; f, again = it.Next() {
		if f.name == "second" {
			return &f
		}
	}
	return nil
}

func main() {
	for i, j := 0, 5; i < j; i, j = i+1, j-1 {
		println(i, j)
	}
	found := findFrame()
	if found != nil {
		println("frame:", found.name)
	}
	println("done")
}
