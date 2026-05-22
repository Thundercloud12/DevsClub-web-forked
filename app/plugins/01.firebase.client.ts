import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()

  const app = initializeApp({
    apiKey: config.public.FIREBASE_API_KEY,
    authDomain: config.public.FIREBASE_AUTH_DOMAIN,
    databaseURL: config.public.FIREBASE_DATABASE_URL,
    projectId: config.public.FIREBASE_PROJECT_ID,
    storageBucket: config.public.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.public.FIREBASE_MESSAGING_SENDER_ID,
    appId: config.public.FIREBASE_APP_ID,
  })

  const auth = getAuth(app)
  const db = getFirestore(app)

  return {
    provide: {
      auth,
      db,
    },
  }
})
