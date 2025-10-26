import OpenAI from "openai";
import { OPENAI_API_KEY } from "@/constants";
import { AppResult, fail, succeed } from "@/util/result";
import InternalServerError from "@/error/InternalServerError";

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export type SummarizeImageInput = {
  imageUrl: string;
};

export async function summarizeImage(input: SummarizeImageInput): Promise<AppResult<string>> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please summarize the content of this image in Japanese. Provide a concise summary with key points in bullet format.",
            },
            {
              type: "image_url",
              image_url: {
                url: input.imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const summary = response.choices[0]?.message?.content;

    if (!summary) {
      return fail(new InternalServerError("OpenAI did not return a summary"));
    }

    return succeed(summary);
  } catch (error) {
    return fail(new InternalServerError(`Failed to summarize image: ${error instanceof Error ? error.message : String(error)}`, error));
  }
}
