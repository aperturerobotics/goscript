package main

// main proves integer narrowing conversions wrap (truncate) like Go instead of
// panicking, matching Go's two's-complement conversion semantics.
func main() {
	var big int64 = (1 << 40) + 5
	println("int32:", int32(big))
	println("uint8:", uint8(big))
	println("int16:", int16(big))

	var neg int64 = -1
	println("uint32 of -1:", uint32(neg))
	println("uint64 of -1:", uint64(neg))

	var u uint64 = 0xFFFFFFFFFFFFFFFF
	println("int64 of max uint64:", int64(u))
}
