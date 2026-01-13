# 🚀 Deploy do Backend na Vercel

## ⚠️ Considerações Importantes

### Vantagens:
- ✅ **Gratuito** para projetos pessoais
- ✅ **Deploy automático** via GitHub
- ✅ **CDN global** (muito rápido)
- ✅ **HTTPS automático**
- ✅ **Mesma plataforma** do frontend (mais fácil de gerenciar)

### Limitações:
- ⚠️ **Serverless Functions** - Cada requisição é uma função separada
- ⚠️ **Cold Start** - Primeira requisição pode ser mais lenta (~1-2s)
- ⚠️ **Timeout** - Funções têm limite de tempo (10s no plano gratuito, 60s no Pro)
- ⚠️ **Banco de Dados** - SQLite não funciona bem em serverless (use PostgreSQL)
- ⚠️ **Uploads de arquivos** - Limite de 4.5MB no plano gratuito

### Recomendação:
- ✅ **Ideal para**: APIs leves, sem processamento pesado
- ⚠️ **Cuidado com**: Uploads grandes, processamento longo, conexões persistentes

---

## 📋 Passos para Deploy

### 1. Preparar o Projeto

O projeto já está configurado com:
- ✅ `vercel.json` - Configuração do Vercel
- ✅ `api/index.ts` - Handler serverless para NestJS
- ✅ `package.json` - Dependências atualizadas

### 2. Atualizar Prisma para PostgreSQL

**IMPORTANTE**: SQLite não funciona bem em serverless. Use PostgreSQL:

1. Atualizar `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Mudar de sqlite
  url      = env("DATABASE_URL")
}
```

2. Criar migration:
```bash
npx prisma migrate dev --name init_postgres
```

### 3. Configurar Banco de Dados

Opções gratuitas de PostgreSQL:
- **Supabase** (recomendado): [supabase.com](https://supabase.com) - 500MB grátis
- **Neon**: [neon.tech](https://neon.tech) - 512MB grátis
- **Railway**: PostgreSQL gratuito (pode usar só o banco)
- **Render**: PostgreSQL gratuito

### 4. Deploy no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em "Add New Project"
3. Importe seu repositório
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `my-dashboard-backend`
   - **Build Command**: `npm install && npm run build && npx prisma generate`
   - **Output Directory**: (deixe vazio)
   - **Install Command**: `npm install`
5. Adicione variáveis de ambiente:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   JWT_SECRET=sua-chave-secreta-super-segura
   FRONTEND_URL=https://seu-frontend.vercel.app
   NODE_ENV=production
   ```
6. Clique em "Deploy"

### 5. Rodar Migrations

Após o deploy, você precisa rodar as migrations. Opções:

**Opção A - Via Vercel CLI:**
```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.local
npx prisma migrate deploy
```

**Opção B - Via Supabase/Neon Dashboard:**
- Acesse o SQL Editor do seu banco
- Execute as migrations manualmente

**Opção C - Script de Deploy:**
Adicione no `package.json`:
```json
{
  "scripts": {
    "vercel-build": "npm run build && npx prisma migrate deploy"
  }
}
```

---

## 🔧 Configuração Adicional

### Uploads de Arquivos

Se você usa uploads, considere usar:
- **Vercel Blob Storage** (pago)
- **Cloudinary** (tem tier gratuito)
- **AWS S3** (tem tier gratuito)
- **Supabase Storage** (gratuito até 1GB)

### Variáveis de Ambiente

Configure no Vercel Dashboard:
- Settings → Environment Variables

---

## 🐛 Troubleshooting

### Erro: "Prisma Client not generated"
**Solução**: Adicione `npx prisma generate` no build command

### Erro: "Database connection failed"
**Solução**: 
- Verifique se `DATABASE_URL` está correta
- Certifique-se de que o banco aceita conexões externas
- Verifique firewall/whitelist do banco

### Erro: "Function timeout"
**Solução**: 
- Otimize queries lentas
- Considere upgrade para Vercel Pro (60s timeout)
- Use background jobs para processamento pesado

### Cold Start lento
**Solução**: 
- Use Vercel Pro (melhor performance)
- Considere manter função "quente" com pings periódicos
- Otimize imports e inicialização

---

## 📊 Comparação: Vercel vs Railway

| Recurso | Vercel | Railway |
|---------|--------|---------|
| **Custo** | Gratuito | $5/mês grátis |
| **Tipo** | Serverless | Container tradicional |
| **Cold Start** | Sim (~1-2s) | Não |
| **Timeout** | 10s (free) / 60s (pro) | Sem limite |
| **Banco** | Precisa externo | Inclui PostgreSQL |
| **Uploads** | 4.5MB limite | Sem limite |
| **Facilidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 💡 Recomendação Final

**Para seu caso (Dashboard Multi-Tenant):**

- ✅ **Vercel**: Se você quer tudo em um lugar, não tem uploads grandes, e aceita cold starts
- ✅ **Railway**: Se você precisa de mais controle, sem cold starts, e quer banco incluído

**Minha sugestão**: Comece com **Vercel** (gratuito e fácil). Se tiver problemas, migre para Railway.

---

## 🎯 Próximos Passos

1. Escolher banco PostgreSQL (Supabase recomendado)
2. Atualizar Prisma schema
3. Fazer deploy no Vercel
4. Configurar variáveis de ambiente
5. Rodar migrations
6. Testar API

Boa sorte! 🚀
