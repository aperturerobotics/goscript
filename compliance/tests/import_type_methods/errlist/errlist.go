package errlist

type ErrorList []string

func (p ErrorList) Add(msg string) ErrorList {
	return append(p, msg)
}
