package main

import "net/http"

func main() {
	resp := http.Response{StatusCode: http.StatusOK}

	println("status:", resp.StatusCode, http.StatusText(resp.StatusCode))
}
