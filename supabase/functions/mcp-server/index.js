import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// ESM.SH HELYETT NPM: HASZNÁLATA
import { Server } from "npm:@modelcontextprotocol/sdk@1.0.1/server/index.js";
import { SSEServerTransport } from "npm:@modelcontextprotocol/sdk@1.0.1/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "npm:@modelcontextprotocol/sdk@1.0.1/types.js";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  // CORS fejlécek beállítása
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const server = new Server({ name: "mcp-server", version: "1.0.0" }, { capabilities: { tools: {} } });

    // Eszközök definiálása
    server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "list_tables",
          description: "Listázza az összes táblát.",
          inputSchema: { type: "object", properties: {} },
        },
      ],
    }));

    // Alapértelmezett kezelő az eszközökhöz
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === "list_tables") {
        const { data } = await supabase.from("_table_metadata").select("*").limit(5); // Teszt lekérdezés
        return { content: [{ type: "text", text: JSON.stringify(data || "Kapcsolat OK, de tábla nem található.") }] };
      }
      throw new Error("Ismeretlen eszköz");
    });

    const url = new URL(req.url);

    // SSE végpont kezelése
    if (url.pathname.endsWith("/sse")) {
      const transport = new SSEServerTransport("/messages", async (res) => {
        // SSE válasz küldése
      });
      const response = await transport.handleStart(req);
      // Fontos: a CORS fejlécet az SSE válaszra is rá kell tenni!
      Object.entries(headers).forEach(([k, v]) => response.headers.set(k, v));
      return response;
    }

    // Üzenetek kezelése
    if (url.pathname.endsWith("/messages")) {
      // Itt a transport handling jönne, de a ChatGPT-nek az SSE indítás a lényeg
      return new Response("OK", { headers });
    }

    return new Response("Működik! Használd az /sse útvonalat.", { status: 200, headers });
  } catch (err) {
    console.error("Hiba:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
});
