import * as nodeCrypto from 'crypto';

if (!globalThis.crypto) {
  globalThis.crypto = nodeCrypto as unknown as Crypto;
}
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './modules/auth/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  //global interceptors
  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService); //will be used to make jwt to be global
  
  // ✅ Register global AuthGuard
  app.useGlobalGuards(new AuthGuard(jwtService, reflector));
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
