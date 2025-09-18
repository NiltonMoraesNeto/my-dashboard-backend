# My Dashboard Backend

API RESTful para o sistema de dashboard de vendas imobiliárias, construída com NestJS, Prisma, SQLite e documentada com Swagger.

## 🚀 Tecnologias

- **Framework**: NestJS
- **Banco de Dados**: SQLite com Prisma ORM
- **Documentação**: Swagger/OpenAPI
- **Validação**: class-validator & class-transformer
- **Linguagem**: TypeScript

## 📋 Funcionalidades

### Módulos da API

1. **Users** (`/users`)
   - ✅ CRUD completo de usuários
   - ✅ Relacionamento com perfis
   - ✅ Validação de dados

2. **Profiles** (`/profiles`)
   - ✅ CRUD completo de perfis
   - ✅ Gerenciamento de tipos de usuário

3. **Sales** (`/sales`)
   - ✅ CRUD de dados de vendas por ano
   - ✅ CRUD de dados de vendas por edifício
   - ✅ Filtros por ano e edifício

## 🔧 Instalação e Execução

### Pré-requisitos

- Node.js (v18+)
- npm

### Instalação

```bash
# Clone o repositório (se aplicável)
git clone <repository-url>
cd my-dashboard-backend

# Instale as dependências
npm install

# Configure o banco de dados
npx prisma migrate dev

# Popule o banco com dados iniciais
npm run db:seed
```

### Executar o Projeto

```bash
# Desenvolvimento (com hot reload)
npm run start:dev

# Produção
npm run build
npm run start:prod
```

O servidor estará disponível em: `http://localhost:4000`

## 📚 Documentação da API

Acesse a documentação Swagger em: `http://localhost:4000/api-docs`

### Endpoints Principais

#### Users

- `GET /users` - Listar todos os usuários
- `GET /users/:id` - Buscar usuário por ID
- `POST /users` - Criar novo usuário
- `PATCH /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Excluir usuário

#### Profiles

- `GET /profiles` - Listar todos os perfis
- `GET /profiles/:id` - Buscar perfil por ID
- `POST /profiles` - Criar novo perfil
- `PATCH /profiles/:id` - Atualizar perfil
- `DELETE /profiles/:id` - Excluir perfil

#### Sales

- `GET /sales` - Listar dados de vendas (com filtro por ano)
- `GET /sales?year=2024` - Filtrar vendas por ano
- `GET /sales/by-building` - Listar vendas por edifício
- `GET /sales/by-building?buildingName=Edifício A` - Filtrar por edifício

## 🗄️ Banco de Dados

### Schema

```typescript
model User {
  id        String   @id @default(cuid())
  nome      String
  email     String   @unique
  password  String
  perfilId  Int
  cep       String?
  avatar    String?
  resetCode String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  perfil Profile @relation(fields: [perfilId], references: [id])
}

model Profile {
  id        Int    @id @default(autoincrement())
  descricao String
  users     User[]
}

model SalesData {
  id    String @id @default(cuid())
  name  String
  value Int
  year  Int
}

model SalesDataByBuilding {
  id           String @id @default(cuid())
  name         String
  value        Int
  buildingName String
}
```

### Comandos Úteis do Prisma

```bash
# Gerar cliente Prisma
npx prisma generate

# Criar nova migração
npx prisma migrate dev --name <nome-da-migração>

# Resetar banco e aplicar seed
npm run db:reset

# Visualizar banco de dados
npx prisma studio
```

## 🔧 Scripts Disponíveis

```bash
npm run start          # Iniciar em produção
npm run start:dev      # Iniciar em desenvolvimento
npm run build          # Build do projeto
npm run db:seed        # Popular banco com dados
npm run db:reset       # Resetar e popular banco
npm run lint           # Executar linter
npm run test           # Executar testes
npm run test:e2e       # Executar testes e2e
```

## 📊 Dados de Exemplo

O projeto vem com dados pré-populados:

- **Perfis**: Administrador, RH, Financeiro, Compras, Vendas, Usuário
- **Usuário**: Admin padrão
- **Vendas**: Dados de 2024 e 2025 por mês
- **Edifícios**: Dados de vendas para Edifício A, B e C

## 🚀 Próximos Passos

- [ ] Adicionar middleware de logging
- [ ] Implementar cache com Redis
- [ ] Adicionar testes unitários e e2e
- [ ] Configurar CI/CD
- [ ] Adicionar rate limiting
- [ ] Implementar paginação

## 🤝 Integração com Frontend

Para conectar com o frontend React (`my-dashboard`), atualize as URLs da API para:

```typescript
const API_BASE_URL = 'http://localhost:4000';

// Exemplos de endpoints
const fetchUsers = () => fetch(`${API_BASE_URL}/users`);
const fetchSales = (year) => fetch(`${API_BASE_URL}/sales?year=${year}`);
const fetchSalesByBuilding = (building) =>
  fetch(`${API_BASE_URL}/sales/by-building?buildingName=${building}`);
```

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
