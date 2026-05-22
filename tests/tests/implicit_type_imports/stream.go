package main

type Stream interface {
	Send() error
}
