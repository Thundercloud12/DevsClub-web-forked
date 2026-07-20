import type { Assignment } from '~/schemas/assignments'
import type {
  Rubric,
  EvaluationCriterion,
  CriterionType,
} from '~/schemas/rubrics'
import type { Submission } from '~/schemas/submissions'
import type { Evaluation, GradedCriterion } from '~/schemas/evaluations'
import type { Track } from '~/schemas/tracks'

export type {
  Assignment,
  Rubric,
  EvaluationCriterion,
  CriterionType,
  Submission,
  Evaluation,
  GradedCriterion,
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
