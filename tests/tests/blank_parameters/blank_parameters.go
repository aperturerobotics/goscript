package main

type blankInterface interface {
	Value() int
}

type blankImpl struct {
	value int
}

func (b *blankImpl) Value() int {
	return b.value
}

var (
	_ blankInterface = &blankImpl{value: 1}
	_ blankInterface = &blankImpl{value: 2}
)

type Packer struct{}

func blanks(_ int, _ string) int {
	return 7
}

func (Packer) pack(msg []byte, _ map[string]int, _ int) []byte {
	return append(msg, 1)
}

func unicodeNames(φ int, β int) (ψ int, δ int) {
	ψ = φ + 1
	δ = β + 2
	return
}

func main() {
	p := Packer{}
	println(blanks(1, "x"))
	println(len(p.pack(nil, nil, 0)))

	f := func(_ int, _ int) int {
		return 9
	}
	println(f(1, 2))

	left, right := unicodeNames(3, 4)
	println(left, right)
}
