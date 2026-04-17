import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const CHAT_SYSTEM_PROMPT = `Tu es l'assistant virtuel de TimeTravel Agency, une agence de voyage temporel de luxe fictive.

Ton rôle : conseiller les clients sur les meilleures destinations temporelles.

Ton ton :
- Professionnel mais chaleureux
- Passionné d'histoire
- Enthousiaste sans être familier
- Expert du voyage temporel (fictif mais crédible)

Tu connais parfaitement nos 3 destinations :
- Paris 1889 (Belle Époque, Tour Eiffel, Exposition Universelle) — 5 jours, à partir de 4 900 €
- Crétacé -65M (dinosaures, nature préhistorique, T-Rex, capsules sécurisées) — 7 jours, à partir de 12 900 €
- Florence 1504 (Renaissance, Michel-Ange, Léonard de Vinci, Médicis) — 6 jours, à partir de 8 900 €

Tu peux suggérer une destination selon les goûts du client (art, nature, architecture, aventure...).
Si on te pose une question hors-sujet (politique, code, etc.), recentre poliment sur le voyage temporel.
Réponds en français, de façon concise (2 à 4 phrases max sauf demande explicite de détails).`;

const RECO_SYSTEM_PROMPT = `Tu es le moteur de recommandation de TimeTravel Agency.
On te fournit les réponses d'un client à un quiz de 4 questions. Ton rôle :
choisir parmi nos 3 destinations celle qui lui correspond le mieux, et expliquer pourquoi.

Destinations disponibles (utiliser EXACTEMENT ces ids) :
- "paris-1889"    → Paris 1889 (Belle Époque, Tour Eiffel, Exposition Universelle, urbain, architecture)
- "cretace"       → Crétacé -65M (dinosaures, nature préhistorique, aventure, faune)
- "florence-1504" → Florence 1504 (Renaissance, Michel-Ange, art, musées, classicisme)

Réponds UNIQUEMENT au format JSON valide, sans aucun texte autour :
{
  "destinationId": "paris-1889" | "cretace" | "florence-1504",
  "explanation": "2 à 3 phrases chaleureuses et personnalisées expliquant ce choix au client."
}`;

async function readJson(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function mistralCall(apiKey, payload) {
  return fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });
}

// Dev-only middleware that mimics Vercel serverless functions /api/chat and /api/recommend.
function devApiPlugin(env) {
  return {
    name: "dev-api",
    configureServer(server) {
      // /api/chat — conversational agent
      server.middlewares.use("/api/chat", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }
        const apiKey = env.MISTRAL_API_KEY;
        if (!apiKey) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "MISTRAL_API_KEY missing" }));
          return;
        }
        try {
          const body = await readJson(req);
          const messages = body.messages ?? [];
          const upstream = await mistralCall(apiKey, {
            model: "mistral-small-latest",
            messages: [
              { role: "system", content: CHAT_SYSTEM_PROMPT },
              ...messages,
            ],
            temperature: 0.7,
            max_tokens: 400,
          });
          const data = await upstream.json();
          if (!upstream.ok) {
            res.statusCode = upstream.status;
            res.end(JSON.stringify({ error: data?.error ?? data }));
            return;
          }
          const reply = data?.choices?.[0]?.message?.content ?? "";
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ reply }));
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err?.message ?? "Unknown" }));
        }
      });

      // /api/recommend — quiz → structured destination recommendation
      server.middlewares.use("/api/recommend", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }
        const apiKey = env.MISTRAL_API_KEY;
        if (!apiKey) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "MISTRAL_API_KEY missing" }));
          return;
        }
        try {
          const body = await readJson(req);
          const answers = body.answers ?? [];
          if (!Array.isArray(answers) || answers.length === 0) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "answers required" }));
            return;
          }
          const userMsg = `Voici les réponses du client au quiz :\n${answers
            .map((a, i) => `${i + 1}. ${a.question} → ${a.answer}`)
            .join("\n")}`;
          const upstream = await mistralCall(apiKey, {
            model: "mistral-small-latest",
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: RECO_SYSTEM_PROMPT },
              { role: "user", content: userMsg },
            ],
            temperature: 0.6,
            max_tokens: 300,
          });
          const data = await upstream.json();
          if (!upstream.ok) {
            res.statusCode = upstream.status;
            res.end(JSON.stringify({ error: data?.error ?? data }));
            return;
          }
          const raw = data?.choices?.[0]?.message?.content ?? "{}";
          let parsed;
          try {
            parsed = JSON.parse(raw);
          } catch {
            res.statusCode = 502;
            res.end(JSON.stringify({ error: "Invalid JSON from model", raw }));
            return;
          }
          const valid = ["paris-1889", "cretace", "florence-1504"];
          if (!valid.includes(parsed?.destinationId)) {
            res.statusCode = 502;
            res.end(JSON.stringify({ error: "Invalid destinationId", parsed }));
            return;
          }
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(parsed));
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err?.message ?? "Unknown" }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), devApiPlugin(env)],
  };
});
