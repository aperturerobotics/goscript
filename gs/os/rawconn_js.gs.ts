import * as $ from "@goscript/builtin/index.js";
import { ErrInvalid } from "./error.gs.js";

type rawConnFile = {
	fd: number
}

export class rawConn {
	constructor(private file: rawConnFile | null) {}

	public Control(f: ((fd: number) => void) | null): $.GoError {
		if (!this.file || this.file.fd < 0) {
			return ErrInvalid
		}
		f?.(this.file.fd)
		return null
	}

	public Read(f: ((fd: number) => boolean) | null): $.GoError {
		if (!this.file || this.file.fd < 0) {
			return ErrInvalid
		}
		f?.(this.file.fd)
		return null
	}

	public Write(f: ((fd: number) => boolean) | null): $.GoError {
		if (!this.file || this.file.fd < 0) {
			return ErrInvalid
		}
		f?.(this.file.fd)
		return null
	}
}

export function newRawConn(file: rawConnFile | null): rawConn {
	return new rawConn(file)
}
