package main

// T constrained to string
func toStringString[T ~string](v T) string {
	return string(v)
}

// T constrained to []byte
func toStringBytes[T ~[]byte](v T) string {
	return string(v)
}

// T constrained to union: string | []byte (via ~string | ~[]byte)
// Note: We express this using a type parameter with an interface union constraint in Go 1.18+.
type StrOrBytes interface {
	~string | ~[]byte
}

func toStringGeneric[T StrOrBytes](v T) string {
	return string(v)
}

func main() {
	// string-only
	println(toStringString("hello"))

	// bytes-only
	println(toStringBytes([]byte{'w', 'o', 'r', 'l', 'd'}))

	// union: string
	println(toStringGeneric("foo"))
	// union: []byte
	println(toStringGeneric([]byte{'b', 'a', 'r'}))
}
