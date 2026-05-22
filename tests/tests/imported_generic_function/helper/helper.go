package helper

type Box[T any] struct {
	Value T
}

type Value interface {
	GetValue() int
}

type IntValue struct {
	N int
}

func (v IntValue) GetValue() int {
	return v.N
}

func Wrap[T any](value T) Box[T] {
	return Box[T]{Value: value}
}

func Collect[T Value](value T) ([]T, error) {
	return []T{value}, nil
}
