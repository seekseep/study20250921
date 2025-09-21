import { NextRequest } from 'next/server'

import { LINE_CHANNEL_SECRET } from '@/constants'
import BadRequest from '@/error/BadRequest'
import { validateSignature } from '@line/bot-sdk'
import { handleError } from '@/middleware/handleError'
import { parseRequestBody } from '@/middleware/parseRequest'
import { saveImage } from '@/app/application/saveImage'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-line-signature') ?? ''

    if (!validateSignature(rawBody, LINE_CHANNEL_SECRET, signature)) {
     return new BadRequest('Invalid signature')
    }

    const events = await parseRequestBody(rawBody)
    if (!events) {
      return new BadRequest('Invalid request body')
    }

    for (const event of events) {
      if (event.type !== 'message' || event.message?.type !== 'image') {
        console.log('Not an image message, skipping...')
        continue
      }

      const messageId = event.message.id
      const userId = event.source.userId

      await saveImage({ messageId, userId })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    return handleError(error)
  }
}

export async function GET() {
  try {
    return new Response('OK', { status: 200 })
  } catch (error: unknown) {
    return handleError(error)
  }
}
