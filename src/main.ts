import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { ValidationExceptionFilter } from 'src/submodule/common/exceptions/validation.exception';
import { getEnv } from 'src/submodule/configs/env.config';
import { AppModule } from './app.module';

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
      .setTitle('FICO ADMIN PANEL API')
      .setDescription('FICO ADMIN PANEL API description')
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
