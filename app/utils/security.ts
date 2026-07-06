/**
 * Sanitizes user-provided URLs to prevent DOM-based XSS attacks
 * (e.g. bypassing validation via direct database injection of 'javascript:' links).
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return '#'
  const trimmed = url.trim()

  // Allow only safe web protocols (http, https, mailto) or relative path anchors
  const safeProtocolPattern = /^(https?|mailto):/i

  if (trimmed.startsWith('/') || safeProtocolPattern.test(trimmed)) {
    return trimmed
  }

  // Fallback to safe anchor
  return '#'
}
