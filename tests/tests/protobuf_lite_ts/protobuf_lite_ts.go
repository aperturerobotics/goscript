package main

import protobuf_go_lite "github.com/aperturerobotics/protobuf-go-lite"

func main() {
	msg := &ExampleMsg{
		ExampleField: []byte("hello"),
		ExampleText:  "world",
	}

	data, err := msg.MarshalVT()
	if err != nil {
		println("error marshalling:", err.Error())
		return
	}

	println("data:", data)

	out := &ExampleMsg{}
	err = out.UnmarshalVT(data)
	if err != nil {
		println("error unmarshalling:", err.Error())
		return
	}

	println("out:", out)

	jdata, err := msg.MarshalJSON()
	if err != nil {
		println("error marshalling to json:", err.Error())
		return
	}

	println("json marshaled:", string(jdata))

	out = &ExampleMsg{}
	err2 := out.UnmarshalJSON(jdata)
	if err2 != nil {
		println("error unmarshalling from json:", err.Error())
		return
	}

	println("json unmarshaled:", out)

	u32, idx, err := protobuf_go_lite.DecodeVarintUint32([]byte{0xac, 0x02}, 0)
	if err != nil {
		println("error decoding uint32:", err.Error())
		return
	}
	println("varint uint32:", u32, idx)

	i32, idx, err := protobuf_go_lite.DecodeVarintInt32([]byte{0xff, 0xff, 0xff, 0xff, 0x0f}, 0)
	if err != nil {
		println("error decoding int32:", err.Error())
		return
	}
	println("varint int32:", i32, idx)

	i64, idx, err := protobuf_go_lite.DecodeVarintInt64([]byte{0xac, 0x02}, 0)
	if err != nil {
		println("error decoding int64:", err.Error())
		return
	}
	println("varint int64:", i64, idx)

	fixed32, idx, err := protobuf_go_lite.DecodeFixed32([]byte{0x44, 0x33, 0x22, 0x11}, 0)
	if err != nil {
		println("error decoding fixed32:", err.Error())
		return
	}
	println("fixed32:", fixed32, idx)

	fixed, idx, err := protobuf_go_lite.DecodeFixed64(
		[]byte{0x88, 0x77, 0x66, 0x55, 0x44, 0x33, 0x22, 0x11},
		0,
	)
	if err != nil {
		println("error decoding fixed64:", err.Error())
		return
	}
	println("fixed64:", fixed, idx)
}
