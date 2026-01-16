import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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
        resetCode: true,
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
        resetCode: true,
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
      if (empresaIdFromAuth !== undefined) {
        updateData.empresaId = empresaIdFromAuth;
      }
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

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

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
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Gera um token de 4 dígitos
    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Salva o token no banco
    await this.prisma.user.update({
      where: { email },
      data: { resetCode },
    });

    // Em produção, aqui você enviaria um email
    // Por enquanto, vamos apenas logar no console
    console.log('🔑 ===== TOKEN DE RESET DE SENHA =====');
    console.log(`📧 Email: ${email}`);
    console.log(`🔢 Token: ${resetCode}`);
    console.log('=====================================');

    return {
      message: 'Token gerado com sucesso',
      resetCode, // Em produção, NÃO retorne isso na API!
    };
  }

  // Reset password with token
  async resetPassword(email: string, resetCode: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.resetCode !== resetCode) {
      throw new Error('Token inválido');
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualiza a senha
    await this.prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    return { message: 'Senha alterada com sucesso' };
  }

  // Clean reset code
  async cleanResetCode(email: string, resetCode: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.resetCode !== resetCode) {
      throw new Error('Token inválido');
    }

    // Limpa o código
    await this.prisma.user.update({
      where: { email },
      data: { resetCode: null },
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
