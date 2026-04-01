# 🚀 Guia de Deploy - PACIFIQUE! Backoffice

## Pré-requisitos

- Node.js 18+ instalado
- Conta GitHub
- Conta Vercel (https://vercel.com)
- Conta Railway (https://railway.app) - para PostgreSQL grátis
- Conta Resend (https://resend.com) - para emails

---

## Passo 1: Configurar Railway (PostgreSQL)

1. Acesse: https://railway.app
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione "Provision PostgreSQL"
5. Aguarde criação do database
6. Na aba "Variables", copie:
   - `DATABASE_URL` (connection string completa)
   - `DATABASE_PRIVATE_URL` (usar como DIRECT_URL)

**Importante:** Railway oferece $5/mês grátis (suficiente para MVP)

---

## Passo 2: Configurar Vercel Blob Storage

1. Acesse: https://vercel.com/dashboard
2. Vá em "Storage" → "Create Database"
3. Selecione "Blob" → "Create"
4. Copie o `BLOB_READ_WRITE_TOKEN`

---

## Passo 3: Configurar Resend (Email)

1. Acesse: https://resend.com/signup
2. Crie uma conta
3. Vá em "API Keys" → "Create API Key"
4. Copie a chave gerada
5. (Opcional) Configure domínio customizado em "Domains"

**Limite Free:** 100 emails/dia (suficiente para MVP)

---

## Passo 4: Preparar Variáveis de Ambiente

Crie um arquivo `.env.production` (NÃO commitar!) com:

```bash
# Railway PostgreSQL
DATABASE_URL="postgresql://postgres:XXX@containers-us-west-XXX.railway.app:5432/railway"
DIRECT_URL="postgresql://postgres:XXX@containers-us-west-XXX.railway.app:5432/railway"

# NextAuth (GERAR NOVO!)
NEXTAUTH_URL="https://seu-app.vercel.app"
NEXTAUTH_SECRET="<GERAR_COM_COMANDO_ABAIXO>"

# Vercel Blob
BLOB_READ_WRITE_TOKEN="vercel_blob_XXXXXXXXXXXXXXXX"

# Resend
RESEND_API_KEY="re_XXXXXXXXXXXXXXXX"
RESEND_FROM_EMAIL="noreply@pacifique.com.br"

# Admin inicial
ADMIN_EMAIL="admin@pacifique.com.br"
ADMIN_PASSWORD="SenhaSegura123!"
ADMIN_NAME="Administrador"
```

**Gerar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## Passo 5: Rodar Migrations (Local com DB de Produção)

```bash
# 1. Instalar dependências
pnpm install

# 2. Gerar Prisma Client
npx prisma generate

# 3. Rodar migrations
npx prisma migrate deploy

# 4. Seed admin user
npx prisma db seed
```

---

## Passo 6: Deploy na Vercel

### Opção A: Via Dashboard (Recomendado)

1. Push código para GitHub
2. Acesse: https://vercel.com/new
3. Importe o repositório
4. Configure:
   - Framework Preset: **Next.js**
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`
5. Adicione as variáveis de ambiente (copiar do .env.production)
6. Clique em "Deploy"

### Opção B: Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Configurar variáveis no dashboard
# Depois:
vercel --prod
```

---

## Passo 7: Configurar Variáveis de Ambiente na Vercel

1. No dashboard do projeto: "Settings" → "Environment Variables"
2. Adicionar TODAS as variáveis do `.env.production`
3. Selecione: **Production**, **Preview**, **Development**
4. Clique "Save"

---

## Passo 8: Verificar Deploy

1. Acesse: `https://seu-app.vercel.app`
2. Vá para: `https://seu-app.vercel.app/auth/login`
3. Login com:
   - Email: `admin@pacifique.com.br`
   - Senha: (a que você configurou)
4. Teste criar um processo, upload de documento, enviar email

---

## Checklist Final ✅

- [ ] Railway PostgreSQL configurado
- [ ] Vercel Blob configurado
- [ ] Resend configurado
- [ ] NEXTAUTH_SECRET gerado (32+ caracteres)
- [ ] Migrations rodadas (`prisma migrate deploy`)
- [ ] Admin user seedado
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Deploy realizado
- [ ] Login funciona
- [ ] Criar processo funciona
- [ ] Upload de documento funciona
- [ ] Envio de email funciona

---

## Troubleshooting

### Build falha com "DATABASE_URL not found"
- Verifique se adicionou a variável na Vercel
- Re-deploy após adicionar variáveis

### "Error connecting to database"
- Verifique connection string do Railway
- Teste conexão local: `npx prisma studio`

### Upload de documento falha
- Verifique `BLOB_READ_WRITE_TOKEN`
- Confirme que Blob Store foi criado na Vercel

### Email não envia
- Verifique `RESEND_API_KEY`
- Confirme domínio verificado no Resend (ou use teste)

---

## Custos

| Serviço | Plano | Custo |
|---------|-------|-------|
| Vercel | Hobby | $0/mês |
| Railway | Dev ($5 grátis) | $0/mês |
| Vercel Blob | Hobby | $0/mês |
| Resend | Free | $0/mês |
| **TOTAL** | | **$0/mês** |

**Limite MVP:**
- Railway: $5 grátis/mês
- Vercel Blob: 10GB grátis
- Resend: 100 emails/dia

---

## Próximos Passos (Pós-MVP)

1. Configurar domínio customizado
2. Habilitar SSL/HTTPS (automático na Vercel)
3. Monitorar analytics (Vercel Analytics)
4. Configurar backups do PostgreSQL
5. Implementar notificações
6. Configurar WhatsApp Business API

---

## Suporte

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Resend Docs: https://resend.com/docs
- Prisma Docs: https://www.prisma.io/docs
