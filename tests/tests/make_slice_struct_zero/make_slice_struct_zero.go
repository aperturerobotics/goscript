package main

type code struct {
	len int
}

func main() {
	codes := make([]code, 2)
	codes[0].len = 3
	println("first:", codes[0].len)
	println("second:", codes[1].len)
}
