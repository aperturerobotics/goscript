package main

import (
	"bufio"
	"fmt"
	"io"
	"net/http"
	"strings"
)

func main() {
	requestWire := "POST /chunk HTTP/1.1\r\n" +
		"Host: example.com\r\n" +
		"Transfer-Encoding: chunked\r\n" +
		"X-Test: one\r\n" +
		"X-Test: two\r\n" +
		"\r\n" +
		"5\r\nhello\r\n0\r\n\r\n"
	req, err := http.ReadRequest(bufio.NewReader(strings.NewReader(requestWire)))
	if err != nil {
		fmt.Println("request error:", err)
		return
	}
	reqBody, reqBodyErr := io.ReadAll(req.Body)
	fmt.Printf("request %s %s %s %s %d %d %s %d %d %t %d %q %v\n",
		req.Method,
		req.Host,
		req.URL.Path,
		req.URL.RawQuery,
		req.ProtoMajor,
		req.ProtoMinor,
		req.UserAgent(),
		len(req.Header.Values("X-Test")),
		req.ContentLength,
		req.Close,
		len(req.TransferEncoding),
		string(reqBody),
		reqBodyErr,
	)

	responseWire := "HTTP/1.1 201 Created\r\n" +
		"Content-Type: text/plain\r\n" +
		"Content-Length: 5\r\n" +
		"\r\n" +
		"hello"
	resp, err := http.ReadResponse(bufio.NewReader(strings.NewReader(responseWire)), req)
	if err != nil {
		fmt.Println("response error:", err)
		return
	}
	respBody, respBodyErr := io.ReadAll(resp.Body)
	fmt.Printf("response %s %d %d %d %s %d %t %d %q %v\n",
		resp.Status,
		resp.StatusCode,
		resp.ProtoMajor,
		resp.ProtoMinor,
		resp.Header.Get("Content-Type"),
		resp.ContentLength,
		resp.Close,
		len(resp.TransferEncoding),
		string(respBody),
		respBodyErr,
	)
}
