import { NextRequest } from 'next/server'

import { LINE_CHANNEL_SECRET } from '@/constants'
import BadRequest from '@/error/BadRequest'
import { validateSignature } from '@line/bot-sdk'
import { handleError } from '@/middleware/handleError'
import { parseRequestBody } from '@/middleware/parseRequest'
import { saveImage } from '@/app/application/saveImage'
import Unauthorized from '@/error/Unauthorized'
import { getHealth } from '@/app/application/getHealth'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-line-signature')

    if (!signature) throw new BadRequest('Missing x-line-signature')

    const valid = validateSignature(rawBody, LINE_CHANNEL_SECRET, signature)
    if (!valid) throw new Unauthorized('Invalid signature')


    const events = await parseRequestBody(rawBody)
    if (!events) throw new BadRequest('Invalid request body')


    for (const event of events) {
      if (event.type !== 'message' || event.message?.type !== 'image') continue


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
    const health = await getHealth()
    return new Response(health, { status: 200 })
  } catch (error: unknown) {
    return handleError(error)
  }
}
