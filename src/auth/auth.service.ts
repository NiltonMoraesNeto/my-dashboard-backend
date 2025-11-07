import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/auth.dto';

interface UserWithoutPassword {
  id: string;
  nome: string;
  email: string;
  perfilId: number;
  cep: string | null;
  avatar: string | null;
  resetCode: string | null;
  createdAt: Date;
  updatedAt: Date;
  perfil?: {
    id: number;
    descricao: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      perfilId: user.perfilId,
      nome: user.nome,
      avatar: user.avatar,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfilId: user.perfilId,
        perfil: user.perfil,
        avatar: user.avatar,
        cep: user.cep,
      },
    };
  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.usersService.findByEmail(decoded.email);
      
      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
