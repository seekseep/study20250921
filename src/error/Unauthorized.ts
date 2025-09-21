import AppError from "./AppError";

export default class Unauthorized extends AppError {
  constructor(message: string) {
    super(401, 'Unauthorized', message)
  }
}
