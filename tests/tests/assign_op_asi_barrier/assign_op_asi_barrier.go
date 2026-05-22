package main

func consume(v *[][]byte, n int64) {
	for len(*v) > 0 {
		ln0 := int64(len((*v)[0]))
		if ln0 > n {
			(*v)[0] = (*v)[0][n:]
			return
		}
		n -= ln0
		(*v)[0] = nil
		*v = (*v)[1:]
	}
}

func main() {
	values := [][]byte{{1, 2}, {3}}
	consume(&values, 2)
	println(len(values), values[0] == nil)
}
