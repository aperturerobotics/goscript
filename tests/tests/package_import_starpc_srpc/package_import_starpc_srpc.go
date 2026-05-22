package main

import (
	"github.com/aperturerobotics/starpc/srpc"
)

type handler struct{}

func (handler) GetServiceID() string {
	return "svc"
}

func (handler) GetMethodIDs() []string {
	return []string{"method"}
}

func (handler) InvokeMethod(serviceID, methodID string, strm srpc.Stream) (bool, error) {
	println("invoked:", serviceID, methodID, strm == nil)
	return true, nil
}

func main() {
	mux := srpc.NewMux()
	err := mux.Register(handler{})
	println("registered:", err == nil)

	handled, err := mux.InvokeMethod("svc", "method", nil)
	println("handled:", handled, err == nil)

	msg := srpc.NewRawMessage([]byte{1, 2, 3}, true)
	data, err := msg.MarshalVT()
	println("raw:", len(data), err == nil)

	server := srpc.NewServer(mux)
	println("server:", server.GetInvoker() != nil)
}
