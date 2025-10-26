import z from "zod";

export const CreateImageParameterSchema = z.object({
  fileName: z.string(),
  path: z.string(),
  lineUserId: z.string().optional(),
  lineMessageId: z.string().optional(),
  metaJson: z.string().optional(),
})
export type CreateImageParameter = z.infer<typeof CreateImageParameterSchema>;

export const FindImageByIdParameterSchema = z.object({
  id: z.string().uuid(),
})
export type FindImageByIdParameter = z.infer<typeof FindImageByIdParameterSchema>;

export const UpdateImageParameterSchema = z.object({
  id: z.string().uuid(),
  fileName: z.string().optional(),
  path: z.string().optional(),
  lineUserId: z.string().optional(),
  lineMessageId: z.string().optional(),
  metaJson: z.string().optional(),
})
export type UpdateImageParameter = z.infer<typeof UpdateImageParameterSchema>;

export const DeleteImageParameterSchema = z.object({
  id: z.string().uuid(),
})
export type DeleteImageParameter = z.infer<typeof DeleteImageParameterSchema>;

export const SaveImageParameterSchema = z.object({
  messageId: z.string(),
  userId: z.string().optional(),
  messageJson: z.string().optional(),
  replyToken: z.string().optional(),
})
export type SaveImageParameter = z.infer<typeof SaveImageParameterSchema>;

export const PutImageFileParameterSchema = z.object({
  fileName: z.string(),
  buffer: z.instanceof(Buffer),
  contentType: z.string(),
})
export type PutImageFileParameter = z.infer<typeof PutImageFileParameterSchema>;

export const GetImageFileParameterSchema = z.object({
  path: z.string(),
})
export type GetImageFileParameter = z.infer<typeof GetImageFileParameterSchema>;

export const DeleteImageByIdParameterSchema = z.object({
  id: z.string().uuid(),
})
export type DeleteImageByIdParameter = z.infer<typeof DeleteImageByIdParameterSchema>;
