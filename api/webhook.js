// api/webhook.js
import axios from "axios";

const {
  WHATSAPP_TOKEN,
  VERIFY_TOKEN = "blanquer123",
  PHONE_ID,
} = process.env;

// envia texto via Cloud API
async function sendText(to, text) {
  await axios.post(
    `https://graph.facebook.com/v20.0/${PHONE_ID}/messages`,
    { messaging_product: "whatsapp", to, type: "text", text: { body: text } },
    { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` } }
  );
}

function mainMenu(name) {
  return `Olá ${name || ""} 👋
Escolha uma opção:
1 - Agendar consulta
2 - Falar com atendente
3 - Localização / Endereço

Responda apenas com o número. Digite MENU para voltar.`.trim();
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // verificação do webhook (Meta)
      const mode = req.query["hub.mode"];
      const token = req.query["hub.verify_token"];
      const challenge = req.query["hub.challenge"];
      if (mode && token === VERIFY_TOKEN) return res.status(200).send(challenge);
      return res.status(403).end();
    }

    if (req.method === "POST") {
      const body = req.body || {};
      if (!body.object) return res.status(200).end();

      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          const value = change.value || {};
          const messages = value.messages || [];
          const contacts = value.contacts || [];

          for (const m of messages) {
            const from = m.from;
            const contact = contacts.find(c => c.wa_id === from) || {};
            const name = contact.profile?.name || "";
            const text = (m.text?.body || "").trim();

            if (!text || text.toLowerCase() === "menu" || text === "0") {
              await sendText(from, mainMenu(name));
              continue;
            }

            if (text === "1") {
              await sendText(from, "Ótimo! Vamos agendar. Qual seu nome completo?");
              // dica: para manter estado na Vercel, use um DB/Redis (Upstash) — posso te passar o snippet depois
            } else if (text === "2") {
              await sendText(from, "Um atendente humano entrará em contato em breve. Digite MENU para voltar.");
            } else if (text === "3") {
              await sendText(
                from,
                "📍 Clínica Blanquer Saúde Integrativa\nAv. Paulista, 807 — São Paulo/SP\n👉 Ver no Google Maps: https://www.google.com/maps/search/?api=1&query=Av+Paulista+807+S%C3%A3o+Paulo\n\nDigite MENU para voltar."
              );
            } else {
              await sendText(from, mainMenu(name));
            }
          }
        }
      }
      return res.status(200).end();
    }

    return res.status(405).end();
  } catch (err) {
    console.error("Erro webhook vercel:", err.response?.data || err.message || err);
    return res.status(500).end();
  }
}
