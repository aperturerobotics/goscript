package main

import "testing"

func RunSubtest(t *testing.T, ch chan string) bool {
	return t.Run("child", func(t *testing.T) {
		if <-ch != "ok" {
			t.Fatalf("unexpected value")
		}
	})
}

func main() {
	println("testing async subtest compiled")
}
