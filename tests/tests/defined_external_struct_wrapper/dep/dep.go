package dep

type hidden struct {
	label string
}

type Public struct {
	Value  string
	Hidden hidden
}

func (p *Public) Label() string {
	return p.Value
}
