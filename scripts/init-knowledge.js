import { OPENAI_API_KEY, QDRANT_URL, QDRANT_API_KEY } from "../config.js";
import { KNOWLEDGE_DOCUMENTS } from "../data/knowledge.js";
import { ensureCollection, upsertDocuments } from "../lib/qdrant.js";
import { validateQdrantEnv } from "../lib/validateEnv.js";

if (!OPENAI_API_KEY) {
  console.error("請在 .env 設定 OPENAI_API_KEY");
  process.exit(1);
}

validateQdrantEnv(QDRANT_URL, QDRANT_API_KEY);

console.log("知識庫初始化：寫入 5 筆台灣水果資料…\n");

await ensureCollection();
await upsertDocuments(KNOWLEDGE_DOCUMENTS);

console.log("完成。已 upsert 以下標題：");
for (const doc of KNOWLEDGE_DOCUMENTS) {
  console.log(`  - ${doc.title}`);
}
console.log("\n下一步：npm run search");
