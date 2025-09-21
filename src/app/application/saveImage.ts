import { getMessageFile } from "@/provider/line"
import { saveImageFile, saveImageMeta } from "@/provider/supabase/index"
import { AppResult, succeed } from "@/util/result"

export async function saveImage (input: { messageId: string, userId?: string, messageJson?: string }): Promise<AppResult<void>> {
 const getMessageFileResult = await getMessageFile(input.messageId)
  if (getMessageFileResult.error) return getMessageFileResult

  const { buffer, contentType, ext } = getMessageFileResult.data

  const now = Date.now()
  const fileName = `${now}_${input.messageId}.${ext}`

  const saveImageFileResult = await saveImageFile({
    buffer,
    contentType,
    fileName,
  })
  if (saveImageFileResult.error) return saveImageFileResult

  const filePath = saveImageFileResult.data
  const saveImageMetaResult = await saveImageMeta({
    messageId: input.messageId,
    userId: input.userId,
    fileName: fileName,
    path: filePath,
    messageJson: input.messageJson
  })
  if (saveImageMetaResult.error) return saveImageMetaResult

  return succeed(undefined)
}
