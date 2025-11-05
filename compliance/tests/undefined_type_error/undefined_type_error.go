package main

// Test case that replicates the undefined type error
// The issue: fmt: $.VarRef<fmt>; where fmt type is undefined

// This should generate a proper type reference, not an undefined fmt type
type formatter struct {
	wid         int  //nolint:unused
	prec        int  //nolint:unused
	widPresent  bool //nolint:unused
	precPresent bool //nolint:unused
	minus       bool
	plus        bool
	sharp       bool //nolint:unused
	space       bool //nolint:unused
	zero        bool //nolint:unused
	plusV       bool //nolint:unused
	sharpV      bool //nolint:unused
}

type printer struct {
	buf []byte      //nolint:unused
	arg interface{} //nolint:unused
	// This line causes the issue: fmt: $.VarRef<fmt>; where fmt is undefined
	// Should generate proper type reference
	fmt formatter
}

func (p *printer) init() {
	p.fmt = formatter{}
}

func (p *printer) format(verb rune) {
	// Use the formatter
	if p.fmt.minus {
		println("minus flag set")
	}
	if p.fmt.plus {
		println("plus flag set")
	}
}

func main() {
	p := &printer{}
	p.init()
	p.format('d')
	println("Formatter test completed")
}
