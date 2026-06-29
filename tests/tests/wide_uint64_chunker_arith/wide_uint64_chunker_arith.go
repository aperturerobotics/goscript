package main

import "io"

// chunker mirrors the content-defined chunker shape that crashed the goscript
// browser build with "Cannot mix BigInt and other types": a uint64 stream
// position advanced from an int chunk size, fed by an io.LimitReader, plus a
// uint64 rolling hash reset to a constant inside the boundary loop.
type chunker struct {
	pos uint64
}

// algorithm reproduces the JC boundary scan: a uint64 rolling hash mixing a
// wide shift, a wide table lookup, wide masks, and a mid-loop constant reset.
func algorithm(data []byte, n int, g []uint64, maskC, maskJ uint64, minSize, jumpLength int) int {
	fp := uint64(0)
	i := minSize
	for i < n {
		fp = (fp << 1) + g[data[i]%uint64Len(g)]
		if (fp & maskJ) == 0 {
			if (fp & maskC) == 0 {
				return i
			}
			fp = 0
			i = i + jumpLength
		} else {
			i++
		}
	}
	return min(i, n)
}

func uint64Len(g []uint64) byte {
	return byte(len(g))
}

func (c *chunker) advance(chunkSize int) {
	c.pos += uint64(chunkSize)
}

func main() {
	g := []uint64{7, 11, 22, 33}
	data := []byte{1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0}
	println("algo", algorithm(data, len(data), g, 0x3, 0x1, 0, 3))

	c := &chunker{}
	var totalSize uint64
	var chkStart uint64

	src := io.LimitReader(newRepeatReader(40), 25)
	buf := make([]byte, 8)
	for {
		nr, err := src.Read(buf)
		if nr > 0 {
			c.advance(nr)
			totalSize += uint64(nr)
			chkStart += uint64(nr)
		}
		if err == io.EOF {
			break
		}
		if err != nil {
			println("err", err.Error())
			return
		}
	}
	println("pos", c.pos)
	println("total", totalSize)
	println("chkStart", chkStart)
}

// repeatReader yields a fixed number of bytes then EOF, like a bounded blob
// source the chunker streams through.
type repeatReader struct {
	remaining int
}

func newRepeatReader(n int) *repeatReader {
	return &repeatReader{remaining: n}
}

func (r *repeatReader) Read(p []byte) (int, error) {
	if r.remaining == 0 {
		return 0, io.EOF
	}
	n := len(p)
	if n > r.remaining {
		n = r.remaining
	}
	for i := 0; i < n; i++ {
		p[i] = byte(i)
	}
	r.remaining -= n
	return n, nil
}
