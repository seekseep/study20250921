'use server'

import { getAllImages, findImageById } from "@/repository/image"
import { FindImageByIdParameter } from "@/domain/value/image"

export async function getImagesAction() {
  return await getAllImages()
}

export async function getImageByIdAction(parameter: FindImageByIdParameter) {
  return await findImageById(parameter)
}
