package main

import (
	"context"
	"io"

	"github.com/aperturerobotics/starpc/srpc"
)

type handler struct{}

func (handler) GetServiceID() string {
	return "svc"
}

func (handler) GetMethodIDs() []string {
	return []string{"method", "stream"}
}

func (handler) InvokeMethod(serviceID, methodID string, strm srpc.Stream) (bool, error) {
	if methodID == "stream" {
		total := 0
		for {
			msg := srpc.NewRawMessage(nil, false)
			err := strm.MsgRecv(msg)
			if err == io.EOF {
				break
			}
			if err != nil {
				return true, err
			}
			total += len(msg.GetData())
		}
		return true, strm.MsgSend(srpc.NewRawMessage([]byte{byte(total)}, false))
	}
	if strm == nil {
		return true, nil
	}
	return true, strm.MsgSend(srpc.NewRawMessage([]byte("ok"), false))
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
	unaryResp := srpc.NewRawMessage(nil, false)
	err := client.ExecCall(context.Background(), "svc", "method", srpc.NewRawMessage(nil, false), unaryResp)
	if err != nil {
		println("exec error:", err.Error())
		return
	}
	println("exec bytes:", len(unaryResp.GetData()))
	strm, err := client.NewStream(context.Background(), "svc", "stream", nil)
	if err != nil {
		println("stream open error:", err.Error())
		return
	}
	_ = strm.MsgSend(srpc.NewRawMessage([]byte{1, 2, 3}, false))
	_ = strm.MsgSend(srpc.NewRawMessage([]byte{4, 5}, false))
	_ = strm.CloseSend()
	resp := srpc.NewRawMessage(nil, false)
	if err := strm.MsgRecv(resp); err != nil {
		println("stream recv error:", err.Error())
		return
	}
	data := resp.GetData()
	if len(data) != 1 {
		println("stream response length:", len(data))
		return
	}
	println("stream bytes:", data[0])
	println("success: native starpc srpc")
}
