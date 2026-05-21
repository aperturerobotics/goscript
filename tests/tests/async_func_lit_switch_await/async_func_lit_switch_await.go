package main

var fn func(int) bool

func main() {
	ch := make(chan bool, 1)
	ch <- true
	fn = func(value int) bool {
		switch value {
		case 0:
			return <-ch
		default:
			return false
		}
	}
	println(fn(0))
}
