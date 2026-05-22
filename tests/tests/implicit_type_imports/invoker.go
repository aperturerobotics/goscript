package main

type Invoker interface {
	Invoke(Stream) error
}
