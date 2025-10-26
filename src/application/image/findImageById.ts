import { FindImageByIdParameter } from "@/domain/value/image";
import { AppResult } from "@/util/result";
import { Image } from "@/domain/entity/image";
import * as imageRepository from "@/repository/image";

export async function findImageById(parameter: FindImageByIdParameter): Promise<AppResult<Image | null>> {
  return await imageRepository.findImageById(parameter);
}
