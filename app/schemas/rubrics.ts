import { z } from 'zod'

// 1. Zod Schemas
export const criterionSchema = z.object({
  id: z.string().regex(/^[a-z_]+$/, 'ID must be lowercase with underscores'),
  label: z.string().min(1, 'Label is required'),
  type: z.enum(['number', 'boolean', 'scale']),
  maxScore: z.number().int().positive('Max score must be greater than 0'),
  minScore: z.number().int().min(0).default(0),
  description: z.string().optional(),
})

export const rubricSchema = z.object({
  id: z.string().min(1, 'Rubric ID is required'), // Matches Firestore Document ID
  name: z.string().min(3, 'Name must be at least 3 characters'),
  criteria: z
    .array(criterionSchema)
    .min(1, 'At least one criterion is required'),
})

// 2. Inferred TypeScript Types
export type CriterionType = z.infer<typeof criterionSchema>['type']
export type EvaluationCriterion = z.infer<typeof criterionSchema>
export type Rubric = z.infer<typeof rubricSchema>
