import { getMessageFile } from "@/provider/line"
import { saveImageFile, saveImageMeta } from "@/provider/supabase/index"

export async function saveImage (input: { messageId: string, userId?: string, messageJson?: string }) {
 const getMessageFileResult = await getMessageFile(input.messageId)

  if (getMessageFileResult === null) return

  const { buffer, contentType, ext } = getMessageFileResult

  const now = Date.now()
  const fileName = `${now}_${input.messageId}.${ext}`

  const filePath = await saveImageFile({
    buffer,
    contentType,
    fileName,
  })

  await saveImageMeta({
    messageId: input.messageId,
    userId: input.userId,
    fileName: fileName,
    path: filePath,
    messageJson: input.messageJson
  })
}
