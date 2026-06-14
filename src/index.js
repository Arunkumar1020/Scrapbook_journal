import { getDb } from "./utils/db";
import { handleJournalRoutes } from "./routes/journalRoutes";
import { randomUUID } from "crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function withCors(response) {
  const newHeaders = new Headers(response.headers);

  Object.entries(corsHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    let response;

    try {
      if (url.pathname === "/") {
        response = Response.json({
          status: "ok",
          message: "Worker API running v2",
        });

        return withCors(response);
      }

      if (url.pathname === "/api/health") {
        response = Response.json({
          status: "ok",
          message: "Worker API is running v2",
        });

        return withCors(response);
      }

      if (url.pathname === "/api/db-health") {
        const sql = getDb(env);

        const result = await sql`
          SELECT
            NOW() as current_time,
            current_database() as database_name,
            current_user as user_name
        `;

        response = Response.json({
          status: "database connected",
          data: result[0],
        });

        return withCors(response);
      }

      if (request.method === "POST" && url.pathname === "/upload") {
        const formData = await request.formData();
        const file = formData.get("image");

        if (!file) {
          response = Response.json(
            {
              success: false,
              message: "No file uploaded",
            },
            {
              status: 400,
            }
          );

          return withCors(response);
        }

        const extension = file.name.split(".").pop();
        const fileName = `${randomUUID()}.${extension}`;

        await env.IMAGES_BUCKET.put(
          fileName,
          await file.arrayBuffer(),
          {
            httpMetadata: {
              contentType: file.type,
            },
          }
        );

        response = Response.json({
          success: true,
          fileName,
        });

        return withCors(response);
      }
      if (request.method === "GET" && url.pathname.startsWith("/image/")) {
  const fileName = url.pathname.replace("/image/", "");

  const object = await env.IMAGES_BUCKET.get(fileName);

  if (!object) {
    response = Response.json(
      {
        success: false,
        message: "Image not found",
      },
      {
        status: 404,
      }
    );

    return withCors(response);
  }

  return withCors(
    new Response(object.body, {
      headers: {
        "Content-Type":
          object.httpMetadata?.contentType || "application/octet-stream",
      },
    })
  );
}
      const journalResponse = await handleJournalRoutes(request, env);

      if (journalResponse) {
        return withCors(journalResponse);
      }

      response = Response.json(
        {
          status: "error",
          message: "Route Not Found",
        },
        {
          status: 404,
        }
      );

      return withCors(response);
    } catch (error) {
      response = Response.json(
        {
          status: "error",
          message: error.message,
        },
        {
          status: 500,
        }
      );

      return withCors(response);
    }
  },
};