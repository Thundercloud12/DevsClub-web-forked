import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore'
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
    const assignmentsRef = collection(db, 'Assignments')
    const docRef = await addDoc(assignmentsRef, validatedData)

    return { ...validatedData, id: docRef.id }
  }

  const getAssignments = async (): Promise<Assignment[]> => {
    const assignmentsRef = collection(db, 'Assignments')
    try {
      const snapshot = await getDocs(assignmentsRef)

      if (snapshot.empty) {
        return []
      }

      return snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          ...data,
          id: doc.id,
          tracks: data.tracks ?? [],
          // Convert Firestore Timestamps to JS Dates
          submissionsCloseAt:
            data.submissionsCloseAt?.toDate?.() ?? data.submissionsCloseAt,
          timeline: {
            ...data.timeline,
            publishedAt:
              data.timeline?.publishedAt?.toDate?.() ??
              data.timeline?.publishedAt,
            submissionsOpenAt:
              data.timeline?.submissionsOpenAt?.toDate?.() ??
              data.timeline?.submissionsOpenAt,
            submissionsCloseAt:
              data.timeline?.submissionsCloseAt?.toDate?.() ??
              data.timeline?.submissionsCloseAt,
          },
        } as Assignment
      })
    } catch (err) {
      throw err
    }
  }

  const getAssignmentById = async (id: string): Promise<Assignment | null> => {
    const docRef = doc(db, 'Assignments', id)
    const snapshot = await getDoc(docRef)

    if (!snapshot.exists()) return null

    const data = snapshot.data()
    return {
      ...data,
      id: snapshot.id,
      tracks: data.tracks ?? [],
      submissionsCloseAt:
        data.submissionsCloseAt?.toDate?.() ?? data.submissionsCloseAt,
      timeline: {
        ...data.timeline,
        publishedAt:
          data.timeline?.publishedAt?.toDate?.() ?? data.timeline?.publishedAt,
        submissionsOpenAt:
          data.timeline?.submissionsOpenAt?.toDate?.() ??
          data.timeline?.submissionsOpenAt,
        submissionsCloseAt:
          data.timeline?.submissionsCloseAt?.toDate?.() ??
          data.timeline?.submissionsCloseAt,
      },
    } as Assignment
  }

  return {
    createAssignment,
    getAssignments,
    getAssignmentById,
  }
}
