import { neon } from "@neondatabase/serverless";

export function getDb(env) {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  return neon(env.DATABASE_URL);
}