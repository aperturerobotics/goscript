package main

import "github.com/s4wave/goscript/tests/tests/interface_slice_index_short_decl/dep"

type value [2]byte

func (v value) Key() any {
	return v
}

type Fixed []dep.Ref

type Shape interface {
	Mark() bool
}

func (f Fixed) Mark() bool {
	return len(f) != 0
}

type Action struct {
	Result int
	Filter map[int]dep.Ref
}

func (a Action) Mark() bool {
	return a.Filter != nil
}

func (a *Action) SetFilter(k int, v dep.Ref) {
	if a.Filter == nil {
		a.Filter = make(map[int]dep.Ref)
	}
	a.Filter[k] = v
}

func main() {
	shapes := []Shape{Fixed{value{1, 2}}, Action{Result: 1, Filter: map[int]dep.Ref{1: value{1, 2}}}}
	var fixed []Fixed
	for _, shape := range shapes {
		switch shape := shape.(type) {
		case Fixed:
			shape = append(shape, value{3, 4})
			fixed = append(fixed, shape)
		case Action:
			fix := fixed[0]
			fv := fix[0]
			if v := shape.Filter[shape.Result]; v != nil {
				_ = dep.ToKey(v)
				_ = dep.ToKey(fv)
			}
			shape.SetFilter(2, fv)
		}
	}
	fix := fixed[0]
	fv := fix[0]
	if dep.ToKey(fv) != nil {
		println("ok")
	}
}
