import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()

  const isDev = process.env.NODE_ENV === 'development' || import.meta.dev

  const app = initializeApp({
    apiKey: config.public.FIREBASE_API_KEY,
    authDomain: config.public.FIREBASE_AUTH_DOMAIN,
    projectId: config.public.FIREBASE_PROJECT_ID,
    storageBucket: config.public.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.public.FIREBASE_MESSAGING_SENDER_ID,
    appId: config.public.FIREBASE_APP_ID,
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
