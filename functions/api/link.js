import { signToken } from '../_lib/token.js'

// GET /api/link?key=<OWNER_KEY>&minutes=10  ->  { url, expiresInMinutes, token }
// Only the site owner (who knows OWNER_KEY) may mint fresh, time-limited links.
export async function onRequestGet(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const key = url.searchParams.get('key') || request.headers.get('x-owner-key') || ''

  if (key !== (env.OWNER_KEY || '')) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' }
    })
  }

  const minutes = Math.max(1, Math.min(1440, Number(url.searchParams.get('minutes') || 10)))
  const token = await signToken(env.GATE_SECRET || '', minutes * 60)
  const link = `${url.origin}/?tk=${encodeURIComponent(token)}`

  return new Response(JSON.stringify({ url: link, expiresInMinutes: minutes, token }), {
    headers: { 'content-type': 'application/json' }
  })
}
