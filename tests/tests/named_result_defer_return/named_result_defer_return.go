package main

func syncReturn() (value int, err string) {
	defer func() {
		err = "deferred"
	}()
	return 7, ""
}

func asyncReturn(ch chan string) (value int, err string) {
	defer func() {
		err = <-ch
	}()
	ch <- "async deferred"
	return 11, ""
}

func blankReturn() (_ int, err string) {
	defer func() {
		err = "blank deferred"
	}()
	return 13, ""
}

func main() {
	v, err := syncReturn()
	println("sync", v, err)

	ch := make(chan string, 1)
	v, err = asyncReturn(ch)
	println("async", v, err)

	v, err = blankReturn()
	println("blank", v, err)
}
