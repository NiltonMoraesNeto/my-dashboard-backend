# My Dashboard Backend

API NestJS para o sistema de gerenciamento de condomínio.

## Stack

- NestJS
- Prisma
- PostgreSQL
- Cookie-only auth com CSRF
- Swagger em desenvolvimento

## Ambiente Local Com OrbStack

Suba o Postgres:

```bash
npm run db:up
```

Configure o `.env` local:

```bash
DATABASE_URL="postgresql://mydashboard:mydashboard@localhost:5434/mydashboard?schema=public"
JWT_SECRET="troque-por-uma-chave-com-pelo-menos-32-caracteres"
FRONTEND_URL="http://localhost:5173"
RESEND_API_KEY=""
RESEND_FROM_EMAIL=""
RESEND_FROM_NAME="Sistema de Gestão"
```

Instale dependências, rode as migrations e aplique seed:

```bash
npm install
npm run db:migrate
npm run db:seed
```

Inicie o backend:

```bash
npm run start:dev
```

O servidor local fica em `http://localhost:4000`.

## DBeaver

Use estes dados para criar a conexão local:

```text
Host: localhost
Port: 5434
Database: mydashboard
Username: mydashboard
Password: mydashboard
```

## Scripts

```bash
npm run db:up        # sobe Postgres local
npm run db:down      # derruba containers locais
npm run db:logs      # logs do Postgres
npm run db:migrate   # cria/aplica migration em desenvolvimento
npm run db:deploy    # aplica migrations em produção/CI
npm run db:seed      # popula dados iniciais
npm run build        # build de produção
npm run start:prod   # roda dist/main.js
```

## Banco

O Prisma está configurado para PostgreSQL em [prisma/schema.prisma](./prisma/schema.prisma).

Arquivos SQLite locais antigos, como `prisma/dev.db`, não devem ser versionados nem usados daqui para frente.

## Produção

Antes de publicar:

- Defina `DATABASE_URL` apontando para Postgres gerenciado.
- Defina `JWT_SECRET` forte com pelo menos 32 caracteres.
- Defina `FRONTEND_URL` com o domínio exato do frontend.
- Rode `npm run db:deploy`.
- Não exponha `/uploads` publicamente; arquivos devem sair por endpoints autenticados.
