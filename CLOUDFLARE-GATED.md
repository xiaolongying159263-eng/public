# 限时访问版（Cloudflare Pages + Functions）

这套功能给站点加一层「令牌 + 到期」访问控制，**不影响现有 GitHub Pages 版本**。
GitHub Pages 仍公开正常发布；下面的 Cloudflare 版可在您需要"发给特定人、限 30 分钟、过期就打不开"时使用。

> ✅ **已上线**：生产域名 `https://ying-portfolio-gated.pages.dev/`。
> 对该域名访问时：无有效令牌 → `403`「链接已失效」；带有效 `?tk=` 令牌 → 正常打开站点。

## 工作原理

- 每次生成一条**带加密令牌的链接**，令牌内含到期时间（默认 10 分钟）。
- 只有令牌有效时才能打开站点；到期后访问会返回"链接已失效"。
- 要再给下一个人看，就**重新生成一条新链接**。
- 令牌由密钥 `GATE_SECRET` 签名，伪造/篡改会失败。

相关文件：
- `wrangler.toml`：Cloudflare Pages 项目配置（构建输出 `dist`）。
- `functions/_lib/token.js`：令牌签发/校验（签名、验签、过期判断）。
- `functions/_middleware.js`：访问控制中间件，校验 URL 或 Cookie 里的令牌。
- `functions/api/link.js`：`GET /api/link?key=OWNER_KEY` 生成新链接的接口。
- `scripts/make-link.mjs`：本地生成链接的备用脚本。

## 部署（需要您的 Cloudflare 账号）

### 方式 A：连 GitHub 自动部署（推荐）
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **创建** → **Pages**。
2. 选择 **连接到 Git** → 授权后选择本仓库 `xiaolongying159263-eng/public`。
3. 构建设置：
   - Framework preset：**Vite**
   - Build command：`pnpm build`
   - Build output directory：`dist`
4. 项目创建后进入 **Settings → Environment variables**，添加：
   - `GATE_SECRET`：一段随机字符串（建议 32+ 位，`GATE_SECRET` 是密钥，务必保密）
   - `OWNER_KEY`：你私有的"生成链接"口令（只有你能用它发新链接）
5. 部署完成后，你就有一个形如 `https://<project>.pages.dev/` 的域名。

> 若你的 `GATE_SECRET` 需要保密，可在 Pages 里用 **Secrets**（加密存储）而不是普通变量。

### 方式 B：命令行部署（可选）
```bash
npm i -g wrangler      # 或 npx wrangler
wrangler login          # 浏览器里登录你的 Cloudflare 账号
wrangler pages deploy dist --project-name=<project>
# 设置密钥：wrangler pages secret put GATE_SECRET --project-name=<project>
#           wrangler pages secret put OWNER_KEY   --project-name=<project>
```

## 生成并发送链接（两种方法）

### 方法 1：网页接口（最方便）
把下面地址里的 `OWNER_KEY` 换成**你在 Cloudflare 设置的那个口令**（它可作为 Secret 存于 Cloudflare，不写进仓库），在浏览器打开即可拿到一条新链接：
```
https://ying-portfolio-gated.pages.dev/api/link?key=OWNER_KEY&minutes=10
```
返回 JSON：
```json
{ "url": "https://ying-portfolio-gated.pages.dev/?tk=...", "expiresInMinutes": 10 }
```
把其中 `url` 整条发给对方。

### 方法 2：本地脚本（备用）
```bash
cd 工程目录
set GATE_SECRET=你的密钥
set BASE_URL=https://ying-portfolio-gated.pages.dev
set MINUTES=10
node scripts/make-link.mjs
```
脚本会打印一条带令牌的新链接。

## 对方如何查看
- 对方在微信/浏览器打开你发的**带 `?tk=` 的完整链接**即可。
- 令牌有效期内正常浏览；**到期后**同一链接再打开会看到"链接已失效"。
- 想再给他看，就再生成一条新链接发过去。

## 关于微信分享卡片
- 微信抓取链接时会把 `?tk=` 一并带上，只要在有效期内被抓取，卡片能正常显示标题、简介和分享图（`og:*` 标签）。
- 有效期过后，同一链接卡片若还在缓存里，**点击会进入"已失效"页**。
- 注意：微信会缓存卡片；若之前用同一链接分享过，可能仍显示旧的预览，需等待缓存刷新。

## 已知限制与提醒
- **不能精确"30 分钟断开且绝对防破解"**：这是前端+静态部署能做到的合理方案。技术上，知道资源地址的人仍可能绕过（如直接请求静态资源）；如需"真正锁死所有资源"，需将整站通过 Worker 用 `env.ASSETS` 分发，我可以再帮你加固。
- 到期时间是"生成链接时 + 30 分钟"，不是"对方第一次打开后 30 分钟"。若你要"从对方打开那一刻起算 30 分钟"，需要额外存储状态（Cloudflare KV），可再加。
- `GATE_SECRET` 和 `OWNER_KEY` 务必保密；`OWNER_KEY` 泄露会让别人也能生成链接。
