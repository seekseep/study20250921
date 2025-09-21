import { saveImage } from "@/app/application/saveImage"
import { AppResult, succeed } from "@/util/result"
import { WebhookEvent } from "@line/bot-sdk"
import { HandleResult } from "./types"

export async function handleWebhookEvents (events: WebhookEvent[]): Promise<AppResult<HandleResult[]>> {
  const results = await Promise.all(events.map(async (event) => {
    if (event.type === 'message' && event.message?.type === 'image') {
      const result = await saveImage({
        messageId: event.message.id,
        userId: event.source.userId
      })
      if (result.error) return { success: false, message: result.error.message }
      return { success: true, message: 'Image saved successfully' }
    }

    return { success: true, message: 'Event type not handled' }
  }))

  return succeed(results)
}
