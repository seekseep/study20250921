import { NextRequest, NextResponse } from "next/server";
import { UpdateImageParameterSchema, DeleteImageParameterSchema } from "@/domain/value/image";
import { findImageById } from "@/app/application/image/findImageById";
import { updateImage } from "@/app/application/image/updateImage";
import { deleteImage } from "@/app/application/image/deleteImage";
import { handleError } from "@/middleware/handleError";
import BadRequest from "@/error/BadRequest";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const result = await findImageById({ id });

    if (result.error) {
      throw result.error;
    }

    if (!result.data) {
      return NextResponse.json({
        success: false,
        error: "Image not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    const parseResult = UpdateImageParameterSchema.safeParse({ ...body, id });

    if (!parseResult.success) {
      throw new BadRequest(`Invalid request body: ${parseResult.error.message}`);
    }

    const result = await updateImage(parseResult.data);

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

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const parseResult = DeleteImageParameterSchema.safeParse({ id });

    if (!parseResult.success) {
      throw new BadRequest(`Invalid request parameter: ${parseResult.error.message}`);
    }

    const result = await deleteImage(parseResult.data);

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
