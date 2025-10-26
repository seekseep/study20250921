import { CreateImageParameter } from "@/domain/value/image";
import { AppResult } from "@/util/result";
import { Image } from "@/domain/entity/image";
import * as imageRepository from "@/repository/image";

export async function createImage(parameter: CreateImageParameter): Promise<AppResult<Image>> {
  return await imageRepository.createImage(parameter);
}
