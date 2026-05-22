package main

func main() {
	server := &Server{}
	server.Handle(&localReadWriteCloser{})
	println("ok")
}

type localReadWriteCloser struct{}

func (*localReadWriteCloser) Read([]byte) (int, error) {
	return 0, nil
}

func (*localReadWriteCloser) Write(p []byte) (int, error) {
	return len(p), nil
}

func (*localReadWriteCloser) Close() error {
	return nil
}
