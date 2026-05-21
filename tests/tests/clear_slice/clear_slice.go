package main

func main() {
	buf := []byte{1, 2, 3}
	clear(buf)
	println("bytes:", buf[0], buf[1], buf[2])

	nums := []int{4, 5, 6, 7}
	clear(nums[1:3])
	println("window:", nums[0], nums[1], nums[2], nums[3])

	words := []string{"a", "b"}
	clear(words)
	println("strings:", words[0] == "", words[1] == "")
}
