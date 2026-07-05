import admin from 'firebase-admin'

export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/admin')) return

  const token = getCookie(event, 'firebase-token')

  if (!token) {
    return sendRedirect(event, '/auth/signin')
  }

  try {
    // Verify the HttpOnly Firebase Session Cookie (with revocation check enabled)
    const decoded = await admin.auth().verifySessionCookie(token, true)

    if (decoded.role !== 'admin') {
      return sendRedirect(event, '/auth/signin')
    }
  } catch (error) {
    return sendRedirect(event, '/auth/signin')
  }
})
