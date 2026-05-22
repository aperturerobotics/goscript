package main

import (
	"time"

	json "github.com/aperturerobotics/protobuf-go-lite/json"
)

func readTime(s *json.UnmarshalState) time.Time {
	t := s.ReadTime()
	return *t
}

func main() {
	state := json.NewUnmarshalState([]byte(`"2025-05-15T01:10:42Z"`), json.DefaultUnmarshalerConfig)
	t := readTime(state)
	println("read time", t.UTC().Format(time.RFC3339), state.Err() == nil)
}
