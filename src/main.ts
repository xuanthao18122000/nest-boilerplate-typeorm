import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getEnv } from './configs/env.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationExceptionFilter } from './common/exceptions/validation.exception';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.useGlobalFilters(new ValidationExceptionFilter());
  app.useStaticAssets(join(__dirname, 'assets', 'imgs'), {
    prefix: '/',
  });

  if (getEnv('APP_NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('NESTJS BOILERPLATE API')
      .setDescription('NESTJS API description')
      .addServer(getEnv('APP_URL'))
      .setVersion('0.1')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document);
  }

  await app.listen(getEnv('APP_PORT'));
}
bootstrap();
