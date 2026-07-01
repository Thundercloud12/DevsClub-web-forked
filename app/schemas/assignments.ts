import { z } from 'zod'

export const assignmentSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  rubricId: z.string().min(1, 'A grading rubric must be selected'),
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
  submissionsCloseAt: z.date(),
  tracks: z.array(z.string()).default([]),
})

export type Assignment = z.infer<typeof assignmentSchema>
