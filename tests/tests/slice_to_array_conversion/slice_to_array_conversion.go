package main

func main() {
	values := []byte{1, 2, 3}
	array := ([2]byte)(values[1:])

	println(array[0], array[1])
	values[1] = 9
	println(array[0], values[1])
}
