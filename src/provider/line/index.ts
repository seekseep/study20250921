import { LINE_CHANNEL_ACCESS_TOKEN } from '@/constants'
import BadRequest from '@/error/BadRequest'
import { AppResult, succeed } from '@/util/result'
import { streamToBuffer } from '@/util/streamToBuffer'
import { messagingApi } from '@line/bot-sdk'
import { fail } from 'assert'
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

type MessageFile = {
  buffer: Buffer<ArrayBufferLike>
  contentType: string
  ext: string
}

export async function getMessageFile (messageId: string): Promise<AppResult<MessageFile>> {
  const messagingApiBlobClient = getMessagingApiBlobClient()
  const stream = await messagingApiBlobClient.getMessageContent(messageId)
  const buffer = await streamToBuffer(stream)

  const fileType = await fileTypeFromBuffer(buffer)
  const contentType = fileType?.mime
  if (!contentType) return fail(new BadRequest('Cannot determine file type'))

  const ext = fileType?.ext
  if (!ext) return fail(new BadRequest('Cannot determine file extension'))

  return succeed({ buffer, contentType, ext })
}
