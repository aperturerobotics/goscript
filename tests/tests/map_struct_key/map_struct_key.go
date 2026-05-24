package main

type requestKey struct {
	soID     string
	inviteID string
	peerID   string
}

func main() {
	status := make(map[requestKey]string)
	status[requestKey{soID: "so-1", inviteID: "inv-1", peerID: "peer-1"}] = "pending"
	status[requestKey{soID: "so-1", inviteID: "inv-1", peerID: "peer-1"}] = "accepted"

	got, ok := status[requestKey{soID: "so-1", inviteID: "inv-1", peerID: "peer-1"}]
	println("same struct key:", got, ok, len(status))

	_, missing := status[requestKey{soID: "so-2", inviteID: "inv-1", peerID: "peer-1"}]
	println("different struct key:", missing)

	delete(status, requestKey{soID: "so-1", inviteID: "inv-1", peerID: "peer-1"})
	_, deleted := status[requestKey{soID: "so-1", inviteID: "inv-1", peerID: "peer-1"}]
	println("deleted struct key:", deleted, len(status))
}
