import { defineStore } from 'pinia'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    profile: null as any,
    isReady: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
  },

  actions: {
    initAuth() {
      return new Promise<void>((resolve) => {
        const auth = getAuth()
        const db = getFirestore()

        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            this.user = firebaseUser

            try {
              const docRef = doc(db, 'Students ', firebaseUser.uid)
              const docSnap = await getDoc(docRef)

              if (docSnap.exists()) {
                this.profile = docSnap.data()
              } else {
                await signOut(auth)
                this.user = null
                this.profile = null
              }
            } catch (error) {
              console.error('Error fetching student profile:', error)
              await signOut(auth)
              this.user = null
              this.profile = null
            }
          } else {
            this.user = null
            this.profile = null
          }

          this.isReady = true
          resolve()
        })
      })
    },

    async login(email: string, password: string) {
      const auth = getAuth()
      await signInWithEmailAndPassword(auth, email, password)
    },

    async logout() {
      const auth = getAuth()
      await signOut(auth)
      navigateTo('/auth/signin')
    },
  },
})
