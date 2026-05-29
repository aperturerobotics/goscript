package main

import (
	"io"
	"net/http"
	"net/http/httptest"
)

func main() {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.Write([]byte("ok"))
	}))
	defer server.Close()

	resp, err := http.Get(server.URL)
	if err != nil {
		println("get error:", err.Error())
		return
	}
	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		println("read error:", err.Error())
		return
	}

	println("get status:", resp.StatusCode)
	println("get body:", string(data))
}
