// Vercel Serverless WhatsApp Bot (Meta Cloud API)
// Clínica Blanquer Saúde Integrativa
// Arquivo: api/webhook.js

import axios from "axios";

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "clinica_token";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || "COLE_SEU_TOKEN_DA_META_AQUI";

function buildMenu() {
  return [
    "Olá! 👋",
    "Sou o assistente virtual da *Clínica Blanquer Saúde Integrativa*.",
    "",
    "Como posso te ajudar hoje?",
    "",
    "1️⃣ Agendar consulta",
    "2️⃣ Convênios",
    "3️⃣ Horário de funcionamento",
    "4️⃣ Localização"
  ].join("\n");
}

function buildReply(option) {
  const op = String(option || "").trim().toLowerCase();
  const known = ["1","2","3","4","oi","olá","ola","menu","iniciar","bom dia","boa tarde","boa noite"];
  if (!known.includes(op)) {
    return [
      "Desculpe, não entendi 😅",
      "Envie apenas o número da opção desejada:",
      "1️⃣ Agendar consulta",
      "2️⃣ Convênios",
      "3️⃣ Horário de funcionamento",
      "4️⃣ Localização"
    ].join("\n");
  }
  if (op === "1") return "Perfeito! 😊\nUm momento, estou encaminhando sua mensagem diretamente para o nosso Dr. para finalizar o agendamento.";
  if (op === "2") return "No momento, realizamos atendimentos *particulares*.\nO valor da consulta é de *R$190,00*.\nOferecemos *recibo para reembolso* junto ao seu plano de saúde.";
  if (op === "3") return "Atendemos de *segunda a sexta*, das *6h às 22h*.\nSempre com horário agendado para melhor te atender!";
  if (op === "4") return "Estamos na *Av. Paulista, 807 – Conjunto 425*, São Paulo – SP.\n📍 Local de fácil acesso, próximo ao metrô. Será um prazer te receber!";
  return buildMenu();
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send("Token inválido");
  }

  if (req.method === "POST") {
    try {
      const entry = req.body?.entry?.[0]?.changes?.[0]?.value;
      const message = entry?.messages?.[0];
      const phone_number_id = entry?.metadata?.phone_number_id;

      if (message && phone_number_id) {
        const from = message.from;
        const userText = (message.text?.body || "").trim();
        const isGreeting = ["oi","olá","ola","menu","iniciar","bom dia","boa tarde","boa noite"].includes(userText.toLowerCase());
        const reply = isGreeting ? buildMenu() : buildReply(userText);

        console.log("FROM:", from, "| TEXT:", userText);

        await axios.post(
          `https://graph.facebook.com/v21.0/${phone_number_id}/messages`,
          {
            messaging_product: "whatsapp",
            to: from,
            type: "text",
            text: { body: reply }
          },
          { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` } }
        );
      }
      return res.status(200).send("EVENT_RECEIVED");
    } catch (e) {
      console.error("Erro ao processar webhook:", e?.response?.data || e.message);
      return res.status(500).send("Erro interno");
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).send("Method Not Allowed");
}
