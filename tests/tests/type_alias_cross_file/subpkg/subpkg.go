package subpkg

type Value []byte

func (v Value) Clone() Value {
	if v == nil {
		return nil
	}
	p := make(Value, len(v))
	copy(p, v)
	return p
}
