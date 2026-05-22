package main

type (
	opener  func(string) (string, error)
	wrapper func(string) (string, error)
	updater func() error
)

func wrap(open opener) wrapper {
	return func(path string) (string, error) {
		value, err := open(path)
		if err != nil {
			return "", err
		}
		return "wrapped:" + value, nil
	}
}

func open(path string) (string, error) {
	return path, nil
}

func run(update updater) error {
	err := func() error {
		return update()
	}()
	if err != nil {
		return err
	}
	return nil
}

func noop() error {
	return nil
}

func main() {
	wrapped := wrap(open)
	value, err := wrapped("ok")
	if err != nil {
		println("err")
		return
	}
	println(value)
	if run(noop) == nil {
		println("run ok")
	}
}
