import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/utils/constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    UserModule,
    // import jwt module
    JwtModule.register({
      global: true, //global: true makes JWT services available across the entire application
      // without needing to import JwtModule in every module.
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30m' },
    }),
  ],

  controllers: [AuthController],
  providers: [
    AuthService,
    // //global auth guard
    // {
    //   provide: APP_GUARD, //Registers a global guard (AuthGuard) for the entire application
    //   // A custom guard for protecting routes, typically checking for a valid JWT in the request.
    //   useClass: AuthGuard, //useClass: Tells NestJS to use AuthGuard as the implementation for APP_GUARD
    //   //makes it a default guard for all routes unless overridden by route-specific guards e.g with @IsPublic decor
    // },
  ],
})
export class AuthModule {}
