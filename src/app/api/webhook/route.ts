import { NextRequest } from 'next/server'
import crypto from 'node:crypto'

import { LINE_CHANNEL_ACCESS_TOKEN, LINE_CHANNEL_SECRET, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from '@/app/constants'
import { supabase } from '@/lib/supabase'
import BadRequestErrorResponse from '@/errors/BadRequestResponse'
import InternalServerErrorResponse from '@/errors/InternalServerErrorResponse'
import UnauthorizedResponse from '@/errors/UnauthorizedResponse'

export const runtime = 'nodejs'

function verifyLineSignature(body: string, signature: string, channelSecret: string) {
  const mac = crypto.createHmac('sha256', channelSecret).update(body).digest('base64')
  return mac === signature
}

export async function POST(req: NextRequest) {
  try {
    // Read raw body for signature verification
    const bodyText = await req.text()
    // --- Logging for debugging signature verification ---
    console.log('🔑 LINE_CHANNEL_SECRET exists:', !!LINE_CHANNEL_SECRET)
    console.log('📩 Raw body text:', bodyText)
    const signature = req.headers.get('x-line-signature') || ''
    console.log('📩 Header signature:', signature)
    console.log(
      '📩 Calculated signature:',
      crypto.createHmac('sha256', LINE_CHANNEL_SECRET).update(bodyText).digest('base64')
    )
    if (!signature) {
      return new BadRequestErrorResponse('Missing x-line-signature header')
    }

    if (!LINE_CHANNEL_SECRET || !LINE_CHANNEL_ACCESS_TOKEN) {
      return new InternalServerErrorResponse('LINE env vars missing')
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new InternalServerErrorResponse('Supabase env vars missing')
    }

    if (!verifyLineSignature(bodyText, signature, LINE_CHANNEL_SECRET)) {
      return new UnauthorizedResponse('Invalid signature')
    }

    let body: { events?: any[] }
    try {
      body = JSON.parse(bodyText)
    } catch (e: any) {
      return new BadRequestErrorResponse('Invalid JSON body')
    }
    const events = body.events ?? []
    const results: any[] = []

    for (const event of events) {
      if (event.type !== 'message' || event.message?.type !== 'image') {
        results.push({ ok: true, skipped: true, reason: 'not-an-image' })
        continue
      }

      const messageId = event.message.id as string
      const userId = (event.source && event.source.userId) ? event.source.userId as string : null

      // Fetch image binary from LINE
      const lineRes = await fetch(`https://api-data.line.me/v2/bot/message/${messageId}/content`, {
        headers: {
          Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
        },
      })

      if (!lineRes.ok) {
        results.push({ ok: false, error: `LINE content fetch failed: ${lineRes.status}` })
        continue
      }

      const contentType = lineRes.headers.get('content-type') ?? 'application/octet-stream'
      const arrayBuffer = await lineRes.arrayBuffer()

      // Decide file extension by content-type
      const ext =
        contentType.includes('png') ? 'png' :
        contentType.includes('webp') ? 'webp' :
        contentType.includes('jpeg') || contentType.includes('jpg') ? 'jpg' :
        'bin'

      const ts = Date.now()
      const fileName = `${ts}_${messageId}.${ext}`
      const path = `images/${fileName}`

      // Upload to Supabase Storage bucket "images"
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(path, arrayBuffer, {
          contentType,
          upsert: false,
        })

      if (uploadError) {
        results.push({ ok: false, error: `Supabase upload error: ${uploadError.message}` })
        continue
      }

      // Insert DB row into "images" table
      const { error: dbError } = await supabase.from('images').insert({
        line_user_id: userId,
        line_message_id: messageId,
        file_name: fileName,
        path,
        meta_json: event,
      })

      if (dbError) {
        results.push({ ok: false, error: `DB insert error: ${dbError.message}`, path })
        continue
      }

      results.push({ ok: true, path })
    }

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err?.message ?? 'unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function GET() {
  return new Response('OK', { status: 200 })
}
