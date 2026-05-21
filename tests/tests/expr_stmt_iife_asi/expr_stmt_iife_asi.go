package main

func main() {
	unique := true
	func() {
		if unique {
			unique = false
		}
	}()
	println(unique)
}
