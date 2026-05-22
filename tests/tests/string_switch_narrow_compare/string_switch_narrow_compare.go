package main

func valid(network string) bool {
	switch network {
	case "tcp", "udp":
	default:
		return false
	}
	return network != ""
}

func main() {
	println(valid("tcp"), valid(""))
}
