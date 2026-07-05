import admin from 'firebase-admin'

export default defineNitroPlugin(() => {
  const isDev = process.env.NODE_ENV === 'development'

  if (isDev) {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9098'
  }

  if (!admin.apps.length) {
    const adminConfig: admin.AppOptions = {
      projectId: process.env.FIREBASE_PROJECT_ID,
    }

    if (!isDev) {
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        adminConfig.credential = admin.credential.cert(
          JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        )
      } else {
        adminConfig.credential = admin.credential.applicationDefault()
      }
    }

    admin.initializeApp(adminConfig)
    console.log('[Nitro Plugin] Firebase Admin SDK initialized successfully.')
  }
})
