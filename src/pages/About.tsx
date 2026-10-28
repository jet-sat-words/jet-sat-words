import { ArrowUpRight, Database, Github, Heart } from "lucide-react";
import { useAtlas } from "../atlas/context";
import { PRODUCT_NAME, REPO_URL } from "../config";

const BASE = import.meta.env.BASE_URL;

export function About() {
  const atlas = useAtlas();
  return (
    <div className="page about">
      <header className="about-hero">
        <img src={`${BASE}brand/og.webp`} alt="" />
        <div>
          <p className="eyebrow">关于 {PRODUCT_NAME}</p>
          <h1 className="display">{PRODUCT_NAME}</h1>
          <p className="lede">
            {PRODUCT_NAME} 收录 {atlas.topics.length} 个 List、{atlas.count.toLocaleString()} 个 SAT 核心词。每个词有音标、中文释义和英文释义。按 List 浏览，在星图里看见整本词书，再用 FSRS 安排复习。
          </p>
          <p className="lede">进度存在这台设备的浏览器里，不需要注册。发音在没有录音时使用设备语音。</p>
          <div className="about-actions">
            <a className="btn btn-primary" href={REPO_URL} target="_blank" rel="noreferrer">
              <Github size={18} /> 在 GitHub 上查看
            </a>
            <a className="btn btn-ghost" href={`${REPO_URL}/blob/main/data/sat-words.json`} target="_blank" rel="noreferrer">
              <Database size={18} /> 下载词库 JSON
            </a>
          </div>
        </div>
      </header>

      <div className="about-grid">
        <section className="panel">
          <h3 className="eyebrow">怎么学</h3>
          <ul className="feature-list">
            <li>
              <b>按 List 走。</b>160 个 List，每组 10 个词，顺序就是词书的顺序。
            </li>
            <li>
              <b>再想起来。</b>选义、听音辨词、拼写。认识一个，就在星图上点亮一颗星。
            </li>
            <li>
              <b>快忘的时候再见。</b>FSRS 是开源的间隔重复算法，只在你快要遗忘时安排复习。
            </li>
            <li>
              <b>分数诚实。</b>只算第一次作答。答错的词会换个题型再见一面，但不会抬高正确率。
            </li>
            <li>
              <b>进度只属于你。</b>没有账号，没有服务器。数据在浏览器里，可以随时导出。
            </li>
          </ul>
        </section>

        <section className="panel">
          <h3 className="eyebrow">快捷键</h3>
          <dl className="keys">
            <div>
              <dt>
                <kbd>⌘</kbd>
                <kbd>K</kbd> 或 <kbd>/</kbd>
              </dt>
              <dd>搜索任何词</dd>
            </div>
            <div>
              <dt>
                <kbd>1</kbd>–<kbd>4</kbd>
              </dt>
              <dd>选择答案</dd>
            </div>
            <div>
              <dt>
                <kbd>Enter</kbd>
              </dt>
              <dd>确认 / 继续</dd>
            </div>
            <div>
              <dt>
                <kbd>←</kbd> <kbd>→</kbd>
              </dt>
              <dd>词卡里切换上一个、下一个</dd>
            </div>
            <div>
              <dt>
                <kbd>Esc</kbd>
              </dt>
              <dd>关闭弹窗</dd>
            </div>
          </dl>
        </section>

        <section className="panel">
          <h3 className="eyebrow">词从哪里来</h3>
          <p className="muted">
            词头、音标、中文释义和英文释义来自这份 SAT 核心词表，整理成站内词库。当前版本没有配图和录音，媒体标记为 0；听发音时使用设备的英文语音。
          </p>
          <p className="muted">{PRODUCT_NAME} 不是官方考试词表，也不承诺提分。它把这 1600 个词放在每天能复习的地方。</p>
        </section>

        <section className="panel">
          <h3 className="eyebrow">给开发者</h3>
          <p className="muted">
            <code>data/sat-words.json</code> 是原始词表。<code>src/atlas/sat-catalog.json</code> 是网页用的 Entry 与索引。部署到 Vercel 时使用仓库根目录，构建命令是 <code>npm run build</code>。
          </p>
          <a className="link" href={`${REPO_URL}#readme`} target="_blank" rel="noreferrer">
            阅读说明 <ArrowUpRight size={14} />
          </a>
        </section>
      </div>
      <p className="colophon">
        <Heart size={14} /> {PRODUCT_NAME}
      </p>
    </div>
  );
}
