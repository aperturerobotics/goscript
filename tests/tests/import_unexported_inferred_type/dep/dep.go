package dep

type hiddenError struct{}

func (hiddenError) Error() string {
	return "closed"
}

var ErrClosed = hiddenError{}
