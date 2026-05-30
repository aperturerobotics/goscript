package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"time"
)

func main() {
	h := http.Header{}
	h.Set("content-type", "text/plain")
	h.Add("content-type", "charset=utf-8")
	println("header:", http.CanonicalHeaderKey("x-test"), h.Get("CONTENT-TYPE"), len(h.Values("content-type")))

	major, minor, ok := http.ParseHTTPVersion("HTTP/2.0")
	println("proto:", major, minor, ok)
	println("status:", http.MethodPatch, http.StatusNetworkAuthenticationRequired, http.StatusText(http.StatusNetworkAuthenticationRequired))

	req, err := http.NewRequest(http.MethodPut, "https://example.invalid/path?q=1", http.NoBody)
	if err != nil {
		println("request error:", err.Error())
		return
	}
	req.Header.Set("Cookie", "space=wave")
	println("request:", req.Method, req.URL.Path, req.ProtoAtLeast(1, 1), len(req.Cookies()))

	rec := httptest.NewRecorder()
	http.Error(rec, http.ErrNotSupported.Error(), http.StatusForbidden)
	println("recorder:", rec.Code, rec.Body.String())

	rec = httptest.NewRecorder()
	http.ServeContent(rec, req, "content.txt", time.Time{}, strings.NewReader("served"))
	println("servecontent:", rec.Code, rec.Body.String())

	headReq, err := http.NewRequest(http.MethodHead, "https://example.invalid/content.txt", http.NoBody)
	if err != nil {
		println("head request error:", err.Error())
		return
	}
	rec = httptest.NewRecorder()
	http.ServeContent(rec, headReq, "content.txt", time.Time{}, strings.NewReader("hidden"))
	println("servecontent head:", rec.Code, rec.Body.Len())

	srv := httptest.NewTLSServer(http.NotFoundHandler())
	defer srv.Close()
	println("server:", srv.URL != "", srv.Client() != nil, httptest.DefaultRemoteAddr)
}
