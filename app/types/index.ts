import type { Assignment } from '~/schemas/assignments'
import type {
  Rubric,
  EvaluationCriterion,
  CriterionType,
} from '~/schemas/rubrics'
import type {
  Submission,
  GradedCriterion,
  SubmissionStatus,
} from '~/schemas/submissions'
import type { Track } from '~/schemas/tracks'

export type {
  Assignment,
  Rubric,
  EvaluationCriterion,
  CriterionType,
  Submission,
  GradedCriterion,
  SubmissionStatus,
  Track,
}

export interface DashboardAssignment extends Assignment {
  id: string
  status: 'upcoming' | 'open' | 'closed'
}

export interface LeaderboardEntry {
  studentId: string
  name: string
  totalScore: number
  submissionsCount: number
}
