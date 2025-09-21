import AppError from "./AppError";

export default class InternalServerError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(500, 'InternalServerError', message, cause)
  }
}
