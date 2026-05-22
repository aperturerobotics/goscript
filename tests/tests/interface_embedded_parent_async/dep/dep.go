package dep

type Directive interface {
	Validate() error
}

func Use(d Directive) bool {
	return d.Validate() == nil
}

func Accept(d Directive) bool {
	return d != nil
}
