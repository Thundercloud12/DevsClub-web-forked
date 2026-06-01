import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore'
import { ref } from 'vue'
import type { Submission } from '~/schemas/submissions'

export interface LeaderboardEntry {
  studentId: string
  name: string
  totalScore: number
  submissionsCount: number
}

export const useLeaderboard = () => {
  const db = getFirestore()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const getTopStudents = async (
    limitCount: number = 20
  ): Promise<LeaderboardEntry[]> => {
    isLoading.value = true
    error.value = null

    try {
      // 1. Fetch all submissions
      const submissionsRef = collection(db, 'submissions')
      const submissionsSnap = await getDocs(submissionsRef)

      if (submissionsSnap.empty) {
        return []
      }

      const submissions = submissionsSnap.docs.map(
        (doc) => doc.data() as Submission
      )

      // 2. Aggregate scores by student
      const studentStats: Record<
        string,
        { totalScore: number; count: number }
      > = {}

      submissions.forEach((sub) => {
        // Only count evaluated submissions that have scores
        if (sub.status !== 'evaluated' || !sub.scores) return

        const scoreSum = sub.scores!.reduce(
          (sum, criterion) => sum + (criterion.actualScore || 0),
          0
        )

        if (!studentStats[sub.studentId]) {
          studentStats[sub.studentId] = { totalScore: 0, count: 0 }
        }

        studentStats[sub.studentId]!.totalScore += scoreSum
        studentStats[sub.studentId]!.count += 1
      })

      // 3. Convert to array, sort by totalScore descending, and take the top limitCount
      const sortedStudents = Object.entries(studentStats)
        .map(([studentId, stats]) => ({
          studentId,
          totalScore: stats.totalScore,
          submissionsCount: stats.count,
        }))
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, limitCount)

      // 4. Fetch student names in parallel
      const leaderboard = await Promise.all(
        sortedStudents.map(async (entry) => {
          let name = 'Unknown Student'

          try {
            const studentRef = doc(db, 'Students ', entry.studentId)
            const studentSnap = await getDoc(studentRef)

            if (studentSnap.exists()) {
              const data = studentSnap.data()
              name = data.name || 'Unknown Student'
            }
          } catch (err) {
            console.warn(
              `Could not fetch details for student ${entry.studentId}`,
              err
            )
          }

          return {
            ...entry,
            name,
          }
        })
      )

      return leaderboard
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err)
      error.value = err.message || 'Failed to fetch leaderboard'
      return []
    } finally {
      isLoading.value = false
    }
  }

  return {
    getTopStudents,
    isLoading,
    error,
  }
}
