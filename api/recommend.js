// Vercel Serverless Function — recommends a destination from quiz answers.
// Returns structured JSON: { destinationId, explanation }.

const SYSTEM_PROMPT = `Tu es le moteur de recommandation de TimeTravel Agency.
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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "MISTRAL_API_KEY is not configured" });
    return;
  }
  try {
    const { answers } = req.body ?? {};
    if (!Array.isArray(answers) || answers.length === 0) {
      res.status(400).json({ error: "answers must be a non-empty array" });
      return;
    }

    const userMsg = `Voici les réponses du client au quiz :\n${answers
      .map((a, i) => `${i + 1}. ${a.question} → ${a.answer}`)
      .join("\n")}`;

    const upstream = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMsg },
        ],
        temperature: 0.6,
        max_tokens: 300,
      }),
    });
    const data = await upstream.json();
    if (!upstream.ok) {
      res.status(upstream.status).json({ error: data?.error ?? data });
      return;
    }
    const raw = data?.choices?.[0]?.message?.content ?? "{}";
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      res.status(502).json({ error: "Invalid JSON from model", raw });
      return;
    }
    const valid = ["paris-1889", "cretace", "florence-1504"];
    if (!valid.includes(parsed?.destinationId)) {
      res.status(502).json({ error: "Invalid destinationId", parsed });
      return;
    }
    res.status(200).json(parsed);
  } catch (err) {
    res.status(500).json({ error: err?.message ?? "Unknown error" });
  }
}
