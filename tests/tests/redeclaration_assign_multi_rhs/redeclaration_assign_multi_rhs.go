package main

func main() {
	s := "abcdef"
	name, s := s[:2], s[2:]

	println(name)
	println(s)
}
