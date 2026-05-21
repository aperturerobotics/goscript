package main

import "strings"

func (l label) Format() string {
	state := newHelperState()
	return strings.ToUpper(l.value) + state.text
}
