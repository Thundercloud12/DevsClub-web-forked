import admin from 'firebase-admin'

export default defineEventHandler(async (event) => {
  const sessionCookie = getCookie(event, 'firebase-token')

  if (sessionCookie) {
    try {
      // Decode the session cookie to get user ID (sub) and revoke their refresh tokens
      const decodedClaims = await admin
        .auth()
        .verifySessionCookie(sessionCookie)
      await admin.auth().revokeRefreshTokens(decodedClaims.sub)
    } catch (error) {
      // Ignore errors if the cookie has already expired or is invalid
    }
  }

  // Clear the HttpOnly cookie
  deleteCookie(event, 'firebase-token', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  return { status: 'success' }
})
