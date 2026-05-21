package main

type helperState struct {
	text string
}

func newHelperState() *helperState {
	return &helperState{text: suffix()}
}

func suffix() string {
	return "SCRIPT"
}
