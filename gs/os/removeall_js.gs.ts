import * as $ from "@goscript/builtin/index.js";
import { RemoveAll as removeAllPath } from "./file_js.gs.js";

export function RemoveAll(path: string): $.GoError {
	return removeAllPath(path)
}
