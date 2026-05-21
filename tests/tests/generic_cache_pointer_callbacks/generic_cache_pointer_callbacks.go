package main

type cache[K, V any] struct {
	stored *V
}

func (c *cache[K, V]) Get(k *K, new func() (*V, error), check func(*V) bool) (*V, error) {
	if c.stored != nil && check(c.stored) {
		return c.stored, nil
	}
	v, err := new()
	if err != nil {
		return nil, err
	}
	c.stored = v
	return v, nil
}

type key struct {
	N int
}

type privateKey struct {
	D int
}

var privateKeyCache cache[key, privateKey]

func privateKeyToCache(k *key) (*privateKey, error) {
	return privateKeyCache.Get(k, func() (*privateKey, error) {
		return &privateKey{D: k.N}, nil
	}, func(v *privateKey) bool {
		return v.D == k.N
	})
}

func main() {
	k := &key{N: 7}
	v, err := privateKeyToCache(k)
	if err != nil {
		panic(err)
	}
	println("cached:", v.D)
}
