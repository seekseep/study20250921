import ErrorResponse from "./ErrorResponse";

export default class BadRequestErrorResponse extends ErrorResponse {
  constructor(message: string) {
    super(message, 400)
  }
}
