package main

type words [1]uint64

func setWords(w *words) (*words, bool) {
	w[0] = 4
	return w, true
}

func (w *words) Rsh(n uint) uint64 {
	return w[0] >> n
}

func main() {
	w, ok := setWords(new(words))
	if !ok {
		println("missing")
		return
	}
	println(w.Rsh(1))
}
