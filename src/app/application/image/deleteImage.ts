import { DeleteImageParameter } from "@/domain/value/image";
import { AppResult } from "@/util/result";
import * as imageRepository from "@/repository/image";

export async function deleteImage(parameter: DeleteImageParameter): Promise<AppResult<void>> {
  return await imageRepository.deleteImage(parameter);
}
