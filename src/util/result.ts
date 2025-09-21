import AppError from "@/error/AppError"

export type AppResult <T> = {
  data: T
  error: null
} | {
  data: null
  error: AppError
}

export function succeed<T>(data: T): AppResult<T> {
  return { data, error: null }
}

export function fail<T>(error: AppError): AppResult<T> {
  return { data: null, error }
}
