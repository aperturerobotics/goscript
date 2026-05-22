import type * as token from '@goscript/go/token/index.js'

export let StringEnd: ((scanner: any) => token.Pos) | null = null

export function __goscript_set_StringEnd(
  value: ((scanner: any) => token.Pos) | null,
): void {
  StringEnd = value
}
