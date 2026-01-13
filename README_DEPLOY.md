# 🚀 Guia Rápido de Deploy - Backend

## Variáveis de Ambiente Necessárias

Configure estas variáveis no Railway/Render:

```env
# Banco de Dados
DATABASE_URL="postgresql://user:password@host:port/database"

# JWT
JWT_SECRET="sua-chave-secreta-super-segura-aqui"

# Frontend URL (para CORS)
FRONTEND_URL="https://seu-frontend.vercel.app"

# Porta (Railway/Render define automaticamente)
PORT=3000
```

## Passos para Deploy

### 1. Railway (Recomendado)

1. Acesse [railway.app](https://railway.app) e faça login com GitHub
2. Clique em "New Project" → "Deploy from GitHub repo"
3. Selecione seu repositório e a pasta `my-dashboard-backend`
4. Railway detectará automaticamente o projeto Node.js
5. Adicione um banco PostgreSQL:
   - Clique em "New" → "Database" → "Add PostgreSQL"
   - Railway criará automaticamente e fornecerá a `DATABASE_URL`
6. Configure as variáveis de ambiente (veja acima)
7. O deploy será automático!

### 2. Render (Alternativa)

1. Acesse [render.com](https://render.com) e faça login com GitHub
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório
4. Configure:
   - **Name**: `my-dashboard-backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Plan**: Free
5. Adicione banco PostgreSQL (New → PostgreSQL)
6. Configure variáveis de ambiente
7. Deploy!

## Migração do Banco de Dados

Após o primeiro deploy, você precisará rodar as migrations:

```bash
# Via Railway CLI
railway run npx prisma migrate deploy

# Ou via Render Shell
npx prisma migrate deploy
```

## Verificar Deploy

Após o deploy, acesse:
- API: `https://seu-backend.railway.app` (ou `.onrender.com`)
- Swagger: `https://seu-backend.railway.app/api-docs`

## Troubleshooting

### Erro: "Prisma Client not generated"
**Solução**: O script `postinstall` deve rodar automaticamente. Se não rodar, adicione manualmente no build command.

### Erro: "Database connection failed"
**Solução**: Verifique se a `DATABASE_URL` está correta e se o banco está acessível.

### Erro: "CORS error"
**Solução**: Adicione a URL do frontend na variável `FRONTEND_URL`.
