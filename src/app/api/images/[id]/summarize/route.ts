import { NextRequest, NextResponse } from "next/server";
import { SummarizeImageParameterSchema } from "@/domain/value/image";
import { summarizeImage } from "@/app/application/image/summarizeImage";
import { handleError } from "@/middleware/handleError";
import BadRequest from "@/error/BadRequest";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const parseResult = SummarizeImageParameterSchema.safeParse({ id });

    if (!parseResult.success) {
      throw new BadRequest(`Invalid request parameter: ${parseResult.error.message}`);
    }

    const result = await summarizeImage(parseResult.data);

    if (result.error) {
      throw result.error;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return handleError(error);
  }
}
