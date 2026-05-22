package dep

type Ref interface {
	Key() any
}

func ToKey(v Ref) any {
	if v == nil {
		return nil
	}
	return v.Key()
}
