import { getMessageFile, replyMessage } from "@/provider/line"
import { saveImageFile, saveImageMeta } from "@/provider/supabase/index"
import { AppResult, succeed } from "@/util/result"

export type SaveImageInput = {
  messageId: string
  userId?: string
  messageJson?: string
  replyToken?: string
}

export async function saveImage (input: SaveImageInput): Promise<AppResult<void>> {
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

  if (input.replyToken) {
    await replyMessage(input.replyToken, {
      type: 'text',
      text: 'Image saved successfully'
    })
  }

  return succeed(undefined)
}
