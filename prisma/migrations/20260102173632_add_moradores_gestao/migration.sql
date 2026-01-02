-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "moradorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "unidades_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "unidades_moradorId_fkey" FOREIGN KEY ("moradorId") REFERENCES "usuarios" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_unidades" ("apartamento", "bloco", "createdAt", "email", "id", "numero", "proprietario", "status", "telefone", "tipo", "updatedAt", "userId") SELECT "apartamento", "bloco", "createdAt", "email", "id", "numero", "proprietario", "status", "telefone", "tipo", "updatedAt", "userId" FROM "unidades";
DROP TABLE "unidades";
ALTER TABLE "new_unidades" RENAME TO "unidades";
CREATE TABLE "new_usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "perfilId" INTEGER NOT NULL,
    "cep" TEXT,
    "avatar" TEXT,
    "resetCode" TEXT,
    "condominioId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "usuarios_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "perfil" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "usuarios_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "usuarios" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_usuarios" ("avatar", "cep", "createdAt", "email", "id", "nome", "password", "perfilId", "resetCode", "updatedAt") SELECT "avatar", "cep", "createdAt", "email", "id", "nome", "password", "perfilId", "resetCode", "updatedAt" FROM "usuarios";
DROP TABLE "usuarios";
ALTER TABLE "new_usuarios" RENAME TO "usuarios";
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
