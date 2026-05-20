package main

import "strings"

func (l label) Format() string {
	return strings.ToUpper(l.value) + suffix()
}
