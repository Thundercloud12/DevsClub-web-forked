import { ZodError } from 'zod'

export function formatErrorMessage(error: any): string {
  if (error instanceof ZodError) {
    return error.issues.map((e) => e.message).join(', ')
  }

  // Handle serialized Zod errors (JSON array strings)
  if (
    error &&
    typeof error.message === 'string' &&
    error.message.trim().startsWith('[')
  ) {
    try {
      const parsed = JSON.parse(error.message)
      if (Array.isArray(parsed) && parsed[0]?.message) {
        return parsed.map((e: any) => e.message).join(', ')
      }
    } catch {
      // Pass through if parsing fails
    }
  }

  return error?.message || 'An unexpected error occurred.'
}
