# 应先生 · 个人作品集网站

基于 React + Vite 的暗色系个人作品集基础版本，包含首页 Hero、个人经历、精选项目、个人优势、联系收尾页五个模块。

## 运行方式

需要本机已安装 Node.js（18 或更高版本）。

```bash
npm install
npm run dev
```

启动后浏览器访问终端里显示的本地地址（默认 http://localhost:5173）。

## 目录结构

```
├── index.html
├── vite.config.js
├── public/                 # 静态资源（图片、视频、favicon 等）
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── data/site.js        # 全部内容数据（建议先改这里）
    ├── styles/global.css   # 全部样式
    └── components/         # 各页面模块
```

## 替换与自定义

所有文字内容集中在 `src/data/site.js`，直接修改即可。

- **视频背景**：把视频文件放进 `public/`，再把 `src/data/site.js` 中的 `heroVideo` 改成相对地址，例如 `'/hero.mp4'`。未填写时显示当前粒子和渐变背景。
- **头像 / 人物图**：在 `src/components/About.jsx` 的 `.about__avatar-art` 处替换为图片。
- **作品图片**：在 `src/components/Projects.jsx` 的 `.project-card__media-art` 处替换为真实案例图。
- **邮箱**：在 `src/data/site.js` 的 `email` 字段填写后，页面会自动显示「发送邮件」按钮。

版心宽度控制在约 1700px，主要针对 PC 端展示，同时带有基础响应式适配。
