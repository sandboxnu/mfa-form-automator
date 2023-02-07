import "reflect-metadata";
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3000; 
  const isDev: boolean = configService.get<boolean>('isDev');

  if (isDev) {
    const config = new DocumentBuilder()
    .setTitle('Cool Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
  
  await app.listen(PORT, () => console.log(`App is listening on port: ${PORT}`));
}
bootstrap();
