package main

import "regexp"

func main() {
	label := regexp.MustCompile(`^[a-z0-9]([-a-z0-9]*[a-z0-9])?$`)
	anchored := regexp.MustCompile(`^a$`)
	suffix := regexp.MustCompile(`a$`)

	println("label spacewave-web:", label.MatchString("spacewave-web"))
	println("anchored a:", anchored.MatchString("a"))
	println("suffix ba:", suffix.MatchString("ba"))
}
