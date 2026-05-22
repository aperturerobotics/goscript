package main

type customErr string

func (e customErr) Error() string {
	return string(e)
}

func setErr(err *error) {
	*err = customErr("pointer error")
}

func main() {
	var err error
	setErr(&err)
	if err != nil {
		println(err.Error())
	}
}
