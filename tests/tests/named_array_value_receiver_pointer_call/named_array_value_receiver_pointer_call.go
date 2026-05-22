package main

type flags [2]int

func (f *flags) set(idx int) {
	f[idx] = idx + 1
}

func (f flags) values() (int, int) {
	f.set(0)
	f.set(1)
	return f[0], f[1] + 1
}

func main() {
	left, right := flags{}.values()
	println(left)
	println(right)
}
