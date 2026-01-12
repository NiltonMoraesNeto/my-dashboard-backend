-- CreateTable
CREATE TABLE IF NOT EXISTS "empresas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "email" TEXT,
    "telefone" TEXT,
    "ativa" INTEGER NOT NULL DEFAULT 1,
    "dataInicio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataFim" DATETIME,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "empresas_ativa_idx" ON "empresas"("ativa");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "empresas_cnpj_key" ON "empresas"("cnpj");

-- AlterTable: Adicionar empresaId em usuarios (nullable)
ALTER TABLE "usuarios" ADD COLUMN "empresaId" TEXT;

-- AlterTable: Adicionar empresaId em unidades (nullable)
ALTER TABLE "unidades" ADD COLUMN "empresaId" TEXT;

-- AlterTable: Adicionar empresaId em contasPagar (nullable)
ALTER TABLE "contasPagar" ADD COLUMN "empresaId" TEXT;

-- AlterTable: Adicionar empresaId em boletos (nullable)
ALTER TABLE "boletos" ADD COLUMN "empresaId" TEXT;

-- AlterTable: Adicionar empresaId em reunioes (nullable)
ALTER TABLE "reunioes" ADD COLUMN "empresaId" TEXT;

-- AlterTable: Adicionar empresaId em avisos (nullable)
ALTER TABLE "avisos" ADD COLUMN "empresaId" TEXT;

-- AlterTable: Adicionar empresaId em balancete_movimentacao (nullable)
ALTER TABLE "balancete_movimentacao" ADD COLUMN "empresaId" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "unidades_empresaId_idx" ON "unidades"("empresaId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "contasPagar_empresaId_idx" ON "contasPagar"("empresaId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "boletos_empresaId_idx" ON "boletos"("empresaId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "reunioes_empresaId_idx" ON "reunioes"("empresaId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "avisos_empresaId_idx" ON "avisos"("empresaId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "balancete_movimentacao_empresaId_idx" ON "balancete_movimentacao"("empresaId");

-- AddForeignKey (usuarios -> empresas)
-- SQLite não permite adicionar foreign key depois, então vamos criar a constraint de forma diferente
-- A foreign key será verificada apenas pelo Prisma Client

-- AddForeignKey (unidades -> empresas)
-- A foreign key será verificada apenas pelo Prisma Client

-- AddForeignKey (contasPagar -> empresas)
-- A foreign key será verificada apenas pelo Prisma Client

-- AddForeignKey (boletos -> empresas)
-- A foreign key será verificada apenas pelo Prisma Client

-- AddForeignKey (reunioes -> empresas)
-- A foreign key será verificada apenas pelo Prisma Client

-- AddForeignKey (avisos -> empresas)
-- A foreign key será verificada apenas pelo Prisma Client

-- AddForeignKey (balancete_movimentacao -> empresas)
-- A foreign key será verificada apenas pelo Prisma Client

-- Nota: SQLite tem limitações com ALTER TABLE para foreign keys.
-- As relações serão gerenciadas pelo Prisma Client.
