package main

import (
	"mime"
	"net/http"
	"net/http/httptest"
)

func setAttachment(w http.ResponseWriter, name string) {
	w.Header().Set("Content-Disposition", mime.FormatMediaType("attachment", map[string]string{"filename": name}))
}

func main() {
	w := httptest.NewRecorder()
	w.Header().Set("X-Test", "ok")
	println(w.Header().Get("X-Test"))

	setAttachment(w, "hello.txt")
	println(w.Header().Get("Content-Disposition"))
}
