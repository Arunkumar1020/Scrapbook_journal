import { neon } from "@neondatabase/serverless";

export function getDb(env) {
  return neon(env.DATABASE_URL);
}