import { z } from 'zod';

export const ImageSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  path: z.string(),
  lineUserId: z.string().optional(),
  lineMessageId: z.string().optional(),
  metaJson: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Image = z.infer<typeof ImageSchema>;
