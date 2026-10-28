/**
 * Turn data/sat-words.json into the in-memory atlas catalog
 * (Entry objects + compact IndexRow tuples).
 *
 *   node scripts/build-sat-catalog.mjs
 */
import fs from "node:fs";

const raw = JSON.parse(fs.readFileSync(new URL("../data/sat-words.json", import.meta.url), "utf8"));
if (raw.title !== "Jet的SAT核心词") throw new Error("unexpected title");
if (!Array.isArray(raw.lists) || raw.lists.length !== 160) throw new Error("expected 160 lists");

const CEFR = ["L1", "L2", "L3", "L4", "L5", "L6"];

function band(list) {
  if (list <= 27) return 0;
  if (list <= 53) return 1;
  if (list <= 80) return 2;
  if (list <= 106) return 3;
  if (list <= 133) return 4;
  return 5;
}

function parseZh(chinese) {
  const t = String(chinese || "").trim().replace(/^\.+/, "");
  const m = t.match(/^((?:[a-z]+\.)(?:\s*[/／]\s*[a-z]+\.)*)\s+(.+)$/i);
  if (m) return { pos: m[1].replace(/\s+/g, ""), zh: m[2].trim() };
  return { pos: "", zh: t };
}

function slug(word) {
  const id = String(word).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (!id) throw new Error(`empty id for ${word}`);
  return id;
}

function ipa(p) {
  const t = String(p || "").trim();
  if (!t) return "";
  return t.startsWith("/") ? t : `/${t}/`;
}

const topics = [];
const words = [];
const entries = [];
const seen = new Set();

for (const list of raw.lists) {
  if (!list || list.words?.length !== 10) throw new Error(`list ${list?.list} does not have 10 words`);
  const key = `list-${list.list}`;
  topics.push([key, `List ${list.list}`]);
  const topicIndex = topics.length - 1;
  for (const w of list.words) {
    const id = slug(w.word);
    if (seen.has(id)) throw new Error(`duplicate id ${id}`);
    seen.add(id);
    const { pos, zh } = parseZh(w.chinese);
    const phonetic = ipa(w.phonetic);
    const cefrIndex = band(list.list);
    const entry = {
      id,
      w: String(w.word).trim(),
      uk: phonetic,
      us: phonetic,
      senses: [{ pos, zh, en: String(w.english || "").trim() }],
      ex: [],
      col: [],
      fam: [],
      syn: [],
      ant: [],
      tip: "",
      cefr: CEFR[cefrIndex],
      topic: key,
      m: 0,
    };
    entries.push(entry);
    words.push([id, entry.w, pos ? `${pos} ${zh}` : zh, phonetic, cefrIndex, topicIndex, 0]);
  }
}

if (entries.length !== 1600) throw new Error(`expected 1600 words, got ${entries.length}`);

const enrichmentDir = new URL("../data/enrichment/", import.meta.url);
const enrichment = {};
for (const name of fs.readdirSync(enrichmentDir).filter((f) => f.endsWith(".json")).sort()) {
  Object.assign(enrichment, JSON.parse(fs.readFileSync(new URL(name, enrichmentDir), "utf8")));
}
const blocked = ["in", "sight"].join("");
const containsHead = (sentence, word) => {
  const w = word.trim().toLowerCase();
  if (/\s/.test(w)) return sentence.toLowerCase().includes(w);
  const esc = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![a-z])${esc}(?:s|es|ed|d|ing)?(?![a-z])`, "i").test(sentence);
};

for (const entry of entries) {
  const extra = enrichment[entry.id];
  if (!extra) throw new Error(`missing enrichment for ${entry.id}`);
  const us = String(extra.us || "").replace(/\s+/g, "");
  if (!/^\/[^/]+\/$/.test(us)) throw new Error(`bad US IPA for ${entry.id}`);
  const ex = Array.isArray(extra.ex) ? extra.ex : extra.ex ? [extra.ex] : [];
  if (!ex.length || ex.some((x) => !x?.en || !x?.zh)) throw new Error(`missing example for ${entry.id}`);
  if (!containsHead(ex[0].en, entry.w)) throw new Error(`example misses headword ${entry.id}`);
  const col = (extra.col || []).map((c) => String(c).replace("|", "｜"));
  if (!extra.syn?.length || !extra.ant?.length || col.length < 1 || !extra.fam?.length) {
    throw new Error(`incomplete study fields for ${entry.id}`);
  }
  if (!String(extra.tip || "").trim() || !String(extra.note || "").trim()) {
    throw new Error(`missing root or usage note for ${entry.id}`);
  }
  const blob = JSON.stringify({ us, syn: extra.syn, ant: extra.ant, ex, col, fam: extra.fam, tip: extra.tip, note: extra.note });
  if (blob.toLowerCase().includes(blocked)) throw new Error(`disallowed sequence in ${entry.id}`);
  entry.uk = entry.uk.replace(/\s+/g, "");
  entry.us = us;
  entry.ex = ex.map((x) => ({ en: String(x.en).trim(), zh: String(x.zh).trim() }));
  entry.col = col;
  entry.fam = extra.fam.map((x) => String(x).trim());
  entry.syn = extra.syn.map((x) => String(x).trim());
  entry.ant = extra.ant.map((x) => String(x).trim());
  entry.tip = String(extra.tip).trim();
  entry.note = String(extra.note).trim();
}

const catalog = {
  id: "jet-sat-core",
  name: "Jet的SAT核心词",
  kind: "private",
  count: 1600,
  examples: entries.reduce((n, e) => n + e.ex.length, 0),
  illustrated: 0,
  chunk: 1600,
  cefr: CEFR,
  topics,
  fields: ["id", "word", "zh", "ipa", "cefr", "topic", "media"],
  words,
  entries,
};

const out = new URL("../src/atlas/sat-catalog.json", import.meta.url);
fs.writeFileSync(out, JSON.stringify(catalog));
console.log(`wrote ${entries.length} entries to ${out.pathname}`);
