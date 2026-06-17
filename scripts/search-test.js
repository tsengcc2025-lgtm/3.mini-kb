import { OPENAI_API_KEY, QDRANT_URL, QDRANT_API_KEY } from "../config.js";
import { searchKnowledge } from "../lib/qdrant.js";
import { validateQdrantEnv } from "../lib/validateEnv.js";

if (!OPENAI_API_KEY) {
  console.error("請在 .env 設定 OPENAI_API_KEY");
  process.exit(1);
}

validateQdrantEnv(QDRANT_URL, QDRANT_API_KEY);

/** 3 種不同問法（作業要求） */
const TEST_QUERIES = [
  "夏天很熱想吃香甜多汁的熱帶水果，有什麼推薦？",
  "台東常見、要放軟才好吃、甜度很高的那種水果是什麼？",
  "維生素 C 很高、脆脆的口感、珍珠品種的是哪種水果？",
];

console.log("搜尋測試（3 種問法）\n");

for (const [i, query] of TEST_QUERIES.entries()) {
  console.log(`--- 問法 ${i + 1} ---`);
  console.log(`查詢：${query}\n`);

  const results = await searchKnowledge(query, 3);

  for (const [rank, r] of results.entries()) {
    console.log(
      `${rank + 1}. [${r.score.toFixed(3)}] ${r.title} — ${r.content.slice(0, 60)}…`,
    );
  }
  console.log("");
}

console.log("請確認：每組結果最相關的標題是否符合問法（芒果/釋迦/芭樂等）。");
