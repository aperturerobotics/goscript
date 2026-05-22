package main

import "github.com/aperturerobotics/goscript/tests/tests/interface_embedded_parent_async/dep"

type Specific interface {
	dep.Directive
	Name() string
}

type impl struct{}

var ready = make(chan bool, 1)

func (i *impl) Name() string {
	ready <- true
	<-ready
	return "ok"
}

func (i *impl) Validate() error {
	ready <- true
	<-ready
	return nil
}

func NewSpecific() Specific {
	return &impl{}
}

func main() {
	s := NewSpecific()
	println("embedded directive", dep.Accept(s), s.Name())
}
