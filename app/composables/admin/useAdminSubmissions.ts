import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore'
import { submissionSchema, type Submission } from '~/schemas/submissions'
import {
  evaluationSchema,
  gradedCriterionSchema,
  type Evaluation,
  type GradedCriterion,
} from '~/schemas/evaluations'
import { useAuthStore } from '~/stores/auth'

export const useAdminSubmissions = () => {
  const db = getFirestore()
  const authStore = useAuthStore()

  // ── Submissions (read-only for admin) ────────────────────────────────────────

  const getAdminSubmissions = async (filters?: {
    assignmentId?: string
    status?: string
  }): Promise<Submission[]> => {
    if (authStore.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can view submissions.')
    }

    const submissionsRef = collection(db, 'Submissions')
    let q = query(submissionsRef)

    const constraints: any[] = []
    if (filters?.assignmentId && filters.assignmentId !== 'all') {
      constraints.push(where('assignmentId', '==', filters.assignmentId))
    }
    if (constraints.length > 0) {
      q = query(submissionsRef, ...constraints)
    }

    const snapshot = await getDocs(q)
    if (snapshot.empty) return []

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      return {
        ...data,
        id: docSnap.id,
        submittedAt: data.submittedAt?.toDate?.() ?? data.submittedAt,
      } as Submission
    })
  }

  const getSubmissionById = async (id: string): Promise<Submission | null> => {
    if (authStore.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can view submissions.')
    }
    const docRef = doc(db, 'Submissions', id)
    const snapshot = await getDoc(docRef)
    if (!snapshot.exists()) return null

    const data = snapshot.data()
    return {
      ...data,
      id: snapshot.id,
      submittedAt: data.submittedAt?.toDate?.() ?? data.submittedAt,
    } as Submission
  }

  // ── Evaluations (admin-only write) ───────────────────────────────────────────

  const getEvaluationBySubmissionId = async (
    submissionId: string
  ): Promise<Evaluation | null> => {
    if (authStore.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can view evaluations.')
    }
    const docRef = doc(db, 'Evaluations', submissionId)
    const snapshot = await getDoc(docRef)
    if (!snapshot.exists()) return null

    const data = snapshot.data()
    return {
      ...data,
      id: snapshot.id,
      evaluatedAt: data.evaluatedAt?.toDate?.() ?? data.evaluatedAt,
    } as Evaluation
  }

  const evaluateSubmission = async (
    submissionId: string,
    submissionAssignmentId: string,
    submissionStudentId: string,
    scores: GradedCriterion[],
    feedback?: string
  ): Promise<Evaluation> => {
    if (authStore.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can evaluate submissions.')
    }

    // Validate each criterion score
    const validatedScores = scores.map((s) => gradedCriterionSchema.parse(s))
    const totalScore = validatedScores.reduce(
      (sum, item) => sum + item.actualScore,
      0
    )

    const evaluation: Evaluation = evaluationSchema.parse({
      id: submissionId,
      submissionId,
      assignmentId: submissionAssignmentId,
      studentId: submissionStudentId,
      scores: validatedScores,
      totalScore,
      feedback: feedback || null,
      evaluatedAt: new Date(),
    })

    // Write ONLY to Evaluations — never touching the Submissions document
    const evalRef = doc(db, 'Evaluations', submissionId)
    await setDoc(evalRef, {
      ...evaluation,
      evaluatedAt: serverTimestamp(),
    })

    return evaluation
  }

  const getAdminEvaluationsForAssignment = async (
    assignmentId: string
  ): Promise<Evaluation[]> => {
    if (authStore.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can view evaluations.')
    }
    const evalsRef = collection(db, 'Evaluations')
    const q = query(evalsRef, where('assignmentId', '==', assignmentId))
    const snapshot = await getDocs(q)
    if (snapshot.empty) return []

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      return {
        ...data,
        id: docSnap.id,
        evaluatedAt: data.evaluatedAt?.toDate?.() ?? data.evaluatedAt,
      } as Evaluation
    })
  }

  // ── Batch delete (for assignment deletion) ────────────────────────────────────

  const deleteSubmissionsByAssignmentId = async (
    assignmentId: string
  ): Promise<number> => {
    if (authStore.role !== 'admin') {
      throw new Error('Unauthorized: Only admins can delete submissions.')
    }

    // Delete submissions
    const submissionsRef = collection(db, 'Submissions')
    const subQ = query(
      submissionsRef,
      where('assignmentId', '==', assignmentId)
    )
    const subSnap = await getDocs(subQ)

    // Delete evaluations for the same assignment
    const evalsRef = collection(db, 'Evaluations')
    const evalsQ = query(evalsRef, where('assignmentId', '==', assignmentId))
    const evalsSnap = await getDocs(evalsQ)

    const allDocs = [...subSnap.docs, ...evalsSnap.docs]
    if (allDocs.length === 0) return 0

    const batchSize = 400
    for (let i = 0; i < allDocs.length; i += batchSize) {
      const batch = writeBatch(db)
      allDocs.slice(i, i + batchSize).forEach((d) => batch.delete(d.ref))
      await batch.commit()
    }

    return subSnap.docs.length
  }

  return {
    getAdminSubmissions,
    getSubmissionById,
    getEvaluationBySubmissionId,
    evaluateSubmission,
    getAdminEvaluationsForAssignment,
    deleteSubmissionsByAssignmentId,
  }
}
