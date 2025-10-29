# 🤖 Bot WhatsApp – Clínica Blanquer (Meta Cloud API + Vercel) – v2

Esta é a versão **v2** do pacote para a Vercel, com logs de depuração e instruções simplificadas.

## 📦 Conteúdo
- `api/webhook.js` – função serverless (GET: verifica webhook / POST: responde mensagens).
- `package.json` – dependências (axios).
- `vercel.json` – runtime Node 18.x.
- `.env.example` – variáveis de ambiente de referência.
- `test/curl-send-example.sh` – exemplo de envio via cURL.
- `README.md` – guia rápido de deploy.

## 🚀 Deploy (Vercel)
1. Acesse https://vercel.com → **New Project** → **Import** esta pasta.
2. Em **Settings → Environment Variables** crie:
   - `VERIFY_TOKEN` = `clinica_token`
   - `WHATSAPP_TOKEN` = cole o token do painel Meta
3. Faça **Deploy**.
4. Use a URL pública em **Webhook URL** no painel da Meta: `https://SEU-APP.vercel.app/api/webhook`.
5. Em **Verify Token** no painel Meta, digite o mesmo valor de `VERIFY_TOKEN`.

## 🧪 Testes
- Envie “oi” para o número de teste. Você verá o **menu**.
- Responda **1**, **2**, **3** ou **4** e receba a resposta automática.
- Para ver logs, abra a aba **Logs** do projeto na Vercel.

## 🔒 Produção
- Verifique seu negócio no Business Manager.
- Registre o número oficial da clínica.
- Gere um **token permanente** (System User) e atualize `WHATSAPP_TOKEN`.
- Faça novo deploy.
