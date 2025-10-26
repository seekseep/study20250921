import { SummarizeImageParameter } from "@/domain/value/image";
import { AppResult, fail } from "@/util/result";
import * as imageRepository from "@/repository/image";
import * as openaiProvider from "@/provider/openai";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from "@/constants";
import InternalServerError from "@/error/InternalServerError";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function summarizeImage(parameter: SummarizeImageParameter): Promise<AppResult<void>> {
  // Get image details
  const imageResult = await imageRepository.findImageById({ id: parameter.id });
  if (imageResult.error) return imageResult;
  if (!imageResult.data) {
    return fail(new InternalServerError("Image not found"));
  }

  const image = imageResult.data;

  // Update status to processing
  const processingResult = await imageRepository.updateImageSummarizeStatus(parameter.id, 'processing');
  if (processingResult.error) return processingResult;

  try {
    // Get public URL for the image
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(image.path);

    // Summarize the image using OpenAI
    const summaryResult = await openaiProvider.summarizeImage({
      imageUrl: urlData.publicUrl,
    });

    if (summaryResult.error) {
      await imageRepository.updateImageSummarizeStatus(parameter.id, 'failed');
      return summaryResult;
    }

    // Update with completed status and result
    return await imageRepository.updateImageSummarizeStatus(
      parameter.id,
      'completed',
      summaryResult.data
    );
  } catch (error) {
    await imageRepository.updateImageSummarizeStatus(parameter.id, 'failed');
    return fail(new InternalServerError(`Failed to summarize image: ${error instanceof Error ? error.message : String(error)}`, error));
  }
}
