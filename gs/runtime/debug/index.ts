export function Stack(): Uint8Array {
  const stack = new Error().stack ?? 'stack trace unavailable'
  return new TextEncoder().encode(stack)
}

export function PrintStack(): void {
  console.error(new TextDecoder().decode(Stack()))
}
