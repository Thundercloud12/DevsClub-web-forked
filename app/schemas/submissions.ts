import { z } from 'zod'

// A submission is ONLY the student-authored content.
// Evaluation results live in the separate Evaluations collection.
export const submissionSchema = z.object({
  id: z.string().min(1, 'Submission ID is required'),
  assignmentId: z.string().min(1, 'Assignment ID is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  studentName: z.string().min(1, 'Student name is required'),
  gradyear: z.string().nullable().optional(),
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
})

// Re-export evaluation types from their dedicated schema file
export { gradedCriterionSchema, evaluationSchema } from './evaluations'
export type { GradedCriterion, Evaluation } from './evaluations'

// Inferred TypeScript types
export type Submission = z.infer<typeof submissionSchema>
