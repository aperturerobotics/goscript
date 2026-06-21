package main

type provider interface {
	Items() []*Group
}

type listProvider struct {
	items []*Group
}

func (p *listProvider) Items() []*Group {
	return p.items
}

type Group struct {
	provider provider
	seen     bool
}

func (g *Group) Each(yield func(*Group) bool) {
	for _, child := range g.provider.Items() {
		if !yield(child) {
			return
		}
	}
}

func (g *Group) Build() {
	for child := range g.Each {
		child.seen = true
	}
}

func main() {
	child := &Group{}
	root := &Group{provider: &listProvider{items: []*Group{child}}}
	root.Build()
	println(child.seen)
}
