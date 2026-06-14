import { z } from 'zod'

export const trackSchema = z.object({
  id: z.string().min(1, 'Track ID is required'),
  name: z.string().min(1, 'Track Name is required'),
})

export type Track = z.infer<typeof trackSchema>
