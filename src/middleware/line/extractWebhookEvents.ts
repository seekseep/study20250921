import BadRequest from "@/error/BadRequest";
import { AppResult, fail, succeed } from "@/util/result";
import { WebhookEvent } from "@line/bot-sdk";
import { NextRequest } from "next/server";

export async function extractWebhookEvents(request: NextRequest): Promise<AppResult<WebhookEvent[]>> {
  const body = await request.json();
  const events = body.events;
  if (!events || !Array.isArray(events)) {
    return fail(new BadRequest('Invalid request body: missing or invalid events array'));
  }
  return succeed(events);
}
