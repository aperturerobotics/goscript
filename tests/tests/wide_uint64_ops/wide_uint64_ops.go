package main

func hash6(u uint64, h uint) uint32 {
	const prime6bytes = 227718039650203
	return uint32(((u << (64 - 48)) * prime6bytes) >> ((64 - h) & 63))
}

func mix(a, b uint64) uint64 {
	return ((a & b) ^ (a | 1)) >> 60
}

func highAfterMask(v uint64) uint64 {
	return (v & 0xffff) << 48
}

func combineHighLow(v, low uint64) uint64 {
	return ((v & 0xffff) << 48) | uint64(uint16(low))
}

func main() {
	println(hash6(0x0102030405, 14))
	println(mix(0xf0f0f0f0f0f0f0f0, 0x0f0f0f0f0f0f0f0f))
	println(uint32(highAfterMask(0x1234) >> 48))
	println(uint32(combineHighLow(0x1234, 0xbeef) >> 48))
	println(uint32(combineHighLow(0x1234, 0xbeef) & 0xffff))
}
