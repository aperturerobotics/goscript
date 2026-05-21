package main

import "github.com/aperturerobotics/goscript/tests/tests/package_import_reserved_alias/unique"

type Holder struct {
	Box *unique.Box
}

func main() {
	holder := Holder{Box: unique.NewBox(7)}
	println("box:", holder.Box.Value)
}
