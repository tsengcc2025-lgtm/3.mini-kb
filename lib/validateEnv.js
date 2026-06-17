/** 檢查 Qdrant Cloud 連線設定（避免誤用 localhost） */
export function validateQdrantEnv(QDRANT_URL, QDRANT_API_KEY) {
  if (!QDRANT_URL) {
    console.error("請在 .env 設定 QDRANT_URL");
    console.error("範例：https://xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.us-east4-0.gcp.cloud.qdrant.io:6333");
    process.exit(1);
  }

  const lower = QDRANT_URL.toLowerCase();
  if (lower.includes("localhost") || lower.includes("127.0.0.1")) {
    console.error("QDRANT_URL 不可使用 localhost / 127.0.0.1。");
    console.error("StackBlitz 沒有本機 Qdrant，請用 Qdrant Cloud 叢集的 https 網址。");
    process.exit(1);
  }

  if (!QDRANT_URL.startsWith("https://")) {
    console.error("QDRANT_URL 請以 https:// 開頭（Qdrant Cloud Cluster URL）。");
    process.exit(1);
  }

  if (!QDRANT_API_KEY) {
    console.error("請在 .env 設定 QDRANT_API_KEY（Qdrant Cloud → Cluster → API Keys）");
    process.exit(1);
  }
}
