package main

func scopedTotal(seed int) int {
	total := seed
	{
		total += 1
		inner := total * 2
		println("inner:", inner)
	}
	{
		total += 3
	}
	return total
}

func shadowedValue() int {
	value := 7
	{
		value := 11
		println("block value:", value)
	}
	return value
}

func main() {
	println("scoped total:", scopedTotal(1))
	println("outer value:", shadowedValue())
}
