import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin(() => {
  const firebaseConfig = {
    apiKey: useRuntimeConfig().public.firebaseApiKey as string,
    authDomain: useRuntimeConfig().public.firebaseAuthDomain as string,
    databaseURL: useRuntimeConfig().public.firebaseDatabaseUrl as string,
    projectId: useRuntimeConfig().public.firebaseProjectId as string,
    storageBucket: useRuntimeConfig().public.firebaseStorageBucket as string,
    messagingSenderId: useRuntimeConfig().public
      .firebaseMessagingSenderId as string,
    appId: useRuntimeConfig().public.firebaseAppId as string,
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

  const auth = getAuth(app)
  const db = getFirestore(app)
  const storage = getStorage(app)

  return {
    provide: {
      firebaseApp: app,
      auth,
      db,
      storage,
    },
  }
})
