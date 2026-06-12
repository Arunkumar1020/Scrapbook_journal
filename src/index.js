import { getDb } from "./utils/db";
import { handleJournalRoutes } from "./routes/journalRoutes";

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		if (url.pathname === "/api/health") {
			return Response.json({
				status: "ok",
			});
		}

		if (url.pathname === "/api/db-health") {
    try {
        console.log("DATABASE_URL exists?", !!env.DATABASE_URL);
        console.log("First 20 chars:", env.DATABASE_URL?.substring(0, 20));
        
        const sql = getDb(env);
        const result = await sql`SELECT NOW() as current_time`;
        
        return Response.json({
            status: "database connected",
            result,
        });
    } catch (error) {
        console.error("Full error:", error);
        return Response.json(
            {
                status: "database error",
                message: error.message,
            },
            { status: 500 }
        );
    }
}
if (url.pathname === "/api/debug-env") {
    return Response.json({
        hasDatabaseUrl: !!env.DATABASE_URL,
        firstChars: env.DATABASE_URL ? env.DATABASE_URL.substring(0, 30) : "undefined",
        urlLength: env.DATABASE_URL ? env.DATABASE_URL.length : 0
    });
}

		const journalResponse =
			await handleJournalRoutes(request);

		if (journalResponse) {
			return journalResponse;
		}

		return new Response("Route Not Found", {
			status: 404,
		});
	},
};