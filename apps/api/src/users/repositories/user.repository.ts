import { Repository } from 'typeorm';

import { CustomRepository } from '@libs/typeorm-ext';

import { UserEntity } from '../entities';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}
