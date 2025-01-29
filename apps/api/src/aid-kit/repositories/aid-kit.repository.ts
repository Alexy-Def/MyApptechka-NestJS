import { Repository } from 'typeorm';

import { CustomRepository } from '@libs/typeorm-ext';

import { AidKitEntity } from '../entities';

@CustomRepository(AidKitEntity)
export class AidKitRepository extends Repository<AidKitEntity> {}
