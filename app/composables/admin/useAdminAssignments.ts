import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
} from 'firebase/firestore'
import { assignmentSchema, type Assignment } from '~/schemas/assignments'
import { useAuthStore } from '~/stores/auth'

export const useAdminAssignments = () => {
  const db = getFirestore()
  const authStore = useAuthStore()

  const parseDates = (data: any) => {
    const publishedAt = data.timeline?.publishedAt
      ? new Date(data.timeline.publishedAt)
      : new Date()
    const submissionsOpenAt = data.timeline?.submissionsOpenAt
      ? new Date(data.timeline.submissionsOpenAt)
      : new Date()
    const submissionsCloseAt = data.timeline?.submissionsCloseAt
      ? new Date(data.timeline.submissionsCloseAt)
      : new Date()

    return {
      ...data,
      submissionsCloseAt,
      timeline: {
        publishedAt,
        submissionsOpenAt,
        submissionsCloseAt,
      },
    }
  }

  const createAssignment = async (rawDetails: any) => {
    if (authStore.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can manage assignments.')
    }
    const dataWithDates = parseDates(rawDetails)
    const validatedData = assignmentSchema.parse(dataWithDates)
    const assignmentsRef = collection(db, 'Assignments')
    const docRef = await addDoc(assignmentsRef, validatedData)
    return { ...validatedData, id: docRef.id }
  }

  const updateAssignment = async (id: string, rawDetails: any) => {
    if (authStore.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can manage assignments.')
    }
    const dataWithDates = parseDates(rawDetails)
    const validatedData = assignmentSchema.parse(dataWithDates)
    const docRef = doc(db, 'Assignments', id)

    const { id: _, ...payload } = validatedData as any
    await updateDoc(docRef, payload)
    return { ...validatedData, id }
  }

  const deleteAssignment = async (id: string) => {
    if (authStore.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can manage assignments.')
    }
    const docRef = doc(db, 'Assignments', id)
    await deleteDoc(docRef)
  }

  const getAdminAssignments = async (): Promise<Assignment[]> => {
    if (authStore.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can access these assignments.')
    }
    const assignmentsRef = collection(db, 'Assignments')
    const snapshot = await getDocs(assignmentsRef)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        tracks: data.tracks ?? [],
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
  }

  return {
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAdminAssignments,
  }
}
