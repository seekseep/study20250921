import { AppResult, succeed } from "@/util/result";
import { NextRequest } from "next/server";
import { validateSignature } from '@line/bot-sdk'
import { fail } from "assert";
import { LINE_CHANNEL_SECRET } from "@/constants";

export async function validateRequestAsText(request: NextRequest): Promise<AppResult<string>> {
  const body = await request.text()
  const signature = request.headers.get('x-line-signature')

  if (!signature) return fail(new Error('Missing x-line-signature'))

  const valid = validateSignature(body, LINE_CHANNEL_SECRET, signature)
  if (!valid) return fail(new Error('Invalid signature'))

  return succeed(body)
}


export async function validateRequestAsJson(request: NextRequest): Promise<AppResult<any>> {
  const body = await request.json()
  const signature = request.headers.get('x-line-signature')

  if (!signature) return fail(new Error('Missing x-line-signature'))

  const bodyString = JSON.stringify(body)
  const valid = validateSignature(bodyString, LINE_CHANNEL_SECRET, signature)
  if (!valid) return fail(new Error('Invalid signature'))

  return succeed(body)
}
