package main

type Handler interface {
	Invoker
	Handle()
}
