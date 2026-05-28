package main

import (
	"bytes"
	"encoding/binary"
)

func main() {
	var buf bytes.Buffer
	var signed int32 = 2
	if err := binary.Write(&buf, binary.BigEndian, signed); err != nil {
		println("write signed error:", err.Error())
		return
	}
	if err := binary.Write(&buf, binary.BigEndian, uint32(3)); err != nil {
		println("write unsigned error:", err.Error())
		return
	}
	out := buf.Bytes()
	println("len:", len(out))
	for _, b := range out {
		println(int(b))
	}
}
