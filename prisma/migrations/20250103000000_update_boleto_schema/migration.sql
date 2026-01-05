-- AlterTable: Adicionar coluna descricao (nullable primeiro, depois podemos tornar obrigatório)
ALTER TABLE "boletos" ADD COLUMN "descricao" TEXT;

-- AlterTable: Adicionar coluna arquivoPdf
ALTER TABLE "boletos" ADD COLUMN "arquivoPdf" TEXT;

-- Atualizar registros existentes com descricao baseado em mes/ano
UPDATE "boletos" SET "descricao" = CASE 
  WHEN "mes" IS NOT NULL AND "ano" IS NOT NULL THEN 'Boleto - ' || CASE "mes"
    WHEN 1 THEN 'Janeiro'
    WHEN 2 THEN 'Fevereiro'
    WHEN 3 THEN 'Março'
    WHEN 4 THEN 'Abril'
    WHEN 5 THEN 'Maio'
    WHEN 6 THEN 'Junho'
    WHEN 7 THEN 'Julho'
    WHEN 8 THEN 'Agosto'
    WHEN 9 THEN 'Setembro'
    WHEN 10 THEN 'Outubro'
    WHEN 11 THEN 'Novembro'
    WHEN 12 THEN 'Dezembro'
    ELSE 'Mês ' || "mes"
  END || '/' || "ano"
  ELSE 'Boleto'
END;

-- Remover colunas antigas
-- SQLite não suporta DROP COLUMN diretamente, então precisamos recriar a tabela
PRAGMA foreign_keys=OFF;

CREATE TABLE "boletos_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "unidadeId" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "vencimento" DATETIME NOT NULL,
    "arquivoPdf" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "dataPagamento" DATETIME,
    "userId" TEXT NOT NULL,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "boletos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "boletos_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "boletos_new" ("id", "unidadeId", "descricao", "valor", "vencimento", "arquivoPdf", "status", "dataPagamento", "userId", "observacoes", "createdAt", "updatedAt")
SELECT "id", "unidadeId", "descricao", "valor", "vencimento", "arquivoPdf", "status", "dataPagamento", "userId", "observacoes", "createdAt", "updatedAt"
FROM "boletos";

DROP TABLE "boletos";
ALTER TABLE "boletos_new" RENAME TO "boletos";

PRAGMA foreign_keys=ON;

