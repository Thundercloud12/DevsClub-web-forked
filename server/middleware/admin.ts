import admin from 'firebase-admin'

// Configure Firebase Admin SDK for local emulator if in development
if (process.env.NODE_ENV === 'development') {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9098'
}

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'demo-tsec-app',
  })
}

export default defineEventHandler(async (event) => {
  // Only run this check for /admin routes
  if (!event.path.startsWith('/admin')) return

  // Get the token from the request cookies
  const token = getCookie(event, 'firebase-token')

  // No token at all → redirect to admin login page
  if (!token) {
    return sendRedirect(event, '/auth/login')
  }

  try {
    // Verify the token using Firebase Admin SDK
    const decoded = await admin.auth().verifyIdToken(token)

    // Token is valid but role isn't admin → redirect to admin login page
    if (decoded.role !== 'admin') {
      return sendRedirect(event, '/auth/login')
    }

    // Role is admin → request continues, page is rendered and sent
  } catch (error) {
    console.error('SSR Auth Middleware Error:', error)
    return sendRedirect(event, '/auth/login')
  }
})
