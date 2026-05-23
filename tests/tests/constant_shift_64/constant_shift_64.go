package main

func main() {
	limit := (1 << 38) - 64
	println(limit > 1024, limit)
}
