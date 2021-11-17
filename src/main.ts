if (process.env.NODE_ENV !== 'production') require('dotenv').config();
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:4000/',
    credentials: true,
  });

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT);
}
bootstrap();
