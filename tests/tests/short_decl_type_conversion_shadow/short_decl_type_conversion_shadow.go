package main

type blockType uint8

const (
	blockTypeRaw blockType = iota
	blockTypeRLE
)

func main() {
	blockType := blockType(1)
	switch blockType {
	case blockTypeRaw:
		println("raw")
	case blockTypeRLE:
		println("rle")
	}
}
