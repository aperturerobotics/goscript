package main

func main() {
	var v any = []byte{7, 8, 9}
	b := v.([]byte)
	println("byte slice:", len(b), b[0], b[2])
}
