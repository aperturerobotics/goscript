package main

type Block interface {
	Size() int
}

type blockImpl struct {
	size int
}

func (b *blockImpl) Size() int {
	return b.size
}

func newBlock(size int) (*blockImpl, error) {
	return &blockImpl{size: size}, nil
}

func newInterface(size int) (Block, error) {
	if size == 0 {
		return nil, nil
	}
	return newBlock(size)
}

func main() {
	block, err := newInterface(16)
	println("err nil:", err == nil)
	println("size:", block.Size())
}
