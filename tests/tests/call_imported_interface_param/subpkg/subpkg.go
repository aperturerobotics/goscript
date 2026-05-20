package subpkg

type Writer interface {
	Write([]byte) (int, error)
}
