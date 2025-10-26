import BadRequest from "@/error/BadRequest";
import { AppResult, fail, succeed } from "@/util/result";
import { WebhookEvent } from "@line/bot-sdk";
import { NextRequest } from "next/server";

export async function extractWebhookEvents(requestBody: any): Promise<AppResult<WebhookEvent[]>> {
  const events = requestBody.events;
  if (!events || !Array.isArray(events)) {
    return fail(new BadRequest('Invalid request body: missing or invalid events array'));
  }
  return succeed(events);
}
