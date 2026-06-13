import { neon } from "@neondatabase/serverless";
import fs from "fs";

function loadDatabaseUrl() {
  const envFile = fs.readFileSync(".dev.vars", "utf-8");

  const line = envFile
    .split("\n")
    .find((line) => line.startsWith("DATABASE_URL="));

  if (!line) {
    throw new Error("DATABASE_URL not found in .dev.vars");
  }

  return line.replace("DATABASE_URL=", "").replace(/^"|"$/g, "").trim();
}

async function main() {
  const databaseUrl = loadDatabaseUrl();

  console.log("DATABASE_URL loaded:", !!databaseUrl);
  console.log("Starts with postgresql:", databaseUrl.startsWith("postgresql://"));
  console.log("Length:", databaseUrl.length);

  const sql = neon(databaseUrl);

  const result = await sql`
    SELECT 
      NOW() as current_time,
      current_database() as database_name,
      current_user as user_name
  `;

  console.log("Database connected successfully:");
  console.log(result[0]);
}

main().catch((error) => {
  console.error("Database connection failed:");
  console.error(error);
});