package main

import (
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
)

func main() {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var data []byte
		if r.Body != nil {
			var readErr error
			data, readErr = io.ReadAll(r.Body)
			if readErr != nil {
				w.WriteHeader(http.StatusInternalServerError)
				if _, writeErr := w.Write([]byte("read error: " + readErr.Error())); writeErr != nil {
					return
				}
				return
			}
		}
		if len(data) != 0 {
			if _, writeErr := w.Write([]byte(r.Method + ":" + string(data))); writeErr != nil {
				return
			}
			return
		}
		if _, writeErr := w.Write([]byte(r.Method)); writeErr != nil {
			return
		}
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

	clientResp, err := server.Client().Get(server.URL)
	if err != nil {
		println("client get error:", err.Error())
		return
	}
	defer clientResp.Body.Close()

	data, err = io.ReadAll(clientResp.Body)
	if err != nil {
		println("client get read error:", err.Error())
		return
	}
	println("client get status:", clientResp.StatusCode)
	println("client get body:", string(data))

	headResp, err := server.Client().Head(server.URL)
	if err != nil {
		println("head error:", err.Error())
		return
	}
	defer headResp.Body.Close()
	println("head status:", headResp.StatusCode)

	postResp, err := server.Client().Post(server.URL, "text/plain", strings.NewReader("payload"))
	if err != nil {
		println("post error:", err.Error())
		return
	}
	defer postResp.Body.Close()

	data, err = io.ReadAll(postResp.Body)
	if err != nil {
		println("post read error:", err.Error())
		return
	}
	println("post status:", postResp.StatusCode)
	println("post body:", string(data))

	transportReq, err := http.NewRequest(http.MethodGet, server.URL, nil)
	if err != nil {
		println("transport request error:", err.Error())
		return
	}
	transportResp, err := (&http.Transport{}).RoundTrip(transportReq)
	if err != nil {
		println("transport error:", err.Error())
		return
	}
	defer transportResp.Body.Close()
	data, err = io.ReadAll(transportResp.Body)
	if err != nil {
		println("transport read error:", err.Error())
		return
	}
	println("transport status:", transportResp.StatusCode)
	println("transport body:", string(data))
}
