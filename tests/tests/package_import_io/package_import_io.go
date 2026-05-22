package main

import (
	"bytes"
	"io"
	"sync"
)

type writerHolder struct {
	w io.Writer
}

var asyncWrites sync.Map

type asyncBuffer struct{}

type staticReader struct {
	done bool
}

type asyncReader struct {
	done bool
}

func (b *asyncBuffer) Write(p []byte) (int, error) {
	asyncWrites.Load("last")
	return len(p), nil
}

func (r *asyncReader) Read(p []byte) (int, error) {
	asyncWrites.Load("read")
	if r.done {
		return 0, io.EOF
	}
	copy(p, []byte("async"))
	r.done = true
	return 5, nil
}

func (r *staticReader) Read(p []byte) (int, error) {
	if r.done {
		return 0, io.EOF
	}
	copy(p, []byte("copy"))
	r.done = true
	return 4, nil
}

func (b *asyncBuffer) Reset(w io.Writer) {
	if b == w {
		println("Reset same writer")
		return
	}
	println("Reset different writer")
}

func copyInterfaces(dst io.Writer, src io.Reader) (int64, error) {
	return io.Copy(dst, src)
}

func main() {
	// Test basic error variables
	println("EOF:", io.EOF.Error())
	println("ErrClosedPipe:", io.ErrClosedPipe.Error())
	println("ErrShortWrite:", io.ErrShortWrite.Error())
	println("ErrUnexpectedEOF:", io.ErrUnexpectedEOF.Error())

	// Test seek constants
	println("SeekStart:", io.SeekStart)
	println("SeekCurrent:", io.SeekCurrent)
	println("SeekEnd:", io.SeekEnd)

	// Test Discard writer
	n, err := io.WriteString(io.Discard, "hello world")
	println("WriteString to Discard - bytes:", n, "err:", err == nil)

	holder := writerHolder{w: io.Discard}
	n, err = io.WriteString(holder.w, "field writer")
	println("WriteString field writer - bytes:", n, "err:", err == nil)

	buf := &asyncBuffer{}
	buf.Reset(buf)
	buf.Reset(nil)
	n64, err := copyInterfaces(io.Discard, &staticReader{})
	println("Copy interface - bytes:", n64, "err:", err == nil)
	n64, err = io.Copy(io.Discard, struct{ io.Reader }{&staticReader{}})
	println("Copy embedded reader - bytes:", n64, "err:", err == nil)
	n64, err = io.Copy(struct{ io.Writer }{io.Discard}, &staticReader{})
	println("Copy embedded writer - bytes:", n64, "err:", err == nil)
	n64, err = io.Copy(buf, &staticReader{})
	println("Copy async writer - bytes:", n64, "err:", err == nil)
	n64, err = io.CopyN(io.Discard, &asyncReader{}, 5)
	println("CopyN async reader - bytes:", n64, "err:", err == nil)
	n64, err = io.Copy(buf, bytes.NewBuffer([]byte("copy")))
	println("Copy bytes WriteTo async writer - bytes:", n64, "err:", err == nil)
	viewBacking := []byte{0, 0, 0, 0, 99}
	n, err = bytes.NewBuffer([]byte("view")).Read(viewBacking[:4])
	println("Read into byte slice view - bytes:", n, "data:", string(viewBacking), "err:", err == nil)
	var dst bytes.Buffer
	n64, err = io.Copy(&dst, &asyncReader{})
	println("Copy bytes ReadFrom async reader - bytes:", n64, "data:", dst.String(), "err:", err == nil)

	reader, writer := io.Pipe()
	done := make(chan bool, 1)
	go func() {
		buf := make([]byte, 5)
		n, err := reader.Read(buf)
		println("Pipe read - bytes:", n, "data:", string(buf[:n]), "err:", err == nil)
		n, err = reader.Read(buf)
		println("Pipe read EOF - bytes:", n, "err EOF:", err == io.EOF)
		done <- true
	}()
	n, err = writer.Write([]byte("hello"))
	println("Pipe write - bytes:", n, "err:", err == nil)
	err = writer.Close()
	println("Pipe close err:", err == nil)
	<-done
	n, err = writer.Write([]byte("again"))
	println("Pipe write after close - bytes:", n, "err closed:", err == io.ErrClosedPipe)

	println("test finished")
}
