package main

type floatInfo struct {
	mantbits int
	expbits  int
}

var info = floatInfo{mantbits: 52, expbits: 11}

func infoPtr() *floatInfo {
	return &info
}
