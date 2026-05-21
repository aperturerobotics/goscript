package main

import "runtime"

func platform() string {
	switch {
	case runtime.GOARCH == "wasm":
		return "wasm"
	case runtime.GOOS == "windows" && runtime.GOARCH == "386":
		return "windows386"
	case runtime.GOOS == "openbsd":
		return "openbsd"
	case runtime.GOOS == "aix":
		return "aix"
	default:
		return "other"
	}
}

func main() {
	println(platform())
}
