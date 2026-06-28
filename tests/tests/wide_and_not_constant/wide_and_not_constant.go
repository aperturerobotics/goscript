package main

func main() {
	// A wide (int64/uint64) &^ or &^= whose right operand is an untyped constant
	// lowers that constant to a JS number, while the left operand is a runtime
	// bigint. The raw "left & ~(right)" path mixed bigint and number and threw at
	// runtime, so wide AND-NOT must route through the typed helper. 1<<63 is the
	// exact math/rand/v2 Rand.Int64 pattern (clear the sign bit).
	var x uint64 = 0xFFFFFFFFFFFFFFFF
	cleared := x &^ (1 << 63)
	println("cleared:", cleared)

	var y uint64 = 0xFFFFFFFFFFFFFFFF
	y &^= 1 << 62
	println("y:", y)

	var z int64 = -1
	z &^= 1 << 62
	println("z:", z)
}
