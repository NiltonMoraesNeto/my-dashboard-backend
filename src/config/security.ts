import { randomBytes, timingSafeEqual } from 'crypto';
import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Request, Response, NextFunction, CookieOptions } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export const AUTH_COOKIE_NAME = 'auth_token';
export const CSRF_COOKIE_NAME = 'csrf_token';
export const CSRF_HEADER_NAME = 'x-csrf-token';

const isProduction = process.env.NODE_ENV === 'production';

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET must be configured');
  }

  if (isProduction && secret.length < 32) {
    throw new Error('JWT_SECRET must have at least 32 characters in production');
  }

  return secret;
}

export function createCsrfToken() {
  return randomBytes(32).toString('base64url');
}

export function getAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
}

export function getCsrfCookieOptions(): CookieOptions {
  return {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
}

export function getClearCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  };
}

export function getClearCsrfCookieOptions(): CookieOptions {
  return {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  };
}

function getAllowedOrigins() {
  const envOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const origins = new Set<string>(envOrigins);

  if (!isProduction) {
    origins.add('http://localhost:5173');
  }

  if (process.env.VERCEL_URL) {
    origins.add(`https://${process.env.VERCEL_URL}`);
  }

  return origins;
}

export function configureCors(app: INestApplication) {
  const allowedOrigins = getAllowedOrigins();

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, !isProduction);

      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      if (isProduction) {
        console.warn(`CORS blocked origin: ${origin}`);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Requested-With', CSRF_HEADER_NAME],
  });
}

export function configureHttpSecurity(app: INestApplication) {
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/auth/login', authLimiter);
  app.use('/users/forgot-password', authLimiter);
  app.use('/users/validate-reset-code', authLimiter);
  app.use('/users/reset-password', authLimiter);
}

export function configureSwagger(app: INestApplication) {
  if (isProduction) return;

  const config = new DocumentBuilder()
    .setTitle('My Dashboard API')
    .setDescription('API para o sistema de gestão de condomínio')
    .setVersion('1.0')
    .addTag('users', 'Operações relacionadas aos usuários')
    .addTag('profiles', 'Operações relacionadas aos perfis')
    .addTag('sales', 'Operações relacionadas às vendas')
    .addTag('auth', 'Operações de autenticação')
    .addTag('condominio', 'Operações relacionadas à gestão de condomínio')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}

function tokensMatch(a: string, b: string) {
  const first = Buffer.from(a);
  const second = Buffer.from(b);

  return first.length === second.length && timingSafeEqual(first, second);
}

function isCsrfExemptPath(path: string) {
  return [
    '/auth/login',
    '/auth/check',
    '/users/forgot-password',
    '/users/validate-reset-code',
    '/users/reset-password',
    '/users/clean-resetCode',
  ].includes(path);
}

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const path = req.path || req.url.split('?')[0];
  if (isCsrfExemptPath(path)) {
    return next();
  }

  if (!req.cookies?.[AUTH_COOKIE_NAME]) {
    return next();
  }

  const csrfCookie = req.cookies?.[CSRF_COOKIE_NAME];
  const csrfHeader = req.header(CSRF_HEADER_NAME);

  if (!csrfCookie || !csrfHeader || !tokensMatch(csrfCookie, csrfHeader)) {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  return next();
}
