package main

type Packer struct{}

func blanks(_ int, _ string) int {
	return 7
}

func (Packer) pack(msg []byte, _ map[string]int, _ int) []byte {
	return append(msg, 1)
}

func main() {
	p := Packer{}
	println(blanks(1, "x"))
	println(len(p.pack(nil, nil, 0)))

	f := func(_ int, _ int) int {
		return 9
	}
	println(f(1, 2))
}
