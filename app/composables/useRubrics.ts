import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
} from 'firebase/firestore'
import { rubricSchema, type Rubric } from '~/schemas/rubrics'
import { useAuthStore } from '~/stores/auth'

export const useRubrics = () => {
  const db = getFirestore()
  const authStore = useAuthStore()

  const createRubric = async (data: any) => {
    if (!authStore.isAdmin) {
      throw new Error('Unauthorized: Only admins can create rubrics.')
    }

    // Validate data against schema
    const validatedData = rubricSchema.parse(data)

    // Save to Firestore using the provided ID
    const rubricRef = doc(db, 'rubrics', validatedData.id)
    await setDoc(rubricRef, validatedData)

    return validatedData
  }

  const getRubrics = async (): Promise<Rubric[]> => {
    const rubricsRef = collection(db, 'rubrics')
    const snapshot = await getDocs(rubricsRef)

    if (snapshot.empty) {
      return []
    }

    return snapshot.docs.map((doc) => doc.data() as Rubric)
  }

  return {
    createRubric,
    getRubrics,
  }
}
