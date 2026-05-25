package main

// MyError is a primitive int type that implements error
type MyError int

const ErrNegative MyError = -1

func (e MyError) Error() string {
	if e == 0 {
		return "no error"
	}
	return "error occurred"
}

// mayFail returns an error if n is negative
func mayFail(n int) error {
	if n < 0 {
		return MyError(n)
	}
	return nil
}

func main() {
	err := mayFail(5)
	if err == nil {
		println("mayFail(5): no error")
	} else {
		println("mayFail(5):", err.Error())
	}

	err = mayFail(-1)
	if err == nil {
		println("mayFail(-1): no error")
	} else {
		println("mayFail(-1):", err.Error())
	}

	switch err {
	case ErrNegative:
		println("switch: matched primitive error")
	default:
		println("switch: missed primitive error")
	}
}
