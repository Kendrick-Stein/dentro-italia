# Dentro l’Italia

一位男老师和三位学生穿行在意大利名画与雕塑中的互动式意大利语学习故事。

## 本地运行

需要 Node.js 22.13 或更高版本。

```bash
npm install
npm run dev
```

构建与检查：

```bash
npm test
```

## GitHub Pages 发布

仓库已包含 `.github/workflows/deploy-pages.yml`。推送到 `main` 后，GitHub Actions 会构建静态站点并把 `out/` 发布到 GitHub Pages；也可以在 Actions 页面手动运行。

首次发布时，在仓库 **Settings → Pages → Build and deployment** 中把 Source 设为 **GitHub Actions**。项目页会使用仓库子路径，例如 `https://用户名.github.io/dentro-italia/`。

## 修改内容

- 旅程章节、意大利语小课、人物标题：`app/story.ts`
- 页面结构与互动：`app/page.tsx`
- 视觉与响应式样式：`app/globals.css`
- 名画与雕塑：`public/artworks/`
- 四位人物：`public/characters/`
- 分享封面：`public/og.png`

人物当前以角色代称展示，后续可在 `app/story.ts` 的 `travelers` 中替换为老师和同学的真实姓名或昵称。

## 新增旅程章节

在 `app/story.ts` 的 `chapters` 数组中复制一个章节对象，然后修改：

- `title` / `titleZh`：意大利语与中文标题
- `narrative`：学习故事
- `image`：画作路径
- `lesson`：短语、解释和关键词
- `characters`：人物在画面中的位置与大小

人物使用百分比定位，`size` 建议保持在 `9%–15%`，这样会像藏在画中的小角色，不会盖住作品。

## 素材与署名

画作和雕塑图片来自 Wikimedia Commons。页面底部的 `ARTWORK CREDITS` 列出了每件使用作品的来源；带 CC BY / CC0 许可的摄影作品也已单独标注。角色插画为本项目生成。

## 主要交互

- 全屏滚动叙事与章节路线
- 名画中的四人小角色
- 点击式意大利语小课
- 浏览器意大利语语音朗读
- 键盘上下章节导航
- 移动端布局与 `prefers-reduced-motion` 降级
- Open Graph / X 分享封面
