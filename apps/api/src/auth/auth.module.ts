import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '@modules/users';
import { AUTH } from 'config';

import * as Controllers from './controllers';
import * as Guards from './guards';
import * as Services from './services';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: AUTH.ACCESS_JWT_SECRET,
      signOptions: { expiresIn: AUTH.ACCESS_TOKEN_EXPIRES_IN },
    }),
  ],
  controllers: Object.values(Controllers),
  providers: [...Object.values(Services), ...Object.values(Guards)],
  exports: [...Object.values(Guards), JwtModule],
})
export class AuthModule {}
