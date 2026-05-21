package main

type box int

func (b box) base() int {
	return int(b)
}
