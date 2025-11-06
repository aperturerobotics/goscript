package main

func main() {
	var s []int
	println("s == nil:", s == nil)

	// Slicing nil with valid bounds should work
	s2 := s[0:0]
	println("s[0:0] == nil:", s2 == nil)

	s3 := s[:0]
	println("s[:0] == nil:", s3 == nil)

	s4 := s[:]
	println("s[:] == nil:", s4 == nil)

	println("slice_nil test passed")
}
