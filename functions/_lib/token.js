// Shared time-limited token logic for Cloudflare Pages Functions.
// Token format: base64url(JSON payload) + "." + base64url(HMAC-SHA256(payload, secret))
// payload = { v: 1, exp: <unix seconds> }

const encoder = new TextEncoder()
const decoder = new TextDecoder()

function bytesToB64url(bytes) {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64urlToBytes(str) {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

export async function signToken(secret, ttlSeconds) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds
  const dataB64 = bytesToB64url(encoder.encode(JSON.stringify({ v: 1, exp })))
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(dataB64))
  return dataB64 + '.' + bytesToB64url(new Uint8Array(sig))
}

export async function verifyToken(token, secret) {
  if (!token || typeof token !== 'string' || !secret) return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [dataB64, sigB64] = parts
  let key
  try {
    key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )
  } catch {
    return false
  }
  const ok = await crypto.subtle.verify('HMAC', key, b64urlToBytes(sigB64), encoder.encode(dataB64))
  if (!ok) return false
  let payload
  try {
    payload = JSON.parse(decoder.decode(b64urlToBytes(dataB64)))
  } catch {
    return false
  }
  if (!payload || payload.v !== 1 || !payload.exp) return false
  return Math.floor(Date.now() / 1000) < payload.exp
}

export function getCookie(header, name) {
  if (!header) return null
  for (const part of header.split(';')) {
    const idx = part.indexOf('=')
    if (idx === -1) continue
    const key = part.slice(0, idx).trim()
    if (key === name) return decodeURIComponent(part.slice(idx + 1).trim())
  }
  return null
}
