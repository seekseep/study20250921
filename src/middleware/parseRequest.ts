import { type WebhookEvent } from "@line/bot-sdk";

export async function parseRequestBody(rawBody: string): Promise<WebhookEvent[] | null> {
  try {
    const body = JSON.parse(rawBody);
    if (body && Array.isArray(body.events)) {
      return body.events as WebhookEvent[];
    }
    return null;
  } catch (error) {
    return null;
  }
}
