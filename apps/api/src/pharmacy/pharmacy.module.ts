import { Module } from '@nestjs/common';

import { TypeOrmExtModule } from '@libs/typeorm-ext';
import { AuthModule } from '@modules/auth';
import { UsersModule } from '@modules/users';

import * as Repositories from './repositories';
import * as Resolvers from './resolvers';
import * as Services from './services';

@Module({
  imports: [TypeOrmExtModule.forCustomRepository(Object.values(Repositories)), AuthModule, UsersModule],
  providers: [...Object.values(Services), ...Object.values(Resolvers)],
  exports: Object.values(Services),
})
export class PharmacyModule {}
