package main

import (
	"fmt"
	"net/netip"
	"syscall"
)

func main() {
	syscall.CloseOnExec(1)
	if err := syscall.SetNonblock(1, true); err != nil {
		fmt.Println("set true:", err)
		return
	}
	if err := syscall.SetNonblock(1, false); err != nil {
		fmt.Println("set false:", err)
		return
	}
	if syscall.F_DUPFD_CLOEXEC != 0 {
		fmt.Println("cloexec supported")
	}
	if false {
		var st syscall.Stat_t
		var buf []byte
		var iovecs []syscall.Iovec
		_, _, _ = syscall.Accept(-1)
		_ = syscall.Close(-1)
		_, _ = syscall.Dup(-1)
		_ = syscall.Fchdir(-1)
		_ = syscall.Fchmod(-1, 0)
		_ = syscall.Fchown(-1, 0, 0)
		_ = syscall.Fstat(-1, &st)
		_ = syscall.Fsync(-1)
		_ = syscall.Ftruncate(-1, 0)
		_, _ = syscall.Pread(-1, buf, 0)
		_, _ = syscall.Pwrite(-1, buf, 0)
		_, _ = syscall.Read(-1, buf)
		_, _ = syscall.ReadDirent(-1, buf)
		_, _, _ = syscall.Recvfrom(-1, buf, 0)
		_, _, _, _, _ = syscall.Recvmsg(-1, buf, buf, 0)
		_, _ = syscall.Seek(-1, 0, 0)
		_, _ = syscall.SendmsgN(-1, buf, buf, nil, 0)
		_ = syscall.Sendto(-1, buf, 0, nil)
		_ = syscall.Shutdown(-1, 0)
		_, _ = syscall.Write(-1, buf)
		_ = syscall.F_DUPFD_CLOEXEC
		_ = syscall.ForkLock
		_ = iovecs
	}
	var sa4 syscall.SockaddrInet4
	addr4 := netip.AddrFrom4(sa4.Addr)
	sa4.Addr = addr4.As4()

	var sa6 syscall.SockaddrInet6
	addr6 := netip.AddrFrom16(sa6.Addr)
	sa6.Addr = addr6.As16()

	fmt.Println("set nonblock ok")
}
