package main

type padded struct {
	_     [2]byte
	Value int
	_     [3]byte
}

var featureBlock struct {
	_       padded
	Enabled bool
	_       padded
}

func main() {
	featureBlock.Enabled = true
	println(featureBlock.Enabled)

	original := padded{Value: 7}
	copy := original
	copy.Value = 8
	println(original.Value, copy.Value)
}
