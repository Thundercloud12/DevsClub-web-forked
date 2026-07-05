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
        let tokenResult = await firebaseUser.getIdTokenResult()
        let role = tokenResult.claims.role as string | undefined

        if (!role) {
          const functions = getFunctions()
          const setRole = httpsCallable(functions, 'setRoleOnLogin')
          const result = await setRole()
          const resultData = result.data as { role: string | null }

          if (resultData.role) {
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

          const token = await firebaseUser.getIdToken()
          await $fetch('/api/auth/session', {
            method: 'POST',
            body: { idToken: token },
          })
        } else {
          const auth = getAuth()
          await signOut(auth)
          this.user = null
          this.profile = null
          this.role = null

          await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        const auth = getAuth()
        await signOut(auth)
        this.user = null
        this.profile = null
        this.role = null

        await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
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
            const wasLoggedIn = !!this.user
            this.user = null
            this.profile = null
            this.role = null

            if (wasLoggedIn) {
              await $fetch('/api/auth/logout', { method: 'POST' }).catch(
                () => {}
              )
            }
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

      // Clear store state immediately and synchronously
      this.user = null
      this.profile = null
      this.role = null

      try {
        await $fetch('/api/auth/logout', { method: 'POST' })
      } catch (error) {
        console.error('Failed to log out on server:', error)
      }

      navigateTo(redirectTo)
    },
  },
})
