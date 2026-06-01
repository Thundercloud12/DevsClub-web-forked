import { ref, onMounted, onUnmounted, computed } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, onSnapshot } from 'firebase/firestore'
import type { User } from 'firebase/auth'

export const useStudentProfile = () => {
  const user = ref<User | null>(null)
  const studentProfile = ref<any>(null)
  const isLoading = ref(true)

  const isLoggedIn = computed(() => user.value !== null)

  let authUnsubscribe: (() => void) | null = null
  let docUnsubscribe: (() => void) | null = null

  onMounted(() => {
    const auth = getAuth()
    const db = getFirestore()

    authUnsubscribe = onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser

      if (!currentUser) {
        studentProfile.value = null
        isLoading.value = false
        if (docUnsubscribe) {
          docUnsubscribe()
          docUnsubscribe = null
        }
        return
      }

      const docRef = doc(db, 'Students ', currentUser.uid)

      if (docUnsubscribe) docUnsubscribe()

      docUnsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            studentProfile.value = { id: snapshot.id, ...snapshot.data() }
          } else {
            studentProfile.value = null
          }
          isLoading.value = false
        },
        (error) => {
          console.error('Failed to fetch student profile:', error)
          isLoading.value = false
        }
      )
    })
  })

  onUnmounted(() => {
    if (authUnsubscribe) authUnsubscribe()
    if (docUnsubscribe) docUnsubscribe()
  })

  return {
    user,
    studentProfile,
    isLoggedIn,
    isLoading,
  }
}
