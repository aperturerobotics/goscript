const generatedMainGuard =
  /if\s*\(\s*\$\.isMainScript\s*\(\s*import\.meta\s*\)\s*\)\s*\{\s*(?:await\s+)?main\s*\(\s*\);?\s*\}/g

export function stripGeneratedMainGuard(code) {
  return code.replace(generatedMainGuard, '')
}
