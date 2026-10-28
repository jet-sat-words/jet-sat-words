import type { Atlas, Entry, IndexRow, WordRef } from "./types";
import catalogJson from "./sat-catalog.json" with { type: "json" };

interface CatalogFile {
  id: string;
  name: string;
  count: number;
  examples: number;
  illustrated: number;
  topics: [string, string][];
  cefr: string[];
  fields: string[];
  words: IndexRow[];
  entries: Entry[];
}

const catalog = catalogJson as unknown as CatalogFile;

let cached: Atlas | null = null;

/**
 * The SAT list, held entirely in memory.
 * Index rows are `[id, word, zh, ipa, cefrIndex, topicIndex, media]` with media 0.
 */
export function loadSatAtlas(): Atlas {
  if (cached) return cached;
  if (catalog.name !== "Jet的SAT核心词") throw new Error("词库名称不正确");
  if (catalog.count !== 1600 || catalog.entries.length !== 1600 || catalog.words.length !== 1600) {
    throw new Error(`词库数量不正确（${catalog.entries.length}）`);
  }
  if (catalog.topics.length !== 160) throw new Error(`List 数量不正确（${catalog.topics.length}）`);
  if (catalog.fields.join(",") !== "id,word,zh,ipa,cefr,topic,media") throw new Error("索引字段不正确");

  const byEntry = new Map(catalog.entries.map((e) => [e.id, e]));
  const words: WordRef[] = catalog.words.map((r, order) => {
    const entry = byEntry.get(r[0]);
    if (!entry) throw new Error(`缺少词条 ${r[0]}`);
    if (r[6] !== 0 || entry.m !== 0) throw new Error(`媒体标记应为 0：${r[0]}`);
    return {
      id: r[0],
      word: r[1],
      zh: r[2],
      ipa: r[3],
      cefr: r[4],
      topic: r[5],
      media: 0,
      order,
      gloss: entry.senses.map((s) => s.en).filter(Boolean).join(" "),
    };
  });
  const byId = new Map(words.map((w) => [w.id, w]));

  cached = {
    id: catalog.id,
    name: catalog.name,
    kind: "private",
    count: words.length,
    examples: catalog.examples,
    illustrated: 0,
    topics: catalog.topics,
    cefr: catalog.cefr,
    words,
    byId,
    peek: (id) => byEntry.get(id),
    async entry(id) {
      const e = byEntry.get(id);
      if (!e) throw new Error(`没有找到词条 ${id}`);
      return e;
    },
    img: () => null,
    audio: () => null,
  };
  return cached;
}
