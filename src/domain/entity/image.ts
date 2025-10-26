import { z } from 'zod';

export const SummarizeStatusSchema = z.enum(['idle', 'processing', 'completed', 'failed']);
export type SummarizeStatus = z.infer<typeof SummarizeStatusSchema>;

export const ImageSchema = z.object({
  id: z.string().uuid(),
  fileName: z.string(),
  path: z.string(),
  lineUserId: z.string().nullable().optional(),
  lineMessageId: z.string().nullable().optional(),
  metaJson: z.string().nullable().optional(),
  uploadedAt: z.string(),
  summarizeStatus: SummarizeStatusSchema.default('idle'),
  summarizeResult: z.string().nullable().optional(),
})

export type Image = z.infer<typeof ImageSchema>;
