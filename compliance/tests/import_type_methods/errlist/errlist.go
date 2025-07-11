package errlist

type ErrorList []string

func (p *ErrorList) Add(msg string) {
	*p = append(*p, msg)
}

type AStruct struct {
	Msg string
}

func (a *AStruct) Set(msg string) {
	a.Msg = msg
}
