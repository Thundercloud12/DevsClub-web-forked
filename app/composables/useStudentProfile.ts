import { doc } from 'firebase/firestore'

export const useStudentProfile = () => {
  const user = useCurrentUser()
  const db = useFirestore()

  const studentProfile = useDocument(
    computed(() => {
      if (!user.value) return null
      return doc(db, 'Students ', user.value.uid)
    })
  )

  return {
    user,
    studentProfile,
    isLoggedIn: computed(() => user.value !== null),
  }
}
