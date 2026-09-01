import { verifyToken, getCookie } from './_lib/token.js'

const COOKIE = 'ytok'

function gateHtml() {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>链接已失效</title>
  <style>
    * { box-sizing: border-box; margin: 0; }
    body {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: #07080b; color: #f2eef6; font-family: system-ui, -apple-system, sans-serif;
      text-align: center; padding: 24px;
    }
    .card { max-width: 440px; }
    .mark {
      width: 56px; height: 56px; border-radius: 14px; margin: 0 auto 20px;
      background: linear-gradient(135deg, #f43f4f, #b91c2b); display: flex;
      align-items: center; justify-content: center; font-weight: 800; font-size: 22px; color: #fff;
    }
    h1 { font-size: 26px; margin-bottom: 10px; letter-spacing: .02em; }
    p { color: #a8a2b4; line-height: 1.6; font-size: 15px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="mark">Y</div>
    <h1>链接已失效</h1>
    <p>该分享链接已过期或不可用。若需查看，请联系发送者获取新的链接。</p>
  </div>
</body>
</html>`
}

export async function onRequest(context) {
  const { request, next, env } = context
  const url = new URL(request.url)

  // Let the link-minting API through (it does its own owner-key check).
  if (url.pathname.startsWith('/api/')) return next()

  const token = url.searchParams.get('tk') || getCookie(request.headers.get('cookie'), COOKIE)
  const valid = token ? await verifyToken(token, env.GATE_SECRET || '') : false

  if (valid) {
    const res = await next()
    // When the token arrived via the URL, persist it as a cookie so the
    // page's own asset requests (JS/CSS/images) are also authorized.
    if (url.searchParams.has('tk')) {
      res.headers.append(
        'Set-Cookie',
        `${COOKIE}=${token}; Path=/; Max-Age=3600; HttpOnly; SameSite=Lax; Secure`
      )
    }
    return res
  }

  const wantsHtml = (request.headers.get('accept') || '').includes('text/html')
  if (wantsHtml) {
    return new Response(gateHtml(), {
      status: 403,
      headers: { 'content-type': 'text/html; charset=utf-8' }
    })
  }
  return new Response('Forbidden', { status: 403 })
}
