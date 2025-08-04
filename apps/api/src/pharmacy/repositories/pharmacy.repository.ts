import { Repository } from 'typeorm';

import { CustomRepository } from '@libs/typeorm-ext';

import { PharmacyEntity } from '../entities';

@CustomRepository(PharmacyEntity)
export class PharmacyRepository extends Repository<PharmacyEntity> {}
