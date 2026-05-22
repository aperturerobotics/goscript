package main

func main() {
	switch wordSize {
	case 32:
		println("word: 32")
	case 64:
		println("word: 64")
	default:
		println("word: other")
	}

	switch cgoEnabled {
	case true:
		println("cgo: on")
	case false:
		println("cgo: off")
	}

	if wordSize == 32 {
		println("compare: 32")
	} else {
		println("compare: not 32")
	}

	switch {
	case cgoEnabled || !cgoEnabled:
		println("resolver: go")
	case cgoEnabled:
		println("resolver: cgo")
	}
}
