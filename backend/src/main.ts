/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:5173',  // Vite default port
      'http://127.0.0.1:5173',  // Alternative localhost
      'http://localhost:3000',  // NestJS default port
      'http://127.0.0.1:3000'   // Alternative localhost
    ],
    methods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  const port = configService.get('PORT') || 3000;
  await app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
  });
}
bootstrap();
