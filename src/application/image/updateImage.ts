import { UpdateImageParameter } from "@/domain/value/image";
import { AppResult } from "@/util/result";
import { Image } from "@/domain/entity/image";
import * as imageRepository from "@/repository/image";

export async function updateImage(parameter: UpdateImageParameter): Promise<AppResult<Image>> {
  return await imageRepository.updateImage(parameter);
}
