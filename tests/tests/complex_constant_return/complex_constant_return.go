package main

func zeroComplex() (complex128, error) {
	return 0, nil
}

func oneComplex() complex128 {
	return 1
}

func main() {
	z, err := zeroComplex()
	println(int(real(z)), int(imag(z)), err == nil)
	o := oneComplex()
	println(int(real(o)), int(imag(o)))
}
