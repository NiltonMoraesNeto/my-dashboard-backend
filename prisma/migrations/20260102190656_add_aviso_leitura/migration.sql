-- CreateTable
CREATE TABLE "aviso_leitura" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "avisoId" TEXT NOT NULL,
    "lido" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "aviso_leitura_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "aviso_leitura_avisoId_fkey" FOREIGN KEY ("avisoId") REFERENCES "avisos" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "aviso_leitura_userId_avisoId_key" ON "aviso_leitura"("userId", "avisoId");
