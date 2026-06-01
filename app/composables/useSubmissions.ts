import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { submissionSchema, type Submission } from '~/schemas/submissions'
import { useAuthStore } from '~/stores/auth'

export const useSubmissions = () => {
  const db = getFirestore()
  const authStore = useAuthStore()

  const createSubmission = async (data: any) => {
    if (!authStore.isLoggedIn) {
      throw new Error('Unauthorized: You must be logged in to submit.')
    }

    // Automatically generate the composite ID if it's missing but we have assignmentId and studentId
    if (!data.id && data.assignmentId && data.studentId) {
      data.id = `${data.assignmentId}_${data.studentId}`
    }

    // Default status to 'pending' if missing
    if (!data.status) {
      data.status = 'pending'
    }

    // Validate data against schema
    const validatedData = submissionSchema.parse(data)

    // Enforce the composite ID requirement exactly as requested
    const expectedId = `${validatedData.assignmentId}_${validatedData.studentId}`
    if (validatedData.id !== expectedId) {
      throw new Error(
        `Submission ID must be in the format {assignmentId}_{studentId}. Expected: ${expectedId}`
      )
    }

    // Save to Firestore
    const submissionRef = doc(db, 'submissions', validatedData.id)
    await setDoc(submissionRef, validatedData)

    return validatedData
  }

  const getSubmissions = async (
    assignmentId?: string
  ): Promise<Submission[]> => {
    const submissionsRef = collection(db, 'submissions')

    let q: any = query(submissionsRef)
    if (assignmentId) {
      q = query(submissionsRef, where('assignmentId', '==', assignmentId))
    }

    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return []
    }

    return snapshot.docs.map((doc) => doc.data() as Submission)
  }

  return {
    createSubmission,
    getSubmissions,
  }
}
