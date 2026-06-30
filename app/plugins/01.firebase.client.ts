import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()

  const isDev = process.env.NODE_ENV === 'development' || import.meta.dev

  const app = initializeApp({
    apiKey: config.public.FIREBASE_API_KEY || (isDev ? 'demo-api-key' : ''),
    authDomain:
      config.public.FIREBASE_AUTH_DOMAIN ||
      (isDev ? 'demo-tsec-app.firebaseapp.com' : ''),
    projectId:
      config.public.FIREBASE_PROJECT_ID || (isDev ? 'demo-tsec-app' : ''),
    storageBucket:
      config.public.FIREBASE_STORAGE_BUCKET ||
      (isDev ? 'demo-tsec-app.appspot.com' : ''),
    messagingSenderId:
      config.public.FIREBASE_MESSAGING_SENDER_ID || (isDev ? '1234567890' : ''),
    appId:
      config.public.FIREBASE_APP_ID ||
      (isDev ? '1:1234567890:web:1234567890' : ''),
  })

  const auth = getAuth(app)
  const db = getFirestore(app)
  const functions = getFunctions(app)

  if (isDev) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9098', {
      disableWarnings: true,
    })
    connectFirestoreEmulator(db, '127.0.0.1', 8080)
    connectFunctionsEmulator(functions, '127.0.0.1', 5001)

    console.log('🔥 Connected to Firebase Emulators')
  }

  return {
    provide: {
      auth,
      db,
      functions,
    },
  }
})
