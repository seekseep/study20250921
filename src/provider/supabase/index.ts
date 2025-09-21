import { createClient } from "@supabase/supabase-js";
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from "@/constants";
import InternalServerError from "@/error/InternalServerError";

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export async function saveImageMeta (input: {
  messageId: string
  userId?: string
  fileName: string
  path: string,
  messageJson?: string
}) {
  const { error: dbError } = await supabase.from('images').insert({
    line_user_id: input.userId,
    line_message_id: input.messageId,
    file_name: input.fileName,
    path: input.path,
    meta_json: input.messageJson,
  })

  if (dbError) {
    throw new InternalServerError(`Supabase insert error: ${dbError.message}`, dbError)
  }
}

export async function saveImageFile (input: {
  fileName: string
  buffer: Buffer
  contentType: string
}) {
  const path = `images/${input.fileName}`

  const { error: uploadError } = await supabase.storage.from('images')
    .upload(path, input.buffer, {
      contentType: input.contentType,
      upsert: false,
    })

  if (uploadError) {
    throw new InternalServerError(`Supabase upload error: ${uploadError.message}`, uploadError)
  }

  return path
}
