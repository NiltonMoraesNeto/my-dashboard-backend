import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable cookie parser
  app.use(cookieParser());

  // Enable CORS com suporte a cookies
  app.enableCors({
    origin: 'http://localhost:5173', // URL do frontend
    credentials: true, // Permite envio de cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('My Dashboard API')
    .setDescription('API para o sistema de dashboard de vendas imobiliárias')
    .setVersion('1.0')
    .addTag('users', 'Operações relacionadas aos usuários')
    .addTag('profiles', 'Operações relacionadas aos perfis')
    .addTag('sales', 'Operações relacionadas às vendas')
    .addTag('auth', 'Operações de autenticação')
    .addTag('condominio', 'Operações relacionadas à gestão de condomínio')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o token JWT obtido no login',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT ?? 4000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(
    `📚 Swagger docs available at: http://localhost:${port}/api-docs`,
  );
}
bootstrap();
