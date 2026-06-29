import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
} from 'firebase/firestore'
import { rubricSchema, type Rubric } from '~/schemas/rubrics'
import { useAuthStore } from '~/stores/auth'

export const useAdminRubrics = () => {
  const db = getFirestore()
  const authStore = useAuthStore()

  const createRubric = async (data: any) => {
    if (authStore.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can manage rubrics.')
    }

    const validatedData = rubricSchema.parse(data)
    const rubricRef = doc(db, 'Rubrics', validatedData.id)
    await setDoc(rubricRef, validatedData)
    return validatedData
  }

  const updateRubric = async (id: string, data: any) => {
    if (authStore.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can manage rubrics.')
    }

    // Force id to match path ID
    const validatedData = rubricSchema.parse({ ...data, id })
    const rubricRef = doc(db, 'Rubrics', id)
    await setDoc(rubricRef, validatedData)
    return validatedData
  }

  const deleteRubric = async (id: string) => {
    if (authStore.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can manage rubrics.')
    }

    const rubricRef = doc(db, 'Rubrics', id)
    await deleteDoc(rubricRef)
  }

  const getAdminRubrics = async (): Promise<Rubric[]> => {
    if (authStore.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can access rubrics.')
    }

    const rubricsRef = collection(db, 'Rubrics')
    const snapshot = await getDocs(rubricsRef)
    if (snapshot.empty) return []

    return snapshot.docs.map((doc) => doc.data() as Rubric)
  }

  const getRubricById = async (id: string): Promise<Rubric | null> => {
    if (authStore.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can access rubrics.')
    }

    const rubricRef = doc(db, 'Rubrics', id)
    const snapshot = await getDoc(rubricRef)
    if (!snapshot.exists()) return null

    return snapshot.data() as Rubric
  }

  return {
    createRubric,
    updateRubric,
    deleteRubric,
    getAdminRubrics,
    getRubricById,
  }
}
