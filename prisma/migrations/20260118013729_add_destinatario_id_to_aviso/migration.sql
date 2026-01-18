-- AlterTable
ALTER TABLE "public"."avisos" ADD COLUMN     "destinatarioId" TEXT;

-- CreateIndex
CREATE INDEX "avisos_destinatarioId_idx" ON "public"."avisos"("destinatarioId");

-- AddForeignKey
ALTER TABLE "public"."avisos" ADD CONSTRAINT "avisos_destinatarioId_fkey" FOREIGN KEY ("destinatarioId") REFERENCES "public"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
