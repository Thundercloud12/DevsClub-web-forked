import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { ref } from 'vue'
import type { LeaderboardEntry } from '~/types'

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
      // Fetch Assignments, Submissions, and Evaluations (resolve names from Submissions fallback)
      const [assignmentsSnap, submissionsSnap, evaluationsSnap] =
        await Promise.all([
          getDocs(collection(db, 'Assignments')),
          getDocs(collection(db, 'Submissions')),
          getDocs(collection(db, 'Evaluations')),
        ])

      // Filter assignments belonging to the selected track
      const trackAssignmentIds = new Set<string>()
      assignmentsSnap.forEach((docSnap) => {
        const data = docSnap.data()
        const tracks = data.tracks || []
        if (trackId === 'all' || tracks.includes(trackId)) {
          trackAssignmentIds.add(docSnap.id)
        }
      })

      // Build a map of studentId -> studentName from Submissions (guaranteed to contain studentName)
      const studentNames: Record<string, string> = {}
      submissionsSnap.forEach((docSnap) => {
        const data = docSnap.data()
        if (data.studentId && data.studentName) {
          studentNames[data.studentId] = data.studentName
        }
      })

      // Aggregate scores from Evaluations collection
      const studentStats: Record<
        string,
        { name: string; totalScore: number; count: number }
      > = {}

      evaluationsSnap.forEach((docSnap) => {
        const eval_ = docSnap.data()

        // Filter based on selected mode
        if (assignmentId === 'aggregate') {
          if (!trackAssignmentIds.has(eval_.assignmentId)) return
        } else {
          if (eval_.assignmentId !== assignmentId) return
        }

        const score =
          typeof eval_.totalScore === 'number' ? eval_.totalScore : 0
        const sid = eval_.studentId
        const name = studentNames[sid] || eval_.studentName || 'Unknown Student'

        if (!studentStats[sid]) {
          studentStats[sid] = { name, totalScore: 0, count: 0 }
        }

        studentStats[sid]!.totalScore += score
        studentStats[sid]!.count += 1
      })

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
