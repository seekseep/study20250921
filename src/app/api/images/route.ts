import { NextRequest, NextResponse } from "next/server";
import { CreateImageParameterSchema } from "@/domain/value/image";
import { createImage } from "@/app/application/image/createImage";
import { getAllImages } from "@/app/application/image/getAllImages";
import { handleError } from "@/middleware/handleError";
import BadRequest from "@/error/BadRequest";

export async function GET() {
  try {
    const result = await getAllImages();

    if (result.error) {
      throw result.error;
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = CreateImageParameterSchema.safeParse(body);

    if (!parseResult.success) {
      throw new BadRequest(`Invalid request body: ${parseResult.error.message}`);
    }

    const result = await createImage(parseResult.data);

    if (result.error) {
      throw result.error;
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
