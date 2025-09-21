import { AppResult, succeed } from "@/util/result";
import { NextRequest } from "next/server";
import { validateSignature } from '@line/bot-sdk'
import { fail } from "assert";
import { LINE_CHANNEL_SECRET } from "@/constants";

export async function validateRequest(request: NextRequest): Promise<AppResult<void>> {
  const body = await request.text()
  const signature = request.headers.get('x-line-signature')

  if (!signature) return fail(new Error('Missing x-line-signature'))

  const valid = validateSignature(body, LINE_CHANNEL_SECRET, signature)
  if (!valid) return fail(new Error('Invalid signature'))

  return succeed(undefined)
}
