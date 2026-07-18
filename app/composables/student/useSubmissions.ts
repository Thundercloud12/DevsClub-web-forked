import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
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

    if (!data.id && data.assignmentId && data.studentId) {
      data.id = `${data.assignmentId}_${data.studentId}`
    }

    if (!data.status) {
      data.status = 'pending'
    }

    // Re-verify the deadline from Firestore before writing — prevents any client-side bypass
    const assignmentRef = doc(db, 'Assignments', data.assignmentId)
    const assignmentSnap = await getDoc(assignmentRef)

    if (!assignmentSnap.exists()) {
      throw new Error('Assignment not found.')
    }

    const assignmentData = assignmentSnap.data()
    const deadline: Date =
      assignmentData.submissionsCloseAt?.toDate?.() ??
      assignmentData.timeline?.submissionsCloseAt?.toDate?.() ??
      null

    if (!deadline || Date.now() > deadline.getTime()) {
      throw new Error(
        'Submission deadline has passed. No submissions are accepted.'
      )
    }

    const validatedData = submissionSchema.parse(data)

    const expectedId = `${validatedData.assignmentId}_${validatedData.studentId}`
    if (validatedData.id !== expectedId) {
      throw new Error(
        `Submission ID must be in the format {assignmentId}_{studentId}. Expected: ${expectedId}`
      )
    }

    const submissionRef = doc(db, 'Submissions', validatedData.id)
    await setDoc(submissionRef, validatedData)

    return validatedData
  }

  const getSubmissions = async (
    assignmentId?: string
  ): Promise<Submission[]> => {
    const submissionsRef = collection(db, 'Submissions')

    let q: any = query(submissionsRef)
    if (assignmentId) {
      q = query(submissionsRef, where('assignmentId', '==', assignmentId))
    }

    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return []
    }

    return snapshot.docs.map((doc) => {
      const data = doc.data() as Record<string, any>
      return {
        ...data,
        submittedAt: data.submittedAt?.toDate?.() ?? new Date(data.submittedAt),
      } as Submission
    })
  }

  const getSubmissionByUser = async (
    assignmentId: string,
    studentId: string
  ): Promise<Submission | null> => {
    const id = `${assignmentId}_${studentId}`
    const submissionRef = doc(db, 'Submissions', id)
    const snapshot = await getDoc(submissionRef)

    if (!snapshot.exists()) return null
    const data = snapshot.data() as Record<string, any>
    return {
      ...data,
      submittedAt: data.submittedAt?.toDate?.() ?? new Date(data.submittedAt),
    } as Submission
  }

  const getSubmissionsByStudent = async (
    studentId: string
  ): Promise<Submission[]> => {
    const submissionsRef = collection(db, 'Submissions')
    const q = query(submissionsRef, where('studentId', '==', studentId))
    const snapshot = await getDocs(q)

    if (snapshot.empty) return []
    return snapshot.docs.map((doc) => {
      const data = doc.data()
      // Firestore Timestamp to JS Date mapping
      return {
        ...data,
        submittedAt: data.submittedAt?.toDate?.() ?? new Date(data.submittedAt),
      } as Submission
    })
  }

  return {
    createSubmission,
    getSubmissions,
    getSubmissionByUser,
    getSubmissionsByStudent,
  }
}
