import ErrorResponse from "./ErrorResponse";

export default class UnauthorizedResponse extends ErrorResponse {
  constructor(message: string) {
    super(message, 401)
  }
}
