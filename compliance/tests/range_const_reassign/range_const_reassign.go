package main

func main() {
	s := "abc"
	for _, c := range s {
		if c >= 'a' {
			c = c - 'a' + 10
		}
		println(int(c))
	}
}
