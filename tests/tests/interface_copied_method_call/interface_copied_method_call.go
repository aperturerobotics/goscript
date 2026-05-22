package main

type runner interface {
	Run()
}

type task struct{}

func (task) Run() {
	println("run")
}

func callCopied(r runner) {
	var curr runner
	func() {
		curr = r
	}()
	curr.Run()
}

func main() {
	callCopied(task{})
}
