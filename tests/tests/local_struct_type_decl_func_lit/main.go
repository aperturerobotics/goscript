package main

func main() {
	run := func() {
		type item struct {
			name  string
			count int
		}

		items := []item{
			{name: "alpha", count: 1},
			{name: "beta", count: 2},
		}
		for _, item := range items {
			println(item.name, item.count)
		}
	}

	run()
}
