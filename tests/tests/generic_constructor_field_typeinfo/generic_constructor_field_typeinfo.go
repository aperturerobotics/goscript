package main

type Block interface {
	MarshalBlock() ([]byte, error)
	UnmarshalBlock([]byte) error
}

type blockType[T Block] struct {
	typeID      string
	constructor func() T
}

func NewBlockType[T Block](typeID string, constructor func() T) *blockType[T] {
	return &blockType[T]{
		typeID:      typeID,
		constructor: constructor,
	}
}

func (t *blockType[T]) Constructor() Block {
	return t.constructor()
}

func (t *blockType[T]) GetBlockTypeID() string {
	return t.typeID
}

type sampleBlock struct{}

func (*sampleBlock) MarshalBlock() ([]byte, error) {
	return []byte{1, 2, 3}, nil
}

func (*sampleBlock) UnmarshalBlock([]byte) error {
	return nil
}

func main() {
	bt := NewBlockType("sample", func() *sampleBlock { return &sampleBlock{} })
	blk := bt.Constructor()
	data, _ := blk.MarshalBlock()
	println(bt.GetBlockTypeID(), len(data))
}
