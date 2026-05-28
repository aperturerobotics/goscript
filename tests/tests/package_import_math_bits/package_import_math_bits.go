package main

import "math/bits"

func main() {
	println(bits.UintSize)
	println(bits.Len(^uint(0)))
	println(bits.LeadingZeros(uint(1)))
	lo, carry := bits.Add(^uint(0), 1, 0)
	println(lo == 0, carry)
}
