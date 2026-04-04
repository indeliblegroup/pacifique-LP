#!/bin/bash
# Script para configurar variáveis de ambiente na Vercel via CLI

echo "🔧 Configurando variáveis de ambiente na Vercel..."
echo ""

# IMPORTANTE: Substitua os valores XXXX pelos valores reais antes de executar!

# 1. NEXTAUTH_SECRET (já gerado)
vercel env add NEXTAUTH_SECRET production <<< "7tLFU6F8MEgNww+ElC9RQuV89FvYogzQOgNaH7+oqP0="
vercel env add NEXTAUTH_SECRET preview <<< "7tLFU6F8MEgNww+ElC9RQuV89FvYogzQOgNaH7+oqP0="
vercel env add NEXTAUTH_SECRET development <<< "7tLFU6F8MEgNww+ElC9RQuV89FvYogzQOgNaH7+oqP0="

# 2. NEXTAUTH_URL
vercel env add NEXTAUTH_URL production <<< "https://pacifique.com.br"

# 3. DATABASE_URL (SUBSTITUIR COM VALOR DO RAILWAY)
read -p "Cole a DATABASE_URL do Railway: " DATABASE_URL
vercel env add DATABASE_URL production <<< "$DATABASE_URL"
vercel env add DATABASE_URL preview <<< "$DATABASE_URL"
vercel env add DATABASE_URL development <<< "$DATABASE_URL"

# 4. DIRECT_URL (mesmo valor)
vercel env add DIRECT_URL production <<< "$DATABASE_URL"
vercel env add DIRECT_URL preview <<< "$DATABASE_URL"
vercel env add DIRECT_URL development <<< "$DATABASE_URL"

# 5. BLOB_READ_WRITE_TOKEN (SUBSTITUIR)
read -p "Cole o BLOB_READ_WRITE_TOKEN da Vercel: " BLOB_TOKEN
vercel env add BLOB_READ_WRITE_TOKEN production <<< "$BLOB_TOKEN"
vercel env add BLOB_READ_WRITE_TOKEN preview <<< "$BLOB_TOKEN"
vercel env add BLOB_READ_WRITE_TOKEN development <<< "$BLOB_TOKEN"

# 6. RESEND_API_KEY (SUBSTITUIR)
read -p "Cole o RESEND_API_KEY: " RESEND_KEY
vercel env add RESEND_API_KEY production <<< "$RESEND_KEY"
vercel env add RESEND_API_KEY preview <<< "$RESEND_KEY"
vercel env add RESEND_API_KEY development <<< "$RESEND_KEY"

# 7. RESEND_FROM_EMAIL
vercel env add RESEND_FROM_EMAIL production <<< "noreply@pacifique.com.br"
vercel env add RESEND_FROM_EMAIL preview <<< "noreply@pacifique.com.br"
vercel env add RESEND_FROM_EMAIL development <<< "noreply@pacifique.com.br"

# 8. Admin inicial
vercel env add ADMIN_EMAIL production <<< "admin@pacifique.com.br"
vercel env add ADMIN_EMAIL preview <<< "admin@pacifique.com.br"
vercel env add ADMIN_EMAIL development <<< "admin@pacifique.com.br"

read -p "Defina uma senha de admin: " ADMIN_PASSWORD
vercel env add ADMIN_PASSWORD production <<< "$ADMIN_PASSWORD"
vercel env add ADMIN_PASSWORD preview <<< "$ADMIN_PASSWORD"
vercel env add ADMIN_PASSWORD development <<< "$ADMIN_PASSWORD"

vercel env add ADMIN_NAME production <<< "Administrador PACIFIQUE!"
vercel env add ADMIN_NAME preview <<< "Administrador PACIFIQUE!"
vercel env add ADMIN_NAME development <<< "Administrador PACIFIQUE!"

echo ""
echo "✅ Todas as variáveis foram configuradas!"
echo "🚀 Agora rode: vercel --prod"
