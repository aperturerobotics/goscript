package dep

var Count = 1
var Hook func() error

func Current() int {
	return Count
}

func Wait() error {
	ch := make(chan error, 1)
	ch <- nil
	return <-ch
}

func Run() error {
	return Hook()
}
