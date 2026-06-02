package main

import (
	"context"
	"io"
	"sync"
	"syscall/js"
	"time"

	"github.com/aperturerobotics/starpc/rpcstream"
	"github.com/aperturerobotics/starpc/srpc"
)

type handler struct{}

func (handler) GetServiceID() string {
	return "svc"
}

func (handler) GetMethodIDs() []string {
	return []string{"method", "stream", "hold", "empty"}
}

func (handler) InvokeMethod(serviceID, methodID string, strm srpc.Stream) (bool, error) {
	if methodID == "empty" {
		return true, strm.MsgSend(srpc.NewRawMessage(nil, false))
	}
	if methodID == "stream" || methodID == "hold" {
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

type streamOpenResult struct {
	stream srpc.Stream
	err    error
}

type streamProbeResult struct {
	total int
	err   string
}

type rpcStreamServerResult struct {
	err string
}

type memoryRpcStream struct {
	ctx         context.Context
	cancel      func()
	recv        <-chan *rpcstream.RpcStreamPacket
	send        chan<- *rpcstream.RpcStreamPacket
	closeSend   sync.Once
	cancelLocal sync.Once
}

type memoryRpcContext struct {
	done chan struct{}
	once sync.Once
}

func newMemoryRpcContext() (*memoryRpcContext, func()) {
	ctx := &memoryRpcContext{done: make(chan struct{})}
	return ctx, func() {
		ctx.once.Do(func() {
			close(ctx.done)
		})
	}
}

func newMemoryRpcStreamPair() (*memoryRpcStream, *memoryRpcStream) {
	aCtx, aCancel := newMemoryRpcContext()
	bCtx, bCancel := newMemoryRpcContext()
	aToB := make(chan *rpcstream.RpcStreamPacket, 16)
	bToA := make(chan *rpcstream.RpcStreamPacket, 16)
	return &memoryRpcStream{
			ctx:    aCtx,
			cancel: aCancel,
			recv:   bToA,
			send:   aToB,
		}, &memoryRpcStream{
			ctx:    bCtx,
			cancel: bCancel,
			recv:   aToB,
			send:   bToA,
		}
}

func (m *memoryRpcContext) Deadline() (time.Time, bool) {
	return time.Time{}, false
}

func (m *memoryRpcContext) Done() <-chan struct{} {
	return m.done
}

func (m *memoryRpcContext) Err() error {
	select {
	case <-m.done:
		return context.Canceled
	default:
		return nil
	}
}

func (m *memoryRpcContext) Value(key any) any {
	return context.Background().Value(key)
}

func (m *memoryRpcStream) Context() context.Context {
	return m.ctx
}

func (m *memoryRpcStream) Send(pkt *rpcstream.RpcStreamPacket) error {
	select {
	case <-m.ctx.Done():
		return context.Canceled
	case m.send <- pkt.CloneVT():
		return nil
	}
}

func (m *memoryRpcStream) Recv() (*rpcstream.RpcStreamPacket, error) {
	select {
	case <-m.ctx.Done():
		return nil, context.Canceled
	case pkt, ok := <-m.recv:
		if !ok {
			return nil, io.EOF
		}
		return pkt, nil
	}
}

func (m *memoryRpcStream) MsgSend(msg srpc.Message) error {
	data, err := msg.MarshalVT()
	if err != nil {
		return err
	}
	return m.Send(&rpcstream.RpcStreamPacket{
		Body: &rpcstream.RpcStreamPacket_Data{Data: data},
	})
}

func (m *memoryRpcStream) MsgRecv(msg srpc.Message) error {
	for {
		pkt, err := m.Recv()
		if err != nil {
			return err
		}
		data := pkt.GetData()
		if len(data) == 0 {
			continue
		}
		return msg.UnmarshalVT(data)
	}
}

func (m *memoryRpcStream) CloseSend() error {
	m.closeSend.Do(func() {
		close(m.send)
	})
	return nil
}

func (m *memoryRpcStream) Close() error {
	_ = m.CloseSend()
	m.cancelLocal.Do(func() {
		m.cancel()
	})
	return nil
}

func openHeldStreams(ctx context.Context, client srpc.Client, count int) ([]srpc.Stream, bool) {
	resultCh := make(chan streamOpenResult, count)
	for i := range count {
		go func(idx int) {
			strm, err := client.NewStream(ctx, "svc", "hold", nil)
			if err == nil {
				err = strm.MsgSend(srpc.NewRawMessage([]byte{byte(idx)}, false))
			}
			resultCh <- streamOpenResult{stream: strm, err: err}
		}(i)
	}

	streams := make([]srpc.Stream, 0, count)
	for range count {
		select {
		case result := <-resultCh:
			if result.err != nil {
				println("hold open error:", result.err.Error())
				return streams, false
			}
			streams = append(streams, result.stream)
		case <-time.After(5 * time.Second):
			println("hold open timeout")
			return streams, false
		}
	}

	return streams, true
}

func closeHeldStreams(streams []srpc.Stream) bool {
	for _, strm := range streams {
		if err := strm.CloseSend(); err != nil {
			println("hold close send error:", err.Error())
			return false
		}
		resp := srpc.NewRawMessage(nil, false)
		if err := strm.MsgRecv(resp); err != nil {
			println("hold recv error:", err.Error())
			return false
		}
		if len(resp.GetData()) != 1 || resp.GetData()[0] != 1 {
			println("hold response mismatch")
			return false
		}
	}
	return true
}

func probeConcurrentStreams(ctx context.Context, client srpc.Client, count int) bool {
	resultCh := make(chan streamProbeResult, count)
	for i := range count {
		go func(idx int) {
			total, err := probeStream(ctx, client, byte(idx+1), byte(idx+2))
			if err != nil {
				resultCh <- streamProbeResult{err: err.Error()}
				return
			}
			resultCh <- streamProbeResult{total: total}
		}(i)
	}

	for i := range count {
		select {
		case result := <-resultCh:
			if result.err != "" {
				println("probe error:", result.err)
				return false
			}
			if result.total != 2 {
				println("probe total mismatch:", i, result.total)
				return false
			}
		case <-time.After(5 * time.Second):
			println("probe timeout:", i)
			return false
		}
	}
	return true
}

func probeStream(ctx context.Context, client srpc.Client, a, b byte) (int, error) {
	strm, err := client.NewStream(ctx, "svc", "stream", nil)
	if err != nil {
		return 0, err
	}
	if err := strm.MsgSend(srpc.NewRawMessage([]byte{a}, false)); err != nil {
		return 0, err
	}
	if err := strm.MsgSend(srpc.NewRawMessage([]byte{b}, false)); err != nil {
		return 0, err
	}
	if err := strm.CloseSend(); err != nil {
		return 0, err
	}
	resp := srpc.NewRawMessage(nil, false)
	if err := strm.MsgRecv(resp); err != nil {
		return 0, err
	}
	data := resp.GetData()
	if len(data) != 1 {
		return len(data), nil
	}
	return int(data[0]), nil
}

func newRoutedRpcStreamClient(ctx context.Context, componentID string, getter rpcstream.RpcStreamGetter, waitAck bool, results chan<- rpcStreamServerResult) srpc.Client {
	return rpcstream.NewRpcStreamClient(func(callCtx context.Context) (*memoryRpcStream, error) {
		client, server := newMemoryRpcStreamPair()
		go func() {
			err := rpcstream.HandleRpcStream(server, getter)
			if err != nil && err != context.Canceled && err != io.EOF {
				select {
				case results <- rpcStreamServerResult{err: err.Error()}:
				default:
				}
			}
		}()
		go func() {
			select {
			case <-ctx.Done():
				_ = client.Close()
				_ = server.Close()
			case <-callCtx.Done():
				_ = client.Close()
				_ = server.Close()
			}
		}()
		return client, nil
	}, componentID, waitAck)
}

func exerciseRpcStreamClientPressure(ctx context.Context) bool {
	mux := srpc.NewMux()
	if err := mux.Register(handler{}); err != nil {
		println("rpcstream pressure register error:", err.Error())
		return false
	}

	results := make(chan rpcStreamServerResult, 8)
	getter := func(ctx context.Context, componentID string, released func()) (srpc.Invoker, func(), error) {
		if componentID != "component-root" && componentID != "component-space" {
			return nil, nil, nil
		}
		return mux, nil, nil
	}

	rootClient := newRoutedRpcStreamClient(ctx, "component-root", getter, true, results)
	held, ok := openHeldStreams(ctx, rootClient, 64)
	if !ok {
		return false
	}

	spaceClient := newRoutedRpcStreamClient(ctx, "component-space", getter, true, results)
	if !probeConcurrentStreams(ctx, spaceClient, 16) {
		return false
	}
	if !closeHeldStreams(held) {
		return false
	}

	select {
	case result := <-results:
		println("rpcstream pressure server error:", result.err)
		return false
	default:
	}
	return true
}

func exerciseRpcStreamHandle() bool {
	client, server := newMemoryRpcStreamPair()
	defer client.Close()
	defer server.Close()

	invoked := make(chan bool, 1)
	done := make(chan error, 1)
	go func() {
		done <- rpcstream.HandleRpcStream(server, func(ctx context.Context, componentID string, released func()) (srpc.Invoker, func(), error) {
			if componentID != "component-a" {
				invoked <- false
				return nil, nil, nil
			}
			return srpc.InvokerFunc(func(serviceID, methodID string, strm srpc.Stream) (bool, error) {
				invoked <- serviceID == "svc" && methodID == "method"
				return true, nil
			}), nil, nil
		})
	}()

	if err := client.Send(&rpcstream.RpcStreamPacket{
		Body: &rpcstream.RpcStreamPacket_Init{
			Init: &rpcstream.RpcStreamInit{ComponentId: "component-a"},
		},
	}); err != nil {
		println("rpcstream init send error:", err.Error())
		return false
	}

	ack, err := client.Recv()
	if err != nil {
		println("rpcstream ack recv error:", err.Error())
		return false
	}
	if ack.GetAck() == nil || ack.GetAck().GetError() != "" {
		println("rpcstream ack mismatch")
		return false
	}

	start, err := srpc.NewCallStartPacket("svc", "method", nil, false).MarshalVT()
	if err != nil {
		println("rpcstream call start marshal error:", err.Error())
		return false
	}
	if err := client.Send(&rpcstream.RpcStreamPacket{
		Body: &rpcstream.RpcStreamPacket_Data{Data: start},
	}); err != nil {
		println("rpcstream call start send error:", err.Error())
		return false
	}

	select {
	case ok := <-invoked:
		if !ok {
			println("rpcstream invoke mismatch")
			return false
		}
	case <-time.After(5 * time.Second):
		println("rpcstream invoke timeout")
		return false
	}

	resp, err := client.Recv()
	if err != nil {
		println("rpcstream response recv error:", err.Error())
		return false
	}
	if resp.GetData() == nil {
		println("rpcstream response missing data")
		return false
	}

	select {
	case err := <-done:
		if err != nil {
			println("rpcstream handle error:", err.Error())
			return false
		}
	case <-time.After(5 * time.Second):
		println("rpcstream handle timeout")
		return false
	}

	return true
}

func exercisePushablePacketWriter() bool {
	var pushed [][]byte
	ended := false
	pushFn := js.FuncOf(func(this js.Value, args []js.Value) any {
		if len(args) != 1 {
			println("push arg count:", len(args))
			return nil
		}
		data := make([]byte, args[0].Length())
		js.CopyBytesToGo(data, args[0])
		pushed = append(pushed, data)
		return nil
	})
	defer pushFn.Release()
	endFn := js.FuncOf(func(this js.Value, args []js.Value) any {
		ended = true
		return nil
	})
	defer endFn.Release()

	writer := srpc.NewPushablePacketWriter(js.ValueOf(map[string]any{
		"push": pushFn,
		"end":  endFn,
	}))
	if err := writer.WritePacket(srpc.NewCallStartPacket("svc", "push", []byte{7, 8, 9}, false)); err != nil {
		println("pushable call-start error:", err.Error())
		return false
	}
	if err := writer.WritePacket(srpc.NewCallCancelPacket()); err != nil {
		println("pushable cancel error:", err.Error())
		return false
	}
	if err := writer.Close(); err != nil {
		println("pushable close error:", err.Error())
		return false
	}
	if !ended {
		println("pushable end missing")
		return false
	}
	if len(pushed) != 2 {
		println("pushable packets:", len(pushed))
		return false
	}

	sawStart := false
	startHandler := srpc.NewPacketDataHandler(func(pkt *srpc.Packet) error {
		start := pkt.GetCallStart()
		if start == nil {
			return io.ErrUnexpectedEOF
		}
		sawStart = start.GetRpcService() == "svc" &&
			start.GetRpcMethod() == "push" &&
			string(start.GetData()) == string([]byte{7, 8, 9})
		return nil
	})
	if err := startHandler(pushed[0]); err != nil {
		println("pushable start decode error:", err.Error())
		return false
	}
	if !sawStart {
		println("pushable start mismatch")
		return false
	}

	sawCancel := false
	cancelHandler := srpc.NewPacketDataHandler(func(pkt *srpc.Packet) error {
		sawCancel = pkt.GetCallCancel()
		return nil
	})
	if err := cancelHandler(pushed[1]); err != nil {
		println("pushable cancel decode error:", err.Error())
		return false
	}
	if !sawCancel {
		println("pushable cancel missing")
		return false
	}

	return true
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	mux := srpc.NewMux()
	_ = mux.Register(handler{})
	_, _ = mux.InvokeMethod("svc", "method", nil)
	_ = closeEmbedded
	_ = recvOne[any]
	_ = srpc.NewRawMessage([]byte{1, 2, 3}, true)
	server := srpc.NewServer(mux)
	client := srpc.NewClient(srpc.NewServerPipe(server))
	unaryResp := srpc.NewRawMessage(nil, false)
	err := client.ExecCall(ctx, "svc", "method", srpc.NewRawMessage(nil, false), unaryResp)
	if err != nil {
		println("exec error:", err.Error())
		return
	}
	println("exec bytes:", len(unaryResp.GetData()))
	strm, err := client.NewStream(ctx, "svc", "stream", nil)
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
	emptyResp := srpc.NewRawMessage(nil, false)
	if err := client.ExecCall(ctx, "svc", "empty", srpc.NewRawMessage(nil, false), emptyResp); err != nil {
		println("empty exec error:", err.Error())
		return
	}
	println("empty exec bytes:", len(emptyResp.GetData()))

	held, ok := openHeldStreams(ctx, client, 32)
	if !ok {
		return
	}
	if !probeConcurrentStreams(ctx, client, 16) {
		return
	}
	if !closeHeldStreams(held) {
		return
	}
	println("pressure streams: ok")
	if !exercisePushablePacketWriter() {
		return
	}
	println("pushable writer: ok")
	if !exerciseRpcStreamHandle() {
		return
	}
	println("rpcstream handle: ok")
	if !exerciseRpcStreamClientPressure(ctx) {
		return
	}
	println("rpcstream pressure: ok")
	println("success: native starpc srpc")
}
