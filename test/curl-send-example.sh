#!/usr/bin/env bash
# Exemplo de envio de texto via Cloud API (substitua os valores)
PHONE_NUMBER_ID="SEU_PHONE_NUMBER_ID"
TOKEN="SEU_TOKEN"
DESTINO="55DDDNUMERO"

curl -X POST "https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages"   -H "Authorization: Bearer ${TOKEN}"   -H "Content-Type: application/json"   -d '{
    "messaging_product": "whatsapp",
    "to": "'${DESTINO}'",
    "type": "text",
    "text": { "body": "Olá do Cloud API 👋" }
  }'
