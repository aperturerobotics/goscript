package main

import "errors"

type scanner interface {
	Scan(func(int) error) error
}

type listScanner struct{}

func (listScanner) Scan(fn func(int) error) error {
	return fn(7)
}

func run(s scanner) error {
	return s.Scan(func(v int) error {
		if v != 7 {
			return errors.New("wrong value")
		}
		return nil
	})
}

func main() {
	println(run(listScanner{}) == nil)
}
