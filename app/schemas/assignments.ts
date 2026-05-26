import { z } from 'zod'

// 1. Zod Schemas
const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Must be a valid URL'),
  type: z.enum(['youtube', 'gdrive', 'link']),
})

export const assignmentSchema = z.object({
  id: z.string().optional(), // Optional on creation, populated after saving to Firestore
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  rubricId: z.string().min(1, 'A grading rubric must be selected'),
  resources: z.array(resourceSchema),
  timeline: z
    .object({
      publishedAt: z.date(),
      submissionsOpenAt: z.date(),
      submissionsCloseAt: z.date(),
    })
    .refine((data) => data.submissionsCloseAt > data.submissionsOpenAt, {
      message: 'Close date must be after open date',
      path: ['submissionsCloseAt'],
    }),
})

// 2. Inferred TypeScript Types
export type ResourceType = z.infer<typeof resourceSchema>['type']
export type Resource = z.infer<typeof resourceSchema>
export type Assignment = z.infer<typeof assignmentSchema>
