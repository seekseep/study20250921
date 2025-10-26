import { getMessageFile, replyMessage } from "@/provider/line"
import { putImageFile, createImage } from "@/repository/image"
import { AppResult, succeed } from "@/util/result"
import { SaveImageParameter } from "@/domain/value/image"

export async function saveImage (input: SaveImageParameter): Promise<AppResult<void>> {
 const getMessageFileResult = await getMessageFile(input.messageId)
  if (getMessageFileResult.error) return getMessageFileResult

  const { buffer, contentType, ext } = getMessageFileResult.data

  const now = Date.now()
  const fileName = `${now}_${input.messageId}.${ext}`

  const putImageFileResult = await putImageFile({
    buffer,
    contentType,
    fileName,
  })
  if (putImageFileResult.error) return putImageFileResult

  const filePath = putImageFileResult.data
  const createImageResult = await createImage({
    fileName: fileName,
    path: filePath,
    lineUserId: input.userId,
    lineMessageId: input.messageId,
    metaJson: input.messageJson
  })
  if (createImageResult.error) return createImageResult

  if (input.replyToken) {
    await replyMessage(input.replyToken, {
      type: 'text',
      text: 'Image saved successfully'
    })
  }

  return succeed(undefined)
}
