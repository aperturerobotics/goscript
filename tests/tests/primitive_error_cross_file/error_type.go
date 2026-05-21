package main

type remoteError int

func (e remoteError) Error() string {
	return "remote error"
}
