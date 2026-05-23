package main

import (
	"context"

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
	return true, nil
}

type embeddedStream struct {
	srpc.Stream
}

func closeEmbedded(strm embeddedStream) error {
	return strm.CloseSend()
}

func recvOne[T any](strm srpc.StreamRecv[T]) error {
	_, err := strm.Recv()
	return err
}

func main() {
	mux := srpc.NewMux()
	_ = mux.Register(handler{})
	_, _ = mux.InvokeMethod("svc", "method", nil)
	_ = closeEmbedded
	_ = recvOne[any]
	_ = srpc.NewRawMessage([]byte{1, 2, 3}, true)
	server := srpc.NewServer(mux)
	client := srpc.NewClient(srpc.NewServerPipe(server))
	err := client.ExecCall(context.Background(), "svc", "method", srpc.NewRawMessage(nil, false), srpc.NewRawMessage(nil, false))
	if err != nil {
		println("exec error:", err.Error())
		return
	}
	prw := srpc.NewPacketReadWriter(nil)
	prw.ReadPump(nil, nil)
	_ = prw.ReadToHandler(nil)
	println("success: starpc srpc override")
}
