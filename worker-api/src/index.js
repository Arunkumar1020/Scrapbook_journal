import { randomUUID } from "crypto";
import { getDb } from "./utils/db";

import { handleAuthRoutes } from "./routes/authRoutes";
import { handleJournalRoutes } from "./routes/journalRoutes";
import { handleAdminRoutes } from "./routes/adminRoutes";
import { handleUserRoutes } from "./routes/userRoutes";
import { handleLegalRoutes } from "./routes/legalRoutes";
import { handleMfaRoutes } from "./routes/mfaRoutes";
import { handleRetentionRoutes } from "./routes/retentionRoutes";
import {
  getMyCookieConsent,
  updateMyCookieConsent,
} from "./controllers/userController";
import { handlePrivacyRequestRoutes } from "./routes/privacyRequestRoutes";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

function withCors(response) {
  const headers = new Headers(response.headers);

  Object.entries(corsHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
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

    try {
      if (url.pathname === "/api/debug-version") {
  return withCors(
    Response.json({
      status: "ok",
      version: "cookie-route-test-v1",
      time: new Date().toISOString(),
    })
  );
}
      if (url.pathname === "/") {
        return withCors(
          Response.json({
            status: "ok",
            message: "Worker API running",
          })
        );
      }

      if (url.pathname === "/api/health") {
        return withCors(
          Response.json({
            status: "ok",
            message: "Worker API is running",
          })
        );
      }

      if (url.pathname === "/api/db-health") {
        const sql = getDb(env);

        const result = await sql`
          SELECT
            NOW() as current_time,
            current_database() as database_name,
            current_user as user_name
        `;

        return withCors(
          Response.json({
            status: "database connected",
            data: result[0],
          })
        );
      }

      // if (
      //   request.method === "GET" &&
      //   url.pathname === "/api/me/cookie-consent"
      // ) {
      //   return withCors(
      //     await getMyCookieConsent(env, request)
      //   );
      // }

      // if (
      //   request.method === "PUT" &&
      //   url.pathname === "/api/me/cookie-consent"
      // ) {
      //   return withCors(
      //     await updateMyCookieConsent(env, request)
      //   );
      // }

      if (
        request.method === "POST" &&
        url.pathname === "/upload"
      ) {
        const formData = await request.formData();
        const file = formData.get("image");

        if (!file) {
          return withCors(
            Response.json(
              {
                success: false,
                message: "No file uploaded",
              },
              {
                status: 400,
              }
            )
          );
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

        return withCors(
          Response.json({
            success: true,
            fileName,
          })
        );
      }

      if (
        request.method === "GET" &&
        url.pathname.startsWith("/image/")
      ) {
        const fileName = url.pathname.replace("/image/", "");
        const object = await env.IMAGES_BUCKET.get(fileName);

        if (!object) {
          return withCors(
            Response.json(
              {
                success: false,
                message: "Image not found",
              },
              {
                status: 404,
              }
            )
          );
        }

        return withCors(
          new Response(object.body, {
            headers: {
              "Content-Type":
                object.httpMetadata?.contentType ||
                "application/octet-stream",
            },
          })
        );
      }
      const retentionResponse = await handleRetentionRoutes(request, env);
      if (retentionResponse) {  return withCors(retentionResponse);}
      const authResponse = await handleAuthRoutes(request, env);
      if (authResponse) return withCors(authResponse);

      const userResponse = await handleUserRoutes(request, env);
      if (userResponse) return withCors(userResponse);

      const mfaResponse = await handleMfaRoutes(request, env);
      if (mfaResponse) return withCors(mfaResponse);

      const journalResponse = await handleJournalRoutes(request, env);
      if (journalResponse) return withCors(journalResponse);

      const privacyRequestResponse =await handlePrivacyRequestRoutes(request, env);
      if (privacyRequestResponse) {return withCors(privacyRequestResponse);}
      
      const adminResponse = await handleAdminRoutes(request, env);
      if (adminResponse) return withCors(adminResponse);

      const legalResponse = await handleLegalRoutes(request);
      if (legalResponse) return withCors(legalResponse);

      return withCors(
        Response.json(
          {
            status: "error",
            message: "Route Not Found",
          },
          {
            status: 404,
          }
        )
      );
    } catch (error) {
      return withCors(
        Response.json(
          {
            status: "error",
            message: error.message,
          },
          {
            status: 500,
          }
        )
      );
    }
  },
};