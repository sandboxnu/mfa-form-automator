import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.use(cookieParser());

  const frontendUrl = process.env.FRONTEND_DOMAIN;
  if (frontendUrl) {
    console.log(`CORS enabled for ${frontendUrl}`);
    app.enableCors({
      origin: frontendUrl,
      credentials: true,
    });
  }

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('MFA Form Automator API')
    .setDescription('MFA Form Automator API Documentation')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 8080);
}

bootstrap();
