package main

type Callback = func() error
type Opener = func(Callback) error

func newOpener(ch chan error) Opener {
	return func(cb Callback) error {
		if err := cb(); err != nil {
			return err
		}
		return <-ch
	}
}

func use(op Opener, cb Callback) error {
	return op(cb)
}

func main() {
	ch := make(chan error, 1)
	ch <- nil
	err := use(newOpener(ch), func() error {
		return nil
	})
	println("alias opener ok", err == nil)
}
