package main

type Base struct{}

func (Base) String() string {
	return "base"
}

type Derived Base

func (Derived) Own() string {
	return "derived"
}

type Stringer interface {
	String() string
}

func main() {
	var base any = Base{}
	_, baseOK := base.(Stringer)
	println("base implements Stringer:", baseOK)

	var derived any = Derived{}
	_, derivedOK := derived.(Stringer)
	println("derived implements Stringer:", derivedOK)
}
