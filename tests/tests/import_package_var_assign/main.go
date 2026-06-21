package main

import "github.com/s4wave/goscript/tests/tests/import_package_var_assign/dep"

func main() {
	dep.Count = 7
	println(dep.Current())
	dep.Hook = func() error {
		return dep.Wait()
	}
	if err := dep.Run(); err != nil {
		println("hook error")
		return
	}
	println("hook ok")
}
