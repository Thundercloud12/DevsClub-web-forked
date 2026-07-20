import { z } from 'zod'
import { criterionSchema } from './rubrics'

// Graded criterion: rubric criterion + actualScore assigned by admin
export const gradedCriterionSchema = criterionSchema
  .extend({
    actualScore: z.number().nonnegative('Score cannot be negative'),
  })
  .refine((data) => data.actualScore <= data.maxScore, {
    message: 'Score cannot exceed the maximum score',
    path: ['actualScore'],
  })
  .refine((data) => data.actualScore >= data.minScore, {
    message: 'Score cannot be less than the minimum score',
    path: ['actualScore'],
  })

// A single evaluation record written ONLY by admins
export const evaluationSchema = z.object({
  id: z.string().min(1), // same as submissionId
  submissionId: z.string().min(1),
  assignmentId: z.string().min(1),
  studentId: z.string().min(1),
  scores: z.array(gradedCriterionSchema),
  totalScore: z.number().nonnegative(),
  feedback: z.string().max(1000).nullable().optional(),
  evaluatedAt: z.date(),
})

export type GradedCriterion = z.infer<typeof gradedCriterionSchema>
export type Evaluation = z.infer<typeof evaluationSchema>
