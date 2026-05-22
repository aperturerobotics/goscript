package main

import "io/fs"

type emptyFS struct{}

func (emptyFS) Open(name string) (fs.File, error) {
	return nil, fs.ErrNotExist
}

type linkFS struct{}

func (linkFS) Open(name string) (fs.File, error) {
	return nil, fs.ErrNotExist
}

func (linkFS) ReadLink(name string) (string, error) {
	return "target.txt", nil
}

func (linkFS) Lstat(name string) (fs.FileInfo, error) {
	return nil, fs.ErrNotExist
}

func main() {
	target, err := fs.ReadLink(linkFS{}, "link")
	println("target:", target, err == nil)

	_, err = fs.ReadLink(emptyFS{}, "link")
	println("unsupported:", err != nil)
}
