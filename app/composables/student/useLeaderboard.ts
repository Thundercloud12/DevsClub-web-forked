import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { ref } from 'vue'
import type { Submission, LeaderboardEntry } from '~/types'

export const useLeaderboard = () => {
  const db = getFirestore()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const getTopStudents = async (
    trackId: string = 'all',
    assignmentId: string = 'aggregate',
    limitCount: number = 20
  ): Promise<LeaderboardEntry[]> => {
    isLoading.value = true
    error.value = null

    try {
      // 1. Fetch Assignments and Submissions in parallel
      const [assignmentsSnap, submissionsSnap] = await Promise.all([
        getDocs(collection(db, 'Assignments')),
        getDocs(collection(db, 'Submissions')),
      ])

      // 2. Filter assignments belonging to the selected track
      const trackAssignmentIds = new Set<string>()
      assignmentsSnap.forEach((doc) => {
        const data = doc.data()
        const tracks = data.tracks || []
        if (trackId === 'all' || tracks.includes(trackId)) {
          trackAssignmentIds.add(doc.id)
        }
      })

      // 3. Aggregate evaluated submissions
      const studentStats: Record<
        string,
        { name: string; totalScore: number; count: number }
      > = {}

      submissionsSnap.forEach((docSnapshot) => {
        const sub = docSnapshot.data() as Submission
        if (sub.status !== 'evaluated') return

        // Filter based on selected mode
        if (assignmentId === 'aggregate') {
          // Must belong to an assignment in the active track
          if (!trackAssignmentIds.has(sub.assignmentId)) return
        } else {
          // Must match the selected single assignment ID
          if (sub.assignmentId !== assignmentId) return
        }

        // Determine score using the denormalized totalScore, falling back to criteria sum if null
        let score = 0
        if (typeof sub.totalScore === 'number') {
          score = sub.totalScore
        } else if (sub.scores) {
          score = sub.scores.reduce(
            (sum, criterion) => sum + (criterion.actualScore || 0),
            0
          )
        }

        if (!studentStats[sub.studentId]) {
          studentStats[sub.studentId] = {
            name: sub.studentName || 'Unknown Student',
            totalScore: 0,
            count: 0,
          }
        }

        studentStats[sub.studentId]!.totalScore += score
        studentStats[sub.studentId]!.count += 1
      })

      // 4. Convert stats map to sorted list
      const leaderboard: LeaderboardEntry[] = Object.entries(studentStats)
        .map(([studentId, stats]) => ({
          studentId,
          name: stats.name,
          totalScore: stats.totalScore,
          submissionsCount: stats.count,
        }))
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, limitCount)

      return leaderboard
    } catch (err: any) {
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
