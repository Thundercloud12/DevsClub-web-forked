import { defineStore } from 'pinia'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'

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

      try {
        // Get the initial ID token result to check if custom claims exist
        let tokenResult = await firebaseUser.getIdTokenResult()
        let role = tokenResult.claims.role as string | undefined

        // If claim is missing, invoke the setRoleOnLogin Cloud Function
        if (!role) {
          const functions = getFunctions()
          const setRole = httpsCallable(functions, 'setRoleOnLogin')
          const result = await setRole()
          const resultData = result.data as { role: string | null }

          if (resultData.role) {
            // Force refresh token to update the claims on the client side
            await firebaseUser.getIdToken(true)
            tokenResult = await firebaseUser.getIdTokenResult()
            role = tokenResult.claims.role as string | undefined
          }
        }

        if (role === 'student' || role === 'admin') {
          this.role = role
          const db = getFirestore()
          const collectionName =
            role === 'student' ? 'Students ' : 'OfficialLogin'
          const profileDocRef = doc(db, collectionName, firebaseUser.uid)
          const profileSnap = await getDoc(profileDocRef)

          if (profileSnap.exists()) {
            this.profile = profileSnap.data()
          } else {
            this.profile = null
          }

          // Set the cookie for SSR middleware compatibility
          const token = await firebaseUser.getIdToken()
          const tokenCookie = useCookie('firebase-token', {
            maxAge: 60 * 60 * 24 * 7, // 1 week
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          })
          tokenCookie.value = token
        } else {
          // If no role resolved, sign out the user
          const auth = getAuth()
          await signOut(auth)
          this.user = null
          this.profile = null
          this.role = null

          const tokenCookie = useCookie('firebase-token')
          tokenCookie.value = null
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        const auth = getAuth()
        await signOut(auth)
        this.user = null
        this.profile = null
        this.role = null

        const tokenCookie = useCookie('firebase-token')
        tokenCookie.value = null
      }
    },

    initAuth() {
      return new Promise<void>((resolve) => {
        const auth = getAuth()

        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            this.user = firebaseUser
            await this.fetchUserProfile(firebaseUser)

            // Set the cookie for SSR middleware compatibility
            const token = await firebaseUser.getIdToken()
            const tokenCookie = useCookie('firebase-token', {
              maxAge: 60 * 60 * 24 * 7,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
            })
            tokenCookie.value = token
          } else {
            this.user = null
            this.profile = null
            this.role = null

            const tokenCookie = useCookie('firebase-token')
            tokenCookie.value = null
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

      const tokenCookie = useCookie('firebase-token')
      tokenCookie.value = null

      navigateTo(redirectTo)
    },
  },
})
