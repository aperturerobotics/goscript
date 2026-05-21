package main

import "errors"

type customErr struct {
	msg string
}

func (e *customErr) Error() string {
	return e.msg
}

type wrappedErr struct {
	err error
}

func (e wrappedErr) Error() string {
	return "wrapped: " + e.err.Error()
}

func (e wrappedErr) Unwrap() error {
	return e.err
}

func main() {
	// Test basic error creation
	err1 := errors.New("first error")
	err2 := errors.New("second error")

	println("err1:", err1.Error())
	println("err2:", err2.Error())

	// Test error comparison
	println("err1 == err2:", err1 == err2)
	println("err1 == nil:", err1 == nil)

	// Test nil error
	var nilErr error
	println("nilErr == nil:", nilErr == nil)

	typedErr := &customErr{msg: "typed error"}
	matched, ok := errors.AsType[*customErr](wrappedErr{err: typedErr})
	println("AsType matched:", ok)
	if ok {
		println("AsType message:", matched.msg)
	}
	_, ok = errors.AsType[*customErr](err1)
	println("AsType missing:", ok)

	println("test finished")
}
