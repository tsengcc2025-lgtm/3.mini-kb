/**
 * 測試 Qdrant Cloud 是否從目前環境連得到（StackBlitz 常擋 :6333）
 * 使用：npm run test:qdrant
 */
import { QDRANT_API_KEY, QDRANT_URL } from "../config.js";
import { validateQdrantEnv } from "../lib/validateEnv.js";

validateQdrantEnv(QDRANT_URL, QDRANT_API_KEY);

const candidates = [
  QDRANT_URL,
  QDRANT_URL.replace(/:6333\/?$/, ""),
];

const unique = [...new Set(candidates.filter(Boolean))];

for (const base of unique) {
  const url = `${base.replace(/\/$/, "")}/collections`;
  console.log(`\n嘗試 GET ${url}`);

  try {
    const res = await fetch(url, {
      headers: { "api-key": QDRANT_API_KEY },
    });
    console.log(`  → HTTP ${res.status}`);
    if (res.ok) {
      const data = await res.json();
      console.log(`  → 成功，collections 數量：${data.result?.collections?.length ?? "?"}`);
      console.log(`\n請將 .env 的 QDRANT_URL 設為：${base}`);
      process.exit(0);
    }
  } catch (err) {
    console.log(`  → 失敗：${err.cause?.code ?? err.message}`);
  }
}

console.log(`
若全部失敗：此環境（例如 StackBlitz）可能無法連 Qdrant Cloud。
請在 GitHub Codespaces 或本機執行 npm run init / npm run search。
`);
process.exit(1);
