package main

func main() {
	encoder := "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

	var decodeMap [256]byte
	for i := range decodeMap {
		decodeMap[i] = 255
	}

	for i := 0; i < len(encoder); i++ {
		if decodeMap[encoder[i]] != 255 {
			panic("duplicate symbol")
		}
		decodeMap[encoder[i]] = byte(i)
	}

	println("Success: no duplicates")
}
