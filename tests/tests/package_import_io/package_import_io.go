package main

import (
	"io"
	"sync"
)

type writerHolder struct {
	w io.Writer
}

var asyncWrites sync.Map

type asyncBuffer struct{}

func (b *asyncBuffer) Write(p []byte) (int, error) {
	asyncWrites.Load("last")
	return len(p), nil
}

func (b *asyncBuffer) Reset(w io.Writer) {
	if b == w {
		println("Reset same writer")
		return
	}
	println("Reset different writer")
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
