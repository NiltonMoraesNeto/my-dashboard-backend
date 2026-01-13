-- CreateTable
CREATE TABLE "public"."empresas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "email" TEXT,
    "telefone" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "dataInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataFim" TIMESTAMP(3),
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "perfilId" INTEGER NOT NULL,
    "cep" TEXT,
    "avatar" TEXT,
    "resetCode" TEXT,
    "condominioId" TEXT,
    "empresaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."perfil" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "perfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."salesData" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "salesData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."salesDataByBuilding" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "buildingName" TEXT NOT NULL,

    CONSTRAINT "salesDataByBuilding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."unidades" (
    "id" TEXT NOT NULL,
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
    "empresaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contasPagar" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "vencimento" TIMESTAMP(3) NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "categoria" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "unidadeId" TEXT,
    "userId" TEXT NOT NULL,
    "empresaId" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contasPagar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."boletos" (
    "id" TEXT NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "vencimento" TIMESTAMP(3) NOT NULL,
    "arquivoPdf" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "dataPagamento" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "empresaId" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boletos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reunioes" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "hora" TEXT NOT NULL,
    "local" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'Assembleia',
    "pauta" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Agendada',
    "userId" TEXT NOT NULL,
    "empresaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reunioes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."avisos" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'Informativo',
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "empresaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."aviso_leitura" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "avisoId" TEXT NOT NULL,
    "lido" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aviso_leitura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."balancete_movimentacao" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "motivo" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "empresaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "balancete_movimentacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cnpj_key" ON "public"."empresas"("cnpj");

-- CreateIndex
CREATE INDEX "empresas_ativa_idx" ON "public"."empresas"("ativa");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "public"."usuarios"("email");

-- CreateIndex
CREATE INDEX "unidades_empresaId_idx" ON "public"."unidades"("empresaId");

-- CreateIndex
CREATE INDEX "contasPagar_empresaId_idx" ON "public"."contasPagar"("empresaId");

-- CreateIndex
CREATE INDEX "boletos_empresaId_idx" ON "public"."boletos"("empresaId");

-- CreateIndex
CREATE INDEX "reunioes_empresaId_idx" ON "public"."reunioes"("empresaId");

-- CreateIndex
CREATE INDEX "avisos_empresaId_idx" ON "public"."avisos"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "aviso_leitura_userId_avisoId_key" ON "public"."aviso_leitura"("userId", "avisoId");

-- CreateIndex
CREATE INDEX "balancete_movimentacao_empresaId_idx" ON "public"."balancete_movimentacao"("empresaId");

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "public"."perfil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "public"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuarios" ADD CONSTRAINT "usuarios_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."unidades" ADD CONSTRAINT "unidades_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."unidades" ADD CONSTRAINT "unidades_moradorId_fkey" FOREIGN KEY ("moradorId") REFERENCES "public"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."unidades" ADD CONSTRAINT "unidades_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contasPagar" ADD CONSTRAINT "contasPagar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contasPagar" ADD CONSTRAINT "contasPagar_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "public"."unidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contasPagar" ADD CONSTRAINT "contasPagar_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."boletos" ADD CONSTRAINT "boletos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."boletos" ADD CONSTRAINT "boletos_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "public"."unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."boletos" ADD CONSTRAINT "boletos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reunioes" ADD CONSTRAINT "reunioes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reunioes" ADD CONSTRAINT "reunioes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."avisos" ADD CONSTRAINT "avisos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."avisos" ADD CONSTRAINT "avisos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."aviso_leitura" ADD CONSTRAINT "aviso_leitura_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."aviso_leitura" ADD CONSTRAINT "aviso_leitura_avisoId_fkey" FOREIGN KEY ("avisoId") REFERENCES "public"."avisos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."balancete_movimentacao" ADD CONSTRAINT "balancete_movimentacao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."balancete_movimentacao" ADD CONSTRAINT "balancete_movimentacao_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
