package main

type Reader interface {
	Val() Value
}

func Read(r Reader) Value {
	return r.Val()
}
