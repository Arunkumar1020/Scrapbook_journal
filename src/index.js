import { getDb } from "./utils/db";
import { handleJournalRoutes } from "./routes/journalRoutes";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return Response.json({
        status: "ok",
        message: "Worker API running",
      });
    }

    if (url.pathname === "/api/health") {
      return Response.json({
        status: "ok",
        message: "Worker API is running",
      });
    }

    if (url.pathname === "/api/debug-env") {
      return Response.json({
        hasDatabaseUrl: !!env.DATABASE_URL,
        startsWithPostgres: env.DATABASE_URL?.startsWith("postgresql://"),
        containsPooler: env.DATABASE_URL?.includes("-pooler"),
        containsSslMode: env.DATABASE_URL?.includes("sslmode=require"),
        containsChannelBinding: env.DATABASE_URL?.includes("channel_binding"),
        urlLength: env.DATABASE_URL?.length || 0,
      });
    }

    if (url.pathname === "/api/db-health") {
      try {
        const sql = getDb(env);

        const result = await sql`
          SELECT 
            NOW() as current_time,
            current_database() as database_name,
            current_user as user_name
        `;

        return Response.json({
          status: "database connected",
          data: result[0],
        });
      } catch (error) {
        console.error("Database error:", error);

        return Response.json(
          {
            status: "database error",
            message: error.message,
            name: error.name,
          },
          { status: 500 }
        );
      }
    }

    const journalResponse = await handleJournalRoutes(request, env);

    if (journalResponse) {
      return journalResponse;
    }

    return Response.json(
      {
        status: "error",
        message: "Route Not Found",
      },
      { status: 404 }
    );
  },
};