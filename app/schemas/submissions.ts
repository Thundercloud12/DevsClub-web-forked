import { z } from 'zod'
import { criterionSchema } from './rubrics'

// 1. Zod Schemas
// Snapshot Pattern: We extend the original criterion to include the actual score
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

export const submissionSchema = z.object({
  id: z.string().min(1, 'Submission ID is required'), // Usually assignmentId_studentId
  assignmentId: z.string().min(1, 'Assignment ID is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  studentName: z.string().min(1, 'Student name is required'),
  githubLink: z
    .string()
    .url('Must be a valid URL')
    .includes('github.com', { message: 'Must be a GitHub repository' }),
  videoLink: z.string().url('Must be a valid URL').nullable().optional(),
  liveUrl: z.string().url('Must be a valid URL').nullable().optional(),
  notes: z
    .string()
    .max(1000, 'Notes must be under 1000 characters')
    .nullable()
    .optional(),
  submittedAt: z.date(),

  // The snapshot of the rubric criteria + the evaluator's actual scores
  scores: z.array(gradedCriterionSchema).optional(),

  status: z.enum(['pending', 'evaluated']),
  totalScore: z.number().nonnegative().nullable().optional(),
})

// 2. Inferred TypeScript Types
export type GradedCriterion = z.infer<typeof gradedCriterionSchema>
export type Submission = z.infer<typeof submissionSchema>
export type SubmissionStatus = z.infer<typeof submissionSchema>['status']
