export function FormatMediaType(t: string, param: Map<string, string> | Record<string, string> | null): string {
  if (!isToken(t)) {
    return ''
  }
  let out = t
  const entries = param instanceof Map ? Array.from(param.entries()) : Object.entries(param ?? {})
  entries.sort(([a], [b]) => a.localeCompare(b))
  for (const [key, value] of entries) {
    if (!isToken(key)) {
      return ''
    }
    out += formatParam(key, String(value))
  }
  return out
}

function formatParam(key: string, value: string): string {
  if (isToken(value)) {
    return `; ${key}=${value}`
  }
  return `; ${key}*=utf-8''${percentEncode(value)}`
}

function isToken(value: string): boolean {
  return /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/.test(value)
}

function percentEncode(value: string): string {
  let out = ''
  for (const byte of new TextEncoder().encode(value)) {
    if (
      (byte >= 0x30 && byte <= 0x39) ||
      (byte >= 0x41 && byte <= 0x5a) ||
      (byte >= 0x61 && byte <= 0x7a) ||
      byte === 0x21 ||
      byte === 0x23 ||
      byte === 0x24 ||
      byte === 0x26 ||
      byte === 0x2b ||
      byte === 0x2d ||
      byte === 0x2e ||
      byte === 0x5e ||
      byte === 0x5f ||
      byte === 0x60 ||
      byte === 0x7c ||
      byte === 0x7e
    ) {
      out += String.fromCharCode(byte)
      continue
    }
    out += `%${byte.toString(16).toUpperCase().padStart(2, '0')}`
  }
  return out
}
