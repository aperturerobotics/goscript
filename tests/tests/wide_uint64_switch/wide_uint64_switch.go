package main

// wide_uint64_switch guards goscript switch codegen for bigint-backed tags. A
// uint64/int64 switch on a small value must match its integer-constant case
// instead of falling through to default. The compiler lowers int64/uint64 to a
// runtime bigint and JS switch matches with strict ===, so a number case
// literal ("case 5:") fails "5n === 5" and silently skips the branch; the case
// literal must carry the bigint suffix ("case 5n:").

func classifyU(v uint64) string {
	switch v {
	case 0:
		return "zero"
	case 5:
		return "five"
	case 1 << 60:
		return "wide"
	default:
		return "other"
	}
}

func classifyI(v int64) string {
	switch v {
	case -5:
		return "neg"
	case 7:
		return "seven"
	default:
		return "other"
	}
}

func main() {
	println(classifyU(0))
	println(classifyU(5))
	println(classifyU(1 << 60))
	println(classifyU(9))
	println(classifyI(-5))
	println(classifyI(7))
	println(classifyI(3))
}
