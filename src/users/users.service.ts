import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
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

  async findAll(page: number = 1, limit: number = 10, search: string = '') {
    const skip = (page - 1) * limit;
    
    // Para SQLite, precisamos buscar todos e filtrar manualmente para case-insensitive
    let allUsers = await this.prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        perfilId: true,
        cep: true,
        avatar: true,
        resetCode: true,
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

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        perfilId: true,
        cep: true,
        avatar: true,
        resetCode: true,
        createdAt: true,
        updatedAt: true,
        perfil: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
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
}
