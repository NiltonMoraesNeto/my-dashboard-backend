import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as any;

    if (!user || !user.isSuperAdmin) {
      throw new ForbiddenException('Acesso negado. Apenas SuperAdmin pode acessar esta rota.');
    }

    return true;
  }
}
