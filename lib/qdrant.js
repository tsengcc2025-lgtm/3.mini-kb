import { QdrantClient } from "@qdrant/js-client-rest";
import { QDRANT_URL, QDRANT_API_KEY } from "../config.js";
import { client, EMBEDDING_MODEL } from "./openai.js";

export const qdrant = new QdrantClient({
  url: QDRANT_URL,
  ...(QDRANT_API_KEY && { apiKey: QDRANT_API_KEY }),
  checkCompatibility: false,
});

export const KNOWLEDGE_COLLECTION = "homework3_taiwan_fruits";
export const EMBEDDING_DIM = 1536;

export async function embed(text) {
  const res = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  return res.data[0].embedding;
}

export async function embedBatch(texts) {
  const res = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });
  return res.data.map((d) => d.embedding);
}

function docToText(doc) {
  return [doc.title, doc.category, doc.content].filter(Boolean).join(" | ");
}

export async function ensureCollection() {
  const collections = await qdrant.getCollections();
  const exists = collections.collections.some(
    (c) => c.name === KNOWLEDGE_COLLECTION,
  );

  if (!exists) {
    await qdrant.createCollection(KNOWLEDGE_COLLECTION, {
      vectors: { size: EMBEDDING_DIM, distance: "Cosine" },
    });
    console.log(`已建立 collection：${KNOWLEDGE_COLLECTION}`);
  } else {
    console.log(`collection 已存在：${KNOWLEDGE_COLLECTION}`);
  }
}

export async function upsertDocuments(documents) {
  const texts = documents.map(docToText);
  const vectors = await embedBatch(texts);

  const points = documents.map((doc, i) => ({
    id: doc.id,
    vector: vectors[i],
    payload: {
      title: doc.title,
      category: doc.category,
      content: doc.content,
    },
  }));

  await qdrant.upsert(KNOWLEDGE_COLLECTION, { wait: true, points });
}

export async function searchKnowledge(query, limit = 3) {
  const vector = await embed(query);

  const results = await qdrant.search(KNOWLEDGE_COLLECTION, {
    vector,
    limit,
    with_payload: true,
  });

  return results.map((r) => ({
    score: r.score,
    title: r.payload.title,
    category: r.payload.category,
    content: r.payload.content,
  }));
}
