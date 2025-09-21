import { LINE_CHANNEL_ACCESS_TOKEN } from '@/constants'
import { streamToBuffer } from '@/middleware/streamToBuffer'
import { messagingApi } from '@line/bot-sdk'
import { fileTypeFromBuffer } from 'file-type'

const {
  MessagingApiClient,
  MessagingApiBlobClient
} = messagingApi

export function getMessagingApiClient () {
  return new MessagingApiClient({
    channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN
  })
}

export function getMessagingApiBlobClient () {
  return new MessagingApiBlobClient({
    channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN
  })
}

export async function getMessageFile (messageId: string) {
  const messagingApiBlobClient = getMessagingApiBlobClient()
  const stream = await messagingApiBlobClient.getMessageContent(messageId)
  const buffer = await streamToBuffer(stream)

  const fileType = await fileTypeFromBuffer(buffer)
  const contentType = fileType?.mime
  if (!contentType) return null

  const ext = fileType?.ext
  if (!ext) return null

  return { buffer, contentType, ext }
}
