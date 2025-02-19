import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { TypeOrmExtModule } from '@libs/typeorm-ext';
import { FeedbackModule } from '@modules/feedback';
import { UsersModule } from '@modules/users';
import { VerificationModule } from '@modules/verification';
import { AUTH, FEEDBACK_PHONE } from 'config';

import * as Controllers from './controllers';
import * as Guards from './guards';
import * as Repositories from './repositories';
import * as Services from './services';

@Module({
  imports: [
    TypeOrmExtModule.forCustomRepository(Object.values(Repositories)),
    UsersModule,
    VerificationModule,
    JwtModule.register({
      secret: AUTH.ACCESS_JWT_SECRET,
      signOptions: { expiresIn: AUTH.ACCESS_TOKEN_EXPIRES_IN },
    }),
    FeedbackModule.register({
      feedbackPhone: FEEDBACK_PHONE.AUTH,
    }),
  ],
  controllers: Object.values(Controllers),
  providers: [...Object.values(Services), ...Object.values(Guards)],
  exports: [...Object.values(Guards), JwtModule],
})
export class AuthModule {}
