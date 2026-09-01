// Local link generator (alternative to the deployed /api/link endpoint).
// Usage:
//   set GATE_SECRET=yourSecret
//   set BASE_URL=https://your-project.pages.dev
//   set MINUTES=30
//   node scripts/make-link.mjs
// Prints a fresh, time-limited link to stdout.

import { signToken } from '../functions/_lib/token.js'

const secret = process.env.GATE_SECRET
const base = (process.env.BASE_URL || 'https://your-project.pages.dev').replace(/\/$/, '')
const minutes = Math.max(1, Number(process.env.MINUTES || 30))

if (!secret) {
  console.error('Missing GATE_SECRET. Set it to the same value configured in Cloudflare.')
  process.exit(1)
}

const token = await signToken(secret, minutes * 60)
const url = `${base}/?tk=${encodeURIComponent(token)}`

console.log('有效分钟数:', minutes)
console.log('分享链接:')
console.log(url)
