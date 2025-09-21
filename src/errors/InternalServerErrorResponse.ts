import ErrorResponse from "./ErrorResponse";

export default class InternalServerErrorResponse extends ErrorResponse {
  constructor(message: string) {
    super(message, 500)
  }
}
