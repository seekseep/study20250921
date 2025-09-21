// Create Supabase client (server-side) using Service Role key

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL environment variable')
}
export const SUPABASE_URL = process.env.SUPABASE_URL

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// LINE credentials
if (!process.env.LINE_CHANNEL_SECRET) {
  throw new Error('Missing LINE_CHANNEL_SECRET environment variable')
}
export const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET


if (!process.env.LINE_CHANNEL_ACCESS_TOKEN) {
  throw new Error('Missing LINE_CHANNEL_ACCESS_TOKEN environment variable')
}
export const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN
