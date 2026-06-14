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
    role: null as string | null,
    isReady: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => state.role === 'admin',
  },

  actions: {
    async fetchUserProfile(firebaseUser: any) {
      if (!firebaseUser) {
        this.profile = null
        this.role = null
        return
      }

      const db = getFirestore()
      try {
        // Check Student collection first
        const studentRef = doc(db, 'Students ', firebaseUser.uid)
        const studentSnap = await getDoc(studentRef)

        if (studentSnap.exists()) {
          this.profile = studentSnap.data()
          this.role = 'student'
        } else {
          const adminRef = doc(db, 'OfficialLogin', firebaseUser.uid)
          const adminSnap = await getDoc(adminRef)

          if (adminSnap.exists()) {
            this.profile = adminSnap.data()
            this.role = 'admin'
          } else {
            const auth = getAuth()
            await signOut(auth)
            this.user = null
            this.profile = null
            this.role = null
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        const auth = getAuth()
        await signOut(auth)
        this.user = null
        this.profile = null
        this.role = null
      }
    },

    initAuth() {
      return new Promise<void>((resolve) => {
        const auth = getAuth()

        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            this.user = firebaseUser
            await this.fetchUserProfile(firebaseUser)
          } else {
            this.user = null
            this.profile = null
            this.role = null
          }

          this.isReady = true
          resolve()
        })
      })
    },

    async login(email: string, password: string) {
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      this.user = userCredential.user
      await this.fetchUserProfile(userCredential.user)
    },

    async logout(redirectTo: string = '/auth/signin') {
      const auth = getAuth()
      await signOut(auth)
      this.role = null
      navigateTo(redirectTo)
    },
  },
})
