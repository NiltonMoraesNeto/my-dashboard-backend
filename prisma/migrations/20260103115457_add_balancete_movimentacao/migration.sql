-- CreateTable
CREATE TABLE "balancete_movimentacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "valor" REAL NOT NULL,
    "motivo" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "balancete_movimentacao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
