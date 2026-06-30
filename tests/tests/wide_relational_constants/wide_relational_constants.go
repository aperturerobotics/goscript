package main

type Signed int64
type Unsigned uint64

func main() {
	var s Signed = -9007199254740993
	println("signed <", s < -9007199254740992)
	println("signed <=", s <= -9007199254740993)
	println("signed >", s > -9223372036854775808)
	println("signed >=", s >= -9007199254740993)

	var u Unsigned = 9223372036854775808
	println("unsigned <", u < 9223372036854775809)
	println("unsigned <=", u <= 9223372036854775808)
	println("unsigned >", u > 9007199254740993)
	println("unsigned >=", u >= 9223372036854775808)
}
