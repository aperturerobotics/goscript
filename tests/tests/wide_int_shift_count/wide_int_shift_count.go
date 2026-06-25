package main

// Pins shift expressions whose result type is number-backed but whose count
// operand is a uint64/int64 (bigint-backed). Go decouples a shift's result type
// from its count type, so the JS shift base stays a number while the count
// lowers to bigint; a raw "1 << s" then throws "Cannot mix BigInt and other
// types". The count must coerce to Number. Mirrors ristretto cmRow.increment
// ("r[i] += 1 << s" with a uint64 shift distance).
func main() {
	var n uint64 = 3
	s := (n & 1) * 4 // s is uint64 -> bigint in TS

	var b byte = 1
	b += 1 << s
	println("byte-shl-by-uint64", b)

	v := (b >> s) & 0x0f
	println("byte-shr-by-uint64", v)

	var w uint16 = 1
	w <<= uint16(s) // compound shift-assign: count coerces via $.uint
	println("uint16-shlassign", w)
}
