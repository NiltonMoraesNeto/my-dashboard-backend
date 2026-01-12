import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmpresaAtivaGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as any;

    // SuperAdmin sempre tem acesso
    if (user?.isSuperAdmin) {
      return true;
    }

    // Se não tem empresaId, não deve acessar (exceto SuperAdmin)
    if (!user?.empresaId) {
      throw new UnauthorizedException('Usuário não vinculado a uma empresa.');
    }

    // Verificar se a empresa está ativa
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: user.empresaId },
    });

    if (!empresa) {
      throw new UnauthorizedException('Empresa não encontrada.');
    }

    if (!empresa.ativa) {
      throw new UnauthorizedException(
        'Sua licença está inativa. Entre em contato com o administrador.',
      );
    }

    return true;
  }
}
