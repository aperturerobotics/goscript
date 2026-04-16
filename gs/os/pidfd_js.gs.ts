import * as $ from "@goscript/builtin/index.js";
import { ErrUnimplemented } from "./error.gs.js";

// JavaScript runtimes do not expose Linux pidfd operations.

export interface SysProcAttr {
	// Process attributes are not modeled for JavaScript pidfd support.
}

export function ensurePidfd(sysAttr: SysProcAttr | null): [SysProcAttr | null, boolean] {
	return [null, false]
}

export function getPidfd(_: SysProcAttr | null, _usePidfd: boolean): [number, boolean] {
	return [0, false]
}

export function pidfdFind(_: number): [number, $.GoError] {
	return [0, ErrUnimplemented]
}
