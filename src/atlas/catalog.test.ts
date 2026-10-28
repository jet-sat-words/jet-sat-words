import assert from "node:assert/strict";
import test from "node:test";
import { loadSatAtlas } from "./data.ts";

test("in-memory SAT atlas lists every word", async () => {
  const atlas = loadSatAtlas();
  assert.equal(atlas.name, "Jet的SAT核心词");
  assert.equal(atlas.kind, "private");
  assert.equal(atlas.count, 1600);
  assert.equal(atlas.words.length, 1600);
  assert.equal(atlas.topics.length, 160);
  assert.equal(atlas.illustrated, 0);
  assert.equal(new Set(atlas.words.map((w) => w.id)).size, 1600);
  assert.ok(atlas.words.every((w) => w.media === 0));
  assert.equal(atlas.img(atlas.words[0]), null);
  assert.equal(atlas.audio(atlas.words[0], "uk"), null);

  const first = atlas.peek("domesticate");
  assert.ok(first);
  assert.equal(first.w, "domesticate");
  assert.equal(first.m, 0);
  assert.equal(first.uk, "/dəˈmestɪkeɪt/");
  assert.match(first.us, /^\/.+\/$/);
  assert.ok(first.ex.length >= 1);
  assert.match(first.ex[0].en, /domesticate/i);
  assert.ok(first.ex[0].zh.length > 0);
  assert.ok(first.syn.length >= 1);
  assert.ok(first.ant.length >= 1);
  assert.ok(first.col.every((c) => c.includes("｜")));
  assert.ok(first.fam.length >= 1);
  assert.match(first.tip, /词根|构词/);
  assert.ok(first.note && first.note.length > 0);
  assert.equal(first.senses[0].pos, "v.");
  assert.match(first.senses[0].zh, /驯化/);
  assert.match(first.senses[0].en, /tame/);

  const loaded = await atlas.entry("hew-out");
  assert.equal(loaded.w, "hew out");
  assert.equal(loaded.topic, "list-135");
  assert.match(loaded.ex[0].en, /hew out/i);
  assert.equal(atlas.byId.get("subtlety")?.topic, 159);

  for (const ref of atlas.words) {
    const e = atlas.peek(ref.id);
    assert.ok(e, ref.id);
    assert.ok(e.us.startsWith("/") && e.us.endsWith("/"), ref.id);
    assert.ok(e.syn.length && e.ant.length && e.ex.length && e.col.length && e.fam.length, ref.id);
    assert.ok(e.tip && e.note, ref.id);
  }
  assert.ok(atlas.examples >= 1600);
});
