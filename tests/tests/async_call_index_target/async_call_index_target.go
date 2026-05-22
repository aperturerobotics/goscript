package main

func values() []int {
	ready := make(chan bool, 1)
	ready <- true
	<-ready
	return []int{4}
}

func mapped() map[int]int {
	ready := make(chan bool, 1)
	ready <- true
	<-ready
	return map[int]int{2: 5}
}

func main() {
	println(values()[0])
	for k, v := range mapped() {
		println(k, v)
	}
}
