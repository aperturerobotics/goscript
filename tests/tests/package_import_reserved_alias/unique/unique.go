package unique

type Box struct {
	Value int
}

func NewBox(value int) *Box {
	return &Box{Value: value}
}
