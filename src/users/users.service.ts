import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomInt } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcryptjs';

const RESET_CODE_TTL_MINUTES = 15;
const MAX_RESET_ATTEMPTS = 5;
const RESET_MESSAGE =
  'Se o email estiver cadastrado, enviaremos um código de recuperação.';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  private assertCanAccessUser(
    targetUser: { empresaId: string | null },
    empresaIdFromAuth?: string | null,
    isSuperAdminAuth?: boolean,
  ) {
    if (isSuperAdminAuth) return;

    if (!empresaIdFromAuth || targetUser.empresaId !== empresaIdFromAuth) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  async create(createUserDto: CreateUserDto, empresaIdFromAuth?: string | null, isSuperAdminAuth?: boolean) {
    // Buscar perfis para validação
    const allProfiles = await this.prisma.profile.findMany();
    const perfilMorador = allProfiles.find((p) =>
      p.descricao.toLowerCase().includes('morador'),
    );

    // Se o perfil for Morador, validar condominioId
    if (perfilMorador && createUserDto.perfilId === perfilMorador.id) {
      if (!createUserDto.condominioId) {
        throw new BadRequestException(
          'Condomínio é obrigatório para usuários com perfil Morador',
        );
      }

      // Verificar se o condomínio existe
      const condominio = await this.prisma.user.findUnique({
        where: { id: createUserDto.condominioId },
      });

      if (!condominio) {
        throw new NotFoundException('Condomínio não encontrado');
      }

      // Verificar se o condomínio tem perfil de Condomínio
      const perfilCondominio = allProfiles.find(
        (p) =>
          p.descricao.toLowerCase().includes('condomínio') ||
          p.descricao.toLowerCase().includes('condominio'),
      );

      if (perfilCondominio && condominio.perfilId !== perfilCondominio.id) {
        throw new BadRequestException(
          'O ID informado não corresponde a um condomínio válido',
        );
      }
    }

    // Lógica de empresaId:
    // - Se for SuperAdmin (isSuperAdminAuth === true): usa empresaId do DTO (pode ser null)
    // - Se não for SuperAdmin: usa empresaId do usuário autenticado (empresaIdFromAuth)
    let empresaIdFinal: string | null | undefined = undefined;
    if (isSuperAdminAuth) {
      // SuperAdmin pode escolher a empresa (ou null)
      // Se empresaId for string vazia ou undefined, usar null
      empresaIdFinal = (createUserDto.empresaId && createUserDto.empresaId.trim() !== '') 
        ? createUserDto.empresaId 
        : null;
    } else {
      // Não-SuperAdmin usa a empresa do usuário autenticado
      empresaIdFinal = empresaIdFromAuth || null;
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        empresaId: empresaIdFinal,
        password: hashedPassword,
      },
      include: {
        perfil: true,
      },
    });

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findAll(page: number = 1, limit: number = 10, search: string = '', empresaId?: string | null, isSuperAdmin?: boolean) {
    const skip = (page - 1) * limit;
    
    // Construir o where clause
    const where: any = {};
    
    // Se não for SuperAdmin, filtrar por empresaId
    if (!isSuperAdmin && empresaId) {
      where.empresaId = empresaId;
    }
    // Se for SuperAdmin, não filtrar por empresaId (vê todos)
    
    // Para SQLite, precisamos buscar todos e filtrar manualmente para case-insensitive
    let allUsers = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        nome: true,
        email: true,
        perfilId: true,
        cep: true,
        avatar: true,
        empresaId: true,
        createdAt: true,
        updatedAt: true,
        perfil: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Aplicar filtro de busca case-insensitive (busca por nome ou email)
    if (search && search.trim() !== '') {
      const searchLower = search.toLowerCase();
      allUsers = allUsers.filter((user) =>
        user.nome.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower),
      );
    }

    const total = allUsers.length;
    const data = allUsers.slice(skip, skip + limit);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, empresaId?: string | null, isSuperAdmin?: boolean) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        perfilId: true,
        cep: true,
        cpf: true,
        dataNascimento: true,
        logradouro: true,
        numero: true,
        complemento: true,
        bairro: true,
        cidade: true,
        uf: true,
        avatar: true,
        condominioId: true,
        empresaId: true,
        createdAt: true,
        updatedAt: true,
        perfil: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Validar isolamento por empresaId (se não for SuperAdmin)
    // Nota: Se isSuperAdmin ou empresaId não fornecido, não validar (usado internamente pelo JwtStrategy)
    if (isSuperAdmin !== undefined && empresaId !== undefined && !isSuperAdmin && empresaId && user.empresaId !== empresaId) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, empresaIdFromAuth?: string | null, isSuperAdminAuth?: boolean) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.assertCanAccessUser(user, empresaIdFromAuth, isSuperAdminAuth);

    // Lógica de empresaId:
    // - Se for SuperAdmin: pode alterar empresaId (usa do DTO)
    // - Se não for SuperAdmin: não pode alterar empresaId (mantém o atual ou usa do auth)
    const updateData: any = { ...updateUserDto };
    if (isSuperAdminAuth) {
      // SuperAdmin pode alterar empresaId
      if (updateUserDto.empresaId !== undefined) {
        updateData.empresaId = updateUserDto.empresaId;
      }
    } else {
      // Não-SuperAdmin não pode alterar empresaId, mantém o atual ou usa do auth
      delete updateData.empresaId;
      delete updateData.perfilId;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        perfil: true,
      },
    });

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async remove(id: string, empresaIdFromAuth?: string | null, isSuperAdminAuth?: boolean) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.assertCanAccessUser(user, empresaIdFromAuth, isSuperAdminAuth);

    return this.prisma.user.delete({ where: { id } });
  }

  // Method for authentication - returns user with password for validation
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        perfil: true,
      },
    });
  }

  // Forgot password - Generate reset token
  async forgotPassword(email: string) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return { message: RESET_MESSAGE };
    }

    const resetCode = randomInt(100000, 1000000).toString();
    const hashedResetCode = await bcrypt.hash(resetCode, 10);
    const resetCodeExpiresAt = new Date(
      Date.now() + RESET_CODE_TTL_MINUTES * 60 * 1000,
    );

    await this.prisma.user.update({
      where: { email: normalizedEmail },
      data: {
        resetCode: hashedResetCode,
        resetCodeExpiresAt,
        resetAttempts: 0,
      },
    });

    // Envia o token por email
    try {
      await this.emailService.sendResetPasswordEmail(
        normalizedEmail,
        resetCode,
        user.nome,
      );
    } catch (error) {
      console.error('Erro ao enviar email de reset de senha:', error);
      // Não lança erro para não expor informações sensíveis
      // O token ainda foi gerado e salvo no banco
    }

    return {
      message: RESET_MESSAGE,
    };
  }

  private async validatePasswordResetUser(email: string, resetCode: string) {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedResetCode = String(resetCode || '').trim();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !user.resetCode || !user.resetCodeExpiresAt) {
      throw new BadRequestException('Código inválido ou expirado');
    }

    if (user.resetCodeExpiresAt.getTime() < Date.now()) {
      await this.prisma.user.update({
        where: { email: normalizedEmail },
        data: {
          resetCode: null,
          resetCodeExpiresAt: null,
          resetAttempts: 0,
        },
      });
      throw new BadRequestException('Código inválido ou expirado');
    }

    if (user.resetAttempts >= MAX_RESET_ATTEMPTS) {
      throw new BadRequestException(
        'Muitas tentativas inválidas. Solicite um novo código.',
      );
    }

    const isValid = await bcrypt.compare(normalizedResetCode, user.resetCode);
    if (!isValid) {
      await this.prisma.user.update({
        where: { email: normalizedEmail },
        data: { resetAttempts: { increment: 1 } },
      });
      throw new BadRequestException('Código inválido ou expirado');
    }

    return { user, normalizedEmail };
  }

  // Reset password with token
  async resetPassword(email: string, resetCode: string, newPassword: string) {
    const { normalizedEmail } = await this.validatePasswordResetUser(
      email,
      resetCode,
    );

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { email: normalizedEmail },
      data: {
        password: hashedPassword,
        resetCode: null,
        resetCodeExpiresAt: null,
        resetAttempts: 0,
      },
    });

    return { message: 'Senha alterada com sucesso' };
  }

  // Validate reset code (without changing password)
  async validateResetCode(email: string, resetCode: string) {
    await this.validatePasswordResetUser(email, resetCode);

    return { message: 'Token válido', valid: true };
  }

  // Clean reset code
  async cleanResetCode(email: string, resetCode: string) {
    const { normalizedEmail } = await this.validatePasswordResetUser(
      email,
      resetCode,
    );

    await this.prisma.user.update({
      where: { email: normalizedEmail },
      data: {
        resetCode: null,
        resetCodeExpiresAt: null,
        resetAttempts: 0,
      },
    });

    return { message: 'Código limpo com sucesso' };
  }

  async changePassword(
    userId: string,
    payload: { currentPassword: string; newPassword: string },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isValid = await bcrypt.compare(
      payload.currentPassword,
      user.password,
    );

    if (!isValid) {
      throw new BadRequestException('Senha atual inválida');
    }

    const hashedPassword = await bcrypt.hash(payload.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return { message: 'Senha alterada com sucesso' };
  }

  async findAllCondominios(empresaId?: string | null, isSuperAdmin?: boolean) {
    // Buscar perfil Condomínio
    const allProfiles = await this.prisma.profile.findMany();
    const perfilCondominio = allProfiles.find(
      (p) =>
        p.descricao.toLowerCase().includes('condomínio') ||
        p.descricao.toLowerCase().includes('condominio'),
    );

    if (!perfilCondominio) {
      return [];
    }

    // Construir o where clause
    const where: any = {
      perfilId: perfilCondominio.id,
    };

    // Se não for SuperAdmin, filtrar por empresaId
    if (!isSuperAdmin && empresaId) {
      where.empresaId = empresaId;
    }
    // Se for SuperAdmin, não filtrar por empresaId (vê todos)

    // Buscar usuários com perfil Condomínio
    const condominios = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        nome: true,
        email: true,
      },
      orderBy: {
        nome: 'asc',
      },
    });

    return condominios;
  }
}
