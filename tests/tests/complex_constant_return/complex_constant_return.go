package main

func zeroComplex() (complex128, error) {
	return 0, nil
}

func oneComplex() complex128 {
	return 1
}

func zeroImag() complex128 {
	return 0i
}

func complexPair() (complex128, complex128) {
	return 1 + 2i, -1i
}

func main() {
	z, err := zeroComplex()
	println(int(real(z)), int(imag(z)), err == nil)
	o := oneComplex()
	println(int(real(o)), int(imag(o)))
	zi := zeroImag()
	println(int(real(zi)), int(imag(zi)), zi == 0+0i)
	a, b := complexPair()
	println(int(real(a)), int(imag(a)), int(real(b)), int(imag(b)), a != b)
}
