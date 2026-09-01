# 项目总结

## 是什么
应先生 / Mr. Ying 的个人设计作品集网站（Vite + React，含导航、关于、案例、优势、联系我）。

## 两个版本
| 版本 | 地址 | 说明 |
| --- | --- | --- |
| 公开版（GitHub Pages） | `https://xiaolongying159263-eng.github.io/public/` | 所有人可访问，push 到 `main` 自动部署 |
| 限时版（Cloudflare Pages + Functions） | `https://ying-portfolio-gated.pages.dev/` | 需令牌，到期后显示「链接已失效」 |

## 限时访问怎么用
生成一条带令牌的链接（默认 10 分钟，可调 1-1440 分钟）：
```
https://ying-portfolio-gated.pages.dev/api/link?key=<OWNER_KEY>&minutes=<分钟>
```
把返回结果里的 `"url"`（带 `?tk=`）整条发给对方：
- 有效期内可正常浏览；
- 到期后同一链接再打开 = 「链接已失效」；
- 想再给某人看，重新生成一条即可。

`OWNER_KEY` / `GATE_SECRET` 存在 Cloudflare 的 Secrets 里，**未写入仓库**（公开仓库，避免泄露）。

## 关键技术
- 令牌：`HMAC-SHA256` 签名，载荷内含到期时间。
- 相关文件：`functions/_lib/token.js`、`functions/_middleware.js`、`functions/api/link.js`、`scripts/make-link.mjs`、`wrangler.toml`。
- 本站部署在 Cloudflare Pages + Functions，无需单独后端。

## 注意事项
- 有效期从「生成链接那一刻」起算，不是从对方打开起算。
- 微信分享卡片依赖页面 `og:*` 标签，且微信有缓存，同链接可能显示旧预览。
- 国内访问 `.pages.dev` 视网络环境而定，如需稳定可绑已备案域名或迁国内云。
- 密钥务必保密；`OWNER_KEY` 泄露会导致他人也能生成链接。
