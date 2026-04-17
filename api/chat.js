// Vercel Serverless Function (Node runtime)
// Proxies chat requests to the Mistral API so the key never reaches the browser.

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de TimeTravel Agency, une agence de voyage temporel de luxe fictive.

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
    const { messages } = req.body ?? {};
    if (!Array.isArray(messages)) {
      res.status(400).json({ error: "messages must be an array" });
      return;
    }

    const payload = {
      model: "mistral-small-latest",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.7,
      max_tokens: 400,
    };

    const upstream = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      res.status(upstream.status).json({ error: data?.error ?? data });
      return;
    }

    const reply = data?.choices?.[0]?.message?.content ?? "";
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: err?.message ?? "Unknown error" });
  }
}
