export function formatCompileError(err) {
  if (!Array.isArray(err?.diagnostics) || err.diagnostics.length === 0) {
    return err?.message || 'compile failed'
  }
  return err.diagnostics.map(formatDiagnostic).join('; ')
}

export function formatDiagnostic(diagnostic) {
  const parts = []
  const position = diagnostic?.position
  if (position?.line > 0) {
    const file = position.displayFile || position.file
    if (file) {
      parts.push(`${file}:${position.line}${position.column > 0 ? `:${position.column}` : ''}`)
    }
  }
  if (diagnostic?.code) {
    parts.push(diagnostic.code)
  }
  const message = diagnostic?.message || 'compile failed'
  let text = parts.length === 0 ? message : `${parts.join(': ')}: ${message}`
  if (diagnostic?.detail) {
    text += ` (${diagnostic.detail})`
  }
  return text
}
