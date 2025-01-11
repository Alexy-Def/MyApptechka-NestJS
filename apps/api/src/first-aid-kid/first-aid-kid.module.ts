import { Module } from '@nestjs/common';

import { TypeOrmExtModule } from '@libs/typeorm-ext';
import { AuthModule } from '@modules/auth';
import { UsersModule } from '@modules/users';

import * as Controllers from './controllers';
import * as Repositories from './repositories';
import * as Services from './services';

@Module({
  controllers: Object.values(Controllers),
  imports: [TypeOrmExtModule.forCustomRepository(Object.values(Repositories)), AuthModule, UsersModule],
  providers: Object.values(Services),
  exports: Object.values(Services),
})
export class FirstAidKidModule {}
