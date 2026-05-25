import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import {
  configureCors,
  configureHttpSecurity,
  configureSwagger,
  csrfProtection,
} from '../src/config/security';

let cachedHandler: any;

async function createHandler() {
  if (cachedHandler) {
    return cachedHandler;
  }

  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  
  const app = await NestFactory.create(
    AppModule,
    adapter,
  );

  app.use(cookieParser());
  configureHttpSecurity(app);
  app.use(csrfProtection);

  configureCors(app);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  configureSwagger(app);

  await app.init();
  
  cachedHandler = expressApp;
  return expressApp;
}

export default async function handler(req: any, res: any) {
  const app = await createHandler();
  app(req, res);
}
