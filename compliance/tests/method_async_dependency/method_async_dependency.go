package main

type Decoder struct{}

// value is async because it uses channels
func (d *Decoder) value() error {
	ch := make(chan int)
	ch <- 42
	return nil
}

// array calls value, so it should also be async
func (d *Decoder) array() error {
	if err := d.value(); err != nil {
		return err
	}
	return nil
}

func main() {
	d := &Decoder{}
	if err := d.array(); err != nil {
		println("Error:", err.Error())
	} else {
		println("Success")
	}
}
