import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore'
import { assignmentSchema, type Assignment } from '~/schemas/assignments'
import { useAuthStore } from '~/stores/auth'

export const useAssignments = () => {
  const db = getFirestore()
  const authStore = useAuthStore()

  const createAssignment = async (data: any) => {
    if (!authStore.isAdmin) {
      throw new Error('Unauthorized: Only admins can create assignments.')
    }
    const validatedData = assignmentSchema.parse(data)
    const assignmentsRef = collection(db, 'assignments')
    const docRef = await addDoc(assignmentsRef, validatedData)

    return { ...validatedData, id: docRef.id }
  }

  const getAssignments = async (): Promise<Assignment[]> => {
    const assignmentsRef = collection(db, 'assignments')
    const snapshot = await getDocs(assignmentsRef)

    if (snapshot.empty) {
      return []
    }

    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Assignment
    )
  }

  return {
    createAssignment,
    getAssignments,
  }
}
