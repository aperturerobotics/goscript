package helper

type Box[T any] struct {
	Value T
}

func Wrap[T any](value T) Box[T] {
	return Box[T]{Value: value}
}
