import AppError from "./AppError";

export default class BadRequest extends AppError {
  constructor(message: string) {
    super(400, 'BadRequest', message)
  }
}
