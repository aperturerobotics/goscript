package subpkg

func Run(name string, fn func() error) {
	err := fn()
	if err != nil {
		println(name, "error")
		return
	}
	println(name, "ok")
}
