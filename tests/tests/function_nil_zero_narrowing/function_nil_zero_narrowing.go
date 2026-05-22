package main

type Cancel func()

func main() {
	var cancel1, cancel2 Cancel
	cancel1, cancel2 = nil, nil
	if cancel1 != nil {
		cancel1()
	}
	if cancel2 != nil {
		cancel2()
	}
	println("ok")
}
