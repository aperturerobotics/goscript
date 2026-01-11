package main

func main() {
	var arr [10]byte
	decodeMapInitialize := "\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff"
	copy(arr[:], decodeMapInitialize)

	// Check that arr is initialized with 255 values
	for i := 0; i < len(arr); i++ {
		if arr[i] != 255 {
			panic("copy failed")
		}
	}
	println("Copy succeeded")
}
