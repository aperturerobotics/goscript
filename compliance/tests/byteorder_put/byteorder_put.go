package main

import "internal/byteorder"

func main() {
	buf := make([]byte, 8)
	byteorder.BEPutUint64(buf, 0x0102030405060708)
	println("BEPutUint64: buf[0]=", buf[0], "buf[7]=", buf[7])
	
	buf32 := make([]byte, 4)
	byteorder.BEPutUint32(buf32, 0x01020304)
	println("BEPutUint32: buf[0]=", buf32[0], "buf[3]=", buf32[3])
	
	println("byteorder put test finished")
}
