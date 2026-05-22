import { signInWithEmailAndPassword, signOut } from 'firebase/auth'

import { collection, getDocs, query, where } from 'firebase/firestore'
import type { Auth } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'

import { ROLE_CONFIG } from '~/utils/roleCollections'
import { useUserStore } from '~/stores/user'
import type { UserRole } from '~/stores/user'

export const useAuth = () => {
  const { $auth, $db } = useNuxtApp() as {
    $auth: Auth
    $db: Firestore
  }

  const userStore = useUserStore()

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      const credential = await signInWithEmailAndPassword(
        $auth,
        email,
        password
      )

      const firebaseUser = credential.user

      const roleConfig = ROLE_CONFIG[role]

      const collectionRef = collection($db, roleConfig.collection)

      const q = query(collectionRef, where('email', '==', email))

      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        throw new Error('User record not found')
      }

      const userDoc = snapshot.docs[0]
      if (!userDoc) {
        throw new Error('User record not found')
      }
      const userData = userDoc.data()

      if (roleConfig.requiresTypeCheck && userData.type !== role) {
        throw new Error('Unauthorized role access')
      }

      userStore.setUser({
        uid: firebaseUser.uid,
        name: userData.name || '',
        email: firebaseUser.email || '',
        role,
      })

      return {
        success: true,
      }
    } catch (error) {
      console.error(error)

      return {
        success: false,
        error,
      }
    }
  }

  const logout = async () => {
    try {
      await signOut($auth)

      userStore.clearUser()

      await navigateTo('/')
    } catch (error) {
      console.error(error)
    }
  }

  return {
    login,
    logout,
  }
}
