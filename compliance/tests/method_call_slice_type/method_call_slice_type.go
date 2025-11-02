package main

type MySlice []int

func (s *MySlice) Add(val int) {
	*s = append(*s, val)
}

func main() {
	var myList MySlice
	myList.Add(10)
	myList.Add(20)
	println("length:", len(myList))
	println("first:", myList[0])
	println("second:", myList[1])
}
