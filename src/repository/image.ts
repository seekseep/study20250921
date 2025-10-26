import { Image, ImageSchema } from "@/domain/entity/image";
import { CreateImageParameter, DeleteImageParameter, FindImageByIdParameter, UpdateImageParameter, PutImageFileParameter, GetImageFileParameter, DeleteImageByIdParameter } from "@/domain/value/image";
import { AppResult, fail, succeed } from "@/util/result";
import { supabase } from "@/provider/supabase";
import InternalServerError from "@/error/InternalServerError";

function convertRowToImage(row: any): AppResult<Image> {
  try {
    const image = ImageSchema.parse({
      id: row.id,
      fileName: row.file_name,
      path: row.path,
      lineUserId: row.line_user_id,
      lineMessageId: row.line_message_id,
      metaJson: row.meta_json,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })
    return succeed(image)
  } catch (error) {
    return fail(new InternalServerError(`Failed to parse image data`, error))
  }
}

export async function createImage(parameter: CreateImageParameter): Promise<AppResult<Image>> {
  const { data, error } = await supabase
    .from('images')
    .insert({
      file_name: parameter.fileName,
      path: parameter.path,
      line_user_id: parameter.lineUserId,
      line_message_id: parameter.lineMessageId,
      meta_json: parameter.metaJson,
    })
    .select()
    .single();

  if (error) {
    return fail(new InternalServerError(`Failed to create image: ${error.message}`, error));
  }

  return convertRowToImage(data);
}

export async function findImageById(parameter: FindImageByIdParameter): Promise<AppResult<Image | null>> {
  const { data, error } = await supabase
    .from('images')
    .select()
    .eq('id', parameter.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return succeed(null);
    }
    return fail(new InternalServerError(`Failed to find image: ${error.message}`, error));
  }

  const imageResult = convertRowToImage(data);
  if (imageResult.error) return imageResult;

  return succeed(imageResult.data);
}

export async function getAllImages(): Promise<AppResult<Image[]>> {
  const { data, error } = await supabase
    .from('images')
    .select()
    .order('created_at', { ascending: false });

  if (error) {
    return fail(new InternalServerError(`Failed to get images: ${error.message}`, error));
  }

  const images: Image[] = [];
  for (const row of data) {
    const imageResult = convertRowToImage(row);
    if (imageResult.error) return imageResult;
    images.push(imageResult.data);
  }

  return succeed(images);
}

export async function updateImage(parameter: UpdateImageParameter): Promise<AppResult<Image>> {
  const updateData: Record<string, unknown> = {};

  if (parameter.fileName !== undefined) updateData.file_name = parameter.fileName;
  if (parameter.path !== undefined) updateData.path = parameter.path;
  if (parameter.lineUserId !== undefined) updateData.line_user_id = parameter.lineUserId;
  if (parameter.lineMessageId !== undefined) updateData.line_message_id = parameter.lineMessageId;
  if (parameter.metaJson !== undefined) updateData.meta_json = parameter.metaJson;

  const { data, error } = await supabase
    .from('images')
    .update(updateData)
    .eq('id', parameter.id)
    .select()
    .single();

  if (error) {
    return fail(new InternalServerError(`Failed to update image: ${error.message}`, error));
  }

  return convertRowToImage(data);
}

export async function deleteImage(parameter: DeleteImageParameter): Promise<AppResult<void>> {
  const { error } = await supabase
    .from('images')
    .delete()
    .eq('id', parameter.id);

  if (error) {
    return fail(new InternalServerError(`Failed to delete image: ${error.message}`, error));
  }

  return succeed(undefined);
}

export async function deleteImageById(parameter: DeleteImageByIdParameter): Promise<AppResult<void>> {
  const { error } = await supabase
    .from('images')
    .delete()
    .eq('id', parameter.id);

  if (error) {
    return fail(new InternalServerError(`Failed to delete image: ${error.message}`, error));
  }

  return succeed(undefined);
}

export async function putImageFile(parameter: PutImageFileParameter): Promise<AppResult<string>> {
  const path = `images/${parameter.fileName}`

  const { error: uploadError } = await supabase.storage.from('images')
    .upload(path, parameter.buffer, {
      contentType: parameter.contentType,
      upsert: false,
    })

  if (uploadError) return fail(new InternalServerError(`Supabase upload error: ${uploadError.message}`, uploadError))

  return succeed(path)
}

export async function getImageFile(parameter: GetImageFileParameter): Promise<AppResult<Blob>> {
  const { data, error } = await supabase.storage
    .from('images')
    .download(parameter.path)

  if (error) return fail(new InternalServerError(`Failed to get image file: ${error.message}`, error))

  return succeed(data)
}
