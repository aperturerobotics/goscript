package main

import (
	"archive/zip"
	"bytes"
	"io"
)

func main() {
	var buf bytes.Buffer
	zw := zip.NewWriter(&buf)
	w, err := zw.Create("hello.txt")
	println("create", err == nil)
	n, err := w.Write([]byte("hello"))
	println("write", n, err == nil)
	err = zw.Close()
	println("close", err == nil, buf.Len() > 0)

	zr, err := zip.NewReader(bytes.NewReader(buf.Bytes()), int64(buf.Len()))
	if err != nil {
		println("open error", err.Error())
		return
	}
	println("open", err == nil, len(zr.File))
	rc, err := zr.File[0].Open()
	println("file open", err == nil)
	data, err := io.ReadAll(rc)
	println("file", zr.File[0].Name, string(data), err == nil)
	err = rc.Close()
	println("file close", err == nil)
}
