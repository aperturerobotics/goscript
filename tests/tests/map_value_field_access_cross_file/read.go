package main

func ReadValue(key string) string {
	return Storage[key].Value
}
