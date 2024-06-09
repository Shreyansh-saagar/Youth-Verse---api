import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join( __dirname,'..','public'),{
    prefix:'/public/'
  })

  app.enableCors({origin:'http://localhost:4200',credentials:true})
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000);
}
bootstrap();
