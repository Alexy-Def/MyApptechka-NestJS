import { Repository } from 'typeorm';

import { CustomRepository } from '@libs/typeorm-ext';

import { RefreshTokenEntity } from '../entities';

@CustomRepository(RefreshTokenEntity)
export class RefreshTokenRepository extends Repository<RefreshTokenEntity> {}
