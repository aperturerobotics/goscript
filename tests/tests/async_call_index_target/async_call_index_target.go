package main

func values() []int {
	ready := make(chan bool, 1)
	ready <- true
	<-ready
	return []int{4}
}

func main() {
	println(values()[0])
}
