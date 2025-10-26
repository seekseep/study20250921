import { AppResult } from "@/util/result";
import { Image } from "@/domain/entity/image";
import * as imageRepository from "@/repository/image";

export async function getAllImages(): Promise<AppResult<Image[]>> {
  return await imageRepository.getAllImages();
}
