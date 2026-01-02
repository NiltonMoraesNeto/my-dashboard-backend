/*
  Warnings:

  - Added the required column `userId` to the `avisos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `boletos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `contasPagar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `reunioes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `unidades` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_avisos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'Informativo',
    "dataInicio" DATETIME NOT NULL,
    "dataFim" DATETIME,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "avisos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_avisos" ("createdAt", "dataFim", "dataInicio", "descricao", "destaque", "id", "tipo", "titulo", "updatedAt") SELECT "createdAt", "dataFim", "dataInicio", "descricao", "destaque", "id", "tipo", "titulo", "updatedAt" FROM "avisos";
DROP TABLE "avisos";
ALTER TABLE "new_avisos" RENAME TO "avisos";
CREATE TABLE "new_boletos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "unidadeId" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "valor" REAL NOT NULL,
    "vencimento" DATETIME NOT NULL,
    "codigoBarras" TEXT,
    "nossoNumero" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "dataPagamento" DATETIME,
    "userId" TEXT NOT NULL,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "boletos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "boletos_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_boletos" ("ano", "codigoBarras", "createdAt", "dataPagamento", "id", "mes", "nossoNumero", "observacoes", "status", "unidadeId", "updatedAt", "valor", "vencimento") SELECT "ano", "codigoBarras", "createdAt", "dataPagamento", "id", "mes", "nossoNumero", "observacoes", "status", "unidadeId", "updatedAt", "valor", "vencimento" FROM "boletos";
DROP TABLE "boletos";
ALTER TABLE "new_boletos" RENAME TO "boletos";
CREATE TABLE "new_contasPagar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descricao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "vencimento" DATETIME NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "categoria" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "unidadeId" TEXT,
    "userId" TEXT NOT NULL,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "contasPagar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "contasPagar_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_contasPagar" ("ano", "categoria", "createdAt", "descricao", "id", "mes", "observacoes", "status", "unidadeId", "updatedAt", "valor", "vencimento") SELECT "ano", "categoria", "createdAt", "descricao", "id", "mes", "observacoes", "status", "unidadeId", "updatedAt", "valor", "vencimento" FROM "contasPagar";
DROP TABLE "contasPagar";
ALTER TABLE "new_contasPagar" RENAME TO "contasPagar";
CREATE TABLE "new_reunioes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "hora" TEXT NOT NULL,
    "local" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'Assembleia',
    "pauta" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Agendada',
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "reunioes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_reunioes" ("createdAt", "data", "hora", "id", "local", "pauta", "status", "tipo", "titulo", "updatedAt") SELECT "createdAt", "data", "hora", "id", "local", "pauta", "status", "tipo", "titulo", "updatedAt" FROM "reunioes";
DROP TABLE "reunioes";
ALTER TABLE "new_reunioes" RENAME TO "reunioes";
CREATE TABLE "new_unidades" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numero" TEXT NOT NULL,
    "bloco" TEXT,
    "apartamento" TEXT,
    "tipo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Ativo',
    "proprietario" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "unidades_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_unidades" ("apartamento", "bloco", "createdAt", "email", "id", "numero", "proprietario", "status", "telefone", "tipo", "updatedAt") SELECT "apartamento", "bloco", "createdAt", "email", "id", "numero", "proprietario", "status", "telefone", "tipo", "updatedAt" FROM "unidades";
DROP TABLE "unidades";
ALTER TABLE "new_unidades" RENAME TO "unidades";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
