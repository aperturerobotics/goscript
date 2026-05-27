package main

import (
	"io/fs"
	"testing/fstest"
)

type openOnlyFS struct {
	fsys fstest.MapFS
}

func (o openOnlyFS) Open(name string) (fs.File, error) {
	return o.fsys.Open(name)
}

func main() {
	fsys := fstest.MapFS{
		"b.txt":          {Data: []byte("b")},
		"a.txt":          {Data: []byte("a")},
		"dir/nested.txt": {Data: []byte("nested")},
	}

	entries, err := fs.ReadDir(openOnlyFS{fsys: fsys}, ".")
	if err != nil {
		println("err:", err.Error())
		return
	}
	for _, entry := range entries {
		println(entry.Name(), entry.IsDir())
	}
}
