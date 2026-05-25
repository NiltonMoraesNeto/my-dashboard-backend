import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  configureCors,
  configureHttpSecurity,
  configureSwagger,
  csrfProtection,
} from './config/security';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

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

  const port = process.env.PORT ?? 4000;
  
  try {
    // Escuta em 0.0.0.0 para permitir conexões externas (necessário no Railway)
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Application is running on: http://0.0.0.0:${port}`);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`📚 Swagger docs available at: http://0.0.0.0:${port}/api-docs`);
    }
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}
bootstrap();
