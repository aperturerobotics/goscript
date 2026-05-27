package main

func checksum(c uint32) uint32 {
	return c + 2
}

func main() {
	var c uint32 = 4294967295
	v := checksum(c)
	println(v == 1)
	println(byte(v) == 1)
	var high uint32 = 0x80000000
	println(high>>31 == 1)
	high >>= 1
	println(high == 0x40000000)
	println(^uint16(0) == 0xffff)
	println(high>>32 == 0)
	var count int
	for mask := byte(8); mask <= 24; mask, count = mask-8, count+1 {
		println(mask)
	}
	println(count)
}
