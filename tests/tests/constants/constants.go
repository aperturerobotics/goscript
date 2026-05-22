package main

var DigestIV = [...]uint32{IV0, IV1, IV2}

const (
	Pi    = 3.14
	Truth = false
	// TODO: Handle large integer constants and bit shifts exceeding JS number limits.
	// Big      = 1 << 60
	// Small    = Big >> 59 // Commented out as it depends on Big
	Greeting = "Hello, Constants!"
)

const (
	IV0 = 1
	IV1 = 2
	IV2 = 3
)

// Nothing has untyped null
var Nothing = any(nil)

func main() {
	println(Pi)
	println(Truth)
	// println(Big) // Commented out until large integer handling is implemented
	// println(Small) // Commented out as it depends on Big
	println(Greeting)
	println(DigestIV[0], DigestIV[1], DigestIV[2])
	println(byte(4))
}
