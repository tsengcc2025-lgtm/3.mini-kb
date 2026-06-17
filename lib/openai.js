import OpenAI from "openai";
import { OPENAI_API_KEY } from "../config.js";

export const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
  maxRetries: 3,
  timeout: 120_000,
});

export const EMBEDDING_MODEL = "text-embedding-3-small";
