import {
  Body,
  Controller,
  Post,
  Get,
  HttpStatus,
  HttpCode,
  Res,
  Req,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, AuthResponseDto } from './dto/auth.dto';
import { Public } from './public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fazer login no sistema' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login realizado com sucesso.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciais inválidas.',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    // Define o token em um httpOnly cookie
    res.cookie('auth_token', result.access_token, {
      httpOnly: true, // Não pode ser acessado por JavaScript
      secure: process.env.NODE_ENV === 'production', // Só HTTPS em produção
      sameSite: 'lax', // Proteção CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    });

    // Retorna apenas os dados do usuário (sem o token)
    return {
      user: result.user,
      message: 'Login realizado com sucesso',
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fazer logout do sistema' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logout realizado com sucesso.',
  })
  async logout(@Res({ passthrough: true }) res: Response) {
    // Remove o cookie
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return { message: 'Logout realizado com sucesso' };
  }

  @Get('me')
  @ApiOperation({ summary: 'Obter dados do usuário autenticado' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dados do usuário.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Não autenticado.',
  })
  async getMe(@Req() req: Request) {
    return req.user;
  }

  @Public()
  @Get('check')
  @ApiOperation({ summary: 'Verificar se o usuário está autenticado' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status de autenticação.',
  })
  async checkAuth(@Req() req: Request) {
    const token = req.cookies?.auth_token;

    if (!token) {
      return { isAuthenticated: false };
    }

    try {
      const user = await this.authService.validateToken(token);
      return {
        isAuthenticated: true,
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
    } catch {
      return { isAuthenticated: false };
    }
  }
}
