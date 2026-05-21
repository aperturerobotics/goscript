package main

func fail() error {
	return remoteError(1)
}

func main() {
	err := fail()
	if err != nil {
		println(err.Error())
	}
}
