package dep

type hidden interface {
	Ping() string
}

type impl struct{}

func (impl) Ping() string {
	return "pong"
}

type Holder struct {
	Hidden hidden
}

func NewHolder() Holder {
	return Holder{Hidden: impl{}}
}
