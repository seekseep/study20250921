import AppError from "@/error/AppError";

export function handleError <R extends Response>(error: unknown) : R {
  if (error instanceof AppError) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: error.status,
      headers: { 'Content-Type': 'application/json' },
    }) as R
  }

  return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  }) as R
}
