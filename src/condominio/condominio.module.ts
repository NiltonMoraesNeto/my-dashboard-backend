import { Module } from '@nestjs/common';
import { CondominioService } from './condominio.service';
import { CondominioController } from './condominio.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CondominioController],
  providers: [CondominioService],
  exports: [CondominioService],
})
export class CondominioModule {}

