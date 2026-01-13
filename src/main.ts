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
  const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL, // URL do frontend em produção
  ].filter(Boolean); // Remove valores undefined/null

  app.enableCors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (ex: Postman, mobile apps)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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
  
  try {
    // Escuta em 0.0.0.0 para permitir conexões externas (necessário no Railway)
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Application is running on: http://0.0.0.0:${port}`);
    console.log(`📚 Swagger docs available at: http://0.0.0.0:${port}/api-docs`);
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}
bootstrap();
