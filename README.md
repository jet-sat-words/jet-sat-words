# Jet的SAT核心词

160 个 List、1600 个 SAT 核心词。可以搜索和按 List 浏览，在星图里看见整本词书，并用 FSRS 做间隔重复。进度只存在浏览器里，不需要注册。

每个词条包含英式与美式音标、中文和英文释义、SAT 风格例句与中译、搭配、词族、近义词、反义词、词根或构词说明，以及易混辨析。没有配图，也不打包录音。点击「美」时，浏览器用本机英文语音朗读（`en-US`）。

界面与学习流程改编自 [designfuchen/word-atlas](https://github.com/designfuchen/word-atlas)（MIT，版权声明见 `LICENSE`）。本仓库地址：[jet-sat-words/jet-sat-words](https://github.com/jet-sat-words/jet-sat-words)。

## 本地开发

```bash
npm install
npm run dev
```

开发服务器默认在 `http://localhost:5188`。

重新从 `data/sat-words.json` 生成站内词库：

```bash
npm run build:catalog
```

## 部署到 Vercel

1. 把这个仓库导入 Vercel。
2. Framework Preset 选 **Vite**。
3. Build Command：`npm run build`
4. Output Directory：`dist`
5. 不要设置子路径。站点部署在域名根目录（`base` 为 `/`）。

也可以直接使用仓库里的 `vercel.json`。推送到 `main` 后，Vercel 会自动构建静态站点。
