package main

func (m mode) Run() string {
	if m == 1 {
		return "one"
	}
	return "other"
}
