package main

func main() {
	for i, r := range "a¢€" {
		println(i, r)
	}
}
