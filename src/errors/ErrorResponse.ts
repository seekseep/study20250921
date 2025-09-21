export default class ErrorResponse extends Response {
  constructor (message: string, status: number) {
    const data = { success: false, error: message }
    const body = JSON.stringify(data)

    super(body, {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
