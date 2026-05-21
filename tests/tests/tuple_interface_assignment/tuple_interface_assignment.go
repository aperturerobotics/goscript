package main

type reader interface {
	Read() int
}

type concrete struct{}

func (*concrete) Read() int {
	return 7
}

func makeReader() (*concrete, error) {
	return &concrete{}, nil
}

func main() {
	var r reader
	var err error
	r, err = makeReader()
	println("ok", r.Read() == 7 && err == nil)
}
