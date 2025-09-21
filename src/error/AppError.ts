export default class AppError extends Error {
  name: string
  status: number
  message: string
  cause?: unknown;

  constructor (
    status: number,
    name: string,
    message: string,
    cause?: unknown
  ) {
    super(message)
    this.name = name
    this.status = status
    this.message = message
    this.cause = cause
  }
}
