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
import {
  AUTH_COOKIE_NAME,
  CSRF_COOKIE_NAME,
  createCsrfToken,
  getAuthCookieOptions,
  getClearCookieOptions,
  getClearCsrfCookieOptions,
  getCsrfCookieOptions,
} from '../config/security';

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

    res.cookie(AUTH_COOKIE_NAME, result.access_token, getAuthCookieOptions());
    res.cookie(CSRF_COOKIE_NAME, createCsrfToken(), getCsrfCookieOptions());

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
    res.clearCookie(AUTH_COOKIE_NAME, getClearCookieOptions());
    res.clearCookie(CSRF_COOKIE_NAME, getClearCsrfCookieOptions());

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
  async checkAuth(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.[AUTH_COOKIE_NAME];

    if (!token) {
      return { isAuthenticated: false };
    }

    try {
      const user = await this.authService.validateToken(token);
      if (!req.cookies?.[CSRF_COOKIE_NAME]) {
        res.cookie(CSRF_COOKIE_NAME, createCsrfToken(), getCsrfCookieOptions());
      }

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
