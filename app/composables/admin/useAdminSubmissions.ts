import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from 'firebase/firestore'
import {
  submissionSchema,
  gradedCriterionSchema,
  type Submission,
  type GradedCriterion,
} from '~/schemas/submissions'
import { useAuthStore } from '~/stores/auth'

export const useAdminSubmissions = () => {
  const db = getFirestore()
  const authStore = useAuthStore()

  const getAdminSubmissions = async (filters?: {
    assignmentId?: string
    status?: 'pending' | 'evaluated'
  }): Promise<Submission[]> => {
    if (authStore.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can view submissions.')
    }

    const submissionsRef = collection(db, 'Submissions')
    let q = query(submissionsRef)

    const constraints = []
    if (filters?.assignmentId && filters.assignmentId !== 'all') {
      constraints.push(where('assignmentId', '==', filters.assignmentId))
    }
    if (filters?.status) {
      constraints.push(where('status', '==', filters.status))
    }

    if (constraints.length > 0) {
      q = query(submissionsRef, ...constraints)
    }

    const snapshot = await getDocs(q)
    if (snapshot.empty) return []

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        submittedAt: data.submittedAt?.toDate?.() ?? data.submittedAt,
      } as Submission
    })
  }

  const evaluateSubmission = async (
    submissionId: string,
    scores: GradedCriterion[]
  ) => {
    if (authStore.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can evaluate submissions.')
    }

    // 1. Validate the array of graded criteria
    const validatedScores = scores.map((s) => gradedCriterionSchema.parse(s))

    // 2. Calculate the total score
    const totalScore = validatedScores.reduce(
      (sum, item) => sum + item.actualScore,
      0
    )

    // 3. Update in Firestore
    const docRef = doc(db, 'Submissions', submissionId)
    const submissionSnap = await getDoc(docRef)
    if (!submissionSnap.exists()) {
      throw new Error(`Submission with ID ${submissionId} does not exist.`)
    }

    await updateDoc(docRef, {
      scores: validatedScores,
      totalScore,
      status: 'evaluated',
    })

    return {
      id: submissionId,
      scores: validatedScores,
      totalScore,
      status: 'evaluated' as const,
    }
  }

  return {
    getAdminSubmissions,
    evaluateSubmission,
  }
}
