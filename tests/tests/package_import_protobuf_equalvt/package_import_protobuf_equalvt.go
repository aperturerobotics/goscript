package main

import protobuf_go_lite "github.com/aperturerobotics/protobuf-go-lite"

type msg struct {
	v int
}

func (m *msg) EqualVT(other *msg) bool {
	return other != nil && m.v == other.v
}

func main() {
	println("equal:", protobuf_go_lite.IsEqualVT[*msg](&msg{v: 7}, &msg{v: 7}))
}
