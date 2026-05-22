package main

type MySlice []int

func (s *MySlice) Add(val int) {
	*s = append(*s, val)
}

func (s MySlice) Sum() int {
	total := 0
	for _, v := range s {
		total += v
	}
	return total
}

func main() {
	var myList MySlice
	myList.Add(10)
	myList.Add(20)
	ptr := &myList
	println("length:", len(myList))
	println("first:", myList[0])
	println("second:", myList[1])
	println("sum:", ptr.Sum())
}
