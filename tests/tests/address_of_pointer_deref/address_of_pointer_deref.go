package main

type Col struct {
	Name    string
	Default *int
}

// cloneColField mirrors the go-mysql-server idiom of taking the address of a
// pointer dereference. In Go, &*p is the identity address-of-dereference: it
// yields the same pointer p, so the resulting field aliases the original
// pointee rather than copying it.
func cloneColField(c *Col) *Col {
	out := *c
	if out.Default != nil {
		out.Default = &(*out.Default)
	}
	return &out
}

func main() {
	v := 10
	p := &v

	// Local: q := &*p must alias v, so writing through q changes v.
	q := &(*p)
	*q = 20
	println("alias write through &*p:", v)

	// Field selector: out.Default = &(*out.Default) keeps the same pointee.
	c := &Col{Name: "c", Default: &v}
	out := cloneColField(c)
	println("field alias same pointee:", out.Default == c.Default)
	*out.Default = 30
	println("field alias write:", v)
}
