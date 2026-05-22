package main

import "io"

type Server struct{}

func (*Server) Handle(rwc io.ReadWriteCloser) {
	rwc.Close()
}
