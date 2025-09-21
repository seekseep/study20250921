import { NextRequest } from 'next/server'

import { handleError } from '@/middleware/handleError'

import { getHealth } from '@/app/application/getHealth'
import { validateRequest } from '@/middleware/line/validateRequest'
import { extractWebhookEvents } from '@/middleware/line/extractWebhookEvents'
import { handleWebhookEvents } from '@/middleware/line/handleWebhookEvents'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const validateRequestResult = await validateRequest(request)
  if (validateRequestResult.error) return handleError(validateRequestResult.error)

  const extractWebhookEventsResult = await extractWebhookEvents(request)
  if (extractWebhookEventsResult.error) return handleError(extractWebhookEventsResult.error)
  const webhookEvents = extractWebhookEventsResult.data

  const handleResult = await handleWebhookEvents(webhookEvents)
  if (handleResult.error) return handleError(handleResult.error)

  return new Response(JSON.stringify(handleResult.data), { status: 200 })
}

export async function GET() {
  const getHealthResult = await getHealth()
  if (getHealthResult.error) return handleError(getHealthResult.error)
  return new Response(getHealthResult.data, { status: 200 })
}
