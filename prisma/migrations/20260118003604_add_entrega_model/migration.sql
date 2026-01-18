-- CreateTable
CREATE TABLE "public"."entregas" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL DEFAULT 'Nova entrega',
    "dataHora" TIMESTAMP(3) NOT NULL,
    "nomeRecebedor" TEXT NOT NULL,
    "recebidoPor" TEXT NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "empresaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entregas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "entregas_empresaId_idx" ON "public"."entregas"("empresaId");

-- CreateIndex
CREATE INDEX "entregas_unidadeId_idx" ON "public"."entregas"("unidadeId");

-- AddForeignKey
ALTER TABLE "public"."entregas" ADD CONSTRAINT "entregas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."entregas" ADD CONSTRAINT "entregas_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "public"."unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."entregas" ADD CONSTRAINT "entregas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
