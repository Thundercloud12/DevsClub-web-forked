import admin from 'firebase-admin'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const idToken = body?.idToken

  if (!idToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'ID Token is required',
    })
  }

  try {
    // 1. Verify the ID token to authenticate the user and retrieve role custom claims
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const isAdmin = decodedToken.role === 'admin'

    // 2. Set role-based session duration
    // Admin: 1 day (86400000 ms), Student: 14 days (1209600000 ms)
    const expiresIn = isAdmin
      ? 1000 * 60 * 60 * 24 * 1
      : 1000 * 60 * 60 * 24 * 14

    // 3. Create the session cookie
    const sessionCookie = await admin.auth().createSessionCookie(idToken, {
      expiresIn,
    })

    // 4. Set the HttpOnly cookie
    setCookie(event, 'firebase-token', sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return { status: 'success' }
  } catch (error: any) {
    console.error('Failed to create Firebase session cookie:', error)
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Invalid ID Token or session creation failed',
    })
  }
})
