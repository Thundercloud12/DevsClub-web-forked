import admin from 'firebase-admin'

if (process.env.NODE_ENV === 'development') {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9098'
}

if (!admin.apps.length) {
  let credential

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      credential = admin.credential.cert(serviceAccount)
    } catch (err) {
      console.error(
        'Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:',
        err
      )
    }
  }

  admin.initializeApp({
    credential,
    projectId: process.env.FIREBASE_PROJECT_ID,
  })
}

export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/admin')) return

  const token = getCookie(event, 'firebase-token')

  if (!token) {
    return sendRedirect(event, '/auth/signin')
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token)

    if (decoded.role !== 'admin') {
      return sendRedirect(event, '/auth/signin')
    }
  } catch (error) {
    console.error('SSR Auth Middleware Error:', error)
    return sendRedirect(event, '/auth/signin')
  }
})
