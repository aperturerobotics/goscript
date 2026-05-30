package main

import (
	"bytes"
	"errors"
	"go/scanner"
	"hash"
	"math/bits"
	"mime"
	"os"
	"strconv"
	"strings"
	"time"
	"unicode"

	"compress/zlib"
	"encoding/json"
)

type xof struct{}

func (xof) Write(p []byte) (int, error) { return len(p), nil }
func (xof) Read(p []byte) (int, error)  { return len(p), nil }
func (xof) Reset()                      {}
func (xof) BlockSize() int              { return 1 }

var _ hash.XOF = xof{}

func main() {
	var compact bytes.Buffer
	_ = json.Compact(&compact, []byte(`{ "x" : 1 }`))
	raw := json.RawMessage(compact.Bytes())
	rawBytes, _ := raw.MarshalJSON()
	num, _ := json.Number("42").Int64()
	println("json:", json.Valid(rawBytes), string(rawBytes), num)

	mediaType, params, _ := mime.ParseMediaType("text/plain; charset=utf-8")
	println("mime:", mediaType, params["charset"], mime.TypeByExtension(".json"), mime.BEncoding.Encode("utf-8", "hi"))

	parsed, _ := strconv.ParseComplex("(1-2i)", 128)
	println("time:", time.RFC1123, time.May.String())
	println(
		"leaf:",
		bits.Rem32(1, 0, 3),
		strings.ToValidUTF8("abc", "?"),
		strconv.FormatComplex(parsed, 'f', -1, 128),
		int(real(parsed)),
		int(imag(parsed)),
		zlib.NoCompression,
		os.ErrNoHandle.Error(),
		strings.ToUpperSpecial(unicode.TurkishCase, "go"),
		strings.ToUpperSpecial(unicode.TurkishCase, "iki") == "\u0130K\u0130",
	)

	var scan bytes.Buffer
	scanner.PrintError(&scan, errors.New("scan failed"))
	println("scanner:", strings.TrimSpace(scan.String()))

	var h hash.XOF = xof{}
	println("hash:", h.BlockSize())
}
