package main

type counter struct {
	value int
}

func (c *counter) Load() int {
	return c.value
}

type inner struct {
	name  string
	count counter
}

type outer struct {
	*inner
}

func main() {
	o := &outer{inner: &inner{name: "ready", count: counter{value: 7}}}

	println("name:", o.name)
	o.name = "done"
	println("renamed:", o.inner.name, o.name)
	println("count:", o.count.Load())
}
