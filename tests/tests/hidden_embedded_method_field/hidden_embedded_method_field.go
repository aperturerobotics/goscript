package main

type embedded struct{}

func (embedded) Database() string {
	return "method"
}

type holder struct {
	Database string
	embedded
}

func value(h holder) string {
	return h.Database
}

func main() {
	println(value(holder{Database: "field"}))
}
