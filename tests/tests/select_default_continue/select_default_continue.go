package main

func main() {
	for i := range 3 {
		select {
		default:
			if i == 1 {
				continue
			}
		}
		println("selected", i)
	}
	println("done")
}
