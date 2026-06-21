package main

type Expr interface {
	Value() int
}

type lit struct {
	n int
}

func (l *lit) Value() int {
	return l.n
}

func replace(to Expr, exprs ...*Expr) bool {
	for _, expr := range exprs {
		if *expr == nil {
			continue
		}
		*expr = to
		return true
	}
	return false
}

func main() {
	var expr Expr = &lit{n: 1}
	var next Expr = &lit{n: 7}
	println(replace(next, &expr), expr.Value())
}
