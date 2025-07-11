package errlist

type ErrorList []string

func (p *ErrorList) Add(msg string) {
	*p = append(*p, msg)
}
