package main

import "errors"

type healthError interface {
	error
	Health() string
}

type wrappedHealthError struct {
	err error
}

func (e *wrappedHealthError) Error() string {
	return e.err.Error()
}

func (e *wrappedHealthError) Unwrap() error {
	return e.err
}

func (e *wrappedHealthError) Health() string {
	return "closed"
}

func main() {
	err := &wrappedHealthError{err: errors.New("root")}

	var target healthError
	ok := errors.As(err, &target)
	println("matched:", ok)
	if ok {
		println("health:", target.Health())
	}
}
